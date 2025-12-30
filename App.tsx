
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Counter, HistoryEntry } from './types';
import CounterCard from './components/CounterCard';
import CounterModal from './components/CounterModal';
import HistoryLog from './components/HistoryLog';
import Header from './components/Header';

const App: React.FC = () => {
  const [counters, setCounters] = useState<Counter[]>(() => {
    const saved = localStorage.getItem('mkc_counters');
    return saved ? JSON.parse(saved) : [
      { id: '1', label: 'Player A', value: 0, incrementKey: '1', decrementKey: 'q', color: 'blue' },
      { id: '2', label: 'Player B', value: 0, incrementKey: '2', decrementKey: 'w', color: 'red' },
      { id: '3', label: 'Player C', value: 0, incrementKey: '3', decrementKey: 'e', color: 'green' },
    ];
  });

  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    const saved = localStorage.getItem('mkc_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCounterId, setEditingCounterId] = useState<string | null>(null);
  const [activePressedKey, setActivePressedKey] = useState<string | null>(null);
  
  const isInputFocused = useRef(false);

  useEffect(() => {
    localStorage.setItem('mkc_counters', JSON.stringify(counters));
  }, [counters]);

  useEffect(() => {
    localStorage.setItem('mkc_history', JSON.stringify(history));
  }, [history]);

  const addLog = useCallback((counter: Counter, change: number) => {
    const newEntry: HistoryEntry = {
      id: Math.random().toString(36).substr(2, 9),
      counterId: counter.id,
      counterLabel: counter.label,
      change,
      timestamp: Date.now(),
    };
    setHistory(prev => [newEntry, ...prev].slice(0, 50));
  }, []);

  const handleIncrement = useCallback((id: string) => {
    setCounters(prev => prev.map(c => {
      if (c.id === id) {
        addLog(c, 1);
        return { ...c, value: c.value + 1 };
      }
      return c;
    }));
  }, [addLog]);

  const handleDecrement = useCallback((id: string) => {
    setCounters(prev => prev.map(c => {
      if (c.id === id) {
        addLog(c, -1);
        return { ...c, value: c.value - 1 };
      }
      return c;
    }));
  }, [addLog]);

  const handleResetAll = useCallback(() => {
    setCounters(prev => prev.map(c => ({ ...c, value: 0 })));
    setHistory([]);
  }, []);

  const saveCounter = (counterData: Omit<Counter, 'id' | 'value'>) => {
    if (editingCounterId) {
      setCounters(prev => prev.map(c => 
        c.id === editingCounterId ? { ...c, ...counterData } : c
      ));
    } else {
      const counter: Counter = {
        ...counterData,
        id: Math.random().toString(36).substr(2, 9),
        value: 0
      };
      setCounters(prev => [...prev, counter]);
    }
    closeModal();
  };

  const removeCounter = (id: string) => {
    if (window.confirm("Delete this counter?")) {
      setCounters(prev => prev.filter(c => c.id !== id));
      setHistory(prev => prev.filter(h => h.counterId !== id));
    }
  };

  const openEditModal = (id: string) => {
    setEditingCounterId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCounterId(null);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isInputFocused.current) return;
    
    const key = e.key.toLowerCase();
    setActivePressedKey(key);

    counters.forEach(counter => {
      if (counter.incrementKey.toLowerCase() === key) {
        handleIncrement(counter.id);
      } else if (counter.decrementKey.toLowerCase() === key) {
        handleDecrement(counter.id);
      }
    });
  }, [counters, handleIncrement, handleDecrement]);

  const handleKeyUp = useCallback(() => {
    setActivePressedKey(null);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const editingCounter = editingCounterId 
    ? counters.find(c => c.id === editingCounterId) 
    : undefined;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-6xl">
        <Header 
          onAddClick={() => setIsModalOpen(true)} 
          onResetConfirm={handleResetAll} 
          activeKey={activePressedKey}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {counters.map(counter => (
            <CounterCard 
              key={counter.id}
              counter={counter}
              onIncrement={() => handleIncrement(counter.id)}
              onDecrement={() => handleDecrement(counter.id)}
              onRemove={() => removeCounter(counter.id)}
              onEdit={() => openEditModal(counter.id)}
              isPressedInc={activePressedKey === counter.incrementKey.toLowerCase()}
              isPressedDec={activePressedKey === counter.decrementKey.toLowerCase()}
            />
          ))}
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-700 rounded-2xl bg-slate-900/40 hover:bg-slate-900 hover:border-blue-500/50 transition-all group"
          >
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-blue-600/20 transition-colors">
              <i className="fa-solid fa-plus text-2xl text-slate-400 group-hover:text-blue-400"></i>
            </div>
            <span className="text-slate-400 group-hover:text-blue-300 font-medium">Add New Counter</span>
          </button>
        </div>

        <HistoryLog history={history} onClear={() => setHistory([])} />
      </div>

      {isModalOpen && (
        <CounterModal 
          onClose={closeModal} 
          onSave={saveCounter}
          onFocusChange={(focused) => { isInputFocused.current = focused; }}
          existingCounters={counters}
          editingCounter={editingCounter}
        />
      )}
    </div>
  );
};

export default App;
