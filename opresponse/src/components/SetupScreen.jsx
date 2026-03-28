import React, { useState } from 'react';
import { DISASTERS, AGENT_TYPES } from '../utils/constants';
import { WEATHER_CONDITIONS } from '../data/weatherData';
import { calculateAgentSplit } from '../utils/helpers';

const SetupScreen = ({ onLaunch }) => {
  const [slots, setSlots] = useState([
    { id: 'zone-1', active: true, disasterId: 'flood', severity: 'High' },
    { id: 'zone-2', active: false, disasterId: 'earthquake', severity: 'Medium' },
    { id: 'zone-3', active: false, disasterId: 'cyclone', severity: 'Low' }
  ]);

  const activeSlots = slots.filter(s => s.active);
  const selectedDisasters = activeSlots.map(s => s.disasterId);
  const hasDuplicates = new Set(selectedDisasters).size !== selectedDisasters.length;
  const canLaunch = activeSlots.length > 0 && !hasDuplicates;

  // Real-time calculation
  const splitCounts = calculateAgentSplit(activeSlots);

  const updateSlot = (index, field, value) => {
    const newSlots = [...slots];
    newSlots[index] = { ...newSlots[index], [field]: value };
    setSlots(newSlots);
  };

  const handleLaunch = () => {
    if (canLaunch) {
      onLaunch(activeSlots);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0f1e] text-white p-6 overflow-y-auto w-full">
      <div className="w-full max-w-6xl bg-[#0f1627] rounded-xl shadow-2xl p-8 border border-gray-800 my-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-2 mt-4">
            🪖 OpResponse
          </h1>
          <p className="text-gray-400 font-medium tracking-wide">
            India Disaster Response Simulator
          </p>
        </div>

        <h2 className="text-center text-lg font-bold text-gray-300 uppercase tracking-widest mb-6 border-b border-gray-800 pb-4">
          Select Active Disaster Zones (1-3)
        </h2>

        {hasDuplicates && (
          <div className="mb-6 mx-auto max-w-md p-3 bg-red-900/40 border border-red-500/50 rounded-lg text-red-400 text-center font-bold text-sm">
            ⚠️ Duplicate disaster type selected across active zones
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {slots.map((slot, i) => {
             const weather = WEATHER_CONDITIONS[slot.disasterId];
             return (
               <div key={slot.id} className={`p-5 rounded-xl border transition-all ${slot.active ? 'bg-[#121a2f] border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-[#0a0f1e] border-gray-800 opacity-60'}`}>
                 <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
                   <h3 className="font-bold text-gray-300 uppercase tracking-wider">Zone {i + 1}</h3>
                   <label className="flex items-center cursor-pointer">
                     <input type="checkbox" checked={slot.active} onChange={(e) => updateSlot(i, 'active', e.target.checked)} className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-gray-700 border-gray-600 cursor-pointer" />
                     <span className="ml-2 text-xs font-bold text-gray-400 uppercase">Active</span>
                   </label>
                 </div>

                 <div className={`space-y-4 ${!slot.active && 'opacity-50 pointer-events-none transition-opacity'}`}>
                   <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Disaster Type</label>
                      <select value={slot.disasterId} onChange={(e) => updateSlot(i, 'disasterId', e.target.value)} className="w-full bg-[#162032] border border-gray-700 text-gray-200 text-sm rounded px-3 py-2  focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer">
                        {DISASTERS.map(d => <option key={d.id} value={d.id}>{d.name} — {d.region}</option>)}
                      </select>
                   </div>

                   <div>
                     <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Severity</label>
                     <div className="flex gap-2">
                       {['Low', 'Medium', 'High'].map(level => (
                          <button key={level} onClick={() => updateSlot(i, 'severity', level)} className={`flex-1 py-1.5 rounded text-xs font-bold transition-all border ${slot.severity === level ? (level === 'High' ? 'bg-red-900 border-red-500 text-red-100' : level === 'Medium' ? 'bg-yellow-900 border-yellow-500 text-yellow-100' : 'bg-green-900 border-green-500 text-green-100') : 'bg-[#162032] border-gray-700 text-gray-500 hover:bg-gray-800'}`}>
                             {level}
                          </button>
                       ))}
                     </div>
                   </div>

                   {/* Weather Preview */}
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
        
        {/* Agent Allocation Preview */}
        {activeSlots.length > 0 && !hasDuplicates && (
          <div className="mb-8 p-5 bg-[#121a2f] border border-emerald-500/20 rounded-xl">
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-4">Live Agent Allocation Preview</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {AGENT_TYPES.map(agentType => (
                <div key={agentType.type} className="p-3 bg-[#0a0f1e] rounded border border-gray-800 flex flex-col gap-2">
                  <div className="font-bold text-sm text-gray-200 border-b border-gray-800 pb-2">{agentType.emoji} {agentType.type}</div>
                  <div className="space-y-1">
                    {activeSlots.map((slot, idx) => (
                      <div key={slot.id} className="text-xs text-gray-400 flex justify-between">
                        <span>Zone {slots.findIndex(s=>s.id===slot.id)+1}</span>
                        <span className="font-mono text-emerald-400 font-bold">→ {splitCounts[idx]} unit{splitCounts[idx] !== 1 ? 's' : ''}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 max-w-md mx-auto">
          <button
            disabled={!canLaunch}
            onClick={handleLaunch}
            className={`w-full py-4 font-bold rounded-lg text-lg uppercase tracking-widest transition-all transform ${canLaunch ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:-translate-y-1' : 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700'}`}
          >
            Deploy Forces
          </button>
        </div>
      </div>

      <div className="mt-4 text-gray-600 text-sm font-mono flex gap-6 pb-4">
        <span>STATUS: SYSTEM ONLINE</span>
        <span>AUTH: VALIDATED</span>
      </div>
    </div>
  );
};

export default SetupScreen;
