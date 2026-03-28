import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Circle } from 'react-leaflet';
import AgentMarker from './AgentMarker';


const MapView = ({ disaster, agents, severity }) => {
  const mapRef = useRef(null);

  // Update map view when disaster changes
  useEffect(() => {
    if (mapRef.current && disaster) {
      mapRef.current.setView([disaster.lat, disaster.lng], 7, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [disaster]);

  const severityRadius = severity === 'High' ? 120000 : severity === 'Medium' ? 80000 : 50000;

  return (
    <div className="flex-1 w-full h-full relative z-10 bg-[#0a0f1e]">
      {/* Absolute overlay for "SIMULATION ACTIVE" */}
      <div className="absolute top-6 left-6 z-[1000] bg-[#0a0f1e]/80 backdrop-blur-md px-6 py-3 rounded-lg border border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] flex items-center gap-4">
        <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span>
        <h2 className="text-xl font-bold font-mono text-red-400 tracking-widest uppercase m-0">
          OpResponse ACTIVE
        </h2>
        <span className="text-sm uppercase tracking-widest text-gray-400 font-mono ml-4">
          Zone: {disaster.region}
        </span>
      </div>

      <MapContainer
        center={[disaster.lat, disaster.lng]}
        zoom={7}
        className="w-full h-full"
        ref={mapRef}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Disaster Impact Zone Overlay */}
        <Circle
          center={[disaster.lat, disaster.lng]}
          radius={severityRadius}
          pathOptions={{
            color: '#ef4444',
            fillColor: '#ef4444',
            fillOpacity: 0.2,
            weight: 2,
            dashArray: '10, 10',
          }}
        />
        
        {/* Render Agents */}
        {agents.map((agent) => (
          <AgentMarker key={agent.id} agent={agent} />
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
