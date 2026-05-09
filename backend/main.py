# ════════════════════════════════════════════════════════════════════
# 🌍 WasteWise AI — Backend Server
# ════════════════════════════════════════════════════════════════════
# A B2B SaaS platform that predicts daily restaurant/hostel footfall
# using ML (XGBoost) to optimize food waste and automatically triggers
# NGO donations for projected surplus food.
# ════════════════════════════════════════════════════════════════════

# ════════════════════════════════════════
# 🔇 SUPPRESS ALL WARNINGS
# ════════════════════════════════════════
import warnings
warnings.filterwarnings("ignore")                 # Suppress all warnings globally
import os
os.environ["PYTHONWARNINGS"] = "ignore"            # Also suppress via env var for subprocesses
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"           # Suppress TensorFlow noise (if ever imported)

import sys
import io

# Force UTF-8 encoding for Windows terminals that choke on emoji
if sys.stdout.encoding != "utf-8":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
if sys.stderr.encoding != "utf-8":
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

# ════════════════════════════════════════
# 📦 IMPORTS
# ════════════════════════════════════════
import numpy as np
import pandas as pd
from datetime import datetime

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

from xgboost import XGBRegressor
from sklearn.metrics import r2_score, mean_squared_error

import requests
from dotenv import load_dotenv

# ════════════════════════════════════════
# ⚙️ GLOBAL SETUP
# ════════════════════════════════════════

# Load environment variables from .env file
load_dotenv()

# Retrieve OpenWeatherMap API key from environment
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")

# Global placeholders — filled during startup
model = None             # Trained XGBRegressor model
training_columns = []    # Column names used during training (for alignment)

# Initialize FastAPI application
app = FastAPI(
    title="WasteWise AI — Backend API",
    description="Predicts footfall, triggers NGO alerts, and simulates marketing ROI.",
    version="1.0.0",
)

# Add CORS middleware — allow all origins for hackathon ease-of-use
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],           # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],           # Allow all HTTP methods
    allow_headers=["*"],           # Allow all headers
)


# ════════════════════════════════════════
# 🤖 ML PIPELINE — runs on startup
# ════════════════════════════════════════

@app.on_event("startup")
def train_model():
    """
    Runs once when the server starts.
    Loads the CSV, preprocesses features, trains an XGBRegressor,
    and stores the model + training column names globally.
    """
    global model, training_columns

    print("\n🚀 Starting the ML Pipeline...")

    # --------------------------------------------------
    # 1. Load the dataset
    # --------------------------------------------------
    try:
        df = pd.read_csv("hackathon_food_waste_dataset.csv")
        print("✅ Data loaded successfully.")
    except FileNotFoundError:
        print("❌ ERROR: hackathon_food_waste_dataset.csv not found!")
        return

    # Print first 5 rows and column names for verification
    print("\n📋 First 5 rows:")
    print(df.head().to_string())
    print(f"\n📊 Columns: {list(df.columns)}")

    # --------------------------------------------------
    # 2. Preprocess the data
    # --------------------------------------------------
    print("\n⚙️  Preprocessing data...")

    # A. Parse Date → extract Month (int) and DayOfWeek (int)
    df["Date"] = pd.to_datetime(df["Date"])       # Convert string to datetime
    df["Month"] = df["Date"].dt.month              # 1–12
    df["DayOfWeek"] = df["Date"].dt.dayofweek      # 0=Mon … 6=Sun
    df.drop("Date", axis=1, inplace=True)          # Drop original Date column

    # B. Fill NaN values — string columns with "" and numeric columns with 0
    # (pandas 2.x strictly enforces dtype compatibility in fillna)
    str_cols = df.select_dtypes(include=["object", "string"]).columns
    num_cols = df.select_dtypes(exclude=["object", "string"]).columns
    df[str_cols] = df[str_cols].fillna("")
    df[num_cols] = df[num_cols].fillna(0)

    # C. Convert boolean columns to int (True→1, False→0)
    bool_cols = df.select_dtypes(include=["bool"]).columns.tolist()
    for col in bool_cols:
        df[col] = df[col].astype(int)

    # D. One-hot encode categorical columns
    categorical_cols = ["Entity_Name", "Entity_Type", "Weather_Condition", "Local_Event"]
    df = pd.get_dummies(df, columns=categorical_cols, drop_first=False)

    # Ensure all one-hot columns are int (pandas sometimes makes them bool)
    for col in df.columns:
        if df[col].dtype == "bool":
            df[col] = df[col].astype(int)

    # --------------------------------------------------
    # 3. Split features and target
    # --------------------------------------------------
    target_col = "Expected_Footfall"               # This is our target
    X = df.drop(target_col, axis=1)
    y = df[target_col]

    # Save column names for later prediction alignment
    training_columns = X.columns.tolist()

    # --------------------------------------------------
    # 4. Train XGBRegressor
    # --------------------------------------------------
    print("🧠 Training XGBRegressor (n_estimators=100)...")

    model = XGBRegressor(
        n_estimators=100,
        random_state=42,
        verbosity=0,                               # Suppress XGBoost internal logs
    )
    model.fit(X, y)                                # Train on full dataset

    # --------------------------------------------------
    # 5. Evaluate on training data
    # --------------------------------------------------
    preds = model.predict(X)
    r2 = r2_score(y, preds)
    rmse = np.sqrt(mean_squared_error(y, preds))

    print(f"✅ Model Trained!")
    print(f"   R² Score : {r2:.4f}")
    print(f"   RMSE     : {rmse:.2f}")
    print(f"   Columns  : {len(training_columns)}")
    print("🟢 ML Pipeline ready. Server is live.\n")


