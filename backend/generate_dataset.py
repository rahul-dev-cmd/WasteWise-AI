"""
Dataset Generator for WasteWise AI
Generates hackathon_food_waste_dataset.csv with synthetic hostel/restaurant data.
"""
import pandas as pd
import numpy as np
from datetime import date
import random

# ---------------------------------------------------------
# 1. Configuration & Setup
# ---------------------------------------------------------
np.random.seed(42)
start_date = date(2024, 1, 1)
end_date = date(2025, 12, 31)
date_range = pd.date_range(start_date, end_date)

entities = [
    {"name": "UEM Kolkata Hostel", "type": "Hostel", "base_footfall": 300},
    {"name": "Hostel B", "type": "Hostel", "base_footfall": 150},
    {"name": "Bistro 1", "type": "Restaurant", "base_footfall": 120},
    {"name": "Spice Grill", "type": "Restaurant", "base_footfall": 200}
]

weather_options = ["Clear", "Cloudy", "Light Rain", "Heavy Rain", "Heatwave"]
weather_probs = [0.5, 0.2, 0.15, 0.05, 0.1]

events = ["None", "Local Festival", "Concert", "Sports Match"]
event_probs = [0.85, 0.05, 0.05, 0.05]

# ---------------------------------------------------------
# 2. Generate the Data
# ---------------------------------------------------------
data = []
for entity in entities:
    for current_date in date_range:
        weather = np.random.choice(weather_options, p=weather_probs)
        event = np.random.choice(events, p=event_probs)
        is_weekend = current_date.weekday() >= 5

        exam_season = False
        promo_active = False
        review_avg = round(random.uniform(3.5, 5.0), 1)
        footfall = entity["base_footfall"]

        if entity["type"] == "Hostel":
            if current_date.month in [4, 5, 11, 12]:
                exam_season = True
                footfall *= random.uniform(0.7, 0.9)
            if event == "Local Festival" or current_date.month == 1:
                footfall *= random.uniform(0.2, 0.4)
            if weather == "Heavy Rain":
                footfall *= 1.05
        elif entity["type"] == "Restaurant":
            if is_weekend:
                footfall *= random.uniform(1.2, 1.5)
            promo_active = random.choice([True, False])
            if promo_active and review_avg >= 4.2:
                footfall *= random.uniform(1.3, 1.6)
            if weather == "Heavy Rain":
                footfall *= random.uniform(0.4, 0.6)
            elif weather == "Clear":
                footfall *= random.uniform(1.0, 1.1)
            if event != "None":
                footfall *= random.uniform(1.2, 1.5)

        final_footfall = int(footfall * random.uniform(0.9, 1.1))
        final_footfall = max(0, final_footfall)

        data.append({
            "Date": current_date,
            "Entity_Name": entity["name"],
            "Entity_Type": entity["type"],
            "Weather_Condition": weather,
            "College_Exam_Season": exam_season,
            "Local_Event": event,
            "Promo_Active": promo_active if entity["type"] == "Restaurant" else False,
            "Recent_Review_Avg": review_avg if entity["type"] == "Restaurant" else None,
            "Expected_Footfall": final_footfall
        })

df = pd.DataFrame(data)
df = df.sort_values(by=["Date", "Entity_Name"]).reset_index(drop=True)
filename = "hackathon_food_waste_dataset.csv"
df.to_csv(filename, index=False)

print(f"✅ Successfully generated dataset with {len(df)} rows!")
print(f"💾 Saved as: {filename}")
print("\n--- Sample Output ---")
print(df.head(8))
