import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import './index.css';

import SetupScreen from './components/SetupScreen';
import MapView from './components/MapView';
import Sidebar from './components/Sidebar';
import ReportModal from './components/ReportModal';
import ComparisonReport from './components/ComparisonReport';
import TimelineSlider from './components/TimelineSlider';

import { useSimulationStore } from './store/useSimulationStore';

function App() {
  const { 
    currentScreen, 
    simulationMode, 
    activeZonesA, 
    activeZonesB, 
    simTime,
    isAutoPlaying,
    showReport,
    setSimTime,
    toggleAutoPlay,
    toggleReport,
    resetSimulation,
    launchSimulation
  } = useSimulationStore();

  const playRef = useRef<any>(null);

  useEffect(() => {
    if (isAutoPlaying) {
      playRef.current = setInterval(() => {
        setSimTime(Math.min(72, simTime + 0.5));
        if (simTime >= 72) {
          toggleAutoPlay();
        }
      }, 100);
    } else {
      if (playRef.current) clearInterval(playRef.current);
    }
    return () => { if (playRef.current) clearInterval(playRef.current); };
  }, [isAutoPlaying, simTime, setSimTime, toggleAutoPlay]);

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-[#0a0f1e] text-white relative">
      {simulationMode === 'comparison' && currentScreen === 'simulation' && (
        <div className="absolute top-4 right-6 z-[2000] flex items-center gap-2 bg-[#ff5500]/10 border border-[#ff5500]/50 text-[#ff7733] px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(255,85,0,0.3)] backdrop-blur-md">
          <span className="text-xl">⚔️</span>
          <span className="font-bold tracking-widest uppercase text-xs">Comparison Mode Active</span>
        </div>
      )}

      {currentScreen === 'setup' && (
        <SetupScreen onLaunch={launchSimulation} />
      )}

      {currentScreen === 'simulation' && (
        <>
          <div className="flex-1 flex flex-row h-full w-full">
            <Sidebar
              timeStepIndex={simTime >= 72 ? 3 : (simTime >= 24 ? 2 : (simTime >= 6 ? 1 : 0))}
              simulationMode={simulationMode}
              activeZonesA={activeZonesA}
              activeZonesB={activeZonesB}
              nextStep={() => {}} // Not used
              generateReport={() => toggleReport(true)}
              onReset={resetSimulation}
            />
            <MapView
              simulationMode={simulationMode}
              activeZonesA={activeZonesA}
              activeZonesB={activeZonesB}
            />
          </div>

          <TimelineSlider 
            simTime={simTime}
            isAutoPlaying={isAutoPlaying}
            onTimeChange={setSimTime}
            onTogglePlay={toggleAutoPlay}
            onReset={() => {
                setSimTime(0);
                if (isAutoPlaying) toggleAutoPlay();
            }}
          />
        </>
      )}

      {showReport && simulationMode === 'single' && (
        <ReportModal activeZones={activeZonesA} onClose={() => toggleReport(false)} />
      )}

      {showReport && simulationMode === 'comparison' && (
        <ComparisonReport activeZonesA={activeZonesA} activeZonesB={activeZonesB} onClose={() => toggleReport(false)} />
      )}
    </div>
  );
}

export default App;
