import React, { useMemo } from 'react';
import { DISASTER_ZONES } from '../data/districtData';

const ReportModal = ({ activeZones, onClose }) => {
  const {
    combinedOverall,
    combinedSpeed,
    combinedCoord,
    combinedCov,
    combinedSup,
    combinedCiv,
    totalPopAllZones,
    zonesData,
    observations,
    recommendation,
  } = useMemo(() => {
    const avg = (arr) => arr.length ? Math.round(arr.reduce((sum, item) => sum + (item.score || 0), 0) / arr.length) : 0;

    const zData = activeZones.map(zone => {
      const army = zone.agents.filter(a => a.type === 'Army');
      const ndrf = zone.agents.filter(a => a.type === 'NDRF');
      const police = zone.agents.filter(a => a.type === 'Local Police');
      const doctors = zone.agents.filter(a => a.type === 'Doctors');
      const sc = zone.agents.filter(a => a.type === 'Supply Chain');
      const civs = zone.agents.filter(a => a.type === 'Civilians');

      const speedScore = avg([{score: avg(army)}, {score: avg(ndrf)}]);
      const coordScore = avg([{score: avg(army)}, {score: avg(ndrf)}, {score: avg(police)}]);
      const covScore = avg([{score: avg(doctors)}, {score: avg(sc)}]);
      const supScore = avg(sc);
      const civScore = avg(civs);
      const overallScore = avg(zone.agents);
      
      const popData = DISASTER_ZONES[zone.disasterId]?.affectedDistricts || [];
      const totalPop = popData.reduce((sum, d) => sum + d.population, 0);

      return { ...zone, speedScore, coordScore, covScore, supScore, civScore, overallScore, totalPop, popData };
    });

    const totPop = zData.reduce((sum, z) => sum + z.totalPop, 0);

    let cOverall = 0;
    if (totPop > 0) {
      cOverall = Math.round(zData.reduce((sum, z) => sum + (z.overallScore * z.totalPop), 0) / totPop);
    } else {
      cOverall = avg(zData.map(z => ({score: z.overallScore})));
    }

    const cSpeed = avg(zData.map(z => ({score: z.speedScore})));
    const cCoord = avg(zData.map(z => ({score: z.coordScore})));
    const cCov = avg(zData.map(z => ({score: z.covScore})));
    const cSup = avg(zData.map(z => ({score: z.supScore})));
    const cCiv = avg(zData.map(z => ({score: z.civScore})));

    let obs = [];
    
    // Multi-zone specific observations
    if (zData.length === 3) {
      obs.push('⚠️ Triple disaster scenario critically stretched national response capacity.');
    } else if (zData.length === 2) {
      obs.push('⚠️ Split resources reduced effectiveness across both operational theatres.');
    }

    if (zData.length > 1) {
      const maxZ = [...zData].sort((a, b) => b.overallScore - a.overallScore)[0];
      const minZ = [...zData].sort((a, b) => a.overallScore - b.overallScore)[0];
      if ((maxZ.overallScore - minZ.overallScore) > 20) {
        obs.push(`⚠️ Resource allocation was uneven — Zone ${activeZones.findIndex(z=>z.id===maxZ.id)+1} (${maxZ.name}) received disproportionate support.`);
      }
    }

    // Global performance rules
    if (cCiv < 50) obs.push('❌ Civilian safety was critically compromised globally.');
    if (cSup < 50) obs.push('⚠️ Supply chains faced severe multi-regional blockages.');
    if (cOverall >= 75) obs.push('⭐ Multi-theatre operation was largely successful overall.');
    else if (cOverall < 50) obs.push('❌ Systemic multi-regional failures recorded in coordination grid.');

    // Pad observations
    while (obs.length < 4) {
      obs.push('ℹ️ Standard protocol followed for remaining designated sectors.');
    }
    obs = obs.slice(0, 4);

    let rec = '';
    if (cOverall > 75) {
      rec = 'The combined operation demonstrated strong inter-agency coordination across all active theaters. Centralized command allocated resources efficiently despite multi-front demands. Continue utilizing this robust framework for future catastrophic events.';
    } else if (cOverall >= 40) {
      rec = 'The multi-zone operation showed moderate effectiveness with clear room for improvement. Inter-agency communication requires refinement. Review severity-based deployment scaling to prevent resource starvation in high-risk zones.';
    } else {
      rec = 'Critical failures were observed across multiple sectors. Major restructuring of response protocol is immediately recommended. National reserve reserves must be expanded to handle simultaneous multi-regional disasters of this scale.';
    }

    return {
      combinedOverall: cOverall,
      combinedSpeed: cSpeed,
      combinedCoord: cCoord,
      combinedCov: cCov,
      combinedSup: cSup,
      combinedCiv: cCiv,
      totalPopAllZones: totPop,
      zonesData: zData,
      observations: obs,
      recommendation: rec,
    };
  }, [activeZones]);

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
      <div className="w-full max-w-6xl bg-[#0a0f1e] border border-gray-800 rounded-2xl shadow-2xl relative mt-32 md:mt-0 max-h-[90vh] overflow-y-auto">
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-emerald-400 to-blue-600"></div>
        <div className={`absolute top-0 left-1/2 -ml-32 w-64 h-32 rounded-full blur-[80px] opacity-30 ${combinedOverall >= 70 ? 'bg-emerald-500' : combinedOverall >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>

        <div className="p-10 relative z-10 flex flex-col gap-10">
          
          {/* Header Section */}
          <div className="text-center border-b border-gray-800/60 pb-8">
            <h1 className="text-5xl font-black text-white tracking-widest uppercase m-0 flex items-center justify-center gap-4">
              <span className="text-blue-500">🛡️</span> OPERATION REPORT <span className="text-blue-500">🛡️</span>
            </h1>
            
            <div className="mt-8 mb-6 inline-block bg-gradient-to-r from-red-900/40 via-orange-900/40 to-red-900/40 border border-orange-500/30 px-8 py-3 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.15)]">
              <p className="text-orange-400 font-bold tracking-widest uppercase text-sm m-0 flex items-center gap-2">
                <span className="text-xl">🌏</span> Total Population At Risk: {(totalPopAllZones / 100000).toFixed(2)} Lakh <span className="text-orange-500/60 lowercase tracking-normal font-medium">(across all active zones)</span>
              </p>
            </div>

            <div className="flex justify-center items-center gap-6">
              <span className="text-gray-400 font-bold uppercase tracking-[0.2em] text-center max-w-xs">Global Combined Effectiveness (Weighted)</span>
              <span className={`text-6xl font-black font-mono drop-shadow-2xl ${getScoreColor(combinedOverall)}`}>
                {combinedOverall}<span className="text-3xl text-gray-600">/100</span>
              </span>
            </div>
          </div>

          {/* Zones Overview */}
          <div className="border-b border-gray-800/60 pb-8 relative">
             <h2 className="text-xl font-bold text-gray-300 uppercase tracking-widest mb-6">Regional Scorecards</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {zonesData.map((z, i) => (
                  <div key={z.id} className={`p-5 rounded-xl border ${getCardBg(z.overallScore)}`}>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Zone {i + 1}</div>
                    <div className="text-lg font-bold text-gray-200 uppercase mb-4 h-14">{z.name} <br/><span className="text-xs text-gray-400 normal-case">({z.severity} Severity)</span></div>
                    
                    <div className="flex justify-between items-center border-t border-gray-800/50 pt-4 mb-2">
                       <span className="text-xs text-gray-400 font-bold uppercase">Pop. At Risk:</span>
                       <span className="text-sm font-mono text-yellow-400">{(z.totalPop / 100000).toFixed(2)} L</span>
                    </div>

                    <div className="flex justify-between items-center">
                       <span className="text-sm text-gray-300 font-bold uppercase">Zone Score:</span>
                       <span className={`text-3xl font-mono font-black ${getScoreColor(z.overallScore)}`}>{z.overallScore}</span>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
            {/* Left Column - Breakdown */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-lg font-bold text-gray-300 uppercase tracking-widest mb-4">Total Metric Breakdown</h2>
              
              <div className={`p-4 rounded-xl border ${getCardBg(combinedSpeed)} flex justify-between items-center`}>
                <span className="font-semibold text-gray-300 uppercase text-xs">Speed Score</span>
                <span className={`font-mono font-bold text-lg ${getScoreColor(combinedSpeed)}`}>{combinedSpeed}</span>
              </div>
              <div className={`p-4 rounded-xl border ${getCardBg(combinedCoord)} flex justify-between items-center`}>
                <span className="font-semibold text-gray-300 uppercase text-xs">Coordination</span>
                <span className={`font-mono font-bold text-lg ${getScoreColor(combinedCoord)}`}>{combinedCoord}</span>
              </div>
              <div className={`p-4 rounded-xl border ${getCardBg(combinedCov)} flex justify-between items-center`}>
                <span className="font-semibold text-gray-300 uppercase text-xs">Coverage</span>
                <span className={`font-mono font-bold text-lg ${getScoreColor(combinedCov)}`}>{combinedCov}</span>
              </div>
              <div className={`p-4 rounded-xl border ${getCardBg(combinedSup)} flex justify-between items-center`}>
                <span className="font-semibold text-gray-300 uppercase text-xs">Supply Efficiency</span>
                <span className={`font-mono font-bold text-lg ${getScoreColor(combinedSup)}`}>{combinedSup}</span>
              </div>
              <div className={`p-4 rounded-xl border ${getCardBg(combinedCiv)} flex justify-between items-center`}>
                <span className="font-semibold text-gray-300 uppercase text-xs">Civilian Safety</span>
                <span className={`font-mono font-bold text-lg ${getScoreColor(combinedCiv)}`}>{combinedCiv}</span>
              </div>
            </div>

            {/* Middle Column - Analytics & Recommendations */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-lg font-bold text-gray-300 uppercase tracking-widest mb-4">Global Observations</h2>
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
            
            {zonesData.map((z, i) => (
              <div key={z.id} className="mb-8 border border-gray-800 rounded-xl overflow-hidden">
                <div className="bg-[#1a263c] px-6 py-3 border-b border-gray-800/50 flex justify-between items-center">
                   <h3 className="font-bold text-gray-300 uppercase tracking-wider text-sm m-0 flex gap-2">
                     <span className="text-gray-500">Zone {i + 1}</span> 
                     <span className="text-gray-400">|</span> 
                     {z.name}
                   </h3>
                   <span className={`text-xs font-mono font-bold px-2 py-1 rounded bg-black/40 ${getScoreColor(z.overallScore)}`}>
                     SCORE: {z.overallScore}
                   </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-[#121a2f] text-gray-300 uppercase font-mono text-[10px] border-b border-gray-800">
                      <tr>
                        <th className="px-6 py-3 w-16">Unit</th>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Type</th>
                        <th className="px-6 py-3">Final Status</th>
                        <th className="px-6 py-3 text-right">Score</th>
                      </tr>
                    </thead>
                    <tbody className="bg-[#0a0f1e] divide-y divide-gray-800/50">
                      {z.agents.map((agent) => (
                        <tr key={agent.id} className="hover:bg-[#121a2f] transition-colors">
                          <td className="px-6 py-3 text-xl">{agent.emoji}</td>
                          <td className="px-6 py-3 font-semibold text-gray-200">{agent.name}</td>
                          <td className="px-6 py-3 uppercase tracking-wider text-[10px]">{agent.type}</td>
                          <td className="px-6 py-3 font-bold text-[10px] uppercase tracking-wider">
                            <span className={agent.status === 'Completed' ? 'text-green-400' : agent.status === 'Blocked' ? 'text-red-400' : 'text-blue-400'}>
                              {agent.status}
                            </span>
                          </td>
                          <td className={`px-6 py-3 text-right font-mono font-bold text-sm ${getScoreColor(agent.score)}`}>
                            {agent.score}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-2">
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
