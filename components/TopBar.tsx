import React from 'react';
import { Palette, User, Upload, Grid, List } from 'lucide-react';
import { Role, ViewMode } from '../types';

interface TopBarProps {
  role: Role;
  setRole: (role: Role) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onUploadClick?: () => void;
  title: string;
}

const TopBar: React.FC<TopBarProps> = ({
  role,
  setRole,
  viewMode,
  setViewMode,
  onUploadClick,
  title
}) => {
  return (
    <div className="h-20 bg-white/40 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-20 border-b border-white/40 transition-all">
      
      {/* Context Title */}
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
        {title}
      </h1>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {role === 'designer' && (
          <button
            onClick={onUploadClick}
            className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>
        )}

        {role === 'designer' && <div className="h-6 w-px bg-gray-300/50 mx-2"></div>}

        {/* View Mode */}
        <div className="flex bg-gray-100/50 p-1 rounded-xl border border-gray-200/50 backdrop-blur-sm">
          <button
            onClick={() => setViewMode('grid')}
            title="Grid View"
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            title="List View"
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        <div className="h-6 w-px bg-gray-300/50 mx-2"></div>

        {/* Role Switcher */}
        <div className="flex items-center gap-1 bg-gray-100/50 p-1 rounded-xl border border-gray-200/50 backdrop-blur-sm">
          <button
            onClick={() => setRole('designer')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              role === 'designer'
                ? 'bg-white text-black shadow-sm ring-1 ring-black/5'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            Designer
          </button>
          <button
            onClick={() => setRole('user')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              role === 'user'
                ? 'bg-white text-black shadow-sm ring-1 ring-black/5'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            User
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;