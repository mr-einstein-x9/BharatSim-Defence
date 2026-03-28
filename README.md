# 🪖 OpResponse — India Disaster Response Simulator

> A frontend simulation tool that models multi-agency disaster response across India using agent-based logic, real maps, and after-action reporting.

![Made with React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Leaflet](https://img.shields.io/badge/Leaflet.js-Map-199900?style=flat-square&logo=leaflet)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3-38B2AC?style=flat-square&logo=tailwind-css)
![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)
![OpResponse Screenshot](./screenshot1.png)![OpResponse Screenshot](./screenshot2.png)![OpResponse Screenshot](./screenshot3.png)![OpResponse Screenshot](./screenshot4.png)
---

## 🌐 Live Demo

👉 **[bharat-sim-defence.vercel.app](https://bharat-sim-defence-1ux11wutf-mr-einstein-x9s-projects.vercel.app)**

---

## 🎯 Problem Statement

India is among the world's most disaster-prone nations — floods in Assam, earthquakes in Uttarakhand, and cyclones along the Odisha coast occur every year. Despite this, disaster response planning largely happens on paper, with no way to:

- Visualize how multiple agencies coordinate in real time
- Predict bottlenecks (blocked supply chains, delayed medical deployment) before they happen
- Score and evaluate response effectiveness after an operation

**OpResponse** bridges this gap by simulating disaster response scenarios on a real map of India — before resources are ever deployed.

---

## 💡 Inspiration

Inspired by **MiroFish** — a Chinese open-source agentic AI that seeds thousands of AI agents with real-world data to simulate and predict outcomes. OpResponse adapts this concept specifically for **India's disaster response and civil-military coordination problem**.

---

## ⚙️ Features

- 🗺️ **Real India Map** — powered by Leaflet.js + OpenStreetMap, no API key required
- 🎯 **3 Disaster Types** — Flood (Assam/Bihar), Earthquake (Uttarakhand), Cyclone (Odisha)
- 🧑‍🤝‍🧑 **18 Agents across 6 types** — Army, NDRF, Doctors, Local Police, Supply Chain, Civilians
- ⏱️ **4 Time Steps** — T+0hr → T+6hr → T+24hr → T+72hr with realistic movement logic
- 📊 **After-Action Report** — effectiveness scores, coordination breakdown, recommendations
- 🔴 **Disaster Zone Overlay** — semi-transparent impact radius on map
- 🪟 **Agent Popups** — click any agent to see name, status, and score
- 🔁 **Reset Simulation** — start over with a new scenario anytime

---

## 🧑‍✈️ Agent Types

| Agent | Role | Color |
|---|---|---|
| 🪖 Army | Primary rescue, heavy logistics | Green |
| 🟠 NDRF | First responder, coordination | Orange |
| 👨‍⚕️ Doctors | Medical camps, civilian care | Blue |
| 👮 Local Police | Crowd control, ground intel | Navy |
| 🚚 Supply Chain | Food, water, medicine delivery | Yellow |
| 👥 Civilians | Affected population | Red |

---

## 📈 Scoring System

The after-action report evaluates:

- **Speed Score** — How fast Army + NDRF reached the zone
- **Coordination Score** — Army + NDRF + Police effectiveness
- **Coverage Score** — Doctors + Supply Chain reach
- **Supply Efficiency** — Logistics performance
- **Civilian Safety Score** — Population protection effectiveness

Overall score is color-coded: 🟢 >70 | 🟡 40–70 | 🔴 <40

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI and state management |
| Tailwind CSS v3 | Styling and dark theme |
| Leaflet.js + react-leaflet | Interactive India map |
| OpenStreetMap | Free map tiles, no API key |

**No backend. No API keys. Runs entirely in the browser.**

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

- Integrate real NDRF deployment data from NDMA records
- Add road network damage simulation based on disaster type
- Multi-user mode — different users control different agencies
- Connect to live weather/flood alert APIs
- Export after-action reports as PDF for training use

---

## 👨‍💻 Author

**Nikhil Sharma**
Aspiring Defence Forces Officer | Developer
- GitHub: [@mr-einstein-x9](https://github.com/mr-einstein-x9)

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

*Built in one day as a proof of concept with AI-assisted coding tools. Inspired by MiroFish. Made for India. 🇮🇳*
