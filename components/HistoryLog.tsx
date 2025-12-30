
import React from 'react';
import { HistoryEntry } from '../types';

interface HistoryLogProps {
  history: HistoryEntry[];
  onClear: () => void;
}

const HistoryLog: React.FC<HistoryLogProps> = ({ history, onClear }) => {
  if (history.length === 0) return null;

  return (
    <div className="mt-12 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <h3 className="text-slate-300 font-bold flex items-center gap-2">
          <i className="fa-solid fa-clock-rotate-left text-slate-500"></i>
          Activity Log
        </h3>
        <button 
          onClick={onClear}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors uppercase font-bold"
        >
          Clear History
        </button>
      </div>
      <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/50">
        {history.map((entry) => (
          <div key={entry.id} className="p-3 flex items-center justify-between text-sm hover:bg-slate-800/30 transition-colors">
            <div className="flex items-center gap-3">
              <span className={`w-8 h-8 flex items-center justify-center rounded-lg ${entry.change > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                {entry.change > 0 ? '+' : '-'}
              </span>
              <span className="text-slate-300 font-medium">{entry.counterLabel}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className={`font-mono font-bold ${entry.change > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {entry.change > 0 ? '+1' : '-1'}
              </span>
              <span className="text-slate-500 text-xs">
                {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryLog;