# ════════════════════════════════════════
# 🌦️ WEATHER HELPER FUNCTION
# ════════════════════════════════════════

def get_weather(lat: float, lon: float) -> str:
    """
    Fetch current weather from OpenWeatherMap and map it to one of:
    'Clear', 'Cloudy', or 'Heavy Rain'.

    Falls back to 'Clear' on any failure (timeout, bad key, etc.).

    Args:
        lat: Latitude of the location.
        lon: Longitude of the location.

    Returns:
        A weather condition string.
    """
    try:
        url = "https://api.openweathermap.org/data/2.5/weather"
        params = {
            "lat": lat,
            "lon": lon,
            "appid": OPENWEATHER_API_KEY,
            "units": "metric",                     # Celsius
        }
        resp = requests.get(url, params=params, timeout=5)  # 5-second timeout
        resp.raise_for_status()                    # Raise on HTTP errors

        data = resp.json()
        main_weather = data["weather"][0]["main"]  # e.g., "Rain", "Clouds", "Clear"

        # Map OpenWeatherMap categories → our training categories
        if main_weather in ("Rain", "Drizzle", "Thunderstorm"):
            weather = "Heavy Rain"
        elif main_weather in ("Clouds", "Mist", "Fog", "Haze", "Smoke"):
            weather = "Cloudy"
        else:
            weather = "Clear"

        print(f"[Weather API] ✅ lat={lat}, lon={lon} → {weather} (raw: {main_weather})")
        return weather

    except Exception as e:
        # On any failure, fall back to "Clear"
        print(f"[Weather API] ⚠️  Failed ({e}). Falling back to 'Clear'.")
        return "Clear"


# ════════════════════════════════════════
# 📝 PYDANTIC REQUEST MODELS
# ════════════════════════════════════════

class PredictRequest(BaseModel):
    """Request body for the /predict endpoint."""
    entity_name: str       # e.g., "UEM Kolkata Hostel"
    entity_type: str       # "Hostel" or "Restaurant"
    capacity: int          # Maximum number of people the entity can serve
    lat: float             # Latitude for weather lookup
    lon: float             # Longitude for weather lookup
    promo_active: bool     # Whether a marketing promotion is currently running
    local_event: bool      # Whether there is a local event nearby


