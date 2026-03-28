import React, { useMemo } from 'react';
import { DISASTER_ZONES } from '../data/districtData';

const ReportModal = ({ agents, disaster, onClose }) => {
  const {
    overall,
    speed,
    coordination,
    coverage,
    supply,
    civilian,
    observations,
    recommendation,
    popData,
    totalPop,
  } = useMemo(() => {
    // Group agents
    const army = agents.filter(a => a.type === 'Army');
    const ndrf = agents.filter(a => a.type === 'NDRF');
    const police = agents.filter(a => a.type === 'Local Police');
    const doctors = agents.filter(a => a.type === 'Doctors');
    const sc = agents.filter(a => a.type === 'Supply Chain');
    const civs = agents.filter(a => a.type === 'Civilians');

    // Helper to calc average score of a group
    const avg = (arr) => Math.round(arr.reduce((sum, a) => sum + (a.score || 0), 0) / (arr.length || 1));

    const speedScore = avg([...army, ...ndrf]);
    const coordScore = avg([...army, ...ndrf, ...police]);
    const covScore = avg([...doctors, ...sc]);
    const supScore = avg(sc);
    const civScore = avg(civs);
    const overallScore = Math.round(agents.reduce((sum, a) => sum + (a.score || 0), 0) / agents.length);

    // Generate observations based on rules
    let obs = [];
    if (sc.some(a => a.status === 'Blocked')) {
      obs.push('⚠️ Supply chain faced blockage — civilian aid delayed.');
    }
    if (avg(army) > 85) {
      obs.push('✅ Army response was exceptionally fast.');
    }
    if (civScore < 50) {
      obs.push('❌ Civilian safety was critically compromised.');
    }

    let popData = null;
    let totalPop = 0;
    if (disaster && disaster.id && DISASTER_ZONES[disaster.id]) {
      popData = DISASTER_ZONES[disaster.id].affectedDistricts;
      totalPop = popData.reduce((sum, d) => sum + d.population, 0);
      
      if (totalPop > 5000000) {
        obs.push('⚠️ High population density significantly increased civilian protection difficulty.');
      } else if (totalPop > 0 && totalPop < 2000000) {
        obs.push('✅ Relatively low population density aided civilian evacuation efforts.');
      }
    }

    if (overallScore >= 75) {
      obs.push('⭐ Operation was largely successful overall.');
    } else if (overallScore >= 50 && obs.length < 4) {
      obs.push('⚠️ Mixed effectiveness reported across operational units.');
    } else if (overallScore < 50 && obs.length < 4) {
      obs.push('❌ Systemic failures recorded in coordination grid.');
    }

    // Pad observations to exactly 4 if needed
    while (obs.length < 4) {
      obs.push('ℹ️ Standard protocol followed for remaining sectors.');
    }
    obs = obs.slice(0, 4);

    let rec = '';
    if (overallScore > 75) {
      rec = 'The operation demonstrated strong inter-agency coordination. Initial deployment times were optimal, and the casualty rate was strictly minimized. Continue utilizing this robust framework for future high-severity catastrophic events.';
    } else if (overallScore >= 40) {
      rec = 'The operation showed moderate effectiveness with clear room for improvement. Inter-agency communication requires refinement, specifically regarding supply chain resilience in contested or severely damaged terrain. Review deployment latency.';
    } else {
      rec = 'Critical failures were observed across multiple sectors. Major restructuring of response protocol is immediately recommended. Supply routes and civilian evacuation mandates must be overhauled before the next crisis.';
    }

    return {
      overall: overallScore,
      speed: speedScore,
      coordination: coordScore,
      coverage: covScore,
      supply: supScore,
      civilian: civScore,
      observations: obs,
      recommendation: rec,
      popData,
      totalPop,
    };
  }, [agents, disaster]);

  const getScoreColor = (sc) => {
    if (sc >= 70) return 'text-green-400';
    if (sc >= 40) return 'text-yellow-400';
    return 'text-red-500';
  };

  const getCardBg = (sc) => {
    if (sc >= 70) return 'border-emerald-500/30 bg-emerald-900/10 shadow-[0_4px_15px_rgba(16,185,129,0.1)]';
    if (sc >= 40) return 'border-yellow-500/30 bg-yellow-900/10 shadow-[0_4px_15px_rgba(234,179,8,0.1)]';
    return 'border-red-500/30 bg-red-900/10 shadow-[0_4px_15px_rgba(239,68,68,0.1)]';
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#050810]/95 backdrop-blur-xl flex justify-center items-center overflow-auto py-12 px-6">
      <div className="w-full max-w-5xl bg-[#0a0f1e] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden relative">
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-emerald-400 to-blue-600"></div>
        <div className={`absolute top-0 left-1/2 -ml-32 w-64 h-32 rounded-full blur-[80px] opacity-30 ${overall >= 70 ? 'bg-emerald-500' : overall >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>

        <div className="p-10 relative z-10 flex flex-col gap-10">
          
          {/* Header Section */}
          <div className="text-center border-b border-gray-800/60 pb-8">
            <h1 className="text-5xl font-black text-white tracking-widest uppercase m-0 flex items-center justify-center gap-4">
              <span className="text-blue-500">🛡️</span> OPERATION REPORT <span className="text-blue-500">🛡️</span>
            </h1>
            <div className="mt-8 flex justify-center items-center gap-6">
              <span className="text-gray-400 font-bold uppercase tracking-[0.2em]">Overall Effectiveness</span>
              <span className={`text-6xl font-black font-mono drop-shadow-2xl ${getScoreColor(overall)}`}>
                {overall}<span className="text-3xl text-gray-600">/100</span>
              </span>
            </div>
          </div>

          {popData && (
            <div className="border-t border-b border-gray-800/60 py-8 relative">
              <h2 className="text-xl font-bold text-gray-300 uppercase tracking-widest mb-6">Affected Population</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="overflow-x-auto rounded-xl border border-gray-800">
                  <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-[#121a2f] text-gray-300 uppercase font-mono text-xs border-b border-gray-800">
                      <tr>
                        <th className="px-6 py-4">District</th>
                        <th className="px-6 py-4 text-right">Population</th>
                      </tr>
                    </thead>
                    <tbody className="bg-[#0a0f1e] divide-y divide-gray-800/50">
                      {popData.map((d, i) => (
                        <tr key={i} className="hover:bg-[#121a2f]">
                          <td className="px-6 py-3 font-semibold text-gray-200">{d.name}</td>
                          <td className="px-6 py-3 text-right font-mono">{(d.population / 100000).toFixed(2)} Lakh</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-col items-center justify-center space-y-4">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">Total At Risk</span>
                  <span className={`text-6xl font-black font-mono drop-shadow-2xl ${totalPop > 2000000 ? 'text-red-500' : totalPop >= 1000000 ? 'text-orange-400' : 'text-yellow-400'}`}>
                    {(totalPop / 100000).toFixed(2)} <span className="text-2xl text-gray-500">Lakh</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Breakdown */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-lg font-bold text-gray-300 uppercase tracking-widest mb-4">Metric Breakdown</h2>
              
              <div className={`p-4 rounded-xl border ${getCardBg(speed)} flex justify-between items-center`}>
                <span className="font-semibold text-gray-300 uppercase text-xs">Speed Score</span>
                <span className={`font-mono font-bold text-lg ${getScoreColor(speed)}`}>{speed}</span>
              </div>
              <div className={`p-4 rounded-xl border ${getCardBg(coordination)} flex justify-between items-center`}>
                <span className="font-semibold text-gray-300 uppercase text-xs">Coordination</span>
                <span className={`font-mono font-bold text-lg ${getScoreColor(coordination)}`}>{coordination}</span>
              </div>
              <div className={`p-4 rounded-xl border ${getCardBg(coverage)} flex justify-between items-center`}>
                <span className="font-semibold text-gray-300 uppercase text-xs">Coverage</span>
                <span className={`font-mono font-bold text-lg ${getScoreColor(coverage)}`}>{coverage}</span>
              </div>
              <div className={`p-4 rounded-xl border ${getCardBg(supply)} flex justify-between items-center`}>
                <span className="font-semibold text-gray-300 uppercase text-xs">Supply Efficiency</span>
                <span className={`font-mono font-bold text-lg ${getScoreColor(supply)}`}>{supply}</span>
              </div>
              <div className={`p-4 rounded-xl border ${getCardBg(civilian)} flex justify-between items-center`}>
                <span className="font-semibold text-gray-300 uppercase text-xs">Civilian Safety</span>
                <span className={`font-mono font-bold text-lg ${getScoreColor(civilian)}`}>{civilian}</span>
              </div>
            </div>

            {/* Middle Column - Analytics & Recommendations */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-lg font-bold text-gray-300 uppercase tracking-widest mb-4">Key Observations</h2>
                <div className="bg-[#121a2f] border border-gray-800 rounded-xl p-6">
                  <ul className="space-y-4 text-gray-300 list-none m-0 p-0 text-sm leading-relaxed">
                    {observations.map((obs, i) => (
                      <li key={i} className="flex gap-3">
                        {obs.startsWith('✅') ? '✅' : obs.startsWith('❌') ? '❌' : obs.startsWith('⚠️') ? '⚠️' : 'ℹ️'}
                        <span className="font-medium">{obs.replace(/^[✅❌⚠️ℹ️]\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-300 uppercase tracking-widest mb-4">Strategic Assessment</h2>
                <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-6 relative overflow-hidden">
                  <p className="text-blue-100/90 leading-relaxed font-medium m-0 relative z-10 text-sm">
                    {recommendation}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Full Agent Table */}
          <div className="mt-8 border-t border-gray-800/60 pt-10">
            <h2 className="text-lg font-bold text-gray-300 uppercase tracking-widest mb-6">Agent Performance Roster</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-800">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-[#121a2f] text-gray-300 uppercase font-mono text-xs border-b border-gray-800">
                  <tr>
                    <th className="px-6 py-4">Unit</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Final Status</th>
                    <th className="px-6 py-4 text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="bg-[#0a0f1e] divide-y divide-gray-800/50">
                  {agents.map((agent) => (
                    <tr key={agent.id} className="hover:bg-[#121a2f] transition-colors">
                      <td className="px-6 py-4 text-2xl">{agent.emoji}</td>
                      <td className="px-6 py-4 font-semibold text-gray-200">{agent.name}</td>
                      <td className="px-6 py-4 uppercase tracking-wider text-xs">{agent.type}</td>
                      <td className="px-6 py-4 font-bold text-xs uppercase tracking-wider">
                        <span className={agent.status === 'Completed' ? 'text-green-400' : agent.status === 'Blocked' ? 'text-red-400' : 'text-blue-400'}>
                          {agent.status}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-right font-mono font-bold text-lg ${getScoreColor(agent.score)}`}>
                        {agent.score}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="flex justify-center mt-6">
            <button 
              onClick={onClose}
              className="px-12 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg text-lg uppercase tracking-widest border border-gray-600 shadow-xl transition-all"
            >
              Close Report
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReportModal;
