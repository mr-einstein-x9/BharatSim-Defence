// src/types/index.ts

export type AgentType = 'Army' | 'NDRF' | 'Local Police' | 'Doctors' | 'Supply Chain' | 'Civilians';

export type AgentStatus = 'Standby' | 'Moving' | 'On Ground' | 'Completed' | 'Blocked';

export interface WeatherEffects {
  speedPenalty?: number;
}

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  emoji: string;
  color: string;
  dot: string;
  lat: number;
  lng: number;
  status: AgentStatus;
  score: number | null;
  zoneId: string;
  breakDown?: any;
  fuel?: number; // 0 to 100
  capacity?: number; // 0 to 100
  history?: {
    time: number;
    lat: number;
    lng: number;
    status: AgentStatus;
    score: number | null;
    fuel?: number;
  }[];
}

export interface DisasterZone {
  id: string;
  disasterId: string;
  severity: 'Low' | 'Medium' | 'High';
  name: string;
  region: string;
  lat: number;
  lng: number;
  weather?: {
    type: string;
    icon: string;
    effects: Record<string, WeatherEffects>;
  };
  agents: Agent[];
  triggeredChains: any[];
}

export interface SimulationState {
  currentScreen: 'setup' | 'simulation';
  simulationMode: 'single' | 'comparison';
  activeZonesA: DisasterZone[];
  activeZonesB: DisasterZone[];
  timeStepIndex: number;
  showReport: boolean;
  logs: LogEntry[];
}

export interface LogEntry {
  id: string;
  time: number; // Hour (0-72)
  message: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  zoneId?: string;
}

