import { AGENT_TYPES } from './constants';

export const calculateAgentSplit = (activeZones) => {
  const TOTAL_AGENTS_PER_TYPE = 3;
  const numZones = activeZones.length;
  if(numZones === 0) return [];
  
  // Base allocation: Everyone gets 1
  let split = activeZones.map(z => ({ ...z, agentsCount: 1 }));
  let remaining = TOTAL_AGENTS_PER_TYPE - numZones;

  // Distribute remaining based on severity
  if (remaining > 0) {
     const severityScores = { 'Low': 1, 'Medium': 2, 'High': 3 };
     // Sort indices by severity (descending)
     const sortedIndices = split.map((z, i) => i).sort((a, b) => severityScores[split[b].severity] - severityScores[split[a].severity]);
     
     let i = 0;
     while (remaining > 0) {
       split[sortedIndices[i % numZones]].agentsCount++;
       remaining--;
       i++;
     }
  }

  return split.map(z => z.agentsCount);
};

export const generateAgents = (activeZones) => {
  const agentCountsPerZone = calculateAgentSplit(activeZones);
  const newZones = [];
  
  let globalIdCounter = 1;

  activeZones.forEach((zone, index) => {
    const agentsForThisZone = [];
    const count = agentCountsPerZone[index];
    
    AGENT_TYPES.forEach(typeObj => {
      for (let i = 0; i < count; i++) {
        const latOffset = (Math.random() * 5) - 2.5;
        const lngOffset = (Math.random() * 5) - 2.5;
        
        agentsForThisZone.push({
          id: `agent-${globalIdCounter++}`,
          name: `${typeObj.type} Unit - ${zone.id.replace('zone-', 'Z')}`,
          type: typeObj.type,
          emoji: typeObj.emoji,
          color: typeObj.color,
          dot: typeObj.dot,
          lat: zone.lat + latOffset,
          lng: zone.lng + lngOffset,
          status: 'Standby',
          score: null,
          zoneId: zone.id
        });
      }
    });

    newZones.push({
      ...zone,
      agents: agentsForThisZone
    });
  });

  return newZones;
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
