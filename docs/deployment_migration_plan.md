# Deployment Migration Plan: ProductLogik

This document details the exact migration strategy for deploying ProductLogik to the Hostinger KVM2 VPS alongside the existing `HetaVideo` production application. The primary directive is to ensure 100% isolation of resources, ports, and process management to protect the integrity of the server and HetaVideo's uptime.

This plan is divided into two parts: Local Codebase Preparation (for AI Agents) and VPS Deployment Guide (for the Human Administrator).

---

## Part 1: Local Codebase Setup (For AI Coding Agent)

**Agent Context:** You are preparing the project for deployment on an Ubuntu VPS running PM2 and Nginx. No changes to the application logic are needed. We are using port `3001` for the frontend and `8081` for the backend. Please execute the following tasks sequentially:

### Task 1: Create `ecosystem.config.js`
Create a file named `ecosystem.config.js` in the **root** of the repository (`d:/SpicedProjects/Projects/productlogik`). 

**File Content:**
```javascript
module.exports = {
  apps: [
    {
      name: 'productlogik-frontend',
      script: 'npx',
      args: 'serve -s dist -l 3001',
      cwd: './frontend',
      env: {
        NODE_ENV: 'production'
      },
      max_memory_restart: '300M',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      error_file: '../frontend-error.log',
      out_file: '../frontend-out.log'
    },
    {
      name: 'productlogik-backend',
      script: 'venv/bin/uvicorn',
      args: 'main:app --host 127.0.0.1 --port 8081',
      cwd: './backend',
      env: {
        PYTHONUNBUFFERED: '1'
      },
      max_memory_restart: '1G',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      error_file: '../backend-error.log',
      out_file: '../backend-out.log'
    }
  ]
};
```
*Note: Using relative `cwd` entries (`./frontend`, `./backend`) allows PM2 to start from wherever the repository is cloned globally.*

### Task 2: Create Deployment Script `deploy-productlogik.sh`
Create a file named `deploy-productlogik.sh` in the **root** of the repository.

**File Content:**
```bash
#!/bin/bash
set -e

echo "Starting isolated deployment for ProductLogik..."

# 1. Update codebase
echo "Pulling latest code from main branch..."
git fetch origin main
git reset --hard origin/main

# 2. Frontend Build (Enforcing Heap Size Limits to protect VPS RAM)
echo "Installing and building frontend..."
cd frontend
npm install
NODE_OPTIONS="--max-old-space-size=1024" npm run build
cd ..

# 3. Backend Setup
echo "Installing backend dependencies..."
cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt
cd ..

# 4. Restart Process Isolation
echo "Restarting targeted PM2 processes..."
# This ensures we don't accidentally restart HetaVideo
pm2 start ecosystem.config.js || pm2 restart productlogik-frontend productlogik-backend

# 5. Persist the isolated process state
pm2 save

echo "Deployment for ProductLogik completed securely!"
```

*(Note: There are no direct code/API logic changes required because CORS and `VITE_API_URL` dynamically rely on `.env` files).*

---

## Part 2: VPS Deployment Guide (For Human Administrator)

This section must be performed directly via SSH on the VPS server.

> **Warning:** Follow step-by-step carefully. The VPS has limited 4GB RAM and actively powers `HetaVideo`. 

