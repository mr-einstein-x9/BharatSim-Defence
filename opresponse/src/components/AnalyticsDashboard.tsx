import React, { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { DisasterZone } from '../types';

interface AnalyticsDashboardProps {
  activeZones: DisasterZone[];
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ activeZones }) => {
  const chartData = useMemo(() => {
    const timePoints = [0, 6, 24, 72];
    return timePoints.map(t => {
      let totalScore = 0;
      let count = 0;
      let civilianSafety = 0;
      let civCount = 0;

      activeZones.forEach(zone => {
        zone.agents.forEach(agent => {
          const histAtT = agent.history?.find(h => h.time === t);
          if (histAtT && histAtT.score !== null) {
            totalScore += histAtT.score;
            count++;
            if (agent.type === 'Civilians') {
              civilianSafety += histAtT.score;
              civCount++;
            }
          }
        });
      });

      return {
        time: `T+${t}h`,
        avgScore: count > 0 ? Math.round(totalScore / count) : (t === 0 ? 100 : 0),
        civilianSafety: civCount > 0 ? Math.round(civilianSafety / civCount) : (t === 0 ? 100 : 0)
      };
    });
  }, [activeZones]);

  return (
    <div className="bg-brand-dark border border-brand-border rounded-xl p-4 shadow-xl">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
        📊 Performance Analytics
      </h3>
      
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorCiv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#12244a" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#475569" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#475569" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#152e5f', border: '1px solid #12244a', borderRadius: '8px', fontSize: '10px' }}
              itemStyle={{ color: '#f1f5f9' }}
            />
            <Area 
              type="monotone" 
              dataKey="avgScore" 
              name="Op Effectiveness"
              stroke="#10b981" 
              fillOpacity={1} 
              fill="url(#colorAvg)" 
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="civilianSafety" 
              name="Civilian Safety"
              stroke="#3b82f6" 
              fillOpacity={1} 
              fill="url(#colorCiv)" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between mt-4">
        <div className="text-center">
          <p className="text-[10px] text-gray-500 uppercase font-bold">Max Efficiency</p>
          <p className="text-lg font-mono font-bold text-emerald-400">
            {Math.max(...chartData.map(d => d.avgScore))}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-gray-500 uppercase font-bold">Safety Min</p>
          <p className="text-lg font-mono font-bold text-blue-400">
            {Math.min(...chartData.filter(d => d.time === 'T+72h').map(d => d.civilianSafety))}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
