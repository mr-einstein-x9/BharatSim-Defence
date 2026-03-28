# 🪖 OpResponse — India Disaster Response Simulator

> A probabilistic, multi-theatre disaster response decision-support system built for India. Spawn agencies, model weather, trigger causal chain reactions, compare strategies, and generate military-grade after-action reports — all in the browser.

![Made with React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Leaflet](https://img.shields.io/badge/Leaflet.js-Map-199900?style=flat-square&logo=leaflet)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3-38B2AC?style=flat-square&logo=tailwind-css)
![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)
![No API Keys](https://img.shields.io/badge/API%20Keys-None-brightgreen?style=flat-square)
![Probabilistic](https://img.shields.io/badge/Engine-Probabilistic-orange?style=flat-square)

---

## 🌐 Live Demo

👉 **[bharat-sim-defence.vercel.app](https://bharat-sim-defence-1ux11wutf-mr-einstein-x9s-projects.vercel.app)**

---

## 🎯 Problem Statement

India is among the world's most disaster-prone nations — floods in Assam, earthquakes in Uttarakhand, and cyclones along the Odisha coast occur every year. Despite this, disaster response planning largely happens on paper, with no way to:

- Visualize how multiple agencies coordinate in real time
- Predict bottlenecks before they happen — blocked supply chains, delayed medical deployment
- Model cascading failures where one problem triggers another
- Score and evaluate response effectiveness dynamically
- Compare two response strategies before committing real resources

**OpResponse** bridges this gap — a probabilistic, agent-based simulation platform that models India's disaster response realistically, where every run tells a different story.

---

## 💡 Inspiration

Inspired by **MiroFish** — a Chinese open-source agentic AI that seeds thousands of AI agents with real-world data to simulate and predict outcomes. OpResponse adapts this concept specifically for **India's disaster response and civil-military coordination problem**.

---

## ⚙️ Core Features

### 🗺️ Real India Map
Powered by Leaflet.js and OpenStreetMap — no API key required. Disaster zones rendered as color-coded impact circles with agent markers showing live status.

### 👥 6 Agency Types — 18 Agents
| Agent | Role | Color |
|---|---|---|
| 🪖 Army | Primary rescue, heavy logistics | Green |
| 🟠 NDRF | First responder, coordination | Orange |
| 👨‍⚕️ Doctors | Medical camps, civilian care | Blue |
| 👮 Local Police | Crowd control, ground intel | Navy |
| 🚚 Supply Chain | Food, water, medicine delivery | Yellow |
| 👥 Civilians | Affected population | Red |

### ⏱️ 4 Time Steps
T+0hr → T+6hr → T+24hr → T+72hr with realistic movement and status logic per agency type.

### 📊 After-Action Report
Military-style debrief with emergent effectiveness scores, coordination breakdown, weather impact analysis, cascade analysis, population risk assessment, and strategic recommendations.

---

## 🚀 Upgrades

### Upgrade 1 — Real District Population Data
- Real Indian census data for 15 districts across 3 disaster zones
- Civilian scores dynamically adjusted based on population at risk
- Flood in Assam (high density) is significantly harder to score well on than Earthquake in Uttarakhand
- Report shows affected districts table + total population in Lakhs
- Sidebar displays live "⚠️ Population at Risk" indicator

### Upgrade 2 — Weather Layer
- Disaster-specific weather conditions with real penalties per agency
- Flood: Heavy Rainfall — supply chains take -20 penalty
- Earthquake: Dust & Aftershocks — mountain roads collapsed, -25 supply penalty
- Cyclone: 120 km/h winds — aerial operations impossible, -30 supply penalty
- Weather preview on setup screen before launching simulation
- Collapsible weather panel in sidebar during simulation
- Weather impact section in after-action report

### Upgrade 3 — Multi-Theatre Operations
- Run up to **3 simultaneous disaster zones** in one simulation
- Smart severity-based agent allocation algorithm
- Each zone gets minimum 1 agent per type, remaining agents prioritize highest severity zones
- Zone tabs in sidebar to switch between theatres
- Separate scores per zone + weighted combined score in report
- Multi-zone observations: *"Triple disaster scenario critically stretched national response capacity"*

### Upgrade 4 — Strategy Comparison Mode
- Run **two completely independent simulations simultaneously**
- Strategy A vs Strategy B — fully flexible setup per strategy
- Dual side-by-side maps with blue/red color-coded agents
- Animated CSS bar charts comparing 5 metrics head-to-head
- Winner banner: *"🔵 Strategy A Wins"* / *"🔴 Strategy B Wins"* / *"⚖️ Draw"*
- Category winners table with color-coded results
- Export Comparison button — copies full report to clipboard

### Upgrade 5 — Probabilistic Engine + Causal Chain Reactions
The biggest upgrade — transforms OpResponse from a deterministic simulator into a realistic decision-support system.

**Probabilistic Outcomes:**
- Every simulation run produces different results
- Scores calculated with severity-based variance (±8 Low, ±15 Medium, ±22 High)
- Weather penalties also vary ±5 per run
- 🎲 Probabilistic Run badge in every report
- Same scenario run twice = meaningfully different outcomes

**Causal Chain Reactions:**
Five cascading failure chains that trigger automatically based on conditions:

| Chain | Trigger | Effect |
|---|---|---|
| 🌊 Flood Road Blockage | Flood + High severity | Supply Chain -15 at T+6hr |
| 🚚 Supply → Medical Delay | Supply Chain blocked | Doctors -10 at T+24hr |
| 🏥 Medical → Casualties | Doctors score < 60 | Civilians -12 at T+72hr |
| 🏔️ Earthquake Road Collapse | Earthquake type | Army -8 at T+6hr |
| 📡 Cyclone Comms Blackout | Cyclone + Medium/High | Police -12 at T+6hr |

**Emergent Scoring:**
- Scores emerge from what actually happened — not hardcoded rules
- Each agent score built from: Base → Chain penalties → Weather variance → Population modifier
- Per-agent score breakdown tooltip in report: *"Base: 100 | Chain: -25 | Weather: -20 | Variance: +8 | Final: 63"*
- ⚡ Cascade Analysis section in report listing all triggered chains

---

## 📈 Scoring System

| Metric | What it measures |
|---|---|
| Speed Score | How fast Army + NDRF reached the zone |
| Coordination Score | Army + NDRF + Police effectiveness |
| Coverage Score | Doctors + Supply Chain reach |
| Supply Efficiency | Logistics performance |
| Civilian Safety Score | Population protection (adjusted for density + chains) |

Overall score color-coded: 🟢 >70 Effective | 🟡 40–70 Moderate | 🔴 <40 Critical Failure

Scores are emergent — shaped by weather penalties, population density, causal chain reactions, and probabilistic variance.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI and simulation state management |
| Tailwind CSS v3 | Dark military theme styling |
| Leaflet.js + react-leaflet | Interactive India map |
| OpenStreetMap | Free map tiles, no API key |
| CSS Animations | Bar chart comparisons, marker transitions |
| Custom Simulation Engine | Probabilistic scoring + causal chains |

**No backend. No API keys. No paid services. Runs entirely in the browser.**

---

## 🏗️ Project Structure

```
opresponse/
├── src/
│   ├── components/
│   │   ├── SetupScreen.jsx       # Disaster + strategy configuration
│   │   ├── MapView.jsx           # Leaflet map with agent markers
│   │   ├── AgentMarker.jsx       # Individual agent on map
│   │   ├── Sidebar.jsx           # Live status + chain events
│   │   ├── ReportModal.jsx       # After-action report
│   │   └── ComparisonReport.jsx  # A vs B comparison with bar charts
│   ├── simulation/
│   │   └── causalChains.js       # 5 cascade failure definitions
│   ├── data/
│   │   ├── districtData.js       # Real Indian census data
│   │   └── weatherData.js        # Disaster weather conditions
│   └── utils/
│       └── helpers.js            # Probabilistic + emergent scoring
```

---

## 🚀 Run Locally

```bash
# Clone the repo
git clone https://github.com/mr-einstein-x9/BharatSim-Defence.git

# Enter project folder
cd BharatSim-Defence/opresponse

# Install dependencies
npm install

# Start dev server
npm start
```

App runs at `http://localhost:3000`

---

## 🔭 Future Scope

- Integrate real NDMA deployment records and historical response data
- Road network damage simulation based on disaster type and severity
- Live weather API integration for real-time condition modeling
- PDF export of after-action reports for training use
- Multi-user mode — different users control different agencies in real time
- State-level drill mode for SDMA training exercises
- LLM-based agent decision making for fully autonomous simulation

---

## 👨‍💻 Author

**Nikhil Sharma**
Aspiring Defence Forces Officer | Developer
- GitHub: [@mr-einstein-x9](https://github.com/mr-einstein-x9)

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

*Built as a proof of concept for AI-assisted defence planning tools. Inspired by MiroFish. Made for India. 🇮🇳*
