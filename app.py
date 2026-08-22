import streamlit as st
import pandas as pd
import pydeck as pdk
import random

# --- UI CONFIG ---
st.set_page_config(page_title="BRICS Digital Public Good", layout="wide")

# --- FEATURE 1: DATA HARMONIZATION ENGINE ---
@st.cache_data
def load_advanced_data():
    # Simulating data from different fragmented systems
    data = {
        'Region': ['Mumbai, IN', 'Gauteng, SA', 'Sao Paulo, BR', 'Mumbai, IN', 'Gauteng, SA'],
        'Source': ['WhatsApp', 'Radio-to-Text', 'Web Portal', 'Paper-Digitized', 'WhatsApp'],
        'Raw_Feedback': [
            "पानी की पाइपलाइन टूटी है", 
            "Roads are full of potholes near the clinic", 
            "Falta de energia constante no bairro",
            "School needs a bridge for monsoon",
            "Water scarcity is hitting the local farm"
        ],
        'Category': ['Water', 'Transport', 'Energy', 'Transport', 'Water'],
        'Lat': [19.0760, -26.2041, -23.5505, 19.1200, -26.2500],
        'Lon': [72.8777, 28.0473, -46.6333, 72.9000, 28.1000],
        'Infra_Index': [0.3, 0.5, 0.4, 0.2, 0.1], # 0 = Critical, 1 = Good
        'Pop_Density': [800, 400, 600, 900, 300]
    }
    df = pd.DataFrame(data)
    # Calculate Priority Score
    df['Priority_Score'] = ((1 - df['Infra_Index']) * 50) + (df['Pop_Density'] / 20)
    return df

df = load_advanced_data()

# --- HEADER ---
st.title("🏛️ BRICS Infrastructure Alignment Platform")
st.markdown("### *Digital Public Good for National Policymakers*")

# --- FEATURE 2: MULTILINGUAL INPUT SIMULATOR ---
with st.expander("📥 Simulate New Citizen Input (Multilingual)"):
    col1, col2 = st.columns(2)
    with col1:
        text_input = st.text_area("Citizen Voice Input", "Enter text in any BRICS language...")
        lang = st.selectbox("Detected Language", ["Hindi", "Portuguese", "Mandarin", "Russian", "English"])
    with col2:
        st.info("AI Processing: Extracting Intent & Location...")
        if st.button("Process & Align"):
            st.success("Intent: 'Infrastructure Repair' | Priority: High | Added to BigQuery")

# --- FEATURE 3: GEOSPATIAL GAP ANALYSIS ---
st.header("🗺️ Geospatial Demand Hotspots")
view_region = st.selectbox("Select Focus Region", df['Region'].unique())
filtered_df = df[df['Region'] == view_region]

# Advanced Map with Heatmap and Scatter
st.pydeck_chart(pdk.Deck(
    map_style='mapbox://styles/mapbox/dark-v9',
    initial_view_state=pdk.ViewState(
        latitude=filtered_df['Lat'].mean(),
        longitude=filtered_df['Lon'].mean(),
        zoom=10,
        pitch=45,
    ),
    layers=[
        pdk.Layer(
            'HeatmapLayer',
            data=filtered_df,
            get_position='[Lon, Lat]',
            get_weight="Priority_Score",
            radius_pixels=60,
        ),
        pdk.Layer(
            'ScatterplotLayer',
            data=filtered_df,
            get_position='[Lon, Lat]',
            get_color='[200, 30, 0, 160]',
            get_radius=200,
        ),
    ],
))

# --- FEATURE 4: AI POLICY RECOMMENDATION ---
st.header("🤖 AI-Driven Investment Recommendations")
col_a, col_b = st.columns(2)

with col_a:
    st.subheader("Top Priority Projects")
    st.dataframe(filtered_df[['Category', 'Raw_Feedback', 'Priority_Score']].sort_values(by='Priority_Score', ascending=False))

with col_b:
    st.subheader("Generated Project Brief")
    top_impact = filtered_df.iloc[0]
    st.write(f"**Project:** {top_impact['Category']} Restoration")
    st.write(f"**Justification:** This area has an Infrastructure Index of {top_impact['Infra_Index']} and a population density of {top_impact['Pop_Density']}. Fixing this will impact the highest number of citizens per dollar spent.")
    st.button("Export to National Budget Plan (PDF)")

# --- FEATURE 5: DPG COMPLIANCE ---
st.sidebar.header("⚙️ DPG Framework")
st.sidebar.checkbox("Anonymize PII Data", value=True)
st.sidebar.checkbox("OpenAPI Interoperability", value=True)
st.sidebar.write("---")
st.sidebar.write("**Tech Stack:** Gemini API, Google Earth Engine, BigQuery")