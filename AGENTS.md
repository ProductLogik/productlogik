# ProductLogik AI Agent Rules (`AGENTS.md`)

This repository contains strict operating constraints for AI assistants, Coding Agents, and code-generation tools. Adhere to these instructions forcefully.

## 0. Project Identity & Context
- **Project Structure**: This is a hobbyist Minimum Viable Product (MVP) fundamentally built by a solo developer with the help of AI agents. There is no official corporate entity, and there are no real earnings or money-making operations involved. 
- **Copywriting Tone**: When generating UI text or legal pages, keep the language transparent and professional, but strictly avoid overblown "enterprise corporation" jargon or complex legal frameworks intended for massive business conglomerates.

## 1. Explicit Technology Stack
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Radix UI.
- **Backend**: Python 3.10+, FastAPI, SQLAlchemy, Uvicorn.
- **Database**: PostgreSQL (Hosted on Supabase).

## 2. Architecture Boundaries
- **Python Backend**: Strictly handles data persistence, JWT authentication, remote LLM coordination (Gemini), billing logic (Stripe), and transactional email dispatch (Resend). Returns clean JSON via REST APIs.
- **React Frontend**: Strictly handles client routing, local `useState`/context logic, and browser-side UI. Never holds sensitive API keys (all environment variables must use the `VITE_` prefix and be strictly public). 

## 3. Database Rules (Supabase)
- ProductLogik exclusively uses **Supabase PostgreSQL**.
- Do NOT attempt to swap the backend ORM away from `SQLAlchemy`.
- Utilize official `.agent-skills` database protocols and refer to `supabase_schema.sql` for structural ground-truth.

## 4. Strict Local Development Environment
- The development servers have strictly assigned ports to avoid collisions:
  - **Python Backend (FastAPI)**: Boot on port `8001` (`http://127.0.0.1:8001`).
  - **Vite Frontend**: Boot on port `5180` (`http://localhost:5180`).
- Use the master `./start.sh` boot script from the root directory when spinning up the full infrastructure.

## 5. Hard Constraints (Zero Exception List)
- **ZERO-PLACEHOLDER POLICY**: Never create scaffolding simply filled with "Lorem Ipsum", `// TODO: implement later`, or fake non-functional UI forms. You must *always* think ahead and create actual, functional value. Write realistic, production-ready marketing copy/legal text for UI pages, and wire up actual functional APIs for forms. If the user dislikes your implementation, they will ask for changes, but generating static/dummy content initially is considered an unacceptable waste of resources.
- Do NOT install heavy generic npm packages (like moment.js, lodash, or massive UI frameworks) when lightweight native TS/JS utility functions or Tailwind/Radix logic can achieve the same goal.
- Do NOT alter the isolated VPS production port configuration mappings (`3001` and `8081`).
- Do NOT guess standard `postgres://localhost:5432` paths string injections—the app relies dynamically upon `.env` injection.
- Do NOT refactor files, update variable naming schemes, or restructure directories unless actively prompted by the `.md` execution plan or explicitly ordered by the Human.
