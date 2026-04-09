# PRODUCTLOGIK - SYSTEM CONTEXT & PROJECT PROMPT

**Project Name**: ProductLogik (The "A.I. Product Compass")
**Project Root**: `d:\SpicedProjects\Projects\productlogik` (Windows Environment)

## 1. Project Overview
ProductLogik is a B2B SaaS platform that transforms raw customer feedback (usually ingested via CSV files) into strategic product decision intelligence. It goes beyond simple summarization by adopting a "Senior Agile Coach" persona to diagnose product strategy, extract actionable problem themes, flag systemic agile anti-patterns (e.g., Feature Factory, HiPPO Effect), and provide confidence scores mapped to specific evidence quotes.

## 2. Tech Stack Ecosystem
**Backend (API & AI Orchestration)**
*   **Framework:** Python 3.10+, FastAPI, Uvicorn as the ASGI server.
*   **Database:** PostgreSQL (hosted on Supabase), managed via SQLAlchemy (ORM).
*   **Authentication:** JWT-based stateless authentication (`passlib`, `python-jose`).
*   **AI Integration:** Multi-provider architecture utilizing **Google Gemini 2.0 Flash** (Primary) and **OpenAI GPT-4o-mini** (Fallback).
*   **External Services:** Stripe (Payments & Quota Enforcement), Resend (Transactional Emails).

**Frontend (Client SPA)**
*   **Framework:** React 18 with TypeScript, bundled via Vite.
*   **Routing:** React Router.
*   **Styling:** Tailwind CSS (Modern glassmorphism aesthetics).
*   **UI Components:** Radix UI primitives (`@radix-ui/react-*`), Lucide Icons, Recharts for data visualization, Sonner for toast notifications.
*   **Forms:** React Hook Form.

## 3. Project Structure
*   `/backend/`: Contains the FastAPI application and backend logic.
    *   `models.py`: SQLAlchemy database definitions.
    *   `auth.py`: JWT security and user management operations.
    *   `upload.py`: Handling feedback ingestion and quota enforcement.
    *   `/services/`: Business logic layer (contains the AI service routing logic, email configuration, etc.).
    *   `requirements.txt`: Python dependencies.
*   `/frontend/`: Contains the React SPA.
    *   `/src/pages/`: Page-level components (Dashboards, Trends, Pricing, etc.).
    *   `/src/components/`: Reusable UI elements and layouts (Navbar, tables, charts).
    *   `/src/lib/`: API clients, state management, and utility functions.
    *   `package.json`: Node dependencies.
*   `/docs/`: Comprehensive project documentation, including `/planning/` (specs) and `/design/` (UI tokens).

## 4. Key Architectural Mechanisms
1.  **Multi-Model Self-Healing AI**: The backend prioritizes Gemini for speed and cost efficiency. If it detects rate limits, provider outages, or errors, it automatically falls back to GPT-4o-mini in real-time to ensure consistent uptime.
2.  **Tiered Quota Enforcement**: Users have subscription tiers (Demo, Pro, Team) managed in sync with Stripe. The backend enforces hard API limits on ingestion/analysis based on the active tier.
3.  **Privacy-First Analysis**: Raw text is evictable. The system converts raw data into structured JSON insights. Enterprise API tiers are configured to prevent training on user data.

## 5. Development & Execution Environment
*   **Local Backend:** Activate virtual environment (`.\venv\Scripts\Activate`), run `uvicorn main:app --reload` on port 8000. 
*   **Local Frontend:** Run `npm run dev` on port 5173.
*   *Note:* The project relies heavily on `.env` configurations (`DATABASE_URL`, `GEMINI_API_KEY`, `OPENAI_API_KEY`, `STRIPE_SECRET`, `RESEND_API_KEY`).

## 6. Agent Directives & Instructions
When executing tasks on this project, adhere to the following:
*   **Absolute Paths:** Always use absolute paths starting with `d:\SpicedProjects\Projects\productlogik` when investigating, reading, or writing files.
*   **Separation of Concerns:** Keep complex logic, ML orchestration, and secure operations (like quota counting) strictly on the backend. The frontend should remain lightweight, focusing entirely on presentation and routing.
*   **Styling Execution:** Always utilize Tailwind CSS for styling on the frontend. Do not write custom vanilla CSS classes unless absolutely necessary. Rely on Radix UI behavior where implemented.
*   **Verification:** Ensure that any endpoint changes in FastAPI have their corresponding types and API calls updated in the frontend's `/src/lib/api.ts` or equivalent client files.
