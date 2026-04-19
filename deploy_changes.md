# Live Deployment Procedure (`deploy_changes.md`)

This document outlines the standard operating procedure for pulling and deploying incremental changes to the Hostinger VPS without triggering a full, heavy rebuild of the entire application.

## Core Principle: `.env` Safety
Your `.env` files are fundamentally safe during deployments. Git never touches files listed in `.gitignore`, meaning a standard `git pull` will only update tracked source files without overwriting your sensitive production database keys.

> [!WARNING]
> While `.env` is safe, avoiding direct edits to tracked source files on the VPS is critical. If you manually edit a tracked file (like `database.py`) natively on the server, running `git reset --hard origin/main` (which our automated script natively does) will permanently wipe those changes. **Always edit code locally on your PC and push to GitHub.**

---

## The Granular Deployment Flow

When you push a fix to GitHub, you do not need to rebuild the entire application stack. You can target specific architectures to save time and server RAM.

### Step 1: Connect to the Server & Pull
Log securely into the VPS and fetch the latest tracking branch:
```bash
ssh deploy@76.13.153.17
cd ~/productlogik
git pull origin main
```

### Step 2: Rebuild Only What Changed

#### Option A: Python Backend Changes
If your fixes were isolated to the APIs, Database logic, or Python files:
```bash
cd ~/productlogik/backend
source venv/bin/activate
pip install -r requirements.txt
cd ..
pm2 restart productlogik-backend
```

#### Option B: React Frontend Changes
If your fixes involved UI elements, Tailwind, or React `.tsx` files:
```bash
cd ~/productlogik/frontend
npm install
NODE_OPTIONS="--max-old-space-size=1024" npm run build
cd ..
pm2 restart productlogik-frontend
```

---

## The Automated "Nuclear" Option
If you want a single command that safely rebuilds absolutely everything at once, the existing `./deploy-productlogik.sh` script inherently wraps all of this logic up:
```bash
cd ~/productlogik
bash deploy-productlogik.sh
```
> [!NOTE]
> The automated script forcefully runs `git reset --hard origin/main`. This guarantees the server identically matches GitHub, but again, it will forcefully overwrite any manual "hot-fixes" you typed directly into tracked source files on the VPS terminal.
