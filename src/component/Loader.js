import React from 'react';
import { HardHat } from 'lucide-react';

export const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
      <div className="relative flex items-center justify-center">
        {/* Outer Spinning Ring */}
        <div className="w-20 h-20 border-4 border-blue-100 rounded-full"></div>
        <div className="absolute w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>

        {/* Center Icon */}
        <div className="absolute">
          <HardHat className="w-8 h-8 text-blue-600 animate-pulse" strokeWidth={2.5} />
        </div>
      </div>

      {/* Loading Text */}
      <div className="mt-6 flex flex-col items-center gap-1">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">SiteTrack</h3>
        <p className="text-sm font-medium text-slate-500 animate-pulse">Loading workspace...</p>
      </div>
    </div>
  );
};

export default Loader;
