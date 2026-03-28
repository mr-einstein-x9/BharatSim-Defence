import React, { useMemo, useEffect, useState } from 'react';
import { DISASTER_ZONES } from '../data/districtData';

const ComparisonReport = ({ activeZonesA, activeZonesB, onClose }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation after render
    const t = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(t);
  }, []);

  const {
    metricsA,
    metricsB,
    overallWinner,
    winnerLabel,
    insights,
    exportText
  } = useMemo(() => {
    const calcMetrics = (zones) => {
      const avg = (arr) => arr.length ? Math.round(arr.reduce((sum, item) => sum + (item.score || 0), 0) / arr.length) : 0;
      
      const zData = zones.map(zone => {
        const army = zone.agents.filter(a => a.type === 'Army');
        const ndrf = zone.agents.filter(a => a.type === 'NDRF');
        const police = zone.agents.filter(a => a.type === 'Local Police');
        const doctors = zone.agents.filter(a => a.type === 'Doctors');
        const sc = zone.agents.filter(a => a.type === 'Supply Chain');
        const civs = zone.agents.filter(a => a.type === 'Civilians');

        return {
          overall: avg(zone.agents),
          speed: avg([{score: avg(army)}, {score: avg(ndrf)}]),
          coord: avg([{score: avg(army)}, {score: avg(ndrf)}, {score: avg(police)}]),
          cov: avg([{score: avg(doctors)}, {score: avg(sc)}]),
          sup: avg(sc),
          civ: avg(civs),
          totPop: (DISASTER_ZONES[zone.disasterId]?.affectedDistricts || []).reduce((sum, d) => sum + d.population, 0)
        };
      });

      const totPopAll = zData.reduce((sum, z) => sum + z.totPop, 0);
      let overallScore = 0;
      if (totPopAll > 0) {
        overallScore = Math.round(zData.reduce((sum, z) => sum + (z.overall * z.totPop), 0) / totPopAll);
      } else {
        overallScore = avg(zData.map(z => ({score: z.overall})));
      }

      return {
        overall: overallScore,
        speed: avg(zData.map(z => ({score: z.speed}))),
        coord: avg(zData.map(z => ({score: z.coord}))),
        cov: avg(zData.map(z => ({score: z.cov}))),
        sup: avg(zData.map(z => ({score: z.sup}))),
        civ: avg(zData.map(z => ({score: z.civ}))),
        totPopAll,
        zoneCount: zones.length
      };
    };

    const mA = calcMetrics(activeZonesA);
    const mB = calcMetrics(activeZonesB);

    const diff = mA.overall - mB.overall;
    let winner = 'draw';
    let label = '⚖️ DRAW';
    if (diff > 3) { winner = 'A'; label = '🔵 STRATEGY A WINS'; }
    else if (diff < -3) { winner = 'B'; label = '🔴 STRATEGY B WINS'; }

    let generatedInsights = [];
    if (mA.civ > mB.civ + 10) generatedInsights.push('Strategy A showed superior civilian protection.');
    else if (mB.civ > mA.civ + 10) generatedInsights.push('Strategy B showed superior civilian protection.');

    if (mA.sup < 50 && mB.sup >= 50) generatedInsights.push('Strategy A suffered severe supply chain blockages, possibly due to high severity configurations.');
    else if (mB.sup < 50 && mA.sup >= 50) generatedInsights.push('Strategy B suffered severe supply chain blockages, possibly due to high severity configurations.');

    if (mA.zoneCount === 3 && mB.zoneCount === 3) generatedInsights.push('Both strategies struggled with coordination scaling under maximum multi-zone stress.');

    if (winner === 'A') generatedInsights.push('Ultimately, Strategy A provided a more stable deployment distribution, resulting in fewer critical operational failures.');
    else if (winner === 'B') generatedInsights.push('Ultimately, Strategy B provided a more stable deployment distribution, resulting in fewer critical operational failures.');
    else if (winner === 'draw') generatedInsights.push('Both strategies yielded functionally identical outcomes. The variations in deployment tactics balanced each other out.');

    // Export text build
    const eText = `OpResponse Comparison Report\n--------------------------\nRESULT: ${label}\nOverall | A: ${mA.overall}/100 vs B: ${mB.overall}/100\nSpeed | A: ${mA.speed} | B: ${mB.speed}\nCoordination | A: ${mA.coord} | B: ${mB.coord}\nCoverage | A: ${mA.cov} | B: ${mB.cov}\nSupply | A: ${mA.sup} | B: ${mB.sup}\nCivilian | A: ${mA.civ} | B: ${mB.civ}\n--------------------------`;

    return { metricsA: mA, metricsB: mB, overallWinner: winner, winnerLabel: label, insights: generatedInsights, exportText: eText };
  }, [activeZonesA, activeZonesB]);

  const handleExport = () => {
    navigator.clipboard.writeText(exportText);
    alert('Copied specific comparison metrics to clipboard!');
  };

  const BarPair = ({ label, scoreA, scoreB }) => {
    let wA = animate ? `${scoreA}%` : '0%';
    let wB = animate ? `${scoreB}%` : '0%';
    return (
      <div className="mb-6">
        <div className="flex justify-between items-end mb-1">
          <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">{label}</span>
        </div>
        <div className="bg-[#0f1627] rounded-md p-3 border border-gray-800 space-y-3">
          {/* Strategy A Bar */}
          <div className="flex items-center">
            <span className="w-6 font-bold text-xs text-blue-400">A</span>
            <div className="flex-1 bg-[#1a2035] h-6 rounded-full overflow-hidden relative border border-gray-700">
              <div className="absolute top-0 left-0 h-full bg-[#3b82f6] transition-all duration-800 ease-out flex items-center justify-end pr-2 shadow-[0_0_10px_rgba(59,130,246,0.6)]" style={{ width: wA }}>
              </div>
            </div>
            <span className="w-12 text-right font-mono font-bold text-sm text-blue-300 flex justify-end gap-1">
              {scoreA} {scoreA > scoreB && <span className="text-emerald-400">✓</span>}
            </span>
          </div>
          {/* Strategy B Bar */}
          <div className="flex items-center">
            <span className="w-6 font-bold text-xs text-red-400">B</span>
            <div className="flex-1 bg-[#1a2035] h-6 rounded-full overflow-hidden relative border border-gray-700">
              <div className="absolute top-0 left-0 h-full bg-[#ef4444] transition-all duration-800 ease-out flex items-center justify-end pr-2 shadow-[0_0_10px_rgba(239,68,68,0.6)]" style={{ width: wB }}>
              </div>
            </div>
            <span className="w-12 text-right font-mono font-bold text-sm text-red-300 flex justify-end gap-1">
              {scoreB} {scoreB > scoreA && <span className="text-emerald-400">✓</span>}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const getWinnerClass = (sA, sB) => {
    if (sA > sB) return 'text-blue-400';
    if (sB > sA) return 'text-red-400';
    return 'text-gray-500';
  };
  const getWinnerLabel = (sA, sB) => {
    if (sA > sB) return 'Strategy A';
    if (sB > sA) return 'Strategy B';
    return 'Draw';
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#050810]/95 backdrop-blur-xl flex justify-center items-center overflow-auto py-12 px-6">
      <div className="w-full max-w-5xl bg-[#0a0f1e] border border-gray-800 rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-gray-500 to-red-600"></div>
        <div className={`absolute top-0 left-1/2 -ml-32 w-64 h-32 rounded-full blur-[80px] opacity-20 ${overallWinner === 'A' ? 'bg-blue-500' : overallWinner === 'B' ? 'bg-red-500' : 'bg-gray-500'}`}></div>

        <div className="p-10 relative z-10 flex flex-col gap-10">
          
          {/* Header */}
          <div className="text-center border-b border-gray-800/60 pb-8">
            <h1 className="text-4xl font-black text-white tracking-widest uppercase m-0 flex items-center justify-center gap-4">
              <span className="text-gray-500">⚔️</span> STRATEGY COMPARISON REPORT <span className="text-gray-500">⚔️</span>
            </h1>
          </div>

          {/* Section 1 - Winner Banner */}
          <div className={`py-6 px-4 rounded-2xl border text-center flex flex-col gap-4 shadow-lg ${overallWinner === 'A' ? 'bg-blue-900/10 border-blue-500/30 shadow-blue-500/10' : overallWinner === 'B' ? 'bg-red-900/10 border-red-500/30 shadow-red-500/10' : 'bg-gray-900/30 border-gray-700 shadow-gray-700/10'}`}>
            <h2 className={`text-5xl font-black uppercase tracking-widest m-0 drop-shadow-md ${overallWinner === 'A' ? 'text-blue-400' : overallWinner === 'B' ? 'text-red-400' : 'text-gray-300'}`}>
              {winnerLabel}
            </h2>
            <div className="flex justify-center items-center gap-12 font-mono mt-2">
              <span className="text-2xl font-bold text-blue-300">Strategy A: <span className="text-4xl text-blue-400">{metricsA.overall}</span>/100</span>
              <span className="text-gray-600 font-bold tracking-widest uppercase">VS</span>
              <span className="text-2xl font-bold text-red-300">Strategy B: <span className="text-4xl text-red-400">{metricsB.overall}</span>/100</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Section 2 - Bar Charts */}
            <div>
               <h3 className="text-lg font-bold text-gray-300 uppercase tracking-widest mb-6 border-b border-gray-800 pb-2">Metric Comparison</h3>
               <BarPair label="Speed Score" scoreA={metricsA.speed} scoreB={metricsB.speed} />
               <BarPair label="Coordination Score" scoreA={metricsA.coord} scoreB={metricsB.coord} />
               <BarPair label="Coverage Score" scoreA={metricsA.cov} scoreB={metricsB.cov} />
               <BarPair label="Supply Efficiency" scoreA={metricsA.sup} scoreB={metricsB.sup} />
               <BarPair label="Civilian Safety Score" scoreA={metricsA.civ} scoreB={metricsB.civ} />
            </div>

            <div className="flex flex-col gap-10">
              {/* Section 3 - Table */}
              <div>
                <h3 className="text-lg font-bold text-gray-300 uppercase tracking-widest mb-6 border-b border-gray-800 pb-2">Category Winners</h3>
                <div className="overflow-hidden rounded-xl border border-gray-800">
                  <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-[#121a2f] text-gray-300 uppercase font-mono text-xs border-b border-gray-800">
                      <tr>
                        <th className="px-6 py-3">Metric</th>
                        <th className="px-6 py-3 text-center text-blue-400">Strategy A</th>
                        <th className="px-6 py-3 text-center text-red-400">Strategy B</th>
                        <th className="px-6 py-3 text-right">Winner</th>
                      </tr>
                    </thead>
                    <tbody className="bg-[#0a0f1e] divide-y divide-gray-800/50 font-mono">
                      {[
                        {name:'Speed', a:metricsA.speed, b:metricsB.speed},
                        {name:'Coordination', a:metricsA.coord, b:metricsB.coord},
                        {name:'Coverage', a:metricsA.cov, b:metricsB.cov},
                        {name:'Supply Efficiency', a:metricsA.sup, b:metricsB.sup},
                        {name:'Civilian Safety', a:metricsA.civ, b:metricsB.civ}
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-[#121a2f]">
                          <td className="px-6 py-3 text-gray-300 font-sans font-semibold text-xs tracking-wider uppercase">{row.name}</td>
                          <td className="px-6 py-3 text-center text-blue-300">{row.a}</td>
                          <td className="px-6 py-3 text-center text-red-300">{row.b}</td>
                          <td className={`px-6 py-3 text-right font-bold uppercase text-xs ${getWinnerClass(row.a, row.b)}`}>{getWinnerLabel(row.a, row.b)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 4 - Insights */}
              <div>
                <h3 className="text-lg font-bold text-gray-300 uppercase tracking-widest mb-6 border-b border-gray-800 pb-2">Key Insights</h3>
                <div className="bg-[#121a2f] border border-gray-800 rounded-xl p-6">
                  <ul className="space-y-4 text-gray-300 list-none m-0 p-0 text-sm leading-relaxed">
                    {insights.map((obs, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <span className="text-emerald-500 mt-0.5">▪</span>
                        <span className="font-medium text-gray-200">{obs}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center gap-4 mt-6 border-t border-gray-800/60 pt-8">
            <button 
              onClick={handleExport}
              className="px-8 py-3 bg-[#121a2f] hover:bg-[#1a263c] text-emerald-400 font-bold rounded-lg text-sm uppercase tracking-widest border border-emerald-500/30 transition-all flex items-center gap-2"
            >
              <span>📋</span> Export Comparison
            </button>
            <button 
              onClick={onClose}
              className="px-12 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg text-sm uppercase tracking-widest border border-gray-600 shadow-xl transition-all"
            >
              Close Report
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ComparisonReport;
