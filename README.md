# 🛡️ BharatSim Defence - OpResponse

**BharatSim Defence** is a high-fidelity disaster response and tactical simulation platform designed for operational analysis and strategic decision-making. It enables commanders to simulate catastrophic multi-zone events (Floods, Earthquakes, Cyclones) and evaluate the effectiveness of different response strategies in real-time.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![Zustand](https://img.shields.io/badge/State-Zustand-orange)
![Vitest](https://img.shields.io/badge/Testing-Vitest-yellow)

---

## 🚀 Core Features

### 🕒 Interactive Operational Timeline
*   **72-Hour Simulation Window**: Scrub through time to see how disasters evolve and how units respond.
*   **Real-time Interpolation**: Smooth geospatial movement of units (Army, NDRF, Police, Doctors) across the map.
*   **Playback Control**: Auto-play the simulation to witness cascading effects in real-time.

### ⚔️ Strategy Comparison Engine
*   **Dual-Strategy Analysis**: Launch two independent configurations side-by-side to compare operational outcomes.
*   **Delta Reporting**: Automated weighted analysis of Speed, Coverage, Coordination, and Civilian Safety.
*   **Dynamic Logs**: Real-time Command Log showing strategic triggers and operational failures.

### 📊 Performance Analytics
*   **Live Dashboard**: Real-time trend charts tracking operational effectiveness vs. civilian safety.
*   **Resource Constraints**: Integrated fuel/energy depletion models that penalize inefficient deployments.
*   **Explainable Scoring**: Detailed score breakdowns for every unit, factoring in weather, causal chains, and population density.

---

## 🛠️ Tech Stack & Architecture

*   **Frontend**: React 19 + Vite (Next-gen build tool)
*   **Type Safety**: TypeScript (Strict mode) for domain model integrity.
*   **State Management**: Zustand (Decoupled, high-performance state store).
*   **Geospatial Rendering**: React Leaflet (Dark-mode tile sets).
*   **Visualization**: Recharts (Dynamic performance tracking).
*   **Testing**: Vitest (Automated logic verification).

### Folder Structure
```text
src/
├── components/   # Modular UI Components (Map, Sidebar, Dashboard, Log)
├── store/        # Zustand state & Simulation Engine logic
├── simulation/   # Causal Chain & Event Trigger logic
├── utils/        # Geospatial math, Scoring formulas, and Helpers
├── types/        # Unified TypeScript Interfaces
└── data/         # Mock Real-world data (Districts, Weather)
```

---

## 🚦 Getting Started

### Prerequisites
*   Node.js 20+
*   npm 10+

### Installation
1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/bharatsim-defence.git
    cd bharatsim-defence/opresponse
    ```
2.  **Install dependencies**
    ```bash
    npm install
    ```
3.  **Start Development Server**
    ```bash
    npm run dev
    ```
4.  **Run Tests**
    ```bash
    npm test
    ```

---

## 🧪 Trust & Safety Verification

BharatSim Defence prioritizes **Verifiability**. Our core simulation engine is covered by an automated test suite that ensures:
*   Deterministic scoring based on operational conditions.
*   Accurate resource depletion models.
*   Reliable geospatial movement.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Contributing
We welcome contributions to enhance the tactical realism of BharatSim. Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.
