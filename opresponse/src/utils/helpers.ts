import { AGENT_TYPES } from './constants';
import { Agent, AgentType, DisasterZone, WeatherEffects } from '../types';

export const calculateAgentSplit = (activeZones: any[]): number[] => {
  const TOTAL_AGENTS_PER_TYPE = 3;
  const numZones = activeZones.length;
  if(numZones === 0) return [];
  
  // Base allocation: Everyone gets 1
  let split = activeZones.map(z => ({ ...z, agentsCount: 1 }));
  let remaining = TOTAL_AGENTS_PER_TYPE - numZones;

  // Distribute remaining based on severity
  if (remaining > 0) {
     const severityScores: Record<string, number> = { 'Low': 1, 'Medium': 2, 'High': 3 };
     // Sort indices by severity (descending)
     const sortedIndices = split.map((_, i) => i).sort((a, b) => severityScores[split[b].severity] - severityScores[split[a].severity]);
     
     let i = 0;
     while (remaining > 0) {
       split[sortedIndices[i % numZones]].agentsCount++;
       remaining--;
       i++;
     }
  }

  return split.map(z => z.agentsCount);
};

export const generateAgents = (activeZones: any[]): DisasterZone[] => {
  const agentCountsPerZone = calculateAgentSplit(activeZones);
  const newZones: DisasterZone[] = [];
  
  let globalIdCounter = 1;

  activeZones.forEach((zone, index) => {
    const agentsForThisZone: Agent[] = [];
    const count = agentCountsPerZone[index];
    
    AGENT_TYPES.forEach(typeObj => {
      for (let i = 0; i < count; i++) {
        const latOffset = (Math.random() * 5) - 2.5;
        const lngOffset = (Math.random() * 5) - 2.5;
        
        agentsForThisZone.push({
          id: `agent-${globalIdCounter++}`,
          name: `${typeObj.type} Unit - ${zone.id.replace('zone-', 'Z')}`,
          type: typeObj.type as AgentType,
          emoji: typeObj.emoji,
          color: typeObj.color,
          dot: typeObj.dot,
          lat: zone.lat + latOffset,
          lng: zone.lng + lngOffset,
          status: 'Standby',
          score: null,
          zoneId: zone.id,
          fuel: 100,
          capacity: 100
        });
      }
    });

    newZones.push({
      ...zone,
      agents: agentsForThisZone,
      triggeredChains: []
    });
  });

  return newZones;
};

export const moveTowardsCenter = (agentLat: number, agentLng: number, centerLat: number, centerLng: number) => {
  const shiftPct = 0.3 + (Math.random() * 0.2); 

  let newLat = agentLat + (centerLat - agentLat) * shiftPct;
  let newLng = agentLng + (centerLng - agentLng) * shiftPct;

  const distLat = Math.abs(centerLat - newLat);
  const distLng = Math.abs(centerLng - newLng);

  if (distLat < 0.3 && distLng < 0.3) {
    newLat = centerLat + (Math.random() * 0.4 - 0.2);
    newLng = centerLng + (Math.random() * 0.4 - 0.2);
  }

  return { lat: newLat, lng: newLng };
};

export const getProbabilisticScore = (base: number, variance: number) => {
  const diff = Math.floor(Math.random() * (variance * 2 + 1)) - variance;
  return base + diff;
};

export const calculateEmergentScore = (agent: Agent, chains: any[], weatherEffects: Record<string, WeatherEffects> | undefined, severity: string, totalPop: number) => {
  const varianceLimit = severity === 'High' ? 22 : severity === 'Medium' ? 15 : 8;

  let base = 100;
  
  let chainPenalty = 0;
  chains.forEach(ch => {
     const impact = ch.impacts.find((i: any) => i.type === agent.type);
     if (impact) chainPenalty += impact.penalty;
  });

  let weatherPenalty = 0;
  if (weatherEffects) {
     const typeMapping: Record<string, string> = {
        'Army': 'army', 'NDRF': 'ndrf', 'Local Police': 'police',
        'Doctors': 'doctors', 'Supply Chain': 'supplyChain', 'Civilians': 'civilians'
     };
     const tKey = typeMapping[agent.type];
     if (tKey && weatherEffects[tKey]) {
        const baseWP = weatherEffects[tKey].speedPenalty || 0;
        if (baseWP > 0) {
           weatherPenalty = getProbabilisticScore(baseWP, 5);
           if (weatherPenalty < 0) weatherPenalty = 0;
        }
     }
  }

  let popPenalty = 0;
  if (agent.type === 'Civilians') {
     if (totalPop > 5000000) popPenalty = 15;
     else if (totalPop >= 2000000) popPenalty = 8;
  }

  const varianceApplied = getProbabilisticScore(0, varianceLimit);

  let finalScore = base - chainPenalty - weatherPenalty - popPenalty + varianceApplied;
  if (finalScore < 15) finalScore = 15;
  if (finalScore > 98) finalScore = 98;

  return {
    base: base,
    chainPenalty: -chainPenalty,
    weatherPenalty: -weatherPenalty,
    popPenalty: -popPenalty,
    variance: varianceApplied,
    finalScore
  };
};

export const interpolateAgent = (agent: Agent, currentTime: number) => {
  if (!agent.history || agent.history.length === 0) return agent;

  // Find the two history points to interpolate between
  let start = agent.history[0];
  let end = agent.history[0];

  for (let i = 0; i < agent.history.length; i++) {
    if (agent.history[i].time <= currentTime) {
      start = agent.history[i];
    }
    if (agent.history[i].time >= currentTime) {
      end = agent.history[i];
      break;
    }
  }

  if (start === end) {
    return { ...agent, lat: start.lat, lng: start.lng, status: start.status, score: start.score };
  }

  const duration = end.time - start.time;
  const elapsed = currentTime - start.time;
  const pct = elapsed / duration;

  return {
    ...agent,
    lat: start.lat + (end.lat - start.lat) * pct,
    lng: start.lng + (end.lng - start.lng) * pct,
    status: start.status, // We use the start status for simplicity, or we could switch halfway
    score: start.score !== null && end.score !== null 
      ? Math.round(start.score + (end.score - start.score) * pct) 
      : (currentTime >= 72 ? end.score : null)
  };
};

