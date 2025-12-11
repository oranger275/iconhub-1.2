
import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Loader2, Search } from 'lucide-react';
import { processSvgContent } from '../services/svgUtils';

const UserBrowse = () => {
  const [icons, setIcons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // 默认配置用于预览
  const config = { size: 48, strokeWidth: 1.5, color: '#000000' };

  useEffect(() => {
    fetchIcons();
  }, []);

  const fetchIcons = async () => {
    setLoading(true);
    // 假设 'icons' 表包含: id, name, content, type, profiles(full_name)
    // 需要在 Supabase 设置外键关联 profiles
    const { data, error } = await supabase
      .from('icons')
      .select(`
        *,
        profiles:designer_id (full_name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching icons:', error);
    } else {
      setIcons(data || []);
    }
    setLoading(false);
  };

  const filteredIcons = icons.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 h-full flex flex-col bg-gray-50/50">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">探索图标</h1>
            <p className="text-gray-500 text-sm">来自社区设计师的精选作品</p>
        </div>
        <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
             <input 
                type="text" 
                placeholder="搜索图标..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none"
             />
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredIcons.map((icon) => (
            <div key={icon.id} className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1 group cursor-pointer">
              <div 
                className="flex items-center justify-center mb-4 text-gray-800"
                dangerouslySetInnerHTML={{ __html: processSvgContent(icon.content, config, icon.type || 'line') }}
              />
              <div className="text-center">
                <h3 className="font-bold text-gray-900 text-sm truncate">{icon.name}</h3>
                <p className="text-xs text-gray-400 mt-1">
                  by {icon.profiles?.full_name || 'Unknown'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBrowse;
