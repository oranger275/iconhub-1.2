
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { iconService } from '../api/iconService';
import { Link } from 'react-router-dom';
import { UploadCloud, LayoutGrid, BarChart3, ArrowRight } from 'lucide-react';

const DesignerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalIcons: 0, totalGroups: 0 });
  const [recentIcons, setRecentIcons] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    const [icons, groups] = await Promise.all([
      iconService.fetchDesignerIcons(user.id),
      iconService.fetchDesignerGroups(user.id)
    ]);
    setStats({ totalIcons: icons.length, totalGroups: groups.length });
    setRecentIcons(icons.slice(0, 5));
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
           <p className="text-gray-500">Welcome back, creator.</p>
        </div>
        <Link to="/upload" className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:-translate-y-1 flex items-center gap-2">
           <UploadCloud className="w-4 h-4" /> Upload New
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4 mb-2">
               <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><LayoutGrid className="w-5 h-5" /></div>
               <span className="text-gray-500 font-medium">Total Icons</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{stats.totalIcons}</h3>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4 mb-2">
               <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><BarChart3 className="w-5 h-5" /></div>
               <span className="text-gray-500 font-medium">Collections</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{stats.totalGroups}</h3>
         </div>
         <div className="bg-gradient-to-br from-gray-900 to-black text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between">
            <div>
               <h3 className="font-bold text-lg mb-1">Manage Library</h3>
               <p className="text-gray-400 text-sm">Organize and edit your icons.</p>
            </div>
            <Link to="/editor" className="flex items-center gap-2 text-sm font-bold hover:underline mt-4">
              Go to Workspace <ArrowRight className="w-4 h-4" />
            </Link>
         </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
         <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Recent Uploads</h3>
            <Link to="/editor" className="text-sm text-blue-600 hover:underline">View All</Link>
         </div>
         <div className="divide-y divide-gray-100">
            {recentIcons.length === 0 ? (
               <div className="p-8 text-center text-gray-400">No icons uploaded yet.</div>
            ) : (
               recentIcons.map(icon => (
                  <div key={icon.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-lg p-2 border border-gray-100" dangerouslySetInnerHTML={{ __html: icon.content }}></div>
                        <span className="font-medium text-gray-700">{icon.name}</span>
                     </div>
                     <span className="text-xs text-gray-400 font-mono">{new Date(icon.createdAt).toLocaleDateString()}</span>
                  </div>
               ))
            )}
         </div>
      </div>
    </div>
  );
};

export default DesignerDashboard;
