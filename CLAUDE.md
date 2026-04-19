# Practical Developer Workflow (`CLAUDE.md`)

When working on ProductLogik, execute the underlying standardized commands for smooth local execution.

## Booting the Full Stack
To spin up both the Vite frontend and Python backend simultaneously:
```bash
./start.sh
```

## Stopping the Full Stack
If ports become orphaned or you require a hard reset:
```bash
./stop.sh
```

## Backend Operations
Working directly inside the isolated Python environment:
```bash
cd backend
# 1. Activate Virtual Environment
source venv/Scripts/activate     # Windows PowerShell/GitBash
# OR
source venv/bin/activate         # Mac/Linux

# 2. Add Dependencies
pip install <package>
pip freeze > requirements.txt

# 3. Dedicated Backend Local Boot 
uvicorn main:app --reload --host 127.0.0.1 --port 8001
```

## Frontend Operations
Working natively in the React environment:
```bash
cd frontend

# 1. Install module dependencies
npm install

# 2. Boot Frontend in Isolation
npm run dev -- --port 5180

# 3. Validate Typescript integrity
npm run lint

# 4. Dry Run a Production Build Verification
npm run build
```

## Immutable Architecture Context (DO NOT IGNORE)
- **NO AUTONOMOUS DEPLOYMENTS**: AI Agents must purely focus on planning, writing code, and structurally fixing bugs. You are absolutely forbidden from autonomously executing deployment scripts (e.g., `git deploy-all` or `./deploy-productlogik.sh`) or blindly pushing code straight to production without explicit permission. The Human strictly controls the deployment triggers.
- **CRON-JOB / SUPABASE WAKE ARCHITECTURE**: Since the Supabase Free Tier pauses databases after 7 days of inactivity, the project uses an external `cron-job.org` service that natively pings `https://productlogik.com/api/health/db`. This endpoint executes a raw `SELECT 1` SQLAlchemy query to keep the compute active. Whenever resolving 500 errors on this route, agents must know it is specifically designed for database keep-alive pings.
