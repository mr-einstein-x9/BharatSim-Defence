# Emergent Simulation Engine Upgrade

This proposal shifts OpResponse from a deterministic simulation to a fully probabilistic, causal engine where outcomes dynamically emerge from compounding environmental factors and chain reactions rather than hardcoded scores.

## User Review Required

- Is the placement of the "🎲 Probabilistic Run" badge appropriate inside the `ReportModal` and `ComparisonReport` main title banners?
- `Zone` configuration models will be extended to include `triggeredChains: []` at launch to locally store event history. 
- The cascading events mandate that at `T+72hr`, some agents (`Doctors`) must be scored *before* others (`Civilians`) to ascertain if late-stage chain reactions (Chain 3) will be triggered. The engine will handle this internally.

## Proposed Changes

---

### Logic Modifications

#### [NEW] [src/simulation/causalChains.js](file:///c:/Users/Nikhil%20Sharma/PRojects/BharatSim%20Defence/opresponse/src/simulation/causalChains.js)
- A new dedicated file exporting trigger configurations and string logic for the 5 mandated core cascade events.

#### [MODIFY] [src/utils/helpers.js](file:///c:/Users/Nikhil%20Sharma/PRojects/BharatSim%20Defence/opresponse/src/utils/helpers.js)
- Introduce `getProbabilisticScore(base, variance)` returning a randomized range centered around base.
- Implement `calculateEmergentScore(agent, zone, chains)` acting as the ultimate aggregator of chain penalties, randomized weather penalties, and base variance. Returns a detailed breakdown metric object.

#### [MODIFY] [src/App.js](file:///c:/Users/Nikhil%20Sharma/PRojects/BharatSim%20Defence/opresponse/src/App.js)
- Instantiate `triggeredChains: []` for all zones in `handleLaunch`.
- Severely truncate the hardcoded score assignments inside `nextTimeStep`.
- Embed chain trigger logic synchronously into the Time Step indexes:
  - **T+6hr**: Check Flood, Earthquake, and Cyclone triggers.
  - **T+24hr**: Check Supply Chain Blocked triggers.
  - **T+72hr**: Evaluate emergent scores for Medical units, conditionally inject the Civilian Cascade trigger, then resolve all final agent scores and append their `breakdown` payloads.

---

### UI/UX Refactors

#### [MODIFY] [src/components/Sidebar.jsx](file:///c:/Users/Nikhil%20Sharma/PRojects/BharatSim%20Defence/opresponse/src/components/Sidebar.jsx)
- Append a **"⚡ Chain Events"** list conditionally appearing underneath the Weather panel mapping over the active zone's local `triggeredChains`.

#### [MODIFY] [src/components/ReportModal.jsx](file:///c:/Users/Nikhil%20Sharma/PRojects/BharatSim%20Defence/opresponse/src/components/ReportModal.jsx) & [ComparisonReport.jsx](file:///c:/Users/Nikhil%20Sharma/PRojects/BharatSim%20Defence/opresponse/src/components/ComparisonReport.jsx)
- Insert the "🎲 Probabilistic Run" badge.
- Build the **"⚡ Cascade Analysis"** block beneath the metric boxes summarizing activated events.
- Upgrade the generated agent rows map in both reports to display the hoverable `"Score Breakdown"` summarizing exactly how the metrics dynamically merged (`Base: 100 | Chain penalty: -25...`).

## Open Questions
- Should the Chain Events red alert box in the sidebar autoscroll or just lengthen the container?  (Assuming standard lengthened container to match layout).

## Verification Plan
1. Launch Simulation -> Verify sidebars show accumulating cascade warnings at T+6, T+24.
2. Advance to T+72 and trigger Comparison Report -> Verify tooltips exist displaying precise numeric breakdowns linking to `finalScore`.
3. Verify running identical setups (Comparison mode with same zones) returns functionally distinct values and wins, proving variance integration.
