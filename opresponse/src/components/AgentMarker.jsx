import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const createCustomIcon = (agent) => {
  return L.divIcon({
    className: 'bg-transparent border-none',
    html: `
      <div class="${agent.color} w-10 h-10 rounded-full border-[3px] border-[#0a0f1e] shadow-[0_0_15px_rgba(0,0,0,0.8)] flex items-center justify-center text-xl transition-all duration-500 ease-in-out">
        ${agent.emoji}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

const AgentMarker = ({ agent }) => {
  const icon = createCustomIcon(agent);

  return (
    <Marker position={[agent.lat, agent.lng]} icon={icon}>
      <Popup className="agent-popup border-none">
        <div className="bg-[#0f1627] text-white p-4 rounded-xl shadow-2xl border border-gray-700 min-w-[200px]">
          <div className="flex items-center gap-3 border-b border-gray-800 pb-3 mb-3">
            <span className="text-3xl bg-gray-800 p-2 rounded-lg">{agent.emoji}</span>
            <div>
              <h3 className="text-lg font-bold text-gray-100 m-0 leading-tight">{agent.name}</h3>
              <p className="text-sm text-gray-400 m-0 uppercase tracking-widest">{agent.type}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center bg-[#162032] p-2 rounded">
              <span className="text-xs uppercase font-bold text-gray-500">Status</span>
              <span className={`text-xs font-bold uppercase ${
                agent.status === 'Completed' || agent.status === 'On Ground' ? 'text-green-400' :
                agent.status === 'Blocked' ? 'text-red-400' : 'text-yellow-400'
              }`}>
                {agent.status}
              </span>
            </div>
            {agent.score !== null && (
              <div className="flex justify-between items-center bg-[#162032] p-2 rounded">
                <span className="text-xs uppercase font-bold text-gray-500">Score</span>
                <span className="text-sm font-mono font-bold text-emerald-300">{agent.score}/100</span>
              </div>
            )}
            <div className="flex justify-between items-center bg-[#162032] p-2 rounded">
              <span className="text-xs uppercase font-bold text-gray-500">Location</span>
              <span className="text-xs font-mono text-gray-300">
                {agent.lat.toFixed(2)}, {agent.lng.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default AgentMarker;
