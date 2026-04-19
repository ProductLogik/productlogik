# AGENT SYSTEM DIRECTIVE: Contact Form API & Resend Integration

**CONTEXT & COMPLIANCE**: 
- **Tech Stack**: FastAPI (Python) Backend + React 18 (Vite/TS) Frontend.
- **Goal**: The `ContactPage.tsx` currently has a visual, non-functional frontend form. You must build a secure backend endpoint using the Resend API to actually dispatch the email to the admin, and then wire the React frontend to submit data to this endpoint.
- **Determinism**: Execute tasks sequentially. Do NOT write unnecessary logic. Do NOT refactor existing features outside the scope of these targets.
- **ACCOUNTABILITY TRACKING**: You must actively edit this current markdown file (`docs/implementation_plan_api_wiring.md`) as you work. Immediately mark an incomplete task `[ ]` as completed `[x]` the exact moment you finish the associated code changes, before moving on to the next task.

---

## TASK 1: FASTAPI RESEND MAILER ENDPOINT
**TARGETS**: `backend/main.py`, `backend/services/email_service.py` (or similar)
- [x] Verify `resend` is installed in `backend/requirements.txt`.
- [x] Create or update a Python service file to handle the `resend.Emails.send()` logic for dispatching a support notification. The Resend API Key must be loaded securely via `os.getenv("RESEND_API_KEY")`.
- [x] Create a Pydantic data model for the incoming contact request capturing: `name` (str), `email` (str), `message` (str).
- [x] In the backend router (`main.py` or an appropriate sub-router), establish a new public POST route: `POST /api/contact`.
- [x] **Implementation Rule**: Within the route logic, invoke the Resend service to dispatch an email to the site administrator notifying them of the message. Include the sender's `name` and `email` appropriately.
- [x] Return a standard `200` JSON resolution: `{"status": "success", "message": "Message sent securely"}`.

## TASK 2: FRONTEND API WIRING
**TARGETS**: `frontend/src/lib/api.ts`, `frontend/src/pages/ContactPage.tsx`
- [x] Modify `frontend/src/lib/api.ts`: Scaffold an asynchronous resolver `submitContactForm(name: string, email: string, message: string)` that executes a JSON `POST` request to the backend URI.
- [x] Modify `frontend/src/pages/ContactPage.tsx`: Rebuild the generic `onSubmit` handler. It must now: prevent default interaction -> flag a React loading state constraint to disable UI spam -> execute `api.submitContactForm()` -> catch HTTP errors -> render standard `sonner` success/error UI toasts based on the API resolution block.

## TASK 3: PRODUCTION COPY & TEXT INJECTION
**TARGETS**: `frontend/src/pages/*` (Various Informational Pages)
- [x] **ZERO-PLACEHOLDER MANDATE**: Under the strict `AGENTS.md` constraints, it is forbidden to leave these 9 pages (Methodology, Privacy Policy, Terms of Service, etc.) populated with `Lorem Ipsum` or generic placeholder UI blocks. 
- [x] **BEFORE CODING - LAYOUT PATTERN CHECK**: Pause and examine `frontend/src/pages/LandingPage.tsx` or `frontend/src/pages/ResultsPage.tsx`. You must intentionally clone their global wrapper containers (`max-w-*`), alignment (`mx-auto`), responsive padding (`px-*`, `py-*`), and Radix UI components so your new pages natively match the existing app width and styling *on your very first pass*.
- [x] Open each of the 9 page files and generate highly realistic marketing and legal copy tailored *specifically* to ProductLogik's actual context. **CRITICAL COPY NOTE**: This app is a hobbyist MVP built by a solo developer, with absolutely no corporate entity or revenue involved. You must tailor your language, Terms of Service, and UI copy to honestly reflect a solo-built MVP—avoiding overly corporate jargon or implying the existence of a massive business.
- [x] **ANTI-HALLUCINATION RULE**: Do NOT hallucinate legal names, mailing addresses, exact subscription costs, or support emails. If you require specific factual information to complete a page adequately, you must STOP and ask the User.
- [x] **PROVIDED FACTUAL CONTEXT**: Use these explicitly provided details without asking the Human:
    - **Support & Contact Email**: `contact@hamzalatif.com`
    - **Owner Profile**: Hamza Latif (Portfolio: `hamzalatif.com`, LinkedIn: `https://www.linkedin.com/in/mhlatif207/`). Generate an honest "About the Builder" blurb utilizing these links where appropriate.
    - **Jurisdiction**: Do not hallucinate a fake country/state. Simply state that the terms are governed by the primary residence jurisdiction of the independent developer, utilizing standard international digital commerce disclaimers.
    - **Privacy Stance**: Emphatically state that user data is NEVER sold, shared, rented, or exploited. It is exclusively used for app utility (Supabase auth & Gemini AI processing).
- [x] **UI CONSISTENCY AUDIT**: Before concluding Task 3, cross-reference your new pages against existing core views (e.g., `LandingPage.tsx` or `ResultsPage.tsx`). Your wrapper containers (`max-w-*`), spacing scale (`gap-*`, `px-*`, `py-*`), interactables (Radix UI `<Button>`), and Tailwind typography must align completely seamlessly with the existing ProductLogik design language. Ensure the page looks highly polished and fully native to the app without any visual jarring. Do NOT leave blank sections or `// TODO` markers.
