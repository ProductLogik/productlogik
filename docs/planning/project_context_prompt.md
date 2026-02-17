# System Prompt: ProductLogik Context
**(Copy and paste this into ChatGPT / Gemini / Claude to give them full context of the project)**

---

## **Project Overview**
**Product Name**: ProductLogik (The "A.I. Product Compass")
**Core Value**: An AI-driven intelligence platform for product managers. It ingests raw customer feedback (CSV), analyzes it using LLMs (Google Gemini), and extracts actionable insights—not just themes, but "Agile Anti-Patterns" (like Feature Factory behavior) and strategic risks.
**Current Status**: MVP Core Complete. Moving to Advanced Features & Monetization.

---

## **Technical Stack**
*   **Backend**: Python 3.10+ with **FastAPI**.
    *   *Key Libraries*: `sqlalchemy` (ORM), `pydantic` (Validation), `google-genai` (AI), `resend` (Email), `pandas` (CSV processing).
    *   *Architecture*: Modular Service Layer (`services/ai_service.py`, `services/email_service.py`).
    *   *Database*: **PostgreSQL** (hosted on Supabase).
*   **Frontend**: TypeScript with **React** & **Vite**.
    *   *Styling*: Tailwind CSS + `lucide-react` icons.
    *   *Design System*: Premium "Glassmorphism" aesthetic with deep green gradients. Custom components (`Card`, `Button`, `Layout`).
    *   *State*: React Context for Auth.
*   **Infrastructure**:
    *   *Hosting*: Render (Backend) + Vercel (Frontend).
    *   *Auth*: JWT (JSON Web Tokens) with email verification.

---

## **Key Features (Implemented)**
1.  **Smart Ingestion**: 
    *   Uploads CSV files containing user feedback.
    *   Using `pandas` to clean and normalize data.
2.  **AI Analysis Engine**:
    *   Uses **Google Gemini Pro** to analyze rows.
    *   Extracts: **Themes**, **Sentiment** (Positive/Neutral/Negative/Critical), **Confidence Scores**, and **Direct Customer Quotes** (Evidence).
3.  **The Compass Dashboard**:
    *   **3-Column Layout**:
        1.  **The Priorities**: Top 3-4 critical themes card.
        2.  **Theme Explorer**: Accordion list of all themes with sentiment breakdown.
        3.  **Agile Health**: (Upcoming) Visual indicators of strategic risks.
4.  **Secure Sharing**:
    *   Share analysis results via email.
    *   **Architecture**: Atomic Transactions (DB share record only created if email sends successfully).

---

## **Roadmap (Upcoming Work)**
1.  **Agile Anti-Pattern Detection ("The Health Check")**:
    *   AI analysis to detect systemic issues like "HiPPO Effect", "Output over Outcome", or "Feature Factory".
    *   Provides coaching advice to fixing these patterns.
2.  **Subscription & Pricing**:
    *   **Stripe Integration**: Checkout for Pro plans.
    *   **Usage Quotas**: Enforce limits (Free: 3 uploads/mo, Pro: 50).
3.  **PDF Export**:
    *   Generate professional reports for stakeholders.

---

## **Design Philosophy**
*   **"Show, Don't Just Tell"**: Always provide *evidence* (quotes) backing up AI claims.
*   **Premium & Trustworthy**: The UI uses dark mode elements, subtle gradients, and high-quality typography (Plus Jakarta Sans) to feel like a serious enterprise tool, not a toy.
*   **Safety First**: Feature flags and isolated modules (new features = new files) to prevent regression.

---
