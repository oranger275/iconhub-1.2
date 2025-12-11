
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { INITIAL_ICONS, INITIAL_GROUPS } from './constants';
import { IconData, IconGroup, Role, IconConfig, ViewMode, IconType } from './types';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import RightPanel from './components/RightPanel';
import IconCard from './components/IconCard';
import { Trash2, FolderInput, X, UploadCloud, CheckSquare, Download, Copy, Check, Image as ImageIcon, FileCode } from 'lucide-react';
import { processSvgContent, downloadSvg, downloadPng, copySvgToClipboard, copyPngToClipboard } from './services/svgUtils';

const App = () => {
  // --- Global State ---
  const [icons, setIcons] = useState<IconData[]>(INITIAL_ICONS);
  const [groups, setGroups] = useState<IconGroup[]>(INITIAL_GROUPS);
  const [role, setRole] = useState<Role>('user');
  
  // --- Filter & View State ---
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterType, setFilterType] = useState<'all' | IconType>('all');

  // --- Designer State ---
  const [selectedIconIds, setSelectedIconIds] = useState<Set<string>>(new Set());
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<IconType>('line');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- User State ---
  const [config, setConfig] = useState<IconConfig>({
    size: 45,
    strokeWidth: 1,
    color: '#000000'
  });
  const [selectedIconForDetail, setSelectedIconForDetail] = useState<IconData | null>(null);
  const [copySuccess, setCopySuccess] = useState<'svg' | 'png' | null>(null);

  // --- Computed ---
  const filteredIcons = icons.filter(icon => {
    const matchesGroup = selectedGroupId ? icon.groupId === selectedGroupId : true;
    const matchesSearch = icon.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || icon.type === filterType;
    return matchesGroup && matchesSearch && matchesType;
  });

  const activeGroupName = selectedGroupId 
    ? groups.find(g => g.id === selectedGroupId)?.name || 'Unknown Group'
    : 'All Icons';

  // --- Actions: Group Management ---
  const handleAddGroup = (name: string) => {
    const newGroup: IconGroup = { id: `g-${Date.now()}`, name };
    setGroups([...groups, newGroup]);
  };

  const handleDeleteGroup = (id: string) => {
    if (confirm('Delete this group and all its icons?')) {
      setGroups(groups.filter(g => g.id !== id));
      setIcons(icons.filter(i => i.groupId !== id));
      if (selectedGroupId === id) setSelectedGroupId(null);
    }
  };

  const handleRenameGroup = (id: string, newName: string) => {
    setGroups(groups.map(g => g.id === id ? { ...g, name: newName } : g));
  };

  // --- Actions: Icon Management ---
  const handleUploadClick = () => {
    setIsUploadModalOpen(true);
  };

  const triggerFileSelection = (type: IconType) => {
    setUploadType(type);
    setIsUploadModalOpen(false);
    setTimeout(() => {
        fileInputRef.current?.click();
    }, 100);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newIcons: IconData[] = [];
    const targetGroupId = selectedGroupId || (groups.length > 0 ? groups[0].id : '');

    if (!targetGroupId && groups.length === 0) {
        alert("Please create a group first to upload icons.");
        return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type === 'image/svg+xml') {
        const text = await file.text();
        newIcons.push({
          id: `icon-${Date.now()}-${i}`,
          name: file.name.replace('.svg', ''),
          content: text,
          groupId: targetGroupId,
          createdAt: Date.now(),
          type: uploadType
        });
      }
    }

    setIcons([...icons, ...newIcons]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleToggleSelectIcon = (id: string, isShiftPressed: boolean) => {
    let newSet = new Set(selectedIconIds);

    if (isShiftPressed && lastSelectedId) {
      const startIdx = filteredIcons.findIndex(i => i.id === lastSelectedId);
      const endIdx = filteredIcons.findIndex(i => i.id === id);

      if (startIdx !== -1 && endIdx !== -1) {
        const lower = Math.min(startIdx, endIdx);
        const upper = Math.max(startIdx, endIdx);
        for (let i = lower; i <= upper; i++) {
           newSet.add(filteredIcons[i].id);
        }
      } else {
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
      }
    } else {
      if (newSet.has(id)) newSet.delete(id);
      else {
        newSet.add(id);
        setLastSelectedId(id);
      }
    }
    setSelectedIconIds(newSet);
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedIconIds.size} icons?`)) {
      setIcons(icons.filter(i => !selectedIconIds.has(i.id)));
      setSelectedIconIds(new Set());
      setLastSelectedId(null);
    }
  };

  const handleBulkMove = (targetGroupId: string) => {
    setIcons(icons.map(i => 
      selectedIconIds.has(i.id) ? { ...i, groupId: targetGroupId } : i
    ));
    setSelectedIconIds(new Set());
    setLastSelectedId(null);
    setIsMoveModalOpen(false);
  };

  const clearSelection = () => {
    setSelectedIconIds(new Set());
    setLastSelectedId(null);
  };

  // --- Detail Modal Actions ---
  const displaySvgForDetail = useMemo(() => {
    if (!selectedIconForDetail) return '';
    // Show larger in modal
    return processSvgContent(selectedIconForDetail.content, { ...config, size: 120 }, selectedIconForDetail.type);
  }, [selectedIconForDetail, config]);

  const handleDetailDownload = (type: 'svg' | 'png') => {
    if (!selectedIconForDetail) return;
    const svgToDownload = processSvgContent(selectedIconForDetail.content, config, selectedIconForDetail.type);
    if (type === 'svg') {
      downloadSvg(selectedIconForDetail.name, svgToDownload);
    } else {
      downloadPng(selectedIconForDetail.name, svgToDownload, 1024); // Download high res PNG
    }
  };

  const handleCopyCode = async () => {
    if (!selectedIconForDetail) return;
    const svgToCopy = processSvgContent(selectedIconForDetail.content, config, selectedIconForDetail.type);
    await copySvgToClipboard(svgToCopy);
    setCopySuccess('svg');
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const handleCopyPng = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedIconForDetail) return;
    const svgToCopy = processSvgContent(selectedIconForDetail.content, config, selectedIconForDetail.type);
    await copyPngToClipboard(svgToCopy, 1024);
    setCopySuccess('png');
    setTimeout(() => setCopySuccess(null), 2000);
  }

  useEffect(() => {
    setSelectedIconIds(new Set());
    setLastSelectedId(null);
  }, [selectedGroupId, role, filterType]);

  return (
    <div className="flex h-screen w-full bg-transparent overflow-hidden text-slate-800 font-sans">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".svg"
        multiple
        className="hidden"
      />

      {/* Left Sidebar: Navigation */}
      <Sidebar
        groups={groups}
        selectedGroupId={selectedGroupId}
        onSelectGroup={setSelectedGroupId}
        role={role}
        onAddGroup={handleAddGroup}
        onDeleteGroup={handleDeleteGroup}
        onRenameGroup={handleRenameGroup}
        totalIcons={icons.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 z-0">
        
        {/* Top Header */}
        <TopBar
          role={role}
          setRole={setRole}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onUploadClick={handleUploadClick}
          title={activeGroupName}
        />

        {/* Content Canvas */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          
          {filteredIcons.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
               <div className="w-20 h-20 bg-white/50 rounded-full flex items-center justify-center mb-6 border border-white shadow-soft backdrop-blur-sm">
                  <UploadCloud className="w-8 h-8 text-gray-300" />
               </div>
               <h3 className="text-xl font-bold text-gray-800 mb-2">No icons found</h3>
               <p className="max-w-xs mx-auto mb-6 text-sm text-gray-500">
                 {searchQuery ? `No results for "${searchQuery}"` : "This collection is empty."}
               </p>
               {role === 'designer' && !searchQuery && (
                 <button onClick={handleUploadClick} className="text-black font-bold hover:underline text-sm">
                    Upload SVG Icons
                 </button>
               )}
            </div>
          )}

          <div className={`
            grid gap-6 pb-24 transition-all duration-300
            ${viewMode === 'grid' 
              ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6' 
              : 'grid-cols-1'
            }
          `}>
            {filteredIcons.map(icon => (
              <div key={icon.id} className={viewMode === 'list' ? 'flex items-center gap-4 bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-gray-100 hover:border-gray-300 transition-colors shadow-sm hover:shadow-md' : ''}>
                {viewMode === 'list' ? (
                   <>
                      <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded border border-gray-100">
                         <div dangerouslySetInnerHTML={{ __html: processSvgContent(icon.content, config, icon.type) }} />
                      </div>
                      <span className="font-medium text-gray-700 flex-1">{icon.name}</span>
                      <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded uppercase font-bold tracking-wider mx-4 border border-gray-100">{icon.type}</span>
                      {role === 'designer' && (
                         <input 
                           type="checkbox" 
                           checked={selectedIconIds.has(icon.id)} 
                           onChange={(e) => handleToggleSelectIcon(icon.id, (e.nativeEvent as any).shiftKey)}
                           className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                         />
                      )}
                      {role === 'user' && (
                         <button 
                           onClick={() => setSelectedIconForDetail(icon)}
                           className="text-xs text-gray-500 hover:text-black hover:underline mr-4"
                         >
                           View details
                         </button>
                      )}
                   </>
                ) : (
                  <IconCard
                    icon={icon}
                    role={role}
                    config={config}
                    isSelected={selectedIconIds.has(icon.id)}
                    onToggleSelect={handleToggleSelectIcon}
                    onClick={() => setSelectedIconForDetail(icon)}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Designer: Floating Action Bar */}
          {role === 'designer' && selectedIconIds.size > 0 && (
            <div className="fixed bottom-8 left-[calc(50%-9rem)] -translate-x-1/2 bg-black/90 text-white backdrop-blur-md border border-white/10 rounded-full px-8 py-3 shadow-strong flex items-center gap-6 z-50 animate-in slide-in-from-bottom-5">
              <span className="text-sm font-bold text-gray-300 border-r border-gray-700 pr-4 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-white"/> {selectedIconIds.size} selected
              </span>
              <div className="flex items-center gap-2">
                 <button 
                   onClick={() => setIsMoveModalOpen(true)}
                   className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-300 hover:text-white" 
                   title="Move to Group"
                 >
                   <FolderInput className="w-5 h-5" />
                 </button>
                 <button 
                   onClick={handleBulkDelete}
                   className="p-2 hover:bg-red-500/20 rounded-full transition-colors text-gray-300 hover:text-red-400"
                   title="Delete"
                 >
                   <Trash2 className="w-5 h-5" />
                 </button>
                 <button 
                   onClick={clearSelection}
                   className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-300 hover:text-white"
                   title="Deselect"
                 >
                   <X className="w-5 h-5" />
                 </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar: Operations */}
      <RightPanel 
        role={role}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        config={config}
        setConfig={setConfig}
        filterType={filterType}
        setFilterType={setFilterType}
      />

      {/* Upload Type Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
           <div className="bg-white rounded-2xl shadow-strong border border-white/50 w-full max-w-xs p-8 transform transition-all scale-100">
               <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">Icon Style</h3>
               <p className="text-sm text-gray-500 mb-8 text-center">Choose the style for your new icons.</p>
               
               <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => triggerFileSelection('line')}
                    className="flex flex-col items-center justify-center gap-3 py-6 rounded-2xl border border-gray-200 hover:border-black hover:bg-gray-50 transition-all group shadow-sm"
                  >
                     <div className="w-10 h-10 rounded-full border-2 border-gray-400 group-hover:border-black transition-colors"></div>
                     <span className="text-sm font-bold text-gray-600 group-hover:text-black">Line</span>
                  </button>
                  <button 
                    onClick={() => triggerFileSelection('solid')}
                    className="flex flex-col items-center justify-center gap-3 py-6 rounded-2xl border border-gray-200 hover:border-black hover:bg-gray-50 transition-all group shadow-sm"
                  >
                     <div className="w-10 h-10 rounded-full bg-gray-400 group-hover:bg-black transition-colors"></div>
                     <span className="text-sm font-bold text-gray-600 group-hover:text-black">Solid</span>
                  </button>
               </div>
               
               <button 
                 onClick={() => setIsUploadModalOpen(false)}
                 className="w-full mt-8 py-3 text-sm font-medium text-gray-400 hover:text-black transition-colors"
               >
                 Cancel
               </button>
           </div>
        </div>
      )}

      {/* Move Modal */}
      {isMoveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-strong border border-white/50 w-full max-w-sm p-6 transform transition-all">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Move Items</h3>
            <p className="text-sm text-gray-500 mb-6">Select a destination folder.</p>
            
            <div className="space-y-1 max-h-60 overflow-y-auto mb-6 pr-1 custom-scrollbar">
              {groups.map(g => (
                <button
                  key={g.id}
                  onClick={() => handleBulkMove(g.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl text-left text-sm font-semibold text-gray-700 transition-colors border border-transparent hover:border-gray-200"
                >
                  <FolderInput className="w-4 h-4 text-gray-400" />
                  {g.name}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setIsMoveModalOpen(false)}
              className="w-full py-3 bg-gray-50 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* User Detail & Download Modal */}
      {selectedIconForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setSelectedIconForDetail(null)}>
           <div 
             className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up border border-white/50" 
             onClick={e => e.stopPropagation()}
           >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                 <h3 className="text-lg font-bold text-slate-900 truncate">{selectedIconForDetail.name}</h3>
                 <button onClick={() => setSelectedIconForDetail(null)} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-black">
                   <X className="w-5 h-5" />
                 </button>
              </div>

              {/* Preview Area */}
              <div className="h-64 bg-white/50 flex items-center justify-center relative border-b border-gray-100">
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                 <div 
                    className="relative z-10 text-gray-800 transition-all duration-300 drop-shadow-xl"
                    dangerouslySetInnerHTML={{ __html: displaySvgForDetail }}
                 />
              </div>

              {/* Actions */}
              <div className="p-8 pt-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Export Options</h4>
                
                <div className="space-y-3">
                  {/* SVG Option */}
                  <div className="group flex items-center justify-between p-4 rounded-2xl border border-gray-200 hover:border-black bg-gray-50 hover:bg-white transition-all shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white text-black border border-gray-200 shadow-sm flex items-center justify-center font-bold text-[10px]">SVG</div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-gray-900 group-hover:text-black truncate">Vector</div>
                        <div className="text-[10px] text-gray-500 truncate">Scalable Code</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                       <button 
                         onClick={handleCopyCode}
                         className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 hover:border-black bg-white text-gray-500 hover:text-black transition-all"
                         title="Copy Code"
                       >
                         {copySuccess === 'svg' ? <Check className="w-4 h-4 text-green-600" /> : <FileCode className="w-4 h-4" />}
                       </button>
                       <button 
                         onClick={() => handleDetailDownload('svg')}
                         className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 hover:border-black bg-white text-gray-500 hover:text-black transition-all"
                         title="Download SVG"
                       >
                         <Download className="w-4 h-4" />
                       </button>
                    </div>
                  </div>

                  {/* PNG Option */}
                  <div className="group flex items-center justify-between p-4 rounded-2xl border border-gray-200 hover:border-black bg-gray-50 hover:bg-white transition-all shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white text-black border border-gray-200 shadow-sm flex items-center justify-center font-bold text-[10px]">PNG</div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-gray-900 group-hover:text-black truncate">Image</div>
                        <div className="text-[10px] text-gray-500 truncate">Raster Bitmap</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                       <button 
                         onClick={handleCopyPng}
                         className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 hover:border-black bg-white text-gray-500 hover:text-black transition-all"
                         title="Copy Image"
                       >
                         {copySuccess === 'png' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                       </button>
                       <button 
                         onClick={() => handleDetailDownload('png')}
                         className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 hover:border-black bg-white text-gray-500 hover:text-black transition-all"
                         title="Download PNG"
                       >
                         <Download className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