class MarketingRequest(BaseModel):
    """Request body for the /marketing/simulate endpoint."""
    entity_name: str
    entity_type: str
    capacity: int
    lat: float
    lon: float
    promo_active: bool     # Will be overridden internally (0 vs 1 comparison)
    local_event: bool


# ════════════════════════════════════════
# 🔮 PREDICTION HELPER
# ════════════════════════════════════════

def build_input_df(
    entity_name: str,
    entity_type: str,
    weather: str,
    local_event: bool,
    promo_active: int,
    review_avg: float = 0.0,
) -> pd.DataFrame:
    """
    Build a single-row DataFrame that matches the exact training columns.

    Steps:
        1. Create a base row with numeric features.
        2. Set one-hot encoded columns to 0.
        3. Flip the correct one-hot flags to 1.
        4. Reindex to match training_columns (fills missing cols with 0).

    Args:
        entity_name:  Name of the entity (must match a training entity).
        entity_type:  'Hostel' or 'Restaurant'.
        weather:      Weather condition string.
        local_event:  Whether a local event is happening.
        promo_active: 1 or 0.
        review_avg:   Average review score (0 for hostels).

    Returns:
        A DataFrame aligned to training_columns.
    """
    now = datetime.now()

    # Base numeric features
    row = {
        "College_Exam_Season": 1 if now.month in [4, 5, 11, 12] else 0,
        "Promo_Active": promo_active,
        "Recent_Review_Avg": review_avg,
        "Month": now.month,                        # Current month
        "DayOfWeek": now.weekday(),                # Current day of week (0=Mon)
    }

    # Initialize all training columns to 0
    for col in training_columns:
        if col not in row:
            row[col] = 0

    # Set the correct one-hot flags to 1
    entity_name_col = f"Entity_Name_{entity_name}"
    entity_type_col = f"Entity_Type_{entity_type}"
    weather_col = f"Weather_Condition_{weather}"
    local_event_val = "None" if not local_event else "Local Festival"
    local_event_col = f"Local_Event_{local_event_val}"

    if entity_name_col in row:
        row[entity_name_col] = 1
    if entity_type_col in row:
        row[entity_type_col] = 1
    if weather_col in row:
        row[weather_col] = 1
    if local_event_col in row:
        row[local_event_col] = 1

    # Build DataFrame and reindex to match training columns exactly
    df = pd.DataFrame([row])
    df = df.reindex(columns=training_columns, fill_value=0)

    return df


# ════════════════════════════════════════
# 📡 API ENDPOINTS
# ════════════════════════════════════════

# ─────────────────────────────────────
# POST /api/v1/predict
# ─────────────────────────────────────

@app.post("/api/v1/predict")
def predict_footfall(req: PredictRequest):
    """
    Predict daily footfall for a given entity using live weather data.

    Returns predicted footfall, food leftover estimate,
    NGO alert status, weather used, and a confidence level.
    """
    # 1. Fetch live weather
    weather = get_weather(req.lat, req.lon)

    # 2. Build input DataFrame matching training schema
    input_df = build_input_df(
        entity_name=req.entity_name,
        entity_type=req.entity_type,
        weather=weather,
        local_event=req.local_event,
        promo_active=1 if req.promo_active else 0,
        review_avg=4.0 if req.entity_type == "Restaurant" else 0.0,
    )

    # 3. Predict footfall
    raw_prediction = model.predict(input_df)[0]    # XGBoost outputs a float
    predicted_footfall = int(round(raw_prediction)) # Round to nearest int
    predicted_footfall = max(0, min(predicted_footfall, req.capacity))  # Clamp [0, capacity]

    # 4. Calculate food leftover and NGO alert
    food_leftover = req.capacity - predicted_footfall
    ngo_alert_triggered = food_leftover > 0        # Any surplus triggers alert

    # 5. Determine confidence level
    leftover_pct = food_leftover / req.capacity if req.capacity > 0 else 0
    confidence = "High" if leftover_pct < 0.20 else "Medium"

    print(f"[Predict] Entity={req.entity_name}, Predicted={predicted_footfall}, "
          f"Leftover={food_leftover}, NGO={'YES' if ngo_alert_triggered else 'NO'}")

    return {
        "predicted_footfall": predicted_footfall,
        "food_leftover": food_leftover,
        "ngo_alert_triggered": ngo_alert_triggered,
        "weather_used": weather,
        "confidence": confidence,
    }


