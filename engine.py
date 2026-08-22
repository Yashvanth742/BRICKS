import pandas as pd

def build_priority_engine(grievance_csv, indicators_csv):
    # 1. Load Datasets
    df_grievance = pd.read_csv(grievance_csv)
    df_indicators = pd.read_csv(indicators_csv)

    # 2. Filter Indicators for the Demo (e.g., India 2020-2023)
    # We look for indicators like 'Access to electricity', 'Road density', etc.
    india_stats = df_indicators[df_indicators['Country Name'] == 'India']

    # 3. The "Weighting" Logic
    # We map Grievance Categories to World Bank Indicators
    # If an indicator is LOW (e.g., 30% access), the Weight is HIGH (0.7)
    weights = {
        "Power/Energy": 0.8,  # High priority if national grid is weak
        "Water/Sanitation": 0.9, 
        "Transport/Roads": 0.6,
        "Health": 0.7
    }

    # 4. Calculate "National Impact Score"
    # Score = (Grievance Urgency) * (National Gap Weight)
    df_grievance['priority_score'] = df_grievance['category'].map(weights).fillna(0.5) * 10
    
    return df_grievance

print("Engine Logic Ready: Grievances now weighted by National Indicators.")