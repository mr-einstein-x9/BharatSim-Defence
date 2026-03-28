import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Circle, Tooltip } from 'react-leaflet';
import AgentMarker from './AgentMarker';

const MapView = ({ activeZones }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && activeZones.length > 0) {
      // Find bounding box for all active zones to frame them all
      const bounds = activeZones.map(z => [z.lat, z.lng]);
      if (bounds.length === 1) {
        mapRef.current.setView(bounds[0], 6, { animate: true, duration: 1.5 });
      } else {
        mapRef.current.fitBounds(bounds, { padding: [50, 50], animate: true, duration: 1.5 });
      }
    }
  }, [activeZones]);

  if (!activeZones || activeZones.length === 0) return null;

  const zoneColors = ['#ef4444', '#f97316', '#eab308'];

  return (
    <div className="flex-1 w-full h-full relative z-10 bg-[#0a0f1e]">
      <div className="absolute top-6 left-6 z-[1000] bg-[#0a0f1e]/80 backdrop-blur-md px-6 py-3 rounded-lg border border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] flex items-center gap-4">
        <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span>
        <h2 className="text-xl font-bold font-mono text-red-400 tracking-widest uppercase m-0">
          OpResponse ACTIVE
        </h2>
        <span className="text-sm uppercase tracking-widest text-gray-400 font-mono ml-4">
          {activeZones.length} Zone{activeZones.length > 1 ? 's' : ''} Active
        </span>
      </div>

      <MapContainer
        center={[activeZones[0].lat, activeZones[0].lng]}
        zoom={5}
        className="w-full h-full"
        ref={mapRef}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {activeZones.map((zone, idx) => {
          const sRad = zone.severity === 'High' ? 120000 : zone.severity === 'Medium' ? 80000 : 50000;
          const color = zoneColors[idx % 3];

          return (
            <React.Fragment key={zone.id}>
              {/* Disaster Impact Zone Overlay */}
              <Circle
                center={[zone.lat, zone.lng]}
                radius={sRad}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: 0.15,
                  weight: 2,
                  dashArray: '10, 10',
                }}
              >
                <Tooltip direction="bottom" opacity={0.9} className="bg-gray-900 border border-gray-700 text-white font-mono text-xs p-2 rounded">
                  <span className="font-bold text-gray-300">Zone {idx + 1}</span><br />
                  {zone.name} ({zone.severity})
                </Tooltip>
              </Circle>
              
              {/* Render Agents for this Zone */}
              {zone.agents.map((agent) => (
                <AgentMarker key={agent.id} agent={agent} />
              ))}
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
