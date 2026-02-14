# Database Schema Design (MVP)

**Database System**: PostgreSQL (Recommended for JSON support) or SQLite (for local MVP).
**ORM**: SQLAlchemy (Python) or Prisma (if using Node backend, but Plan says FastAPI so SQLAlchemy).

## 1. Tables

### `users`
*   **Purpose**: Authentication and account management.
*   **Columns**:
    *   `id` (UUID, PK): Unique User ID.
    *   `email` (VARCHAR, Unique): User email.
    *   `password_hash` (VARCHAR): Hashed password (Argon2/Bcrypt).
    *   `created_at` (TIMESTAMP): Registration time.
    *   `role` (VARCHAR): 'user', 'admin'. (Default: 'user').
    *   `monthly_usage_count` (INT): Track usage against limits. Resets monthly.

### `projects` (or `uploads`)
*   **Purpose**: Grouping feedback data into a single "Context" or "Analysis request".
*   **Columns**:
    *   `id` (UUID, PK): Unique Project ID.
    *   `user_id` (UUID, FK -> users.id): Owner.
    *   `name` (VARCHAR): Project name (e.g., "Q3 User Survey").
    *   `created_at` (TIMESTAMP).
    *   `original_filename` (VARCHAR): Name of the uploaded CSV.
    *   `row_count` (INT): Number of feedback items processed.

### `analysis_reports`
*   **Purpose**: Storing the expensive AI results so we don't re-run them on page refresh.
*   **Columns**:
    *   `id` (UUID, PK).
    *   `project_id` (UUID, FK -> projects.id).
    *   `analysis_type` (VARCHAR): 'THEME_DISCOVERY', 'AGILE_ANTIPATTERNS', 'FULL_REPORT'.
    *   `result_json` (JSONB): The full structured output from the LLM.
    *   `created_at` (TIMESTAMP).
    *   `model_used` (VARCHAR): e.g., 'gpt-4o', 'gpt-3.5-turbo'. (Good for debugging costs).

### `feedback_items` (Optional for MVP - Privacy Heavy)
*   *Note*: For strict privacy, we might NOT store individual rows, only the aggregate `result_json`.
*   *Decision*: **Store for MVP** to allow "Drill down" in the UI.
*   **Columns**:
    *   `id` (UUID, PK).
    *   `project_id` (UUID, FK -> projects.id).
    *   `raw_text` (TEXT): The user feedback.
    *   `source` (VARCHAR): 'Jira', 'Email', etc.

## 2. Relationships
*   `User` 1 -- * `Project`
*   `Project` 1 -- * `Analysis_Report`
*   `Project` 1 -- * `Feedback_Item`

## 3. Indexing Strategy
*   Index `projects(user_id)` for fast dashboard loading.
*   Index `analysis_reports(project_id)` for fetching results.

## 4. Privacy & Cleanup
*   Implement a "Hard Delete" function:
    *   `DELETE FROM users WHERE id = X` must cascade delete all `projects`, `reports`, and `feedback_items`.
