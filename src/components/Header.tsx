import React from 'react';
import { Leaf, MessageSquare, Flower2, Stethoscope, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'identify' | 'garden' | 'chat' | 'doctor';
  setActiveTab: (tab: 'identify' | 'garden' | 'chat' | 'doctor') => void;
  gardenCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, gardenCount }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('identify')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-800 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-800/25 group-hover:scale-105 transition-transform">
              <Leaf className="w-6 h-6 transform -rotate-12 group-hover:rotate-0 transition-transform duration-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-plant font-bold text-xl sm:text-2xl text-emerald-950 tracking-tight">
                  FloraWise
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                  Gemini 4 Argon
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-stone-500 font-medium">
                AI Plant Doctor, Botanical Vision &amp; Hydration Routine
              </p>
            </div>
          </div>

          {/* Nav items */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('identify')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'identify'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-stone-600 hover:text-emerald-900 hover:bg-emerald-50/70'
              }`}
            >
              <Leaf className="w-4 h-4" />
              <span>Identify</span>
            </button>

            <button
              onClick={() => setActiveTab('garden')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'garden'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-stone-600 hover:text-emerald-900 hover:bg-emerald-50/70'
              }`}
            >
              <Flower2 className="w-4 h-4" />
              <span>My Garden</span>
              {gardenCount > 0 && (
                <span className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === 'garden' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {gardenCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'chat'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-stone-600 hover:text-emerald-900 hover:bg-emerald-50/70'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>FloraBot</span>
            </button>

            <button
              onClick={() => setActiveTab('doctor')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'doctor'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-stone-600 hover:text-emerald-900 hover:bg-emerald-50/70'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span className="hidden md:inline">Plant Doctor</span>
              <span className="md:hidden">Doctor</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
