import React from 'react';
import { TIME_STEPS } from '../utils/constants';

const Sidebar = ({ timeStepIndex, agents, nextStep, generateReport, onReset }) => {
  const currentStepLabel = TIME_STEPS[timeStepIndex];
  const isFinished = timeStepIndex === TIME_STEPS.length - 1;

  // Sorting agents by type so they appear grouped
  const sortedAgents = [...agents].sort((a, b) => a.type.localeCompare(b.type));

  return (
    <div className="w-80 h-full bg-[#0f1627] border-r border-gray-800 flex flex-col text-white shadow-2xl relative z-20">
      {/* Header */}
      <div className="p-6 border-b border-gray-800 bg-[#0a0f1e]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
            🪖 STATUS
          </h2>
          <button
            onClick={onReset}
            className="text-xs bg-gray-800 hover:bg-red-800 text-gray-300 py-1 px-3 rounded shadow transition-colors"
          >
            Reset
          </button>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-semibold tracking-widest text-gray-500 uppercase">
            Current Time
          </span>
          <span className="text-2xl font-mono font-bold text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]">
            {currentStepLabel}
          </span>
        </div>
      </div>

      {/* Agent List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
                <p className="font-semibold text-sm text-gray-200">
                  {agent.name}
                </p>
                <p className="text-xs text-gray-400">{agent.type}</p>
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

      {/* Actions */}
      <div className="p-6 border-t border-gray-800 bg-[#0a0f1e] space-y-4">
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
