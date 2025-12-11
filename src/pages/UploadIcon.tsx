
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { iconService } from '../api/iconService';
import { UploadCloud, X, Loader2, FileCode } from 'lucide-react';
import { IconType } from '../types';

const UploadIcon = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [type, setType] = useState<IconType>('line');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files).filter(f => f.type === 'image/svg+xml'));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0 || !user) return;
    setUploading(true);
    
    try {
      const payload = [];
      for (const file of files) {
        const text = await file.text();
        payload.push({
          name: file.name.replace('.svg', ''),
          content: text,
          groupId: null, // Default to no group (Uncategorized)
          type: type,
          designerId: user.id
        });
      }

      await iconService.uploadIcons(payload);
      alert('Upload successful!');
      navigate('/editor'); // Redirect to editor to manage
    } catch (e) {
      alert('Upload failed.');
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload Icons</h1>
      
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
         {/* Type Selection */}
         <div className="mb-8">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Icon Style</label>
            <div className="flex gap-4">
               <button 
                 onClick={() => setType('line')}
                 className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${type === 'line' ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
               >
                 Line
               </button>
               <button 
                 onClick={() => setType('solid')}
                 className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${type === 'solid' ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
               >
                 Solid
               </button>
            </div>
         </div>

         {/* File Drop Area */}
         <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center hover:bg-gray-50 transition-colors mb-8 relative">
            <input 
              type="file" 
              multiple 
              accept=".svg"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center">
               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                  <UploadCloud className="w-8 h-8" />
               </div>
               <h3 className="text-lg font-bold text-gray-900">Click or Drag SVG files here</h3>
               <p className="text-sm text-gray-500 mt-2">Only .svg files are supported</p>
            </div>
         </div>

         {/* File List */}
         {files.length > 0 && (
            <div className="mb-8 space-y-2">
               <h4 className="text-sm font-bold text-gray-900 mb-2">Selected Files ({files.length})</h4>
               {files.map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                     <div className="flex items-center gap-3">
                        <FileCode className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">{f.name}</span>
                     </div>
                  </div>
               ))}
            </div>
         )}

         {/* Actions */}
         <div className="flex justify-end gap-4">
            <button 
               onClick={() => navigate('/designer-dashboard')}
               className="px-6 py-3 rounded-xl text-gray-500 font-bold hover:bg-gray-100 transition-colors"
            >
               Cancel
            </button>
            <button 
               onClick={handleUpload}
               disabled={uploading || files.length === 0}
               className="px-8 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
               {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upload Now'}
            </button>
         </div>
      </div>
    </div>
  );
};

export default UploadIcon;
