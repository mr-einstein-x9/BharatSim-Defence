import { DisasterZone } from '../types';

export interface Chain {
  id: string;
  triggerStep: number;
  check: (zone: DisasterZone, context?: any) => boolean;
  event: string;
  impacts: { type: string, penalty: number }[];
}

export const CHAINS: Chain[] = [
  {
    id: 'flood_supply',
    triggerStep: 1, // T+6hr
    check: (zone) => zone.disasterId === 'flood' && zone.severity === 'High',
    event: 'Roads flooded → Supply routes blocked',
    impacts: [{ type: 'Supply Chain', penalty: 15 }]
  },
  {
    id: 'quake_army',
    triggerStep: 1, // T+6hr
    check: (zone) => zone.disasterId === 'earthquake',
    event: 'Seismic damage → Mountain roads collapsed → Army mobility reduced',
    impacts: [{ type: 'Army', penalty: 8 }]
  },
  {
    id: 'cyclone_police',
    triggerStep: 1, // T+6hr
    check: (zone) => zone.disasterId === 'cyclone' && zone.severity !== 'Low',
    event: 'Cyclonic winds → Communication towers down → Police coordination lost',
    impacts: [{ type: 'Local Police', penalty: 12 }]
  },
  {
    id: 'supply_medical',
    triggerStep: 2, // T+24hr
    check: (zone) => zone.agents.some(a => a.type === 'Supply Chain' && a.status === 'Blocked'),
    event: 'Supply blocked → Medical equipment delayed',
    impacts: [{ type: 'Doctors', penalty: 10 }]
  },
  {
    id: 'medical_civilian',
    triggerStep: 3, // T+72hr
    check: (zone, context) => context?.doctorsFailed === true,
    event: 'Medical delay → Increased civilian casualties',
    impacts: [{ type: 'Civilians', penalty: 12 }]
  }
];

export const evaluateChainsForStep = (zone: DisasterZone, stepIndex: number, context: any = null) => {
  const newChains: any[] = [];
  CHAINS.filter(c => c.triggerStep === stepIndex).forEach(chain => {
    const alreadyFired = zone.triggeredChains?.some(tc => tc.id === chain.id);
    if (!alreadyFired && chain.check(zone, context)) {
      newChains.push({
        id: chain.id,
        event: chain.event,
        impacts: chain.impacts,
        step: stepIndex
      });
    }
  });
  return newChains;
};
