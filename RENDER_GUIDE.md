# Deploying ProductLogik Backend to Render.com

This guide covers how to deploy the **backend only** to Render.com.

## Prerequisites

1.  **GitHub Account**: Your code must be pushed to a GitHub repository.
2.  **Render Account**: Sign up at [render.com](https://render.com).

## Option 1: Zero-Config Deployment (Recommended)

If you are deploying from a repository where **backend** is the root (or you point Render to it), this `render.yaml` will work automatically.

1.  In Render Dashboard, click **New +** -> **Blueprint**.
2.  Connect your GitHub repository.
3.  Render will detect `render.yaml` (ensure it's in the root of what Render sees) and propose the service.
4.  Click **Apply**.

## Option 2: Manual Setup

1.  **Create Web Service**:
    *   Go to Dashboard -> **New +** -> **Web Service**.
    *   Connect your repository.

2.  **Configure Service**:
    *   **Name**: `productlogik-backend`
    *   **Root Directory**: `backend` (Important! If your repo has both frontend and backend. If your repo is *only* the backend code, leave this blank).
    *   **Runtime**: `Python 3`
    *   **Build Command**: `pip install -r requirements.txt` (Note: No `backend/` prefix because of Root Directory setting).
    *   **Start Command**: `gunicorn -k uvicorn.workers.UvicornWorker main:app`

3.  **Environment Variables**:
    *   Find the **Environment** tab in your new service.
    *   Add the contents of your local `.env` file (excluding `DATABASE_URL` if using Render's database).
    *   **Important**:
        *   If you use Render's managed PostgreSQL, Render automatically provides a `DATABASE_URL` env var. **Our code now supports this automatically.**
        *   If you use an external DB (e.g., Supabase, Neon), add your own `DATABASE_URL` or the specific variables (`host`, `user`, etc.).

## Postgres Database (Optional)

If you need a database on Render:
1.  Click **New +** -> **PostgreSQL**.
2.  Name it (e.g., `productlogik-db`).
3.  Once created, copy the `Internal Connection String` (if your backend is also on Render) or `External Connection String`.
4.  In your **Web Service** -> **Environment**, Render might auto-link them if created via Blueprint. If manual, add a `DATABASE_URL` variable with the connection string.

## Frontend Connection

Since your frontend is hosted elsewhere (VPS, Web Hosting):
1.  Get your **Backend URL** from Render (e.g., `https://productlogik-backend.onrender.com`).
2.  Update your **Frontend's** environment configuration (e.g., `.env.production` or code constants) to point `VITE_API_URL` (or equivalent) to this new HTTPS URL.
## Troubleshooting

### 1. "No open HTTP ports detected"
This is usually caused by the app crashing during startup.
*   **Logging Fix**: We have updated `main.py` to only log to the console on Render, avoiding potential file permission issues.
*   **Port Binding**: Ensure your Start Command in Render is exactly: 
    `gunicorn -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT main:app`

### 2. Login fails silently
This is often a mismatch between the Frontend's `VITE_API_URL` and the Backend's actual URL.
*   **Trailing Slashes**: We've updated the frontend logic to automatically handle trailing slashes in your URL. 
*   **Verification**: Check your Vercel/Frontend environment variables. `VITE_API_URL` should be `https://your-backend-name.onrender.com` (no `/api` required, it's added automatically).

### 3. Database Connection
If Render says "Failure to connect to database", ensure you've either:
*   Linked a Render PostgreSQL database.
*   Added your external `DATABASE_URL` to the Environment tab.

### 4. Preventing "Spin Down" (Free Tier)
Render's free tier spins down after 15 minutes of inactivity, causing a 50+ second delay on the next request.
To keep it alive:
1.  **Use a Free Pinger**: Sign up for [cron-job.org](https://cron-job.org/en/) (free) or [UptimeRobot](https://uptimerobot.com/).
2.  **Create a Job**:
    *   **URL**: `https://your-backend-name.onrender.com/health`
    *   **Interval**: Every 14 minutes.
    *   **Method**: `GET`
3.  This keeps your service "warm" and prevents the delay.
