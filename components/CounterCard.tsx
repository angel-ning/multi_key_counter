
import React from 'react';
import { Counter } from '../types';

interface CounterCardProps {
  counter: Counter;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
  onEdit: () => void;
  isPressedInc: boolean;
  isPressedDec: boolean;
}

const getColorClasses = (color: string) => {
  switch (color) {
    case 'blue': return 'from-blue-500 to-indigo-600 text-blue-400 border-blue-500/30 ring-blue-500/50';
    case 'red': return 'from-red-500 to-rose-600 text-red-400 border-red-500/30 ring-red-500/50';
    case 'green': return 'from-emerald-500 to-teal-600 text-emerald-400 border-emerald-500/30 ring-emerald-500/50';
    case 'yellow': return 'from-amber-500 to-orange-600 text-amber-400 border-amber-500/30 ring-amber-500/50';
    case 'purple': return 'from-purple-500 to-violet-600 text-purple-400 border-purple-500/30 ring-purple-500/50';
    case 'pink': return 'from-pink-500 to-fuchsia-600 text-pink-400 border-pink-500/30 ring-pink-500/50';
    default: return 'from-slate-500 to-slate-600 text-slate-400 border-slate-500/30 ring-slate-500/50';
  }
};

const CounterCard: React.FC<CounterCardProps> = ({ 
  counter, 
  onIncrement, 
  onDecrement, 
  onRemove,
  onEdit,
  isPressedInc,
  isPressedDec
}) => {
  const colorClasses = getColorClasses(counter.color);

  return (
    <div className={`relative group h-64 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all hover:border-slate-700 hover:shadow-2xl hover:shadow-black/50 ${isPressedInc || isPressedDec ? `ring-2 ${colorClasses.split(' ').pop()} scale-[1.02]` : ''}`}>
      {/* Action Buttons */}
      <div className="absolute top-4 right-4 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={onEdit}
          className="text-slate-500 hover:text-blue-400 transition-colors"
          title="Edit Counter"
        >
          <i className="fa-solid fa-pen-to-square"></i>
        </button>
        <button 
          onClick={onRemove}
          className="text-slate-500 hover:text-red-400 transition-colors"
          title="Remove Counter"
        >
          <i className="fa-solid fa-trash-can"></i>
        </button>
      </div>

      <div className="p-6 h-full flex flex-col justify-between">
        <div className="flex flex-col">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Counter Label</span>
          <h3 className="text-xl font-bold text-slate-200 truncate pr-16">{counter.label}</h3>
        </div>

        <div className="flex items-center justify-center">
          <span className={`text-7xl font-black tabular-nums drop-shadow-lg bg-gradient-to-br ${colorClasses.split(' ').slice(0, 2).join(' ')} bg-clip-text text-transparent`}>
            {counter.value}
          </span>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-col gap-1 items-start">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Inc Key</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={onIncrement}
                className={`key-caps w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 font-mono font-bold text-lg uppercase transition-all ${isPressedInc ? 'bg-blue-600 border-blue-400 text-white translate-y-0.5 shadow-none' : 'text-slate-300'}`}
              >
                {counter.incrementKey === ' ' ? '␣' : counter.incrementKey}
              </button>
              <i className="fa-solid fa-plus text-[10px] text-slate-600"></i>
            </div>
          </div>

          <div className="flex flex-col gap-1 items-end">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Dec Key</span>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-minus text-[10px] text-slate-600"></i>
              <button 
                onClick={onDecrement}
                className={`key-caps w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 font-mono font-bold text-lg uppercase transition-all ${isPressedDec ? 'bg-red-600 border-red-400 text-white translate-y-0.5 shadow-none' : 'text-slate-300'}`}
              >
                {counter.decrementKey === ' ' ? '␣' : counter.decrementKey}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounterCard;
