# 🌍 WasteWise AI — Smart Food Waste Reduction Platform

> Predict. Donate. Save. — An AI-powered B2B SaaS platform that helps restaurants and hostels fight food waste using Machine Learning.

---

## 📌 Table of Contents

1. [The Problem](#-the-problem)
2. [Our Solution](#-our-solution)
3. [How It Works (Simple Version)](#-how-it-works-simple-version)
4. [Tech Stack](#-tech-stack)
5. [Project Structure](#-project-structure)
6. [Getting Started — Step by Step](#-getting-started--step-by-step)
7. [Running the Website on Your System](#-running-the-website-on-your-system)
8. [Available Pages](#-available-pages)
9. [API Endpoints (for developers)](#-api-endpoints-for-developers)
10. [Environment Variables](#-environment-variables)
11. [Common Errors & Fixes](#-common-errors--fixes)

---

## 😟 The Problem

Every single day, **restaurants and college hostels prepare more food than they need** — and the leftover food goes straight to the trash.

This is a massive problem for three reasons:

- 🗑️ **Waste** — Tonnes of perfectly good food is thrown away daily
- 💸 **Money loss** — Preparing extra food costs real money
- 🌱 **Environmental damage** — Food waste contributes to greenhouse gas emissions

The challenge is that these places don't know **in advance** how many people will show up to eat on a given day. So they always over-prepare — just to be safe.

**Example:** A hostel prepares food for 300 students, but on exam days only 180 show up. 120 meals go to waste — every single day.

---

## ✅ Our Solution

**WasteWise AI** solves this by predicting exactly how many people will show up — *before* the food is even cooked.

Here's what our platform does:

1. **🔮 Predicts daily footfall** — Using a trained AI model, it tells you how many people to expect today, based on:
   - Current weather (raining? sunny?)
   - Day of the week (weekday or weekend?)
   - Whether a local event is happening
   - Whether exams are going on (for hostels)
   - Whether a promotion is active (for restaurants)

2. **🚨 Auto-triggers NGO alerts** — If surplus food is predicted, it immediately shows you which NGOs are nearby and ready to collect

3. **📣 Marketing ROI Simulator** — Restaurants can check: "If I run a promotion today, how many extra customers will I get?"

4. **📊 Smart Dashboard** — A live visual overview of predicted footfall, food waste saved, and alerts sent

---

## 🧠 How It Works (Simple Version)

Think of it like this:

```
You enter: Restaurant name + Location + Today's situation
        ↓
Our AI looks at: Weather + Events + Weekday/Weekend + History
        ↓
AI says: "Expect 187 customers today"
        ↓
System calculates: You have capacity for 200 → 13 meals surplus
        ↓
Alert sent: "Kolkata Food Bank is 2.5 km away and ready to collect!"
```

The AI model was trained on **2 years of synthetic data** (2024–2025) covering 4 real-world style entities:
- UEM Kolkata Hostel (300 person capacity)
- Hostel B (150 person capacity)
- Bistro 1 Restaurant (120 person capacity)
- Spice Grill Restaurant (200 person capacity)

---

## 🛠️ Tech Stack

### Backend (The Brain)

| Technology | What it does |
|---|---|
| **Python 3.10+** | The programming language everything is written in |
| **FastAPI** | Creates the API server — handles all requests from the website |
| **XGBoost** | The Machine Learning model that predicts footfall |
| **Pandas** | Reads and processes the training dataset (CSV file) |
| **NumPy** | Handles all the math and number crunching |
| **Scikit-learn** | Evaluates how good our model is (R² Score, RMSE) |
| **OpenWeatherMap API** | Fetches real-time live weather data for the entered location |
| **Python-dotenv** | Loads secret keys from a `.env` file safely |
| **Uvicorn** | The web server that runs FastAPI |

### Frontend (The Face)

| Technology | What it does |
|---|---|
| **React 18** | JavaScript framework — builds the entire user interface |
| **Vite** | Super-fast development server and build tool |
| **Tailwind CSS** | Makes everything look beautiful without writing much CSS |
| **Recharts** | Draws the bar charts and graphs on the dashboard |
| **Axios** | Sends requests from the website to the Python backend |
| **React Router** | Handles navigation between different pages |
| **Lucide React** | Beautiful icons used throughout the app |

---

## 📁 Project Structure

```
MealMind/
│
├── backend/                          ← Python FastAPI server
│   ├── main.py                       ← Main server file (all API logic lives here)
│   ├── generate_dataset.py           ← Script to create the training CSV
│   ├── hackathon_food_waste_dataset.csv  ← The training data (2 years, 4 entities)
│   ├── requirements.txt              ← List of Python packages needed
│   └── .env                          ← Your secret API keys (not shared publicly)
│
├── frontend/                         ← React website
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx         ← Home dashboard with live stats
│   │   │   ├── Predictions.jsx       ← Enter details → get AI footfall prediction
│   │   │   ├── Marketing.jsx         ← Simulate promotion ROI
│   │   │   ├── NgoNetwork.jsx        ← View nearby NGOs ready for pickup
│   │   │   ├── Surplus.jsx           ← Track surplus food history
│   │   │   └── Login.jsx             ← Login page
│   │   ├── App.jsx                   ← Main app with routing
│   │   ├── api.js                    ← All API call functions
│   │   └── main.jsx                  ← Entry point
│   ├── package.json                  ← List of JavaScript packages needed
│   └── vite.config.js               ← Dev server config (runs on port 3000)
│
└── README.md                         ← This file!
```

---

## 🚀 Getting Started — Step by Step

> **Beginner-friendly!** Follow each step one by one. Don't skip anything.

### Prerequisites (Things you need installed first)

Before starting, make sure these are installed on your computer:

- ✅ **Python 3.10 or higher** → [Download here](https://www.python.org/downloads/)
- ✅ **Node.js 18 or higher** → [Download here](https://nodejs.org/)
- ✅ **Git** (optional, for cloning) → [Download here](https://git-scm.com/)

To check if they're installed, open a terminal and type:
```bash
python --version     # Should say Python 3.10 or higher
node --version       # Should say v18 or higher
```

---

### Step 1 — Get the Project on Your Computer

If you have the folder already, skip this. Otherwise:
```bash
# If you got it as a zip, just extract it somewhere easy like Desktop
# Or if cloning from Git:
git clone <repository-url>
cd MealMind
```

---

### Step 2 — Set Up the Backend (Python Server)

Open a terminal and go into the backend folder:

```bash
cd MealMind/backend
```

**Install all required Python packages:**
```bash
pip install -r requirements.txt
```

> This will install FastAPI, XGBoost, Pandas, and everything else the server needs. It may take 1–2 minutes.

---

### Step 3 — Set Up Your API Key (Weather Data)

The app uses OpenWeatherMap to fetch real-time weather. You need a free API key.

**Get your free API key:**
1. Go to [https://openweathermap.org/api](https://openweathermap.org/api)
2. Click "Sign Up" (it's free)
3. After signing in, go to "API Keys" in your dashboard
4. Copy your key

**Add the key to the project:**

Inside `MealMind/backend/`, there is a file called `.env`. Open it and put your key:

```
OPENWEATHER_API_KEY=your_actual_key_here
```

> ⚠️ Don't share this file publicly. Your key is private.

> 💡 If you don't have a key yet, the app still works — it just defaults to "Clear" weather for all predictions.

---

### Step 4 — Set Up the Frontend (React Website)

Open a **new terminal** (keep the first one for the backend) and go into the frontend folder:

```bash
cd MealMind/frontend
```

**Install all JavaScript packages:**
```bash
npm install
```

> This will download React, Tailwind CSS, Recharts, and everything else. May take 1–2 minutes.

---

## 🌐 Running the Website on Your System

You need **two terminals open at the same time** — one for the backend, one for the frontend.

### Terminal 1 — Start the Backend Server

```bash
cd MealMind/backend
python main.py
```

You should see output like this:

```
============================================================
  WasteWise AI — Starting Backend Server
============================================================

🚀 Starting the ML Pipeline...
✅ Data loaded successfully.
🧠 Training XGBRegressor (n_estimators=100)...
✅ Model Trained!
   R² Score : 0.9821
   RMSE     : 4.37
   Columns  : 18
🟢 ML Pipeline ready. Server is live.

INFO:     Uvicorn running on http://0.0.0.0:8001
```

> ✅ The backend is now running at: **https://wastewise-ai-backend.onrender.com**

---

### Terminal 2 — Start the Frontend (Website)

```bash
cd MealMind/frontend
npm run dev
```

You should see:

```
  VITE v5.x.x  ready in 300ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

> ✅ The website is now running at: **http://localhost:3000**

---

### Open the Website

Open your browser (Chrome, Edge, Firefox — any will work) and go to:

```
http://localhost:3000
```

That's it! 🎉 You should see the WasteWise AI login page.

---

## 📄 Available Pages

Once the website is open, here's what you can do on each page:

| Page | URL | What it does |
|---|---|---|
| **Login** | `/login` | Sign in to access the dashboard |
| **Dashboard** | `/` or `/dashboard` | Overview — live stats, charts, quick summary |
| **Predictions** | `/predictions` | Enter your entity name + location → AI predicts today's footfall |
| **Marketing** | `/marketing` | Simulate: "Will running a promo today bring more customers?" |
| **NGO Network** | `/ngo` | See which NGOs are nearby and ready to collect surplus food |
| **Surplus Tracker** | `/surplus` | View history of surplus food and NGO pickups |

---

## 🔌 API Endpoints (for developers)

The backend exposes these API routes. You can test them directly at:
**https://wastewise-ai-backend.onrender.com/docs** (interactive Swagger UI — no extra tools needed!)

### `GET /`
Health check — confirms the server is running.

**Response:**
```jsonhttps:
{
  "status": "online",
  "service": "WasteWise AI Backend",
  "version": "1.0.0"
}
```

---

### `POST /api/v1/predict`
Predicts the expected footfall for today.

**Request body:**
```json
{
  "entity_name": "UEM Kolkata Hostel",
  "entity_type": "Hostel",
  "capacity": 300,
  "lat": 22.5726,
  "lon": 88.3639,
  "promo_active": false,
  "local_event": false
}
```

**Response:**
```json
{
  "predicted_footfall": 214,
  "food_leftover": 86,
  "ngo_alert_triggered": true,
  "weather_used": "Clear",
  "confidence": "Medium"
}
```

---

### `POST /api/v1/marketing/simulate`
Compares predicted footfall with and without a promotion.

**Request body:** Same as `/predict`

**Response:**
```json
{
  "without_promo": 120,
  "with_promo": 167,
  "expected_boost": 47,
  "recommendation": "Run Campaign"
}
```

---

### `GET /api/v1/ngo/network`
Returns a list of nearby NGOs ready for food pickup.

**Response:**
```json
[
  {
    "name": "Kolkata Food Bank",
    "distance_km": 2.5,
    "driver_available": true,
    "capacity_meals": 200
  }
]
```

---

## 🔐 Environment Variables

The `.env` file inside `backend/` holds your secret configuration:

| Variable | Required? | Description |
|---|---|---|
| `OPENWEATHER_API_KEY` | Optional | Your OpenWeatherMap key for live weather. Falls back to "Clear" if missing. |

---

## 🐛 Common Errors & Fixes

### ❌ `TypeError: Invalid value '0' for dtype 'str'`
**What it means:** You're running a newer version of pandas (2.x) which is strict about filling empty values.

**Fix:** This was already fixed in `main.py`. Make sure you have the latest version of the file.

---

### ❌ `FileNotFoundError: hackathon_food_waste_dataset.csv not found`
**What it means:** The training data file is missing from the backend folder.

**Fix:** Run the dataset generator:
```bash
cd MealMind/backend
python generate_dataset.py
```

---

### ❌ `ModuleNotFoundError: No module named 'xgboost'`
**What it means:** Python packages aren't installed.

**Fix:**
```bash
pip install -r requirements.txt
```

---

### ❌ `npm run dev` fails — `Cannot find module`
**What it means:** Node packages aren't installed.

**Fix:**
```bash
cd MealMind/frontend
npm install
```

---

### ❌ Website shows blank page or "Cannot connect"
**What it means:** Either the backend isn't running, or both servers aren't started.

**Fix:** Make sure BOTH terminals are running:
- Terminal 1: `python main.py` inside `backend/`
- Terminal 2: `npm run dev` inside `frontend/`

---

### ❌ Weather always shows "Clear"
**What it means:** Your OpenWeatherMap API key is missing or invalid.

**Fix:** Add a valid key to `backend/.env`:
```
OPENWEATHER_API_KEY=your_key_here
```

---

## 👨‍💻 Built With ❤️ for the Hackathon

WasteWise AI was built to demonstrate how Machine Learning can solve a real-world social problem — food waste — in a practical, deployable way.

**Core idea:** If we can predict demand accurately, we can prepare the right amount of food. And when there's still surplus, we make sure it reaches people who need it — not a landfill.

---

*Made with 🌍 purpose and 🤖 intelligence.*
