import React, { useState } from 'react';
import { DISASTERS } from '../utils/constants';
import { WEATHER_CONDITIONS } from '../data/weatherData';

const SetupScreen = ({ onLaunch }) => {
  const [disasterId, setDisasterId] = useState(DISASTERS[0].id);
  const [severity, setSeverity] = useState('Medium');
  const weather = WEATHER_CONDITIONS[disasterId];

  const handleLaunch = () => {
    onLaunch(disasterId, severity);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0f1e] text-white p-6">
      <div className="w-full max-w-lg bg-[#0f1627] rounded-xl shadow-2xl p-8 border border-gray-800">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-2">
            🪖 OpResponse
          </h1>
          <p className="text-gray-400 font-medium tracking-wide">
            India Disaster Response Simulator
          </p>
        </div>

        <div className="space-y-8">
          {/* Disaster Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 uppercase tracking-widest mb-3">
              Select Disaster Area
            </label>
            <select
              className="w-full bg-[#162032] border border-gray-700 text-white text-lg rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all cursor-pointer"
              value={disasterId}
              onChange={(e) => setDisasterId(e.target.value)}
            >
              {DISASTERS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} — {d.region}
                </option>
              ))}
            </select>
          </div>

          {/* Weather Preview */}
          {weather && (
            <div className="mt-4 p-4 bg-[#121a2f] border border-gray-700/80 rounded-lg text-sm text-gray-300 flex items-center gap-3 shadow-inner">
              <span className="text-2xl">{weather.icon}</span>
              <div className="font-mono text-[13px]">
                <span className="font-bold text-gray-200">Expected Conditions:</span> {weather.type} <span className="text-gray-600 mx-1">|</span> Wind: {weather.windSpeed} <span className="text-gray-600 mx-1">|</span> Visibility: {weather.visibility}
              </div>
            </div>
          )}

          {/* Severity Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 uppercase tracking-widest mb-3">
              Initial Severity
            </label>
            <div className="flex gap-4">
              {['Low', 'Medium', 'High'].map((level) => (
                <button
                  key={level}
                  onClick={() => setSeverity(level)}
                  className={`flex-1 py-3 rounded-lg font-bold transition-all border ${
                    severity === level
                      ? level === 'High'
                        ? 'bg-red-900 border-red-500 text-red-100 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                        : level === 'Medium'
                        ? 'bg-yellow-900 border-yellow-500 text-yellow-100 shadow-[0_0_15px_rgba(234,179,8,0.3)]'
                        : 'bg-green-900 border-green-500 text-green-100 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                      : 'bg-[#162032] border-gray-700 text-gray-400 hover:bg-[#1a263c]'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <button
            onClick={handleLaunch}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-lg text-lg uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all transform hover:-translate-y-1 active:translate-y-0"
          >
            Launch Simulation
          </button>
        </div>
      </div>

      <div className="mt-8 text-gray-600 text-sm font-mono flex gap-6">
        <span>STATUS: SYSTEM ONLINE</span>
        <span>AUTH: VALIDATED</span>
      </div>
    </div>
  );
};

export default SetupScreen;
