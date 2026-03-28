export const DISASTER_ZONES = {
  flood: {
    name: "Assam/Bihar Flood Zone",
    center: { lat: 26.0, lng: 91.0 },
    affectedDistricts: [
      { name: "Dhubri", population: 1949258 },
      { name: "Barpeta", population: 1693190 },
      { name: "Morigaon", population: 957423 },
      { name: "Nagaon", population: 2823007 },
      { name: "Goalpara", population: 1008959 }
    ]
  },
  earthquake: {
    name: "Uttarakhand Earthquake Zone",
    center: { lat: 30.0, lng: 79.0 },
    affectedDistricts: [
      { name: "Chamoli", population: 391605 },
      { name: "Rudraprayag", population: 242285 },
      { name: "Uttarkashi", population: 330086 },
      { name: "Pithoragarh", population: 483439 },
      { name: "Bageshwar", population: 259898 }
    ]
  },
  cyclone: {
    name: "Odisha Cyclone Zone",
    center: { lat: 20.0, lng: 86.0 },
    affectedDistricts: [
      { name: "Puri", population: 1498604 },
      { name: "Kendrapara", population: 1439891 },
      { name: "Bhadrak", population: 1506522 },
      { name: "Balasore", population: 2317419 },
      { name: "Jagatsinghpur", population: 1136604 }
    ]
  }
};
