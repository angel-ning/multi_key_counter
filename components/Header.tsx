
import React, { useState, useEffect } from 'react';

interface HeaderProps {
  onAddClick: () => void;
  onResetConfirm: () => void;
  activeKey: string | null;
}

const Header: React.FC<HeaderProps> = ({ onAddClick, onResetConfirm, activeKey }) => {
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  // Auto-cancel reset confirmation after 3 seconds of inactivity
  useEffect(() => {
    let timeout: number;
    if (isConfirmingReset) {
      timeout = window.setTimeout(() => {
        setIsConfirmingReset(false);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [isConfirmingReset]);

  const handleResetClick = () => {
    if (isConfirmingReset) {
      onResetConfirm();
      setIsConfirmingReset(false);
    } else {
      setIsConfirmingReset(true);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
      <div>
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          Multi-Key Counter Pro
        </h1>
        <p className="text-slate-400 mt-1">Bind keyboard keys to individual variables</p>
      </div>

      <div className="flex items-center gap-4">
        {activeKey && (
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-full">
            <span className="text-slate-500 text-xs font-semibold uppercase">Last Key:</span>
            <kbd className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 text-blue-400 text-sm font-mono uppercase">
              {activeKey === ' ' ? 'Space' : activeKey}
            </kbd>
          </div>
        )}
        
        <div className="relative">
          <button 
            onClick={handleResetClick}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all border ${
              isConfirmingReset 
                ? 'bg-rose-600 border-rose-400 text-white animate-pulse' 
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
          >
            <i className={`fa-solid ${isConfirmingReset ? 'fa-triangle-exclamation' : 'fa-rotate-left'}`}></i>
            <span>{isConfirmingReset ? 'Click to Confirm?' : 'Reset All'}</span>
          </button>
          
          {isConfirmingReset && (
            <button 
              onClick={(e) => { e.stopPropagation(); setIsConfirmingReset(false); }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-[10px] text-slate-400 hover:text-white"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>
        
        <button 
          onClick={onAddClick}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-900/20 transition-all"
        >
          <i className="fa-solid fa-plus"></i>
          <span>New Counter</span>
        </button>
      </div>
    </div>
  );
};

export default Header;
