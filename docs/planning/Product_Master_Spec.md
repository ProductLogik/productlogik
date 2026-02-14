# Product Master Specification (PRD)

**Project Name**: ProductLogik — Logic-Driven Product Intelligence
**Version**: 1.0 (MVP)
**Status**: Ready for Development

---

## 1. Executive Summary
**ProductLogik** is an AI-powered decision intelligence tool for Product Owners (POs). It ingests raw textual feedback (Jira tickets, customer emails, survey results) and outputs actionable, evidence-based priorities.

**Core Value Prop**: "Stop guessing. Let AI prove what your users actually need."
**Target User**: Solo Product Owners, Freelance PMs, Founder-led startups.

---

## 2. Feature Specification

### Feature A: Feedback Theme Discovery
**Goal**: Turn 500+ random rows of text into 5-10 coherent "Problem Themes".

*   **Input**: CSV File (`text`, `source`, `date` columns).
*   **Step 1 - Ingestion**: Parse CSV, validate rows.
*   **Step 2 - AI Analysis**:
    *   *Prompt Logic*: "Analyze these rows. Group by underlying user need. Ignore feature requests, look for problems."
*   **Output (Dashboard)**:
    *   List of Themes (e.g., "Login on Mobile is broken").
    *   *Confidence Score*: 0-100% (How sure is the AI?).
    *   *Evidence*: Quotes from the CSV backing this theme.
    *   *Priority Recommendation*: High/Med/Low based on frequency and sentiment.

### Feature A.1: Data Input Specification (CSV)
**Sources**: The system accepts exports from common product management and feedback tools.
*   **Jira / Linear**: Export of backlog items (Stories, Bugs).
*   **Zendesk / Intercom**: Export of support tickets.
*   **Google Forms / Typeform**: Survey results.
*   **SalesForce / HubSpot**: Sales call notes.

**CSV Structure**:
The system is flexible but requires a mapped "Content" column.
*   **Mandatory Column**: `text` (The core feedback).
    *   *Mapping*: Users can map `Description`, `Summary`, `Ticket Body`, or `Comment` to this field during upload.
*   **Optional Columns**:
    *   `source`: Context (e.g., "Support", "Sales", "Q4 Survey").
    *   `date`: For trend analysis (e.g., "2023-10-25").
    *   `priority` / `severity`: Existing tags from the source tool.

**Example Row Data**:
| text | source | date |
| :--- | :--- | :--- |
| "I can't reset my password on mobile, the button is hidden." | Zendesk | 2024-01-15 |
| "We need a dark mode for night shifts." | Feature Request | 2024-01-12 |
| "The report export is too slow, client is angry." | Jira | 2024-01-10 |

### Feature B: Agile Anti-Pattern Detector
**Goal**: Identify dysfunctions in team behavior based on status reporting language.

*   **Logic Source**: `Agile_AntiPatterns_Prompt_Spec.md`
*   **Detected Patterns**:
    1.  **Output over Outcome**: "We shipped 50 points!" (Vs "Users are happy").
    2.  **Stakeholder-Driven**: "CEO wants this." (HiPPO effect).
    3.  **Feature Factory**: Endless shipping, no validation.
*   **Output**:
    *   "Risk Flags" on the dashboard.
    *   Coaching advice specific to the triggered pattern.

---

## 3. Technical Architecture

### A. Technology Stack
*   **Frontend**: React (Vite) + TailwindCSS (Shadcn/UI).
*   **Backend**: Python FastAPI.
*   **Database**: PostgreSQL (Supabase or Local Docker).
*   **AI Method (Low-Cost / Low-Complexity)**:
    *   *Option A (Current Best Value)*: `gpt-4o-mini`. It is extremely cheap ($0.15/1M input tokens). Most simple apps cost <$0.01 per month to run.
    *   *Option B (Zero Cost / Offline)*: **KeyBERT / TF-IDF**.
        *   Use Python's `scikit-learn` to extract keywords and cluster text *without* an AI API.
        *   **Pros**: Free, privacy-friendly, works offline.
        *   **Cons**: "Dumber". It finds *words* (e.g., "login", "password"), not *concepts* (e.g., "Authentication Frucstration").
    *   *Recommendation*: Start with **Option A** (API). The complexity of setting up local NLP is actually *higher* than calling an API, and the cost is negligible for an MVP.

### B. Database Schema (Simplified)
*   `Users`: Auth details, monthly usage counters.
*   `Projects`: Container for uploads.
*   `Analysis_Reports`: Stores the JSON result from AI (cached).
*   *Reference*: `Database_Schema.md`

### C. Authentication
*   **Method**: Email/Password (Custom implementation or Supabase Auth).
*   **Security**: B-Crypt hashing, JWT format for session tokens.

---

## 4. User Experience (UX) Flow
1.  **Landing Page**: Value prop -> "Try for Free".
2.  **Auth / Sign Up**: Simple email registration.
3.  **Upload Screen**: Drag & Drop CSV.
    *   *State*: "Processing..." (Progress bar is critical).
4.  **Dashboard (Main View)**:
    *   **Top**: "Executive Summary" (3 Key Priorities).
    *   **Left**: Theme list.
    *   **Right**: Agile Health / Anti-Pattern warnings.
    *   **Action**: "Export to PDF".

---

## 5. Non-Functional Requirements
*   **Performance**: Analysis must take < 60s for 500 rows.
*   **Privacy**: Data is processed but strictly scoped to the user's project.
*   **Cost Control**: Max 10 analyses/month for Free tier (enforced by DB counter).

---

## 6. Implementation Roadmap
1.  **Phase 1 (Foundation)**: Setup Repo, FastAPI, React, DB connection.
2.  **Phase 2 (The Core)**: CSV Upload -> AI Processing -> JSON Output.
3.  **Phase 3 (UI)**: Build the Dashboard to visualize the JSON.
4.  **Phase 4 (Agile)**: Add the Anti-Pattern logic layer.
