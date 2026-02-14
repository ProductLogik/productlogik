# ProductLogik

**AI-Powered Product Feedback Analysis & Agile Anti-Pattern Detection**

ProductLogik helps product teams transform user feedback into actionable insights while detecting agile anti-patterns that slow down delivery.

![ProductLogik Logo](assets/logo.svg)

---

## 🚀 Features

- **📊 Feedback Analysis**: Upload CSV files with user feedback and get AI-powered theme extraction
- **🎯 Sentiment Detection**: Automatically categorize feedback by sentiment (Critical, Feature Request, Performance)
- **⚠️ Agile Anti-Pattern Detection**: Identify "Feature Factory" and other anti-patterns in your workflow
- **🔐 Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **📈 Usage Tracking**: Monitor API usage and quotas per user
- **💎 Premium UI**: Modern glassmorphism design with smooth animations

---

## 🏗️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **PostgreSQL** (Supabase) - Database
- **SQLAlchemy** - ORM
- **bcrypt** - Password hashing
- **python-jose** - JWT tokens
- **OpenAI SDK** - AI analysis (Phase 3)

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation

---

## 📁 Project Structure

```
productlogik/
├── backend/              # FastAPI backend
│   ├── auth.py          # Authentication routes & JWT logic
│   ├── main.py          # Main FastAPI app
│   ├── models.py        # SQLAlchemy models
│   ├── database.py      # Database connection
│   ├── services/        # AI service & business logic
│   └── requirements.txt # Python dependencies
├── frontend/            # React frontend
│   ├── src/
│   │   ├── pages/      # Page components
│   │   ├── components/ # Reusable UI components
│   │   └── lib/        # API client & utilities
│   └── package.json    # Node dependencies
├── docs/               # Documentation
│   ├── planning/       # Product specs & user stories
│   └── design/         # UI/UX design prompts
├── assets/             # Logo and brand assets
├── start.sh            # Start both backend & frontend
├── stop.sh             # Stop all services
└── README.md           # This file
```

---

## 🛠️ Setup & Installation

### Prerequisites
- **Python 3.11+**
- **Node.js 18+**
- **PostgreSQL** (or Supabase account)

### 1. Clone the Repository
```bash
git clone https://github.com/ProductLogik/productlogik.git
cd productlogik
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your database credentials and JWT secret
```

**Required `.env` variables:**
```env
DATABASE_URL=postgresql://user:password@host:port/database
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install
```

### 4. Database Setup
Run the SQL schema to create tables:
```bash
psql -U your_user -d your_database -f backend/supabase_schema.sql
```

Or use the provided check script:
```bash
cd backend
python check_db.py
```

---

## 🚀 Running the Application

### Option 1: Use Start Script (Recommended)
```bash
# From project root
./start.sh
```
This starts:
- **Backend** on `http://127.0.0.1:8001`
- **Frontend** on `http://localhost:5180`

### Option 2: Manual Start
**Terminal 1 (Backend):**
```bash
cd backend
uvicorn main:app --reload --host 127.0.0.1 --port 8001
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev -- --port 5180
```

### Stop Services
```bash
./stop.sh
```

---

## 📖 Usage

1. **Sign Up**: Create an account at `http://localhost:5180/signup`
2. **Log In**: Access your dashboard at `http://localhost:5180/login`
3. **Upload CSV**: Upload user feedback CSV files
4. **View Insights**: See AI-generated themes and agile anti-pattern warnings

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest test_auth.py
```

### Database Connection Test
```bash
cd backend
python check_db.py
```

---

## 🗺️ Roadmap

- [x] **Phase 1**: Authentication & Database
- [x] **Phase 1.5**: Frontend-Backend Integration
- [ ] **Phase 2**: File Upload & CSV Processing
- [ ] **Phase 3**: OpenAI Integration for Real AI Analysis
- [ ] **Phase 4**: Advanced Analytics Dashboard
- [ ] **Phase 5**: Team Collaboration Features

See [docs/planning/Future_Upgrades.md](docs/planning/Future_Upgrades.md) for detailed roadmap.

---

## 📝 Documentation

- **[Product Spec](docs/planning/Product_Master_Spec.md)** - Complete product specification
- **[User Stories](docs/planning/MVP_User_Stories_AI_Product_Decision_Intelligence.md)** - MVP user stories
- **[Database Schema](docs/planning/Database_Schema.md)** - Database design
- **[Setup Guide](Setup_Guide.md)** - Detailed setup instructions
- **[Design System](docs/design/ui_design_prompts.md)** - UI/UX guidelines

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

**ProductLogik Team**

---

## 🙏 Acknowledgments

- OpenAI for AI capabilities
- Supabase for database hosting
- The FastAPI and React communities

---

## 📧 Support

For support, email support@productlogik.com or open an issue on GitHub.

---

**Built with ❤️ by the ProductLogik Team**