### Step 1: Reclaim Nameservers & Update DNS
Because Hostinger strictly locks its DNS UI while external Nameservers are active, you must forcefully take back control from Vercel *first*. (Since you stated downtime is not a concern, this is the safest and cleanest approach).
1. Log into your **Hostinger Dashboard**.
2. Navigate to the **Domains** tab at the top of your screen and select `productlogik.com`.
3. In the left-hand management sidebar, click on **DNS / Nameservers**.
4. Locate the **Nameservers** block. Click **Change Nameservers** and explicitly select **Use Hostinger nameservers**. Click Save. (This instantly revokes Vercel's control and permanently unlocks your DNS table).
5. Now, scroll down further to the **Manage DNS records** table.
6. Click the **Delete** button next to any dummy parking `A` records (like Hostinger's default `dns-parking` IPs) to wipe the area clean.
7. Use the "Add Record" form at the top to create two brand new `A Records` (Type: `A`, Name: `@`, Points To: `76.13.153.17`) and (Type: `A`, Name: `www`, Points To: `76.13.153.17`). Click **Add Record**.
* **Why do this?**: Changing the Nameservers unlocks local routing. Doing this *first* ensures that while you spend the next few minutes configuring the VPS over SSH, the global DNS is actively propagating to your new `76.13.153.17` IP.
* **If skipped**: SSL generation (Certbot) later on will completely fail because Let's Encrypt will try to validate your domain by pinging dead Vercel endpoints instead of your true VPS IP.

### Step 2: Connect to the Server
SSH into the server as the `deploy` user.
```bash
ssh deploy@76.13.153.17
```
* **Why do this?**: You need command-line access to the host machine.
* **If skipped**: You cannot begin the deployment.

**(Crucial Python Dependency)**: Before proceeding, standard Hostinger Ubuntu images do *not* include Python's built-in virtual environment manager by default. You must install it natively first by pasting this into your terminal:
```bash
sudo apt update && sudo apt install python3.12-venv python3-pip -y
```

### Step 3: Clone the Github Repository safely
Run the following commands to safely clone ProductLogik without touching the `hetavideo` folder:
```bash
cd ~
git clone https://github.com/ProductLogik/productlogik.git productlogik
```
* **Why do this?**: This creates the isolated `/home/deploy/productlogik` directory.
* **If skipped**: You won't have the application on your server. If you mistakenly upload to the `hetavideo` folder, it will crash your existing application.

### Step 4: Create isolated Backend `.env` variables
Navigate to the backend and inject the environment variables:
```bash
cd ~/productlogik/backend
nano .env
```
Paste the following inside (these are your actual production keys):
```env
DATABASE_URL=postgresql+psycopg2://postgres.[YOUR-SUPABASE-PROJECT-ID]:[YOUR-DATABASE-PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
SECRET_KEY=[YOUR-GENERATED-SECURE-SECRET-KEY]
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=3000
FRONTEND_URL=https://productlogik.com,https://www.productlogik.com
```
* **Why do this?**: Your backend needs to know it is allowed to accept requests from your real domain (`FRONTEND_URL` controls CORS policy).
* **If skipped**: The frontend will not be able to log in, upload, or request data.

### Step 5: Create isolated Frontend `.env.production` variables
Navigate to the frontend and create variables:
```bash
cd ~/productlogik/frontend
nano .env.production
```
Paste the following inside:
```env
VITE_API_URL=/api
```
* **Why do this?**: The frontend Javascript runs in the browser, so it needs to know where the server is. Since we use reverse-proxy, `/api` automatically routes to our local backend port on the server.
* **If skipped**: The frontend will attempt to connect to `localhost:8001` from the user's personal laptop browser, immediately throwing connection errors.

### Step 6: Execute the Deployment Script
Run the automated deployment script that the AI agent previously generated:
```bash
cd ~/productlogik
chmod +x deploy-productlogik.sh
./deploy-productlogik.sh
```
* **Why do this?**: This builds the React app and starts the Python/React servers via PM2 on unique internal ports (3001 and 8081). Because we enforced `NODE_OPTIONS`, it will not drain the server's RAM and kill HetaVideo during this build sequence. 
* **If skipped**: The PM2 processes will never initialize, meaning Nginx will hit a '502 Bad Gateway'.

### Step 7: Create the Isolated Nginx Configuration
Create the Nginx routing block strictly for `productlogik.com`:
```bash
sudo nano /etc/nginx/sites-available/productlogik
```
Paste this block:
```nginx
server {
    listen 80;
    server_name productlogik.com www.productlogik.com;

    # Routes to PM2 Python Backend
    location /api/ {
        proxy_pass http://127.0.0.1:8081/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Routes to PM2 Javascript Frontend 
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
* **Why do this?**: This allows the server to act as a traffic cop. When browser requests hitting Port 80 enter the server, it asks Nginx "where should these go?". Nginx directs `/api` cleanly to 8081, and standard clicks (`/`) to 3001.
* **If skipped**: No one on the internet can see your app.

### Step 8: Activate Nginx Settings Safely
Symlink the site to enable it, then reload (never restart) Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/productlogik /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```
* **Why do this?**: The symlink formally enables the configuration. Reloading strictly absorbs the new changes without disconnecting active HetaVideo streamers. 
* **If skipped**: The Nginx configuration will sit there indefinitely but never be active.

### Step 9: Apply HTTPS via Certbot
Now that you control the traffic and your IP has propagated, secure your connections:
```bash
sudo certbot --nginx -d productlogik.com -d www.productlogik.com
```
* **Why do this?**: This negotiates a free SSL certificate automatically with Let's Encrypt and alters your Nginx file to convert HTTP to HTTPS. 
* **If skipped**: Browsers like Chrome will throw massive red warnings that your site is insecure, barring users from effectively visiting it.

### Step 10: Configure Supabase Database Keep-Alive (External Cron)
Now that your VPS is successfully routing public HTTPS traffic, set up the external ping to prevent the Supabase Free Tier from pausing.
1. Log into your external task scheduler (e.g., `cron-job.org`).
2. Create a new task hitting exactly: `https://productlogik.com/api/health/db` (or your chosen domain).
3. Set the execution schedule to run once every 12 to 24 hours.
* **Why do this?**: Hitting this URI forces the Python backend to execute a native `SELECT 1` SQLAlchemy query on the Postgres pooler. This registers active compute usage with Supabase, bypassing the 7-day inactivity pause limit without straining your VPS RAM with internal background schedulers.
* **If skipped**: Supabase will automatically pause your database engine. The next legitimate user to visit your site will experience a completely broken, frozen application as the database fails to respond.

### Step 11: Final Infrastructure Cleanup
Now that your VPS is fully secured with SSL, you can finally execute the legacy teardown:
1. Log into **Vercel** and **Render** dashboards.
2. Completely delete your original `productlogik` deployment projects.
3. Revoke their OAuth access from your GitHub repository settings.
* **Why do this?**: Doing this *last* guarantees absolute zero-downtime during your deployment migration. Now that the Hostinger VPS handles the entire unified load, keeping the Vercel and Render bridges alive is just an unnecessary security risk.
