import React, { useState } from 'react';
import { DISASTERS, AGENT_TYPES } from '../utils/constants';
import { WEATHER_CONDITIONS } from '../data/weatherData';
import { calculateAgentSplit } from '../utils/helpers';

const SetupScreen = ({ onLaunch }) => {
  const [isComparisonMode, setIsComparisonMode] = useState(false);

  const [slotsA, setSlotsA] = useState([
    { id: 'zone-1A', active: true, disasterId: 'flood', severity: 'High' },
    { id: 'zone-2A', active: false, disasterId: 'earthquake', severity: 'Medium' },
    { id: 'zone-3A', active: false, disasterId: 'cyclone', severity: 'Low' }
  ]);
  
  const [slotsB, setSlotsB] = useState([
    { id: 'zone-1B', active: true, disasterId: 'cyclone', severity: 'High' },
    { id: 'zone-2B', active: false, disasterId: 'flood', severity: 'Medium' },
    { id: 'zone-3B', active: false, disasterId: 'earthquake', severity: 'Low' }
  ]);

  const activeA = slotsA.filter(s => s.active);
  const activeB = slotsB.filter(s => s.active);

  const selectedA = activeA.map(s => s.disasterId);
  const selectedB = activeB.map(s => s.disasterId);

  const hasDuplicatesA = new Set(selectedA).size !== selectedA.length;
  const hasDuplicatesB = new Set(selectedB).size !== selectedB.length;

  const canLaunchSingle = activeA.length > 0 && !hasDuplicatesA;
  const canLaunchCompare = activeA.length > 0 && activeB.length > 0 && !hasDuplicatesA && !hasDuplicatesB;
  const canLaunch = isComparisonMode ? canLaunchCompare : canLaunchSingle;

  const splitCountsA = calculateAgentSplit(activeA);
  const splitCountsB = calculateAgentSplit(activeB);

  const updateSlot = (index, field, value, strategy) => {
    if (strategy === 'A') {
      const newSlots = [...slotsA];
      newSlots[index] = { ...newSlots[index], [field]: value };
      setSlotsA(newSlots);
    } else {
      const newSlots = [...slotsB];
      newSlots[index] = { ...newSlots[index], [field]: value };
      setSlotsB(newSlots);
    }
  };

  const handleLaunch = () => {
    if (canLaunch) {
      if (isComparisonMode) {
        onLaunch({ mode: 'comparison', configA: activeA, configB: activeB });
      } else {
        onLaunch({ mode: 'single', configA: activeA });
      }
    }
  };

  const renderPanel = (title, accentColor, slots, strategy, hasDupes, splitCounts, activeSlots) => (
    <div className={`flex-1 bg-[#0f1627] rounded-xl shadow-2xl p-6 border border-gray-800 ${accentColor === 'blue' ? 'border-t-4 border-t-blue-500' : accentColor === 'red' ? 'border-t-4 border-t-red-500' : ''}`}>
      {title && (
        <h2 className="text-xl font-bold uppercase tracking-widest mb-6 border-b border-gray-800 pb-4 flex items-center justify-between">
          <span className={accentColor === 'blue' ? 'text-blue-400' : accentColor === 'red' ? 'text-red-400' : 'text-gray-300'}>{title}</span>
        </h2>
      )}

      {hasDupes && (
        <div className="mb-6 p-3 bg-red-900/40 border border-red-500/50 rounded-lg text-red-400 text-center font-bold text-sm">
          ⚠️ Duplicate disaster type selected
        </div>
      )}

      <div className={`grid grid-cols-1 ${isComparisonMode ? '' : 'md:grid-cols-3'} gap-6 mb-8`}>
        {slots.map((slot, i) => {
           const weather = WEATHER_CONDITIONS[slot.disasterId];
           return (
             <div key={slot.id} className={`p-5 rounded-xl border transition-all ${slot.active ? (accentColor === 'blue' ? 'bg-[#121a2f] border-blue-500/30' : accentColor === 'red' ? 'bg-[#121a2f] border-red-500/30' : 'bg-[#121a2f] border-emerald-500/50') : 'bg-[#0a0f1e] border-gray-800 opacity-60'}`}>
               <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
                 <h3 className="font-bold text-gray-300 uppercase tracking-wider">Zone {i + 1}</h3>
                 <label className="flex items-center cursor-pointer">
                   <input type="checkbox" checked={slot.active} onChange={(e) => updateSlot(i, 'active', e.target.checked, strategy)} className={`w-4 h-4 rounded bg-gray-700 border-gray-600 cursor-pointer ${accentColor === 'blue' ? 'text-blue-500 focus:ring-blue-500' : accentColor === 'red' ? 'text-red-500 focus:ring-red-500' : 'text-emerald-500 focus:ring-emerald-500'}`} />
                   <span className="ml-2 text-xs font-bold text-gray-400 uppercase">Active</span>
                 </label>
               </div>

               <div className={`space-y-4 ${!slot.active && 'opacity-50 pointer-events-none transition-opacity'}`}>
                 <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Disaster Type</label>
                    <select value={slot.disasterId} onChange={(e) => updateSlot(i, 'disasterId', e.target.value, strategy)} className="w-full bg-[#162032] border border-gray-700 text-gray-200 text-sm rounded px-3 py-2 cursor-pointer focus:outline-none focus:border-gray-500">
                      {DISASTERS.map(d => <option key={d.id} value={d.id}>{d.name} — {d.region}</option>)}
                    </select>
                 </div>

                 <div>
                   <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Severity</label>
                   <div className="flex gap-2">
                     {['Low', 'Medium', 'High'].map(level => (
                        <button key={level} onClick={() => updateSlot(i, 'severity', level, strategy)} className={`flex-1 py-1.5 rounded text-xs font-bold transition-all border ${slot.severity === level ? (level === 'High' ? 'bg-red-900 border-red-500 text-red-100' : level === 'Medium' ? 'bg-yellow-900 border-yellow-500 text-yellow-100' : 'bg-green-900 border-green-500 text-green-100') : 'bg-[#162032] border-gray-700 text-gray-500 hover:bg-gray-800'}`}>
                           {level}
                        </button>
                     ))}
                   </div>
                 </div>

                 {weather && (
                   <div className="mt-2 p-3 bg-[#0a0f1e] border border-gray-800 rounded text-xs text-gray-400 shadow-inner">
                     <div className="flex items-center gap-2 mb-1">
                       <span className="text-lg">{weather.icon}</span>
                       <span className="font-bold text-gray-300">{weather.type}</span>
                     </div>
                     <div className="font-mono text-[10px] text-gray-500">
                       W: {weather.windSpeed} | V: {weather.visibility}
                     </div>
                   </div>
                 )}
               </div>
             </div>
           );
        })}
      </div>
      
      {activeSlots.length > 0 && !hasDupes && (
        <div className={`mb-4 p-4 bg-[#121a2f] border rounded-xl ${accentColor === 'blue' ? 'border-blue-500/20' : accentColor === 'red' ? 'border-red-500/20' : 'border-emerald-500/20'}`}>
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Agent Allocation Preview</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {AGENT_TYPES.map(agentType => (
              <div key={agentType.type} className="p-2 bg-[#0a0f1e] rounded border border-gray-800 text-[10px]">
                <div className="font-bold text-gray-300 border-b border-gray-800 pb-1 mb-1">{agentType.emoji} {agentType.type}</div>
                <div className="space-y-0.5">
                  {activeSlots.map((slot, idx) => (
                    <div key={slot.id} className="text-gray-500 flex justify-between">
                      <span>Z{slots.findIndex(s=>s.id===slot.id)+1}</span>
                      <span className={`font-mono font-bold ${accentColor === 'blue' ? 'text-blue-400' : accentColor === 'red' ? 'text-red-400' : 'text-emerald-400'}`}>{splitCounts[idx]}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#0a0f1e] text-white p-6 overflow-y-auto w-full">
      
      <div className="text-center mb-6 mt-4">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-2">
          🪖 OpResponse
        </h1>
        <p className="text-gray-400 font-medium tracking-wide">
          India Disaster Response Simulator
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="bg-[#121a2f] p-1 rounded-lg border border-gray-800 inline-flex">
          <button 
            onClick={() => setIsComparisonMode(false)}
            className={`px-8 py-2.5 rounded text-sm font-bold uppercase tracking-widest transition-all ${!isComparisonMode ? 'bg-[#1e293b] text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Single Operation
          </button>
          <button 
            onClick={() => setIsComparisonMode(true)}
            className={`px-8 py-2.5 rounded text-sm font-bold uppercase tracking-widest transition-all ${isComparisonMode ? 'bg-[#1e293b] text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Comparison Mode
          </button>
        </div>
      </div>

      <div className={`w-full max-w-7xl flex flex-col ${isComparisonMode ? 'md:flex-row gap-6' : ''}`}>
        {isComparisonMode ? (
          <>
            {renderPanel('🔵 Strategy A', 'blue', slotsA, 'A', hasDuplicatesA, splitCountsA, activeA)}
            {renderPanel('🔴 Strategy B', 'red', slotsB, 'B', hasDuplicatesB, splitCountsB, activeB)}
          </>
        ) : (
          renderPanel('Select Active Disaster Zones (1-3)', 'emerald', slotsA, 'A', hasDuplicatesA, splitCountsA, activeA)
        )}
      </div>

      <div className="mt-8 max-w-md w-full">
        {isComparisonMode && (
          <p className="text-center text-xs text-gray-500 font-semibold mb-3 uppercase tracking-widest">
            * Run both strategies simultaneously and compare results *
          </p>
        )}
        <button
          disabled={!canLaunch}
          onClick={handleLaunch}
          className={`w-full py-4 font-bold rounded-lg text-lg uppercase tracking-widest transition-all transform ${canLaunch ? (isComparisonMode ? 'bg-gradient-to-r from-blue-600 to-red-600 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:-translate-y-1 text-white' : 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:-translate-y-1') : 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700'}`}
        >
          {isComparisonMode ? 'Launch Comparison' : 'Deploy Forces'}
        </button>
      </div>

      <div className="mt-8 text-gray-600 text-sm font-mono flex gap-6 pb-4">
        <span>STATUS: SYSTEM ONLINE</span>
        <span>AUTH: VALIDATED</span>
        {isComparisonMode && <span>MODE: COMPARISON</span>}
      </div>
    </div>
  );
};

export default SetupScreen;
