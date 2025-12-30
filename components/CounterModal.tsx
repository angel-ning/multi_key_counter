
import React, { useState, useEffect } from 'react';
import { Counter } from '../types';

interface CounterModalProps {
  onClose: () => void;
  onSave: (counter: Omit<Counter, 'id' | 'value'>) => void;
  onFocusChange: (focused: boolean) => void;
  existingCounters: Counter[];
  editingCounter?: Counter;
}

const COLORS = ['blue', 'red', 'green', 'yellow', 'purple', 'pink'];

const CounterModal: React.FC<CounterModalProps> = ({ onClose, onSave, onFocusChange, existingCounters, editingCounter }) => {
  const [label, setLabel] = useState(editingCounter?.label || '');
  const [incKey, setIncKey] = useState(editingCounter?.incrementKey || '');
  const [decKey, setDecKey] = useState(editingCounter?.decrementKey || '');
  const [color, setColor] = useState(editingCounter?.color || 'blue');
  
  const [incError, setIncError] = useState<string | null>(null);
  const [decError, setDecError] = useState<string | null>(null);

  const checkConflict = (key: string, type: 'inc' | 'dec') => {
    if (!key) return null;
    
    // Check internal conflict
    if (type === 'inc' && key === decKey) return 'Cannot be the same as Decrement key';
    if (type === 'dec' && key === incKey) return 'Cannot be the same as Increment key';

    // Check external conflicts
    for (const c of existingCounters) {
      if (editingCounter && c.id === editingCounter.id) continue;
      
      if (c.incrementKey.toLowerCase() === key.toLowerCase()) {
        return `Already used by "${c.label}" (Inc)`;
      }
      if (c.decrementKey.toLowerCase() === key.toLowerCase()) {
        return `Already used by "${c.label}" (Dec)`;
      }
    }
    return null;
  };

  useEffect(() => {
    setIncError(checkConflict(incKey, 'inc'));
  }, [incKey, decKey, existingCounters]);

  useEffect(() => {
    setDecError(checkConflict(decKey, 'dec'));
  }, [decKey, incKey, existingCounters]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label || !incKey || !decKey || incError || decError) return;
    onSave({ label, incrementKey: incKey, decrementKey: decKey, color });
  };

  const captureKey = (setter: (key: string) => void) => (e: React.KeyboardEvent) => {
    e.preventDefault();
    setter(e.key);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{editingCounter ? 'Edit Counter' : 'Create New Counter'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight">Counter Name</label>
            <input 
              autoFocus
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onFocus={() => onFocusChange(true)}
              onBlur={() => onFocusChange(false)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600"
              placeholder="e.g. Visitors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight">Inc Key</label>
              <input 
                type="text"
                readOnly
                value={incKey === ' ' ? 'Space' : incKey}
                onKeyDown={captureKey(setIncKey)}
                onFocus={() => onFocusChange(true)}
                onBlur={() => onFocusChange(false)}
                className={`w-full bg-slate-800 border rounded-xl px-4 py-3 text-center text-white font-mono font-bold uppercase cursor-pointer focus:outline-none focus:ring-2 ${incError ? 'border-red-500 ring-red-500/20' : 'border-slate-700 focus:ring-blue-500'}`}
                placeholder="Press key"
              />
              {incError && <p className="absolute -bottom-5 left-0 text-[10px] text-red-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis w-full">{incError}</p>}
            </div>
            <div className="relative">
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight">Dec Key</label>
              <input 
                type="text"
                readOnly
                value={decKey === ' ' ? 'Space' : decKey}
                onKeyDown={captureKey(setDecKey)}
                onFocus={() => onFocusChange(true)}
                onBlur={() => onFocusChange(false)}
                className={`w-full bg-slate-800 border rounded-xl px-4 py-3 text-center text-white font-mono font-bold uppercase cursor-pointer focus:outline-none focus:ring-2 ${decError ? 'border-red-500 ring-red-500/20' : 'border-slate-700 focus:ring-blue-500'}`}
                placeholder="Press key"
              />
              {decError && <p className="absolute -bottom-5 left-0 text-[10px] text-red-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis w-full">{decError}</p>}
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-tight">Theme Color</label>
            <div className="flex items-center gap-3">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-all ring-offset-4 ring-offset-slate-900 ${color === c ? 'ring-2 ring-white scale-110' : 'hover:scale-110 opacity-70'}`}
                  style={{ backgroundColor: c === 'pink' ? '#ec4899' : c }}
                />
              ))}
            </div>
          </div>

          <button 
            type="submit"
            disabled={!label || !incKey || !decKey || !!incError || !!decError}
            className={`w-full mt-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20`}
          >
            {editingCounter ? 'Update Counter' : 'Create Counter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CounterModal;
