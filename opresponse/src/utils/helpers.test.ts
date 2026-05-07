import { describe, it, expect } from 'vitest';
import { calculateEmergentScore, moveTowardsCenter } from './helpers';
import { Agent, AgentType } from '../types';

describe('Simulation Engine - Trust & Safety Verification', () => {
  
  it('should correctly calculate scores with weather penalties', () => {
    const mockAgent: Agent = {
      id: 'test-1',
      name: 'Test Army',
      type: 'Army' as AgentType,
      lat: 20,
      lng: 80,
      status: 'Standby',
      score: null,
      zoneId: 'zone-1'
    };

    const weatherEffects = {
      army: { speedPenalty: 20, label: 'Heavy Rain' }
    };

    // Calculate score with a 20 point weather penalty
    const result = calculateEmergentScore(mockAgent, [], weatherEffects as any, 'Medium', 0);
    
    // Base 100 - WeatherPenalty(approx 20) + Variance
    // With variance limit of 15 for Medium severity, score should be roughly 65-95
    expect(result.finalScore).toBeGreaterThan(50);
    expect(result.finalScore).toBeLessThan(100);
    expect(result.weatherPenalty).toBeLessThan(0);
  });

  it('should apply severe penalties for Civilian Safety in high population zones', () => {
    const mockCiv: Agent = {
      id: 'civ-1',
      name: 'Civilians',
      type: 'Civilians' as AgentType,
      lat: 20,
      lng: 80,
      status: 'Standby',
      score: null,
      zoneId: 'zone-1'
    };

    // High population (6 Million)
    const result = calculateEmergentScore(mockCiv, [], {}, 'High', 6000000);
    
    // Should have a popPenalty
    expect(result.popPenalty).toBe(-15);
  });

  it('should move agents towards the zone center correctly', () => {
    const startLat = 10;
    const startLng = 10;
    const centerLat = 20;
    const centerLng = 20;

    const { lat, lng } = moveTowardsCenter(startLat, startLng, centerLat, centerLng);

    // Should be closer to 20,20 than 10,10
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
      lat: 20,
      lng: 80,
      status: 'Standby',
      score: null,
      zoneId: 'zone-1'
    };

    // Create massive penalties
    const massiveChains = [
        { impacts: [{ type: 'Army', penalty: 50 }] },
        { impacts: [{ type: 'Army', penalty: 50 }] },
        { impacts: [{ type: 'Army', penalty: 50 }] }
    ];

    const result = calculateEmergentScore(brokenAgent, massiveChains, {}, 'High', 0);
    expect(result.finalScore).toBe(15); // The floor we defined in helpers.ts
  });
});
