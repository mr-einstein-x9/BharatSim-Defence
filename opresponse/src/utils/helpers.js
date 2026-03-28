import { AGENT_TYPES } from './constants';

export const generateAgents = (disasterLat, disasterLng) => {
  const newAgents = [];
  let idCounter = 1;

  AGENT_TYPES.forEach(typeObj => {
    for (let i = 0; i < 3; i++) {
      // Generate random offset between -2.5 and +2.5 degrees
      const latOffset = (Math.random() * 5) - 2.5;
      const lngOffset = (Math.random() * 5) - 2.5;
      
      newAgents.push({
        id: `agent-${idCounter++}`,
        name: `${typeObj.type} Unit ${i + 1}`,
        type: typeObj.type,
        emoji: typeObj.emoji,
        color: typeObj.color,
        dot: typeObj.dot,
        lat: disasterLat + latOffset,
        lng: disasterLng + lngOffset,
        status: 'Standby',
        score: null,
      });
    }
  });

  return newAgents;
};

export const moveTowardsCenter = (agentLat, agentLng, centerLat, centerLng) => {
  // We want to shift by 30-50% towards the center
  const shiftPct = 0.3 + (Math.random() * 0.2); // 0.3 to 0.5

  let newLat = agentLat + (centerLat - agentLat) * shiftPct;
  let newLng = agentLng + (centerLng - agentLng) * shiftPct;

  // Cap movement so they stop within 0.3 degrees of the center
  const distLat = Math.abs(centerLat - newLat);
  const distLng = Math.abs(centerLng - newLng);

  if (distLat < 0.3 && distLng < 0.3) {
    // If they are within 0.3 degrees, just snap them somewhere safely close but offset
    // so they don't exactly stack on top of each other
    newLat = centerLat + (Math.random() * 0.4 - 0.2);
    newLng = centerLng + (Math.random() * 0.4 - 0.2);
  }

  return { lat: newLat, lng: newLng };
};
