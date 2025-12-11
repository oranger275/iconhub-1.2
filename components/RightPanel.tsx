import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Role, IconConfig, IconType } from '../types';

interface RightPanelProps {
  role: Role;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  config: IconConfig;
  setConfig: (config: IconConfig) => void;
  filterType: 'all' | IconType;
  setFilterType: (type: 'all' | IconType) => void;
}

const PRESET_COLORS = [
  '#000000', // Black
  '#005eb8', // Primary Blue
  '#00a9e0', // Cyan
  '#c60000', // Red
  '#5a32cc', // Purple
  '#ffc146', // Yellow/Orange
  '#00d8c8'  // Teal
];

const RightPanel: React.FC<RightPanelProps> = ({
  role,
  searchQuery,
  setSearchQuery,
  config,
  setConfig,
  filterType,
  setFilterType
}) => {
  const [hexInput, setHexInput] = useState(config.color);

  useEffect(() => {
    setHexInput(config.color);
  }, [config.color]);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      setConfig({ ...config, color: val });
    }
  };

  const handleHexBlur = () => {
    if (!/^#[0-9A-Fa-f]{6}$/.test(hexInput)) {
       setHexInput(config.color);
    }
  }

  return (
    <div className="w-72 bg-white/80 backdrop-blur-md border-l border-white/50 h-full flex flex-col shrink-0 z-10 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
      {/* Header */}
      <div className="h-20 flex items-center px-6 border-b border-gray-100/50">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-400" />
          Properties
        </h2>
      </div>

      <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-8">
        
        {/* Search Section */}
        <section>
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 block">
            Search
          </label>
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" />
            <input
              type="text"
              placeholder="Find icons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all shadow-sm"
            />
          </div>
        </section>

        {/* Type Filter Section */}
        <section>
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 block">
            Style
          </label>
          <div className="flex bg-gray-100/50 p-1 rounded-xl border border-gray-200">
            {(['all', 'line', 'solid'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  filterType === type 
                    ? 'bg-white text-black shadow-sm ring-1 ring-black/5' 
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </section>

        <div className="h-px bg-gray-100/50"></div>

        {/* User Configuration Section - Only active for Users */}
        {role === 'user' ? (
          <>
            <section className="space-y-6">
               {/* Size */}
               <div>
                 <div className="flex justify-between items-center mb-3">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Size</label>
                    <span className="text-[10px] font-mono text-gray-600 bg-gray-100/50 border border-gray-200 px-2 py-0.5 rounded-md">
                      {config.size}px
                    </span>
                 </div>
                 <input
                    type="range"
                    min="16"
                    max="96"
                    value={config.size}
                    onChange={(e) => setConfig({ ...config, size: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black hover:accent-gray-800"
                  />
               </div>

               {/* Stroke */}
               <div>
                 <div className="flex justify-between items-center mb-3">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Stroke Width</label>
                    <span className="text-[10px] font-mono text-gray-600 bg-gray-100/50 border border-gray-200 px-2 py-0.5 rounded-md">
                      {config.strokeWidth}px
                    </span>
                 </div>
                 <input
                    type="range"
                    min="0.5"
                    max="4"
                    step="0.1"
                    value={config.strokeWidth}
                    onChange={(e) => setConfig({ ...config, strokeWidth: parseFloat(e.target.value) })}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black hover:accent-gray-800"
                  />
               </div>
            </section>

            <div className="h-px bg-gray-100/50"></div>

            {/* Color Section */}
            <section>
               <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 block">
                 Color
               </label>
               
               {/* Presets - Smaller Buttons */}
               <div className="flex flex-wrap gap-2 mb-4">
                 {PRESET_COLORS.map(c => (
                   <button
                     key={c}
                     onClick={() => setConfig({ ...config, color: c })}
                     className={`w-6 h-6 rounded-full transition-all border-2 ${
                        config.color.toLowerCase() === c.toLowerCase() 
                          ? 'border-white ring-2 ring-black shadow-md scale-110' 
                          : 'border-transparent hover:border-gray-300 hover:scale-105'
                     }`}
                     style={{ backgroundColor: c }}
                     title={c}
                   />
                 ))}
               </div>

               {/* Custom Hex */}
               <div className="flex items-center gap-3">
                  <div className="relative overflow-hidden w-9 h-9 rounded-xl shadow-sm ring-1 ring-gray-200 cursor-pointer hover:ring-black transition-all shrink-0">
                    <div className="absolute inset-0" style={{ backgroundColor: config.color }}></div>
                    <input
                      type="color"
                      value={config.color}
                      onChange={(e) => setConfig({ ...config, color: e.target.value })}
                      className="absolute opacity-0 inset-0 w-full h-full cursor-pointer"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-mono">#</span>
                    <input 
                      type="text" 
                      value={hexInput.replace('#', '')}
                      onChange={(e) => handleHexChange({ ...e, target: { ...e.target, value: '#' + e.target.value } })}
                      onBlur={handleHexBlur}
                      className="w-full bg-white/50 border border-gray-200 rounded-xl pl-6 pr-3 py-2 text-sm font-mono text-gray-700 focus:outline-none focus:bg-white focus:ring-2 focus:ring-gray-200 focus:border-gray-400 uppercase transition-all"
                      maxLength={6}
                    />
                  </div>
               </div>
            </section>
          </>
        ) : (
          <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-200 text-center">
            <p className="text-xs text-gray-500 leading-relaxed">
              Designer mode active. <br/> Use center canvas to manage icons.
            </p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-6 border-t border-gray-100/50 bg-gray-50/30">
        <div className="flex items-start gap-3">
           <div className="w-8 h-8 rounded-full bg-white shadow-sm text-gray-600 flex items-center justify-center shrink-0 border border-gray-200">
             <span className="font-bold text-xs">i</span>
           </div>
           <div>
             <h4 className="text-xs font-bold text-gray-700 mb-1">Help & Tips</h4>
             <p className="text-[10px] text-gray-500 leading-relaxed">
               {role === 'user' 
                 ? "Click an icon to view details and download options." 
                 : "Upload SVGs to add to library."}
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;