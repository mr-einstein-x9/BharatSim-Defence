import React from 'react';
import { LogEntry } from '../types';

interface CommandLogProps {
  logs: LogEntry[];
  simTime: number;
}

const CommandLog: React.FC<CommandLogProps> = ({ logs, simTime }) => {
  const visibleLogs = logs.filter(log => log.time <= simTime);

  return (
    <div className="bg-brand-darker border border-brand-border rounded-xl flex flex-col h-64 shadow-inner overflow-hidden">
      <div className="px-3 py-2 border-b border-brand-border bg-brand-medium flex justify-between items-center">
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] m-0">
          🛰️ Real-time Command Log
        </h3>
        <span className="text-[8px] font-mono text-emerald-500 animate-pulse">LIVE FEED</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 font-mono text-[10px] space-y-2 scrollbar-thin scrollbar-thumb-gray-800">
        {visibleLogs.length === 0 && (
          <div className="text-gray-600 italic text-center mt-4">Waiting for incoming data...</div>
        )}
        {visibleLogs.map((log) => (
          <div key={log.id} className={`flex gap-2 p-1.5 rounded border-l-2 transition-all duration-300 ${
            log.type === 'warning' ? 'bg-orange-900/10 border-orange-500/50 text-orange-200' :
            log.type === 'danger' ? 'bg-red-900/10 border-red-500/50 text-red-200' :
            log.type === 'success' ? 'bg-emerald-900/10 border-emerald-500/50 text-emerald-200' :
            'bg-blue-900/10 border-blue-500/50 text-blue-200'
          }`}>
            <span className="text-gray-500 shrink-0">[{Math.floor(log.time)}h]</span>
            <span className="flex-1">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommandLog;