# ─────────────────────────────────────
# POST /api/v1/marketing/simulate
# ─────────────────────────────────────

@app.post("/api/v1/marketing/simulate")
def simulate_marketing(req: MarketingRequest):
    """
    Compare predicted footfall WITH and WITHOUT a marketing promotion.

    Returns both predictions, the expected boost, and a recommendation.
    """
    # 1. Fetch live weather (shared for both scenarios)
    weather = get_weather(req.lat, req.lon)

    # 2. Predict WITHOUT promo (promo_active=0)
    input_no_promo = build_input_df(
        entity_name=req.entity_name,
        entity_type=req.entity_type,
        weather=weather,
        local_event=req.local_event,
        promo_active=0,                            # No promotion
        review_avg=4.0 if req.entity_type == "Restaurant" else 0.0,
    )
    without_promo = int(round(model.predict(input_no_promo)[0]))
    without_promo = max(0, min(without_promo, req.capacity))

    # 3. Predict WITH promo (promo_active=1)
    input_with_promo = build_input_df(
        entity_name=req.entity_name,
        entity_type=req.entity_type,
        weather=weather,
        local_event=req.local_event,
        promo_active=1,                            # With promotion
        review_avg=4.0 if req.entity_type == "Restaurant" else 0.0,
    )
    with_promo = int(round(model.predict(input_with_promo)[0]))
    with_promo = max(0, min(with_promo, req.capacity))

    # 4. Calculate boost and recommendation
    boost = with_promo - without_promo
    recommendation = "Run Campaign" if boost > 10 else "Not Worth It"

    print(f"[Marketing] Entity={req.entity_name}, "
          f"Without={without_promo}, With={with_promo}, Boost={boost}")

    return {
        "without_promo": without_promo,
        "with_promo": with_promo,
        "expected_boost": boost,
        "recommendation": recommendation,
    }


# ─────────────────────────────────────
# GET /api/v1/ngo/network
# ─────────────────────────────────────

@app.get("/api/v1/ngo/network")
def get_ngo_network():
    """
    Return a static list of 3 mock NGOs available for surplus food pickup.

    Each NGO includes name, distance, driver availability, and meal capacity.
    """
    ngo_list = [
        {
            "name": "Kolkata Food Bank",
            "distance_km": 2.5,
            "driver_available": True,
            "capacity_meals": 200,
        },
        {
            "name": "Annapurna Foundation",
            "distance_km": 5.1,
            "driver_available": True,
            "capacity_meals": 350,
        },
        {
            "name": "Robin Hood Army — Kolkata Chapter",
            "distance_km": 8.3,
            "driver_available": False,
            "capacity_meals": 500,
        },
    ]

    print(f"[NGO Network] Returned {len(ngo_list)} NGOs.")
    return ngo_list


# ════════════════════════════════════════
# 🏠 ROOT ENDPOINT (Health Check)
# ════════════════════════════════════════

@app.get("/")
def root():
    """Health-check endpoint. Returns a welcome message."""
    return {
        "status": "online",
        "service": "WasteWise AI Backend",
        "version": "1.0.0",
        "docs": "/docs",
    }


# ════════════════════════════════════════
# 🚀 ENTRY POINT
# ════════════════════════════════════════

if __name__ == "__main__":
    import uvicorn
    print("=" * 60)
    print("  WasteWise AI — Starting Backend Server")
    print("=" * 60)
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
