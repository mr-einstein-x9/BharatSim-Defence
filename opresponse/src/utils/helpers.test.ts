import { describe, it, expect } from 'vitest';
import { calculateEmergentScore, moveTowardsCenter } from './helpers';
import { Agent, AgentType } from '../types';

describe('Simulation Engine - Trust & Safety Verification', () => {
  
  it('should correctly calculate scores with weather penalties', () => {
    const mockAgent: Agent = {
      id: 'test-1',
      name: 'Test Army',
      type: 'Army' as AgentType,
      emoji: '🪖',
      color: 'bg-green-500',
      dot: 'bg-green-400',
      lat: 20,
      lng: 80,
      status: 'Standby',
      score: null,
      zoneId: 'zone-1'
    };

    const weatherEffects = {
      army: { speedPenalty: 20, label: 'Heavy Rain' }
    };

    const result = calculateEmergentScore(mockAgent, [], weatherEffects as any, 'Medium', 0);
    
    expect(result.finalScore).toBeGreaterThan(50);
    expect(result.finalScore).toBeLessThan(100);
    expect(result.weatherPenalty).toBeLessThan(0);
  });

  it('should apply severe penalties for Civilian Safety in high population zones', () => {
    const mockCiv: Agent = {
      id: 'civ-1',
      name: 'Civilians',
      type: 'Civilians' as AgentType,
      emoji: '👥',
      color: 'bg-gray-500',
      dot: 'bg-gray-400',
      lat: 20,
      lng: 80,
      status: 'Standby',
      score: null,
      zoneId: 'zone-1'
    };

    const result = calculateEmergentScore(mockCiv, [], {}, 'High', 6000000);
    
    expect(result.popPenalty).toBe(-15);
  });

  it('should move agents towards the zone center correctly', () => {
    const startLat = 10;
    const startLng = 10;
    const centerLat = 20;
    const centerLng = 20;

    const { lat, lng } = moveTowardsCenter(startLat, startLng, centerLat, centerLng);

    expect(lat).toBeGreaterThan(10);
    expect(lng).toBeGreaterThan(10);
    expect(lat).toBeLessThan(20.5);
    expect(lng).toBeLessThan(20.5);
  });

  it('should never return a score below the safety floor (15)', () => {
     const brokenAgent: Agent = {
      id: 'broken',
      name: 'Failed Unit',
      type: 'Army' as AgentType,
      emoji: '🪖',
      color: 'bg-green-500',
      dot: 'bg-green-400',
      lat: 20,
      lng: 80,
      status: 'Standby',
      score: null,
      zoneId: 'zone-1'
    };

    const massiveChains = [
        { impacts: [{ type: 'Army', penalty: 50 }] },
        { impacts: [{ type: 'Army', penalty: 50 }] },
        { impacts: [{ type: 'Army', penalty: 50 }] }
    ];

    const result = calculateEmergentScore(brokenAgent, massiveChains, {}, 'High', 0);
    expect(result.finalScore).toBe(15); 
  });
});
