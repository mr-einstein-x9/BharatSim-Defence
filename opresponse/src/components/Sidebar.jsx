import React, { useState } from 'react';
import { TIME_STEPS } from '../utils/constants';
import { DISASTER_ZONES } from '../data/districtData';

const Sidebar = ({ timeStepIndex, agents, nextStep, generateReport, onReset, disaster, weather }) => {
  const [isWeatherExpanded, setIsWeatherExpanded] = useState(false);
  const currentStepLabel = TIME_STEPS[timeStepIndex];
  const isFinished = timeStepIndex === TIME_STEPS.length - 1;

  const sortedAgents = [...agents].sort((a, b) => a.type.localeCompare(b.type));

  let popRiskText = '';
  let popColorClass = '';

  if (disaster && disaster.id && DISASTER_ZONES[disaster.id]) {
    const totalPop = DISASTER_ZONES[disaster.id].affectedDistricts.reduce((sum, d) => sum + d.population, 0);
    const popInLakhs = (totalPop / 100000).toFixed(2);
    popRiskText = `⚠️ Population at Risk: ${popInLakhs} Lakh`;
    
    if (totalPop > 2000000) {
      popColorClass = 'text-red-400 bg-red-900/20 border-red-500/30';
    } else if (totalPop >= 1000000) {
      popColorClass = 'text-orange-400 bg-orange-900/20 border-orange-500/30';
    } else {
      popColorClass = 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
    }
  }

  return (
    <div className="w-80 h-full bg-[#0f1627] border-r border-gray-800 flex flex-col text-white shadow-2xl relative z-20">
      
      {/* Top Header */}
      <div className="p-4 border-b border-gray-800 bg-[#0a0f1e] flex justify-between items-center shrink-0">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600 m-0">
          🪖 STATUS
        </h2>
        <button
          onClick={onReset}
          className="text-xs bg-gray-800 hover:bg-red-800 text-gray-300 py-1 px-3 rounded shadow transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Main Scrollable Area */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        
        {/* Population at Risk */}
        {disaster && (
          <div className={`mx-4 mt-4 p-2 rounded border text-xs font-semibold flex items-center justify-center text-center shadow-sm shrink-0 ${popColorClass}`}>
            {popRiskText}
          </div>
        )}

        {/* Expandable Weather Panel */}
        {weather && (
          <div className="mx-4 mt-4 bg-[#162032] border border-gray-700/80 rounded-lg shadow-lg overflow-hidden shrink-0">
            <button 
              onClick={() => setIsWeatherExpanded(!isWeatherExpanded)}
              className="w-full flex justify-between items-center p-3 hover:bg-[#1a263c] transition-colors"
            >
              <h3 className="font-bold text-gray-200 uppercase tracking-widest text-[10px] m-0">
                🌦️ Weather Conditions
              </h3>
              <span className="text-gray-400 text-[10px]">
                {isWeatherExpanded ? '▲' : '▼'}
              </span>
            </button>
            
            {isWeatherExpanded && (
              <div className="p-3 pt-0 border-t border-gray-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{weather.icon}</span>
                  <p className="text-emerald-400 text-xs font-mono font-semibold m-0">
                    {weather.type} <span className="text-gray-500">|</span> Wind: {weather.windSpeed} <span className="text-gray-500">|</span> Vis: {weather.visibility}
                  </p>
                </div>
                <div className="space-y-1 mt-2">
                  {Object.entries(weather.effects).map(([key, effect]) => {
                    const agentNames = { army: '🪖 Army', ndrf: '🟠 NDRF', doctors: '👨⚕️ Doctors', police: '👮 Police', supplyChain: '🚚 Supply Chain', civilians: '👥 Civilians' };
                    return (
                      <div key={key} className="text-[10px] text-gray-400">
                        <span className="font-semibold text-gray-300">{agentNames[key]}</span> — {effect.label} 
                        {effect.speedPenalty > 0 && <span className="text-red-400 font-mono ml-1">(+{effect.speedPenalty} penalty)</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Thin Divider Line */}
        <div className="mx-4 my-5 border-b border-gray-800/80 shrink-0"></div>

        <div className="px-4 pb-4 flex-1 flex flex-col">
          {/* Time Step Indicator */}
          <div className="flex items-baseline justify-between mb-4 shrink-0">
            <span className="text-sm font-semibold tracking-widest text-gray-500 uppercase">
              Current Time
            </span>
            <span className="text-2xl font-mono font-bold text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]">
              {currentStepLabel}
            </span>
          </div>

          {/* Agent List */}
          <div className="space-y-3 pb-4">
            {sortedAgents.map((agent) => (
              <div
                key={agent.id}
                className="flex items-center justify-between p-3 bg-[#162032] rounded-lg border border-gray-700/50 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl bg-gray-800/50 p-1 rounded">
                    {agent.emoji}
                  </span>
                  <div>
                    <p className="font-semibold text-sm text-gray-200 m-0">
                      {agent.name}
                    </p>
                    <p className="text-xs text-gray-400 m-0">{agent.type}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {/* Status Dot & Label */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-gray-500">
                      {agent.status}
                    </span>
                    <span
                      className={`w-2.5 h-2.5 rounded-full shadow-sm ${
                        agent.status === 'Completed' ||
                        agent.status === 'On Ground'
                          ? 'bg-green-500 shadow-green-500/50'
                          : agent.status === 'Blocked'
                          ? 'bg-red-500 shadow-red-500/50'
                          : 'bg-yellow-500 shadow-yellow-500/50'
                      }`}
                    />
                  </div>
                  {/* Optional Score */}
                  {agent.score !== null && (
                    <span className="text-xs font-mono font-bold text-emerald-300">
                      {agent.score}/100
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-gray-800 bg-[#0a0f1e] space-y-4 shrink-0">
        <button
          onClick={nextStep}
          disabled={isFinished}
          className={`w-full py-3 rounded-lg font-bold uppercase tracking-wider transition-all ${
            isFinished
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
              : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-[0_0_15px_rgba(52,211,153,0.3)] hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] transform hover:-translate-y-0.5'
          }`}
        >
          {isFinished ? 'Simulation Ended' : 'Next Time Step'}
        </button>

        {isFinished && (
          <button
            onClick={generateReport}
            className="w-full py-3 bg-blue-600 text-white hover:bg-blue-500 font-bold uppercase tracking-wider rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all transform hover:-translate-y-0.5 animate-pulse"
          >
            Generate Report
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
