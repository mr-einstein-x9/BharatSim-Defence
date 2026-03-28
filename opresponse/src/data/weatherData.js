export const WEATHER_CONDITIONS = {
  flood: {
    type: "Heavy Rainfall",
    icon: "🌧️",
    windSpeed: "45 km/h",
    visibility: "Poor",
    effects: {
      army: { speedPenalty: 10, label: "Waterlogged roads slow movement" },
      ndrf: { speedPenalty: 5, label: "NDRF boats deployed, partially effective" },
      doctors: { speedPenalty: 15, label: "Medical teams delayed by flooding" },
      police: { speedPenalty: 10, label: "Crowd control hampered by rain" },
      supplyChain: { speedPenalty: 20, label: "Supply routes heavily flooded" },
      civilians: { speedPenalty: 0, label: "Civilians trapped by rising water" }
    }
  },
  earthquake: {
    type: "Dust & Aftershocks",
    icon: "🌫️",
    windSpeed: "20 km/h",
    visibility: "Moderate",
    effects: {
      army: { speedPenalty: 15, label: "Debris blocking mountain roads" },
      ndrf: { speedPenalty: 10, label: "Aftershocks slowing rescue ops" },
      doctors: { speedPenalty: 10, label: "Field hospitals unstable" },
      police: { speedPenalty: 5, label: "Communication towers damaged" },
      supplyChain: { speedPenalty: 25, label: "Mountain roads collapsed" },
      civilians: { speedPenalty: 0, label: "Civilians buried under rubble" }
    }
  },
  cyclone: {
    type: "Cyclonic Storm",
    icon: "🌀",
    windSpeed: "120 km/h",
    visibility: "Very Poor",
    effects: {
      army: { speedPenalty: 20, label: "High winds grounding helicopters" },
      ndrf: { speedPenalty: 15, label: "Storm surge blocking coastal access" },
      doctors: { speedPenalty: 20, label: "Medical airlift impossible" },
      police: { speedPenalty: 10, label: "Coastal roads washed out" },
      supplyChain: { speedPenalty: 30, label: "Ports and roads destroyed by surge" },
      civilians: { speedPenalty: 0, label: "Mass evacuation required" }
    }
  }
};
