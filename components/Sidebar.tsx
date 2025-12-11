import React, { useState } from 'react';
import { IconGroup, Role } from '../types';
import { Folder, Edit2, Trash2, FolderOpen, Layers, Plus } from 'lucide-react';

interface SidebarProps {
  groups: IconGroup[];
  selectedGroupId: string | null;
  onSelectGroup: (id: string | null) => void;
  role: Role;
  onAddGroup: (name: string) => void;
  onDeleteGroup: (id: string) => void;
  onRenameGroup: (id: string, newName: string) => void;
  totalIcons: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  groups,
  selectedGroupId,
  onSelectGroup,
  role,
  onAddGroup,
  onDeleteGroup,
  onRenameGroup,
  totalIcons
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGroupName.trim()) {
      onAddGroup(newGroupName.trim());
      setNewGroupName('');
      setIsCreating(false);
    }
  };

  const startEditing = (group: IconGroup) => {
    setEditingGroupId(group.id);
    setEditName(group.name);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGroupId && editName.trim()) {
      onRenameGroup(editingGroupId, editName.trim());
      setEditingGroupId(null);
    }
  };

  return (
    <div className="w-64 bg-white/80 backdrop-blur-md h-full flex flex-col shrink-0 transition-all duration-300 border-r border-white/50 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="p-6 h-full flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 shrink-0">
          <div className="w-10 h-10 flex items-center justify-center">
            <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M5.12501 39.2916C3.23804 39.2916 1.70834 37.762 1.70834 35.875C1.70834 33.988 3.23804 32.4583 5.12501 32.4583C7.01198 32.4583 8.54168 33.988 8.54168 35.875C8.54168 37.762 7.01198 39.2916 5.12501 39.2916Z" stroke="black" strokeWidth="1.36667" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M35.875 39.2916C33.988 39.2916 32.4583 37.762 32.4583 35.875C32.4583 33.988 33.988 32.4583 35.875 32.4583C37.762 32.4583 39.2917 33.988 39.2917 35.875C39.2917 37.762 37.762 39.2916 35.875 39.2916Z" stroke="black" strokeWidth="1.36667" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.12501 8.54168C3.23804 8.54168 1.70834 7.01198 1.70834 5.12501C1.70834 3.23804 3.23804 1.70834 5.12501 1.70834C7.01198 1.70834 8.54168 3.23804 8.54168 5.12501C8.54168 7.01198 7.01198 8.54168 5.12501 8.54168Z" stroke="black" strokeWidth="1.36667" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M35.875 8.54168C33.988 8.54168 32.4583 7.01198 32.4583 5.12501C32.4583 3.23804 33.988 1.70834 35.875 1.70834C37.762 1.70834 39.2917 3.23804 39.2917 5.12501C39.2917 7.01198 37.762 8.54168 35.875 8.54168Z" stroke="black" strokeWidth="1.36667" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M35.875 32.4583V8.54166" stroke="black" strokeWidth="1.36667" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.125 32.4583V8.54166" stroke="black" strokeWidth="1.36667" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.54166 5.125H32.4583" stroke="black" strokeWidth="1.36667" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.54166 35.875H32.4583" stroke="black" strokeWidth="1.36667" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.756 24V15.492H11.904V24H9.756ZM16.1723 24.132C15.5483 24.132 14.9843 24 14.4803 23.736C13.9843 23.472 13.5923 23.112 13.3043 22.656C13.0163 22.192 12.8723 21.664 12.8723 21.072C12.8723 20.48 13.0163 19.952 13.3043 19.488C13.6003 19.024 13.9963 18.66 14.4923 18.396C14.9963 18.124 15.5643 17.988 16.1963 17.988C17.1003 17.988 17.8603 18.292 18.4763 18.9L17.1563 20.22C16.9163 19.98 16.5963 19.86 16.1963 19.86C15.8523 19.86 15.5643 19.972 15.3323 20.196C15.1083 20.412 14.9963 20.7 14.9963 21.06C14.9963 21.42 15.1123 21.712 15.3443 21.936C15.5763 22.16 15.8603 22.272 16.1963 22.272C16.4203 22.272 16.6123 22.236 16.7723 22.164C16.9323 22.092 17.0723 21.988 17.1923 21.852L18.5243 23.172C18.1883 23.5 17.8323 23.744 17.4563 23.904C17.0803 24.056 16.6523 24.132 16.1723 24.132ZM22.0196 24.132C21.3876 24.132 20.8236 24 20.3276 23.736C19.8396 23.464 19.4516 23.096 19.1636 22.632C18.8756 22.168 18.7316 21.64 18.7316 21.048C18.7316 20.472 18.8716 19.952 19.1516 19.488C19.4396 19.024 19.8276 18.66 20.3156 18.396C20.8116 18.124 21.3756 17.988 22.0076 17.988C22.6316 17.988 23.1916 18.124 23.6876 18.396C24.1836 18.66 24.5716 19.024 24.8516 19.488C25.1396 19.944 25.2836 20.464 25.2836 21.048C25.2836 21.64 25.1396 22.168 24.8516 22.632C24.5716 23.096 24.1836 23.464 23.6876 23.736C23.1996 24 22.6436 24.132 22.0196 24.132ZM22.0076 22.272C22.3516 22.272 22.6276 22.16 22.8356 21.936C23.0516 21.712 23.1596 21.42 23.1596 21.06C23.1596 20.7 23.0516 20.412 22.8356 20.196C22.6276 19.972 22.3516 19.86 22.0076 19.86C21.6636 19.86 21.3836 19.972 21.1676 20.196C20.9596 20.42 20.8556 20.712 20.8556 21.072C20.8556 21.432 20.9596 21.724 21.1676 21.948C21.3836 22.164 21.6636 22.272 22.0076 22.272ZM26.112 24V18.132H28.2V18.516C28.632 18.18 29.164 18.012 29.796 18.012C30.212 18.012 30.588 18.112 30.924 18.312C31.26 18.504 31.524 18.768 31.716 19.104C31.908 19.432 32.004 19.8 32.004 20.208V24H29.916V20.688C29.916 20.416 29.832 20.204 29.664 20.052C29.504 19.892 29.304 19.812 29.064 19.812C28.816 19.812 28.608 19.892 28.44 20.052C28.28 20.204 28.2 20.416 28.2 20.688V24H26.112Z" fill="black"/>
            </svg>
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">IconHub</span>
        </div>

        {/* All Icons */}
        <div className="mb-8 shrink-0">
          <button
            onClick={() => onSelectGroup(null)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border ${
              selectedGroupId === null
                ? 'bg-black text-white border-transparent shadow-md'
                : 'bg-white/50 text-gray-500 border-transparent hover:bg-white hover:text-black hover:shadow-sm'
            }`}
          >
            <Layers className={`w-4 h-4 ${selectedGroupId === null ? 'text-white' : 'text-gray-400'}`} />
            All Icons
            <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-bold ${
                selectedGroupId === null ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
            }`}>{totalIcons}</span>
          </button>
        </div>

        {/* Collections Header */}
        <div className="flex items-center justify-between mb-4 px-2 shrink-0">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Collections</h2>
          {role === 'designer' && (
            <button
              onClick={() => setIsCreating(true)}
              className="w-6 h-6 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-black hover:text-white text-gray-500 transition-all"
              title="New Group"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Create Form */}
        {isCreating && (
          <form onSubmit={handleCreateSubmit} className="mb-2 px-1 shrink-0">
            <input
              autoFocus
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              onBlur={() => setIsCreating(false)}
              placeholder="Group name..."
              className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-gray-50"
            />
          </form>
        )}

        {/* Groups List */}
        <div className="flex-1 space-y-1 overflow-y-auto px-1 custom-scrollbar min-h-0">
          {groups.map((group) => (
            <div key={group.id} className="group relative">
              {editingGroupId === group.id ? (
                <form onSubmit={handleEditSubmit} className="py-1">
                  <input
                    autoFocus
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={() => setEditingGroupId(null)}
                    className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg bg-white"
                  />
                </form>
              ) : (
                <button
                  onClick={() => onSelectGroup(group.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    selectedGroupId === group.id
                      ? 'bg-white shadow-sm text-black font-bold'
                      : 'text-gray-500 hover:bg-white/60 hover:text-black'
                  }`}
                >
                  {selectedGroupId === group.id ? (
                    <FolderOpen className="w-4 h-4 text-black" />
                  ) : (
                    <Folder className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
                  )}
                  <span className="truncate max-w-[120px]">{group.name}</span>
                  
                  {role === 'designer' && (
                    <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div
                        onClick={(e) => { e.stopPropagation(); startEditing(group); }}
                        className="p-1 hover:bg-white rounded-md text-gray-400 hover:text-black shadow-sm"
                      >
                        <Edit2 className="w-3 h-3" />
                      </div>
                      <div
                        onClick={(e) => { e.stopPropagation(); onDeleteGroup(group.id); }}
                        className="p-1 hover:bg-white rounded-md text-gray-400 hover:text-red-500 shadow-sm"
                      >
                        <Trash2 className="w-3 h-3" />
                      </div>
                    </div>
                  )}
                </button>
              )}
            </div>
          ))}
          
          {groups.length === 0 && !isCreating && (
            <div className="text-center py-8 px-4 text-xs text-gray-400 border border-dashed border-gray-200 rounded-xl mx-1 mt-2">
              No collections yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;