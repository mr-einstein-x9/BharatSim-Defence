import React, { useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Circle, Tooltip } from 'react-leaflet';
import AgentMarker from './AgentMarker';
import { DisasterZone } from '../types';
import L from 'leaflet';
import { interpolateAgent } from '../utils/helpers';
import { useSimulationStore } from '../store/useSimulationStore';

interface MapPanelProps {
  zones: DisasterZone[];
  title?: string;
  tint?: 'blue' | 'red';
  simTime: number;
}

const MapPanel: React.FC<MapPanelProps> = ({ zones, title, tint, simTime }) => {
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    if (mapRef.current && zones && zones.length > 0) {
      const bounds = zones.map(z => [z.lat, z.lng] as [number, number]);
      if (bounds.length === 1) {
        mapRef.current.setView(bounds[0], 6, { animate: true, duration: 1.5 });
      } else {
        mapRef.current.fitBounds(bounds, { padding: [50, 50], animate: true, duration: 1.5 });
      }
    }
  }, [zones]);

  const interpolatedZones = useMemo(() => {
    return zones.map(zone => ({
      ...zone,
      agents: zone.agents.map(agent => interpolateAgent(agent, simTime))
    }));
  }, [zones, simTime]);

  if (!zones || zones.length === 0) return <div className="flex-1 w-full bg-[#0a0f1e]"></div>;

  const zoneColors = tint === 'blue' ? ['#3b82f6', '#60a5fa', '#93c5fd'] : tint === 'red' ? ['#ef4444', '#f87171', '#fca5a5'] : ['#ef4444', '#f97316', '#eab308'];

  return (
    <div className="flex-1 h-full relative z-10 bg-[#0a0f1e] overflow-hidden">
      {title && (
        <div className={`absolute top-6 left-6 z-[1000] bg-[#0a0f1e]/80 backdrop-blur-md px-6 py-3 rounded-lg border shadow-lg flex items-center gap-4 ${tint === 'blue' ? 'border-blue-500 shadow-blue-500/30' : 'border-red-500 shadow-red-500/30'}`}>
          <span className={`w-3 h-3 rounded-full animate-pulse ${tint === 'blue' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]'}`}></span>
          <h2 className="text-xl font-bold font-mono text-gray-200 tracking-widest uppercase m-0">
            {title}
          </h2>
          <span className="text-xs uppercase tracking-widest text-gray-500 font-mono ml-4">
            T+{Math.floor(simTime)}h
          </span>
        </div>
      )}

      <MapContainer center={[zones[0].lat, zones[0].lng]} zoom={5} className="w-full h-full" ref={mapRef} zoomControl={false}>
        <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        {interpolatedZones.map((zone, idx) => {
          const sRad = zone.severity === 'High' ? 120000 : zone.severity === 'Medium' ? 80000 : 50000;
          const color = zoneColors[idx % 3];
          return (
            <React.Fragment key={zone.id}>
              <Circle center={[zone.lat, zone.lng]} radius={sRad} pathOptions={{ color: color, fillColor: color, fillOpacity: 0.15, weight: 2, dashArray: '10, 10' }}>
                <Tooltip direction="bottom" opacity={0.9} className="bg-gray-900 border border-gray-700 text-white font-mono text-xs p-2 rounded">
                  <span className="font-bold text-gray-300">Zone {idx + 1}</span><br />
                  {zone.name} ({zone.severity})
                </Tooltip>
              </Circle>
              {zone.agents.map((agent) => (
                <AgentMarker key={agent.id} agent={agent} tint={tint} />
              ))}
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};

interface MapViewProps {
  simulationMode: 'single' | 'comparison';
  activeZonesA: DisasterZone[];
  activeZonesB: DisasterZone[];
}

const MapView: React.FC<MapViewProps> = ({ simulationMode, activeZonesA, activeZonesB }) => {
  const { simTime } = useSimulationStore();

  if (simulationMode === 'comparison') {
    return (
      <div className="flex-1 w-full h-full flex divide-x divide-gray-800">
        <MapPanel zones={activeZonesA} title="Strategy A" tint="blue" simTime={simTime} />
        <MapPanel zones={activeZonesB} title="Strategy B" tint="red" simTime={simTime} />
      </div>
    );
  }

  return <MapPanel zones={activeZonesA} title="OpResponse ACTIVE" simTime={simTime} />;
};

export default MapView;
