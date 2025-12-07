# 🏥 Smart Pharmacy Inventory Management System

AI-powered pharmacy inventory platform with demand forecasting, real-time alerts, and intelligent chatbot assistance.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Python 3.12+
- PostgreSQL 15+ (via Supabase)
- Docker (optional)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_ORG/smart-pharmacy-system.git
cd smart-pharmacy-system
```

2. **Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env.local
# Add your Supabase keys to .env.local
npm run dev
```

3. **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Add your environment variables to .env
uvicorn api.main:app --reload
```

4. **ML Services Setup**
```bash
cd ml-services
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 📁 Project Structure

- `frontend/` - Next.js 15 dashboard (TypeScript + Tailwind)
- `backend/` - FastAPI REST API
- `ml-services/` - ML models and inference
- `agentic-ai/` - LangChain chatbot and voice assistant
- `data-pipeline/` - ETL and data processing
- `database/` - Migrations and schemas

## 🔗 Live URLs

- **Production**: https://smart-pharmacy.vercel.app
- **Staging**: https://smart-pharmacy-dev.vercel.app
- **API Docs**: https://api.smart-pharmacy.com/docs

## 👥 Team

- **Web Developer**: Frontend + Backend + Infrastructure
- **Data Scientist**: ML models + Data pipeline
- **Agentic AI Developer**: Chatbot + Voice + Automation

## 📖 Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [API Documentation](docs/API_DOCS.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-name-feature`
2. Commit changes: `git commit -m "feat: add feature"`
3. Push to branch: `git push origin feature/your-name-feature`
4. Create Pull Request to `dev` branch

## 📝 License

MIT License
