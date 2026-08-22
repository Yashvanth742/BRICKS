# 🌍 AERO-BRICS: AI-Powered Federated Climate Action Platform

> **Submitted for BRICS Climate & AI Innovation Challenge**
> An AI-powered, interoperable federated platform combining citizen photo analysis, Copernicus satellite imagery, and meteorological data to detect hyper-local air pollution hotspots, forecast cross-border smog spikes, and generate automated diplomatic action briefs across BRICS nations.

---

## 🚀 Key Features

### 1. 🗺️ Trans-Boundary Economic Corridor Command Map
- **Live Regional Monitoring**: Indo-Gangetic Plain (India 🇮🇳), Jing-Jin-Ji (China 🇨🇳), São Paulo (Brazil 🇧🇷), Mpumalanga Coal Belt (South Africa 🇿🇦), and Urals Metallurgy Corridor (Russia 🇷🇺).
- **Satellite Layers**: Copernicus Sentinel-5P TROPOMI NO₂ Column Density, PM2.5 heatmap overlay, and Aerosol Optical Index.
- **Hidden Hotspot Detection**: Pulsing radar markers flagging unsanctioned crop stubble burning, metallurgical smelter flares, and coal power basin emissions.
- **Plume Vector Animation**: Dynamic visual SVG arrows demonstrating trans-boundary smog drift across international borders.

### 2. 📸 Multimodal Citizen Photo AI & Voice Engine (Google AI)
- **Gemini Multimodal Vision**: Citizen photo upload with instant AI classification identifying emission sources, smoke opacity, estimated PM2.5 contribution, and health risk ratings.
- **Multilingual Voice Support**: Native Speech-to-Text voice recording and Text-to-Speech audio readback across 6 BRICS languages (English, Hindi, Mandarin, Portuguese, Russian, Arabic).

### 3. 🌐 BRICS Federated AI Interoperability Hub
- **Decentralized Node Learning**: Connects national edge AI nodes (IIT Delhi, Tsinghua Univ, INPE Brazil, CSIR South Africa, Roshydromet Russia, MBZUAI UAE).
- **Privacy-Preserving Training**: Trains local Spatio-Temporal Graph Neural Networks (ST-GNN) with Differential Privacy ($\epsilon = 0.5$) without exporting raw citizen location data across borders.

### 4. 📈 Predictive 24-Hour Corridor Air Quality Forecast
- **Spike Predictor**: Recharts visualizer of PM2.5, NO₂, and SO₂ hourly trajectories benchmarked against WHO Air Quality Guidelines ($15\,\mu\text{g/m}^3$).
- **Meteorological Drivers**: Real-time correlation with boundary layer thermal inversion height, wind velocity, and relative humidity.

### 5. 🚨 Gemini GenAI Rapid Intervention & Diplomatic Brief Generator
- **Diplomatic Emergency Alerts**: Automated synthesis of satellite and ground sensor streams into structured cross-border policy briefs.
- **Priority Action Protocol**: Action items tagged by priority (*Immediate*, *Within 6 Hours*, *Within 24 Hours*) for municipal environmental authorities.
- **Executive Brief Export**: PDF export and interactive dispatch celebration.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, CartoDB/Leaflet (`react-leaflet`), Recharts, Lucide Icons, Canvas Confetti.
- **Google AI Layer**: Google Gemini API (`@google/generative-ai` `gemini-1.5-flash`), Web Speech API (Speech Recognition & Speech Synthesis).
- **Data Integrations**: Copernicus Sentinel-5P satellite feeds, OpenAQ station APIs, WHO Air Quality Guidelines.
- **Interoperability**: Federated Edge Learning Node Simulation Engine.

---

## 💻 Quick Start & Running Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Yashvanth742/BRICKS.git
   cd BRICKS
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local dev server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🏆 BRICS Hackathon Alignment

- **Functioning End-to-End Flow**: Integrated map, citizen reporting, federated model aggregation, and policy brief generation.
- **Google AI Mandatory Integration**: Gemini Multimodal image classification & Gemini GenAI diplomatic brief generation.
- **Cross-Border Applicability**: Trans-boundary corridor tracking across India, China, Brazil, South Africa, Russia, and UAE.
- **Multilingual / Voice**: Native STT/TTS in Hindi, Mandarin, Portuguese, Russian, Arabic, and English.
