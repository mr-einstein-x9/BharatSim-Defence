# OpResponse — India Disaster Response Simulator Implementation Plan

The objective is to build a frontend-only React application called "OpResponse," which simulates disaster response in India. It includes a setup screen, a map-based simulation interface, time-stepped logic for moving and updating agent statuses, and a final generated after-action report modal.

## User Review Required

> [!IMPORTANT]  
> Please review the proposed logic for agent initial placement and the method of moving towards the disaster center:
> - **Initial Spawn Position**: Agents will spawn randomly within an approximate radius (e.g., ~2.5 degrees of lat/lng variance) around the selected disaster center.
> - **Movement Logic**: During time steps (T+6, T+24, T+72), moving agents will shift 30-50% closer to the exact disaster center to simulate "gradual shift" rather than instant teleportation. Does this sound correct for the simulation?

## Proposed Changes

---

### Global Config and Styling

#### [MODIFY] [index.css](file:///c:/Users/Nikhil%20Sharma/PRojects/BharatSim%20Defence/opresponse/src/index.css)
- Add Tailwind CSS directives (`@tailwind base; @tailwind components; @tailwind utilities;`).
- Set a dark background body color default (`#0a0f1e`).

---

### Core Components

#### [MODIFY] [App.js](file:///c:/Users/Nikhil%20Sharma/PRojects/BharatSim%20Defence/opresponse/src/App.js)
- Handle global state: `currentScreen` (Setup, Sim), `simulationParams` (Disaster, Severity), `timeStepIndex` (0, 1, 2, 3 mapped to T+0, T+6, T+24, T+72).
- Handle agent state: an array of 18 agent objects (`id`, `name`, `type`, `status`, `lat`, `lng`, `score`).
- Implement the "Next Time Step" transition logic according to the required spec (e.g., Army moving at T+6, Doctors moving at T+24).

#### [NEW] [SetupScreen.jsx](file:///c:/Users/Nikhil%20Sharma/PRojects/BharatSim%20Defence/opresponse/src/components/SetupScreen.jsx)
- Dark military theme UI.
- Dropdown for 3 Disaster Types (Flood, Earthquake, Cyclone).
- Radio buttons for Severity (Low, Medium, High).
- Big "Launch Simulation" button that passes parameters to `App.js`.

#### [NEW] [MapView.jsx](file:///c:/Users/Nikhil%20Sharma/PRojects/BharatSim%20Defence/opresponse/src/components/MapView.jsx)
- Renders `react-leaflet` instances (`MapContainer`, `TileLayer`).
- Shows the disaster impact zone (a semi-transparent red `<Circle>`).
- Renders `AgentMarker` components dynamically based on agent states.

#### [NEW] [AgentMarker.jsx](file:///c:/Users/Nikhil%20Sharma/PRojects/BharatSim%20Defence/opresponse/src/components/AgentMarker.jsx)
- Custom `L.divIcon` displaying a colored circular background and exact agent emoji.
- Includes a `<Popup>` showing `name`, `type`, `status`, and `score` when clicked.

#### [NEW] [Sidebar.jsx](file:///c:/Users/Nikhil%20Sharma/PRojects/BharatSim%20Defence/opresponse/src/components/Sidebar.jsx)
- Shows the current time step (e.g., "T+6hr").
- Contains a scrollable list of all 18 agents with their emojis, names, and a colored status dot (Green for Completed/On Ground, Yellow for Moving/Standby, Red for Blocked).
- "Next Time Step" button.
- "Generate Report" button (conditionally rendered after T+72hr).

#### [NEW] [ReportModal.jsx](file:///c:/Users/Nikhil%20Sharma/PRojects/BharatSim%20Defence/opresponse/src/components/ReportModal.jsx)
- Full-screen absolute overlay.
- Calculates and renders the overall effectiveness score (color-coded).
- Breaks down coordination, coverage, and civilian safety scores.
- Renders the Agent Performance Table and generated recommendation text based on score condition rules.

## Open Questions

1. Which Tailwind version is currently installed in the project? (Based on `tailwind.config.js` it seems standard 3.x, but I'll ensure we use typical 3.x classes).
2. Are you fine with using pure random number generation functions within React to place the agents initially, or do you require fixed starting coordinates?

## Verification Plan

### Manual Verification
- Launch the application and select each simulation disaster type.
- Verify 18 agent markers are rendered using Leaflet.
- Step through the time steps (T+6, T+24, T+72) and visually verify agent markers incrementally moving towards the center.
- Verify "Blocked" chances apply to Civilians and conditionally to Supply Chain if Severity is "High".
- Verify Final Report calculates average correctly according to rule sets.
