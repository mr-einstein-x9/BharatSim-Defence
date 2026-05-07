import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface TimelineSliderProps {
  simTime: number;
  isAutoPlaying: boolean;
  onTimeChange: (time: number) => void;
  onTogglePlay: () => void;
  onReset: () => void;
}

const TimelineSlider: React.FC<TimelineSliderProps> = ({ 
  simTime, 
  isAutoPlaying, 
  onTimeChange, 
  onTogglePlay, 
  onReset 
}) => {
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[3000] w-full max-w-2xl px-6">
      <div className="bg-[#0f1627]/90 backdrop-blur-md border border-gray-800 rounded-2xl p-4 shadow-2xl flex items-center gap-6">
        
        {/* Play/Pause Button */}
        <button 
          onClick={onTogglePlay}
          className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center text-white transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)]"
        >
          {isAutoPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
        </button>

        {/* Slider */}
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <span>T+0h</span>
            <span>T+6h</span>
            <span>T+24h</span>
            <span>T+72h</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="72" 
            step="0.5"
            value={simTime}
            onChange={(e) => onTimeChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        {/* Time Display */}
        <div className="bg-[#162032] px-4 py-2 rounded-lg border border-gray-700 min-w-[80px] text-center">
          <span className="text-xl font-mono font-black text-emerald-400">
            T+{Math.floor(simTime)}h
          </span>
        </div>

        {/* Reset Button */}
        <button 
          onClick={onReset}
          className="p-2 text-gray-500 hover:text-red-400 transition-colors"
          title="Reset Simulation"
        >
          <RotateCcw size={20} />
        </button>
      </div>
    </div>
  );
};

export default TimelineSlider;
