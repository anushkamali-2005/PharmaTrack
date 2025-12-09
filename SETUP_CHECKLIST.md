# 🚀 RAG Safety Feature - Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Backend Setup (Render)

- [ ] **Push code to GitHub**
  ```bash
  git add .
  git commit -m "feat: Add RAG-powered safety engine"
  git push origin main
  ```

- [ ] **Set Environment Variables in Render:**
  - `GOOGLE_API_KEY` = Your Gemini API key (get from https://makersuite.google.com/app/apikey)
  - `DATABASE_URL` = Your database connection string (if using PostgreSQL)
  - `PYTHON_ENV` = `production` (optional)

- [ ] **Verify Backend is Running:**
  - Visit: `https://your-render-url.onrender.com/health`
  - Should return: `{"status": "healthy", ...}`

### 2. Knowledge Base Ingestion

- [ ] **Check if dataset exists:**
  - Ensure `datasets/raw/medquad.csv` is in your repository

- [ ] **Ingest the Knowledge Base:**
  ```bash
  # Option 1: Via API (after backend is deployed)
  curl -X POST https://your-render-url.onrender.com/api/v1/safety/ingest
  
  # Option 2: Check status
  curl https://your-render-url.onrender.com/api/v1/safety/status
  ```

- [ ] **Verify Ingestion:**
  - Status endpoint should show: `"ready": true`
  - Or check backend logs for "✅ Ingestion Complete"

### 3. Frontend Setup (Vercel)

- [ ] **Set Environment Variable in Vercel:**
  - Go to: Vercel Dashboard → Your Project → Settings → Environment Variables
  - Add/Update: `NEXT_PUBLIC_API_URL` = `https://your-render-url.onrender.com/api/v1`
  - **Important:** Redeploy after adding environment variable

- [ ] **Verify Frontend Build:**
  - Check Vercel deployment logs for any build errors
  - Should build successfully

### 4. Testing

- [ ] **Test Backend API:**
  - Visit: `https://your-render-url.onrender.com/docs`
  - Check `/api/v1/safety/status` endpoint
  - Test `/api/v1/safety/check` with sample data

- [ ] **Test Frontend:**
  - Visit: `https://your-vercel-url.vercel.app/dashboard/safety`
  - Enter drug name (e.g., "Aspirin")
  - Add conditions and medications
  - Click "Run Safety Check"
  - Verify results display correctly

## 🔧 Troubleshooting

### Issue: "System unavailable (Missing API Keys or DB)"
**Solution:** 
- Check `GOOGLE_API_KEY` is set in Render
- Verify knowledge base is ingested (check `/api/v1/safety/status`)

### Issue: "Failed to analyze safety"
**Solution:**
- Check backend logs in Render
- Verify backend URL is correct in frontend environment variable
- Check CORS settings (should allow Vercel domain)

### Issue: Knowledge base not found
**Solution:**
- Ensure `datasets/raw/medquad.csv` exists in repository
- Run ingestion endpoint: `POST /api/v1/safety/ingest`
- Check backend logs for path resolution

### Issue: Frontend can't connect to backend
**Solution:**
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check backend CORS allows Vercel domain
- Verify backend is running (check `/health` endpoint)

## 📝 Quick Test Commands

```bash
# Test backend health
curl https://your-render-url.onrender.com/health

# Check safety system status
curl https://your-render-url.onrender.com/api/v1/safety/status

# Test safety check (example)
curl -X POST https://your-render-url.onrender.com/api/v1/safety/check \
  -H "Content-Type: application/json" \
  -d '{
    "drug_name": "Aspirin",
    "conditions": ["Diabetes"],
    "current_medications": ["Metformin"]
  }'
```

## 🎯 Expected Behavior

1. **Safety Page Loads:** Should show input form with drug search
2. **Autocomplete Works:** Typing drug name shows suggestions
3. **Safety Check Runs:** Clicking "Run Safety Check" shows loading, then results
4. **Results Display:**
   - Safety Score (0-100) with color coding
   - Warnings list
   - Explanation text
   - Alternative medicines (if score < 70)
   - FDA alerts (if any)
   - Research citations
   - Pharmacist action buttons

## 🔗 Important URLs

- **Backend API Docs:** `https://your-render-url.onrender.com/docs`
- **Frontend:** `https://your-vercel-url.vercel.app/dashboard/safety`
- **Safety Status:** `https://your-render-url.onrender.com/api/v1/safety/status`

