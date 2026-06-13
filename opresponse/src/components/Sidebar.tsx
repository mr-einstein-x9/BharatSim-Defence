import React, { useState, useEffect, useMemo } from 'react';
import { TIME_STEPS } from '../utils/constants';
import { DISASTER_ZONES } from '../data/districtData';
import { DisasterZone } from '../types';
import AnalyticsDashboard from './AnalyticsDashboard';
import CommandLog from './CommandLog';
import { useSimulationStore } from '../store/useSimulationStore';

interface SidebarProps {
  timeStepIndex: number;
  simulationMode: 'single' | 'comparison';
  activeZonesA: DisasterZone[];
  activeZonesB: DisasterZone[];
  nextStep: () => void;
  generateReport: () => void;
  onReset: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  simulationMode, 
  activeZonesA, 
  activeZonesB, 
  generateReport, 
  onReset 
}) => {
  const { simTime, logs } = useSimulationStore();
  const [activeStrategy, setActiveStrategy] = useState<'A' | 'B'>('A');
  
  const currentZonesList = useMemo(() => 
    simulationMode === 'comparison' 
      ? (activeStrategy === 'A' ? activeZonesA : activeZonesB) 
      : activeZonesA, 
    [simulationMode, activeStrategy, activeZonesA, activeZonesB]
  );

  const [activeTabId, setActiveTabId] = useState<string | null>(currentZonesList[0]?.id || null);
  const [isWeatherExpanded, setIsWeatherExpanded] = useState(false);

  const timeStepIndex = simTime >= 72 ? 3 : (simTime >= 24 ? 2 : (simTime >= 6 ? 1 : 0));
  const currentStepLabel = TIME_STEPS[timeStepIndex] || '';

  useEffect(() => {
    if (currentZonesList.length > 0 && !currentZonesList.find(z => z.id === activeTabId)) {
      setActiveTabId(currentZonesList[0].id);
    }
  }, [currentZonesList, activeTabId]);

  const activeZone = currentZonesList.find(z => z.id === activeTabId) || currentZonesList[0];
  const sortedAgents = activeZone ? [...activeZone.agents].sort((a, b) => a.type.localeCompare(b.type)) : [];

  return (
    <div className="w-80 h-full bg-brand-dark border-r border-brand-border flex flex-col text-white shadow-2xl relative z-20">
      
      <div className="p-4 border-b border-brand-border bg-brand-darker flex justify-between items-center shrink-0">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600 m-0">
          🪖 OPS STATUS
        </h2>
        <button
          onClick={onReset}
          className="text-xs bg-gray-800 hover:bg-red-800 text-gray-300 py-1 px-3 rounded shadow transition-colors"
        >
          Reset
        </button>
      </div>

      {simulationMode === 'comparison' && (
        <div className="flex shrink-0 border-b border-brand-border bg-brand-dark">
          <button
            onClick={() => setActiveStrategy('A')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeStrategy === 'A' 
                ? 'text-blue-400 border-blue-500 bg-blue-900/10' 
                : 'text-gray-500 border-transparent hover:text-gray-300 hover:bg-brand-lighter/50'
            }`}
          >
            🔵 Strategy A
          </button>
          <button
            onClick={() => setActiveStrategy('B')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeStrategy === 'B' 
                ? 'text-red-400 border-red-500 bg-red-900/10' 
                : 'text-gray-500 border-transparent hover:text-gray-300 hover:bg-brand-lighter/50'
            }`}
          >
            🔴 Strategy B
          </button>
        </div>
      )}

      {currentZonesList.length > 1 && (
        <div className="flex shrink-0 border-b border-brand-border bg-brand-medium">
          {currentZonesList.map((zone, idx) => (
            <button
              key={zone.id}
              onClick={() => setActiveTabId(zone.id)}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
                activeTabId === zone.id 
                  ? 'text-emerald-400 border-emerald-500 bg-brand-light' 
                  : 'text-gray-500 border-transparent hover:text-gray-300 hover:bg-brand-lighter/50'
              }`}
            >
              Zone {idx + 1}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto flex flex-col p-4 space-y-6">
        
        {/* Analytics Dashboard */}
        <AnalyticsDashboard activeZones={currentZonesList} />

        {/* Command Log */}
        <CommandLog logs={logs} simTime={simTime} />

        {activeZone && activeZone.weather && (
          <div className="bg-brand-light border border-brand-border rounded-lg shadow-lg overflow-hidden shrink-0">
            <button 
              onClick={() => setIsWeatherExpanded(!isWeatherExpanded)}
              className="w-full flex justify-between items-center p-3 hover:bg-brand-lighter/50 transition-colors"
            >
              <h3 className="font-bold text-gray-200 uppercase tracking-widest text-[10px] m-0">
                🌦️ Weather Conditions
              </h3>
              <span className="text-gray-400 text-[10px]">
                {isWeatherExpanded ? '▲' : '▼'}
              </span>
            </button>
            
            {isWeatherExpanded && (
              <div className="p-3 pt-0 border-t border-brand-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{activeZone.weather.icon}</span>
                  <p className="text-emerald-400 text-xs font-mono font-semibold m-0">
                    {activeZone.weather.type}
                  </p>
                </div>
                <div className="space-y-1 mt-2">
                   <p className="text-[10px] text-gray-400">Atmosphere is critically affecting deployment speeds.</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="border-b border-brand-border shrink-0"></div>

        <div className="pb-4 flex-1 flex flex-col">
          <div className="flex items-baseline justify-between mb-4 shrink-0">
            <span className="text-sm font-semibold tracking-widest text-gray-500 uppercase">
              Current Time
            </span>
            <span className="text-2xl font-mono font-bold text-emerald-400 drop-shadow-0_0_8px_rgba(52,211,153,0.8)">
              {currentStepLabel}
            </span>
          </div>

          <div className="space-y-3 pb-4">
            {sortedAgents.map((agent) => (
              <div
                key={agent.id}
                className="flex items-center justify-between p-3 bg-brand-light rounded-lg border border-brand-border/50 hover:border-brand-lighter transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl bg-gray-800/50 p-1 rounded">
                    {agent.emoji}
                  </span>
                  <div>
                    <p className="font-semibold text-sm text-gray-200 m-0">
                      {agent.name}
                    </p>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] text-gray-400 uppercase">{agent.type}</span>
                       {agent.fuel !== undefined && agent.type !== 'Civilians' && (
                         <div className="flex items-center gap-1">
                            <div className="w-8 h-1 bg-brand-darker rounded-full overflow-hidden">
                               <div 
                                 className={`h-full ${agent.fuel > 30 ? 'bg-emerald-500' : 'bg-red-500'}`} 
                                 style={{ width: `${agent.fuel}%` }}
                               />
                            </div>
                            <span className="text-[8px] text-gray-500 font-mono">{Math.floor(agent.fuel)}%</span>
                         </div>
                       )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8px] uppercase font-bold text-gray-500">
                      {agent.status}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full shadow-sm ${
                        agent.status === 'Completed' ||
                        agent.status === 'On Ground'
                          ? 'bg-green-500 shadow-green-500/50'
                          : agent.status === 'Blocked'
                          ? 'bg-red-500 shadow-red-500/50'
                          : 'bg-yellow-500 shadow-yellow-500/50'
                      }`}
                    />
                  </div>
                  {agent.score !== null && (
                    <span className="text-[10px] font-mono font-bold text-emerald-300">
                      {agent.score}/100
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-brand-border bg-brand-darker space-y-4 shrink-0">
        <button
            onClick={generateReport}
            className={`w-full py-3 text-white font-bold uppercase tracking-wider rounded-lg transition-all transform hover:-translate-y-0.5 animate-pulse ${simulationMode === 'comparison' ? 'bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-500 hover:to-red-500 shadow-[0_0_15px_rgba(139,92,246,0.3)]' : 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]'}`}
          >
            {simulationMode === 'comparison' ? 'Compare Results' : 'Generate Report'}
          </button>
      </div>
    </div>
  );
};

export default Sidebar;
