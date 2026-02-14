# Implementation Plan - ProductLogik — Logic-Driven Product Intelligence (MVP)

## User Review Required
> [!IMPORTANT]
> **Prerequisites Checklist** (Required from YOU):
> 1.  **OpenAI API Key**: We need this to run `gpt-4o-mini` and `text-embedding-3-small`.
> 2.  **UX Design Decision**:
>     *   *Option A*: You provide a Figma link/Screenshot from the prompt I gave you.
>     *   *Option B*: I build a "Standard B2B SaaS" look using Shadcn/UI (clean, gray/white/indigo, minimal). *Defaulting to Option B unless you specify.*
> 3.  **Environment**: Ensure you have Python 3.10+ and Node.js 18+ installed on `windows`.

## Proposed Changes

### Phase 1: Technical Foundation (Structure & Database)
#### [NEW] [Project Scaffolding]
-   **Directory**: `d:\SpicedProjects\Projects\productlogik`
-   **Backend**: FastAPI setup, `requirements.txt` (including `openai`, `pandas`, `sqlalchemy`).
-   **Frontend**: React (Vite) + TailwindCSS setup.
-   **Database**: SQLite (`production.db`) configured via SQLAlchemy. (Easiest for local MVP).

### Phase 2: The Logic (Backend & AI)
#### [NEW] [AI Service Implementation]
-   Create `backend/services/ai_service.py`.
-   Implement `analyze_themes(text_rows)` using the prompt strategies.
-   Implement `detect_agile_antipatterns(text_rows)` using `Agile_AntiPatterns_Prompt_Spec.md`.
-   Create API Endpoints:
    -   `POST /upload`: ingests CSV, returns ID.
    -   `GET /analysis/{id}`: returns the JSON report.

### Phase 3: The Experience (Frontend UI)
#### [NEW] [UI Components]
-   **Upload Component**: Drag & drop zone with progress bar simulation.
-   **Dashboard Layout**: Sidebar + Main Content Area.
-   **Theme Cards**: Accordion-style list of discovered themes.
-   **Agile Widget**: Warning panel for the Anti-Patterns.

### Phase 4: Polish & Delivery
#### [NEW] [Final Touches]
-   **Authentication**: Simple "Mock Auth" or Basic Auth for MVP.
-   **PDF Export**: Browser print styling or PDF generation library.

## Verification Plan
### Automated Tests
-   **Backend**: `pytest` to ensure CSVs are parsed correctly and APIs return 200 OK.
-   **Frontend**: `npm run build` check to ensure no type errors.

### Manual Verification
-   **The User Journey Test**:
    1.  Start backend & frontend.
    2.  Open localhost.
    3.  Upload a test CSV (I will create a dummy `sample_feedback.csv`).
    4.  Wait for analysis.
    5.  Check if "Themes" and "Agile Warnings" appear as expected.
