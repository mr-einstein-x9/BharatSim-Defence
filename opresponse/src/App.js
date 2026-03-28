import React, { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import './index.css';

import SetupScreen from './components/SetupScreen';
import MapView from './components/MapView';
import Sidebar from './components/Sidebar';
import ReportModal from './components/ReportModal';
import ComparisonReport from './components/ComparisonReport';

import { DISASTERS } from './utils/constants';
import { generateAgents, moveTowardsCenter, calculateEmergentScore } from './utils/helpers';
import { DISASTER_ZONES } from './data/districtData';
import { WEATHER_CONDITIONS } from './data/weatherData';
import { evaluateChainsForStep } from './simulation/causalChains';



function App() {
  const [currentScreen, setCurrentScreen] = useState('setup'); // 'setup' | 'simulation'
  const [simulationMode, setSimulationMode] = useState('single'); // 'single' | 'comparison'
  const [activeZonesA, setActiveZonesA] = useState([]);
  const [activeZonesB, setActiveZonesB] = useState([]);
  const [timeStepIndex, setTimeStepIndex] = useState(0);
  const [showReport, setShowReport] = useState(false);

  const handleLaunch = (payload) => {
    const buildZones = (config) => {
      const configured = config.map(slot => {
        const dInfo = DISASTERS.find(d => d.id === slot.disasterId);
        return {
          id: slot.id, disasterId: slot.disasterId, severity: slot.severity,
          name: dInfo.name, region: dInfo.region, lat: dInfo.lat, lng: dInfo.lng,
          weather: WEATHER_CONDITIONS[slot.disasterId]
        };
      });
      return generateAgents(configured).map(z => ({ ...z, triggeredChains: [] }));
    };

    if (payload.mode === 'comparison') {
      setSimulationMode('comparison');
      setActiveZonesA(buildZones(payload.configA));
      setActiveZonesB(buildZones(payload.configB));
    } else {
      setSimulationMode('single');
      setActiveZonesA(buildZones(payload.configA));
      setActiveZonesB([]);
    }

    setCurrentScreen('simulation');
    setTimeStepIndex(0);
    setShowReport(false);
  };

  const handleReset = () => {
    setCurrentScreen('setup');
    setActiveZonesA([]);
    setActiveZonesB([]);
    setTimeStepIndex(0);
    setShowReport(false);
  };

  const nextTimeStep = () => {
    if (timeStepIndex >= 3) return;
    const nextStepIdx = timeStepIndex + 1;

    const processZones = (prevZones) => prevZones.map(zone => {
      let updatedAgents = zone.agents.map(agent => {
        let newStatus = agent.status;
        let newLat = agent.lat;
        let newLng = agent.lng;

        if (nextStepIdx === 1) { // T+6hr
          switch (agent.type) {
            case 'Army': case 'NDRF': case 'Local Police': newStatus = 'Moving'; break;
            case 'Doctors': case 'Supply Chain': newStatus = 'Standby'; break;
            case 'Civilians': newStatus = Math.random() < 0.5 ? 'Blocked' : 'Standby'; break;
            default: break;
          }
        } else if (nextStepIdx === 2) { // T+24hr
          switch (agent.type) {
            case 'Army': case 'NDRF': case 'Local Police': newStatus = 'On Ground'; break;
            case 'Doctors': newStatus = 'Moving'; break;
            case 'Supply Chain': newStatus = zone.severity === 'High' ? 'Blocked' : 'Moving'; break;
            case 'Civilians': if (newStatus !== 'Blocked') newStatus = 'Moving'; break;
            default: break;
          }
        } else if (nextStepIdx === 3) { // T+72hr
          switch (agent.type) {
            case 'Army': case 'NDRF': case 'Local Police': case 'Supply Chain': case 'Civilians': newStatus = 'Completed'; break;
            case 'Doctors': newStatus = 'On Ground'; break;
            default: break;
          }
        }

        const isMoving = newStatus === 'Moving' || newStatus === 'On Ground' || newStatus === 'Completed';
        if (isMoving) {
          const { lat, lng } = moveTowardsCenter(newLat, newLng, zone.lat, zone.lng);
          newLat = lat;
          newLng = lng;
        }

        return { ...agent, status: newStatus, lat: newLat, lng: newLng };
      });

      const interZone = { ...zone, agents: updatedAgents };
      let pushedChains = [];
      let docsFailed = false;

      if (nextStepIdx === 1 || nextStepIdx === 2) {
        pushedChains = evaluateChainsForStep(interZone, nextStepIdx);
      }

      if (nextStepIdx === 3) {
        const totalPop = DISASTER_ZONES[zone.disasterId]?.affectedDistricts.reduce((sum, d) => sum + d.population, 0) || 0;

        updatedAgents = updatedAgents.map(ag => {
          if (ag.type === 'Civilians') return ag;
          const res = calculateEmergentScore(ag, zone.triggeredChains, zone.weather?.effects, zone.severity, totalPop);
          return { ...ag, score: res.finalScore, breakDown: res };
        });

        docsFailed = updatedAgents.some(a => a.type === 'Doctors' && a.score < 60);
        pushedChains = evaluateChainsForStep(interZone, 3, { doctorsFailed: docsFailed });

        const tempChainsPop = [...zone.triggeredChains, ...pushedChains];
        updatedAgents = updatedAgents.map(ag => {
          if (ag.type === 'Civilians') {
            const res = calculateEmergentScore(ag, tempChainsPop, zone.weather?.effects, zone.severity, totalPop);
            return { ...ag, score: res.finalScore, breakDown: res };
          }
          return ag;
        });
      }

      return { ...zone, agents: updatedAgents, triggeredChains: [...(zone.triggeredChains || []), ...pushedChains] };
    });

    setActiveZonesA(prev => processZones(prev));
    if (simulationMode === 'comparison') {
      setActiveZonesB(prev => processZones(prev));
    }

    setTimeStepIndex(nextStepIdx);
  };

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-[#0a0f1e] text-white relative">
      {simulationMode === 'comparison' && currentScreen === 'simulation' && (
        <div className="absolute top-4 right-6 z-[2000] flex items-center gap-2 bg-[#ff5500]/10 border border-[#ff5500]/50 text-[#ff7733] px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(255,85,0,0.3)] backdrop-blur-md">
          <span className="text-xl">⚔️</span>
          <span className="font-bold tracking-widest uppercase text-xs">Comparison Mode Active</span>
        </div>
      )}

      {currentScreen === 'setup' && (
        <SetupScreen onLaunch={handleLaunch} />
      )}

      {currentScreen === 'simulation' && (
        <div className="flex-1 flex flex-row h-full w-full">
          <Sidebar
            timeStepIndex={timeStepIndex}
            simulationMode={simulationMode}
            activeZonesA={activeZonesA}
            activeZonesB={activeZonesB}
            nextStep={nextTimeStep}
            generateReport={() => setShowReport(true)}
            onReset={handleReset}
          />
          <MapView
            simulationMode={simulationMode}
            activeZonesA={activeZonesA}
            activeZonesB={activeZonesB}
          />
        </div>
      )}

      {showReport && simulationMode === 'single' && (
        <ReportModal activeZones={activeZonesA} onClose={() => setShowReport(false)} />
      )}

      {showReport && simulationMode === 'comparison' && (
        <ComparisonReport activeZonesA={activeZonesA} activeZonesB={activeZonesB} onClose={() => setShowReport(false)} />
      )}
    </div>
  );
}

export default App;
