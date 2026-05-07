import { create } from 'zustand';
import { SimulationState, DisasterZone, Agent, AgentType, LogEntry } from '../types';
import { DISASTERS } from '../utils/constants';
import { generateAgents, moveTowardsCenter, calculateEmergentScore } from '../utils/helpers';
import { DISASTER_ZONES } from '../data/districtData';
import { WEATHER_CONDITIONS } from '../data/weatherData';
import { evaluateChainsForStep } from '../simulation/causalChains';

interface SimulationStore extends SimulationState {
  simTime: number;
  isAutoPlaying: boolean;
  setSimTime: (time: number) => void;
  toggleAutoPlay: () => void;
  setScreen: (screen: 'setup' | 'simulation') => void;
  launchSimulation: (payload: { mode: 'single' | 'comparison', configA: any[], configB?: any[] }) => void;
  resetSimulation: () => void;
  runFullSimulation: () => void;
  toggleReport: (show: boolean) => void;
  addLog: (entry: Omit<LogEntry, 'id'>) => void;
}

export const useSimulationStore = create<SimulationStore>()((set, get) => ({
  currentScreen: 'setup',
  simulationMode: 'single',
  activeZonesA: [],
  activeZonesB: [],
  timeStepIndex: 0,
  simTime: 0,
  isAutoPlaying: false,
  showReport: false,
  logs: [],

  setScreen: (screen) => set({ currentScreen: screen }),
  setSimTime: (time) => set({ simTime: time }),
  toggleAutoPlay: () => set((state) => ({ isAutoPlaying: !state.isAutoPlaying })),
  addLog: (entry) => set((state) => ({ 
    logs: [{ ...entry, id: Math.random().toString(36).substr(2, 9) }, ...state.logs].slice(0, 50) 
  })),

  launchSimulation: (payload) => {
    const buildZones = (config: any[]) => {
      const configured = config.map(slot => {
        const dInfo = DISASTERS.find(d => d.id === slot.disasterId);
        return {
          id: slot.id, disasterId: slot.disasterId, severity: slot.severity,
          name: dInfo?.name || '', region: dInfo?.region || '', lat: dInfo?.lat || 0, lng: dInfo?.lng || 0,
          weather: (WEATHER_CONDITIONS as any)[slot.disasterId]
        };
      });
      return generateAgents(configured).map(z => ({
        ...z,
        triggeredChains: [],
        agents: z.agents.map(a => ({
          ...a,
          fuel: 100,
          history: [{ time: 0, lat: a.lat, lng: a.lng, status: a.status, score: null, fuel: 100 }]
        }))
      }));
    };

    set({
      simulationMode: payload.mode,
      activeZonesA: buildZones(payload.configA),
      activeZonesB: payload.mode === 'comparison' ? buildZones(payload.configB || []) : [],
      currentScreen: 'simulation',
      timeStepIndex: 0,
      simTime: 0,
      isAutoPlaying: false,
      showReport: false,
      logs: []
    });

    get().addLog({ time: 0, message: "📡 Command Center Initialized. Dispatching units...", type: 'info' });
    get().runFullSimulation();
  },

  runFullSimulation: () => {
    const { activeZonesA, activeZonesB, simulationMode } = get();
    
    const calculateAllSteps = (zones: DisasterZone[], tag: string) => {
      let currentZones = [...zones];
      const timeSteps = [6, 24, 72];
      
      timeSteps.forEach((t, idx) => {
        const stepIdx = idx + 1;
        currentZones = currentZones.map(zone => {
          let updatedAgents: Agent[] = zone.agents.map(agent => {
            let newStatus = agent.status;
            let newLat = agent.lat;
            let newLng = agent.lng;
            let newFuel = agent.fuel || 100;

            if (stepIdx === 1) { // T+6hr
              switch (agent.type) {
                case 'Army': case 'NDRF': case 'Local Police': newStatus = 'Moving'; break;
                case 'Doctors': case 'Supply Chain': newStatus = 'Standby'; break;
                case 'Civilians': newStatus = Math.random() < 0.5 ? 'Blocked' : 'Standby'; break;
              }
            } else if (stepIdx === 2) { // T+24hr
              switch (agent.type) {
                case 'Army': case 'NDRF': case 'Local Police': newStatus = 'On Ground'; break;
                case 'Doctors': newStatus = 'Moving'; break;
                case 'Supply Chain': newStatus = zone.severity === 'High' ? 'Blocked' : 'Moving'; break;
                case 'Civilians': if (newStatus !== 'Blocked') newStatus = 'Moving'; break;
              }
            } else if (stepIdx === 3) { // T+72hr
              switch (agent.type) {
                case 'Army': case 'NDRF': case 'Local Police': case 'Supply Chain': case 'Civilians': newStatus = 'Completed'; break;
                case 'Doctors': newStatus = 'On Ground'; break;
              }
            }

            const isMoving = newStatus === 'Moving' || newStatus === 'On Ground' || newStatus === 'Completed';
            if (isMoving && newFuel > 0) {
              const { lat, lng } = moveTowardsCenter(newLat, newLng, zone.lat, zone.lng);
              newLat = lat;
              newLng = lng;
              newFuel -= (t / 72) * 30; // Deplete fuel based on movement duration
              if (newFuel < 0) {
                newFuel = 0;
                newStatus = 'Blocked';
              }
            }

            return { ...agent, status: newStatus, lat: newLat, lng: newLng, fuel: newFuel };
          });

          const interZone = { ...zone, agents: updatedAgents };
          let pushedChains: any[] = [];
          
          if (stepIdx === 1 || stepIdx === 2) {
            pushedChains = evaluateChainsForStep(interZone, stepIdx);
            pushedChains.forEach(c => {
               get().addLog({ time: t, message: `🚨 [${tag}] ${c.event} in ${zone.name}`, type: 'warning', zoneId: zone.id });
            });
          }

          if (stepIdx === 3) {
            const totalPop = (DISASTER_ZONES as any)[zone.disasterId]?.affectedDistricts.reduce((sum: number, d: any) => sum + d.population, 0) || 0;
            updatedAgents = updatedAgents.map(ag => {
              if (ag.type === 'Civilians') return ag;
              const res = calculateEmergentScore(ag, zone.triggeredChains, zone.weather?.effects, zone.severity, totalPop);
              return { ...ag, score: res.finalScore, breakDown: res };
            });
            const docsFailed = updatedAgents.some(a => a.type === 'Doctors' && (a.score || 0) < 60);
            pushedChains = evaluateChainsForStep(interZone, 3, { doctorsFailed: docsFailed });
            pushedChains.forEach(c => {
               get().addLog({ time: t, message: `🚨 [${tag}] ${c.event} in ${zone.name}`, type: 'danger', zoneId: zone.id });
            });
            const tempChainsPop = [...zone.triggeredChains, ...pushedChains];
            updatedAgents = updatedAgents.map(ag => {
              if (ag.type === 'Civilians') {
                const res = calculateEmergentScore(ag, tempChainsPop, zone.weather?.effects, zone.severity, totalPop);
                return { ...ag, score: res.finalScore, breakDown: res };
              }
              return ag;
            });
          }

          const triggered = [...(zone.triggeredChains || []), ...pushedChains];
          const agentsWithHistory = updatedAgents.map(ag => ({
            ...ag,
            history: [...(ag.history || []), { time: t, lat: ag.lat, lng: ag.lng, status: ag.status, score: ag.score, fuel: ag.fuel }]
          }));

          return { ...zone, agents: agentsWithHistory, triggeredChains: triggered };
        });
      });
      return currentZones;
    };

    set({
      activeZonesA: calculateAllSteps(activeZonesA, "STRAT-A"),
      activeZonesB: simulationMode === 'comparison' ? calculateAllSteps(activeZonesB, "STRAT-B") : []
    });

    get().addLog({ time: 72, message: "🏁 Simulation completed. Data synthesized.", type: 'success' });
  },

  resetSimulation: () => set({
    currentScreen: 'setup',
    activeZonesA: [],
    activeZonesB: [],
    timeStepIndex: 0,
    simTime: 0,
    isAutoPlaying: false,
    showReport: false,
    logs: []
  }),

  toggleReport: (show) => set({ showReport: show })
}));
