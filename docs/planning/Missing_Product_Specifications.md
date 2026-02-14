# Missing Product Specifications

This document outlines the **critical missing information** required to implement "ProductLogik: Logic-Driven Product Intelligence" and its "Agile Anti-Pattern" feature.

## 1. Agile Feature: "Agile Anti-Pattern Detector" (Gaps)
The current User Stories (Epic 4, US-4.1) describe *what* to detect but not *how*. To build this, we need the **"Logic Layer" definitions**.

### Missing Logic Definitions
The AI needs specific signals to look for. We need to define the "Rules of Engagement" for the LLM:
*   **"Output over Outcome"**:
    *   *What specific keywords/phrases trigger this?* (e.g., "delivered 5 features", "velocity increased" vs "customer retention up").
    *   *Threshold*: Logic to decide if it's a "Risk" or just "Status update".
*   **"Overloaded Backlog"**:
    *   *Detection Method*: Is this purely text analysis? Or do we need numerical metadata (e.g., "Ticket Count" column)? If text-only, how does it know the backlog size?
*   **"Stakeholder-Driven"**:
    *   *Signals*: Phrases like "CEO wants", "Sales requested", "Urgent for client X".
*   **Corrective Actions Database**:
    *   We need a mapped list: If Pattern A is found -> Recommend Action B. (Currently, the AI will just hallucinate advice unless we provide a "Coaching Playbook").

### Agile Feature UX
*   **Integration**: Is this a separate tab? Or mixed into the "Themes" view?
*   **Feedback Loop**: Can the user disagree? "No, that wasn't waterfall, that was a fix." (False positive handling).

## 2. Technical Architecture Gaps (The "Glue")
Existing docs cover Frontend (React) and Backend (FastAPI), but miss the middle components.

### A. Authentication & User Management
*   **Auth Provider**: Custom (Email/Pass + JWT) or Managed (Google Auth/Auth0)?
*   **User Data**: Do we store "Organization Name" or "Role"? (Helps AI context).

### B. Database Schema (Data Model)
We need a structure to save the data. Proposal for missing schema:
*   `Users`: (id, email, password_hash, created_at)
*   `Uploads`: (id, user_id, filename, row_count, uploaded_at)
*   `Analysis_Results`: (id, upload_id, ai_response_json, status)
    *   *Critical*: Do we save the *raw uploaded rows*? (Privacy/Storage implication).

## 3. Deployment & Operational Missing Info
*   **LLM Configuration**:
    *   Which model specifically for *Agile* vs *Theming*? (Agile might need a "reasoning" model like o1-mini or GPT-4o, while Theming can use cheaper 4o-mini).
*   **Cost Limits**:
    *   "Max analyses per month" defined, but what is the number? (5? 50?).

## 4. Next Step: Action Items
To fix these gaps, we should:
1.  **Create an `Agile_AntiPatterns_Prompt_Spec.md`**: Define the exact instructions for the AI for each pattern.
2.  **Draft `Database_Schema.md`**: Define the tables.
3.  **Decide Auth Strategy**: Recommended simple Email/Password for MVP.
