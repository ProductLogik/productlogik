<p align="center">
  <img src="assets/logo.svg" alt="ProductLogik Logo" width="120" height="120">
</p>

<h1 align="center">ProductLogik</h1>
<p align="center"><strong>The AI-Powered Product Decision Intelligence Platform</strong></p>

<p align="center">ProductLogik (The "A.I. Product Compass") transforms raw customer feedback into strategic intelligence. It diagnoses product strategy, extracts actionable problem themes, and detects systemic agile anti-patterns.</p>

---

## 🚀 Key Features

- **🧠 Dual-Provider AI**: Powered by **Google Gemini 2.0 Flash** (Primary) with automated fallback to **GPT-4o-mini**, ensuring high performance and reliable feedback analysis.
- **📊 Intelligence Ingestion**: Transform raw CSV feedback into coherent themes with sentiment analysis, confidence scores, and evidence quotes.
- **🧭 Compass Dashboard**: A streamlined results view for product owners to prioritize what users actually need.
- **⚡ Real-Time Usage Tracking**: Integrated usage dashboard with dynamic progress bars and credits management.
- **💳 Tiered Quota Enforcement**: Production-ready **Stripe** integration enforcing 3 tiers (Demo, Pro, Team) with hard API limits.
- **💼 Professional Branding**: Authenticated domain emails via **Resend** and hosted PNG branding assets for professional delivery.
- **🔐 Enterprise Security**: JWT-based session management, feedback data isolation, and secure CORS/CSP configuration.

---

## 🤖 AI Intelligence Layer (The Compass)

ProductLogik is built with a sophisticated, self-healing AI architecture designed for reliability and strategic depth:

### 🔄 Multi-Model Fallback System (Self-Healing)
The platform prioritizes speed and cost with **Gemini 2.0 Flash**, but the `AIService` automatically detects provider failures or rate limits and fails over to **GPT-4o-mini** in real-time.

### 🎯 Strategic Theme Discovery
Our proprietary prompt architecture uses a **Senior Agile Coach persona**. It doesn't just summarize feedback; it filters noise and identifies underlying strategic risks such as "Login Friction" or "Innovation Debt".

### 🛡️ Privacy-First AI
*   **Zero-Training**: We use enterprise-grade APIs where your data is NOT used to train the base models.
*   **Minimal Footprint**: Analysis insights are stored in structured JSON; raw text is processed and evicted to respect data privacy.

---

## 🏗️ Tech Stack

### Backend
- **FastAPI** - High-performance Python web framework
- **Google Gemini Pro** - State-of-the-art LLM for feedback analysis
- **PostgreSQL (Supabase)** - Scalable relational database
- **SQLAlchemy** - Robust ORM for data management
- **Resend** - Professional transactional email infrastructure
- **Stripe** - Secure payment processing and subscription management

### Frontend
- **React 18** - UI library with **Vite** build tool
- **TypeScript** - Strict type safety for large-scale development
- **Tailwind CSS** - Modern, responsive glassmorphism design
- **Lucide Icons** - Clean and consistent iconography

---

## 📁 Project Structure

```
productlogik/
├── backend/              # FastAPI backend
│   ├── services/        # AI (Gemini), Email (Resend), & Quota services
│   ├── models.py        # SQLAlchemy database models
│   ├── auth.py          # Secure JWT authentication & user management
│   └── upload.py        # Quota-enforced feedback ingestion
├── frontend/            # React frontend
│   ├── src/
│   │   ├── pages/      # Dashboards, Pricing, & Usage tracking
│   │   ├── components/ # Reusable UI components (Navbar, UserProfile)
│   │   └── lib/        # API client & internal utilities
├── docs/               # System & Strategy Documentation
│   ├── planning/       # Product specs, Agile specs, & Feature plans
│   └── design/         # UI/UX design tokens
├── start.sh            # One-click developer environment boot
└── README.md           # This file
```

---

## 🛠️ Setup & Installation

### Prerequisites
- **Python 3.10+**
- **Node.js 18+**
- **Supabase/PostgreSQL** instance

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Configure DATABASE_URL, GEMINI_API_KEY, and RESEND_API_KEY
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```

### 3. Execution
```bash
# From root directory
./start.sh
```

---

## 🌐 Deployment & Infrastructure (Current Migration)

ProductLogik is currently undergoing an active infrastructure migration from standard PaaS providers (Vercel/Render) to a strictly isolated, self-managed **Ubuntu VPS**. 

This transition integrates **PM2** for resilient process lifecycle memory-management (running isolated API and React instances) and connects an **Nginx Reverse Proxy** for secure HTTPS traffic routing.

For complete, step-by-step instructions regarding the production server configurations and environment isolation, please read the primary migration doc:
👉 **[Deployment Migration Plan](./docs/deployment_migration_plan.md)**

---

## 🗺️ Roadmap: The Path to Enterprise

- [x] **Phase 1: Foundation**: Core Ingestion, Auth, & Gemini 2.0 Integration.
- [/] **Phase 2: Commercialization & Infrastructure**: Stripe Tiers, Custom Domain Setup, & Quota Enforcement.
    - [/] **Production VPS Migration (Active)**: Transitioning from Vercel/Render to a unified Ubuntu machine utilizing Nginx and PM2.
- [/] **Phase 3: Deep Insights**:
    - [ ] **Agile Anti-Pattern Detection**: Automated detection of Feature Factory & HiPPO Effect.
    - [ ] **Product Health Score**: Composite metric for strategic consistency.
    - [ ] **PDF Export Engine**: Professional reporting for stakeholders.
- [ ] **Phase 4: Ecosystem**: Auto-Sync with Intercom, Zendesk, and Slack.

---

## 👥 Author

**Muhammad Hamza Latif**
*Solo Developer, ProductLogik*

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for Product Owners everywhere.**
