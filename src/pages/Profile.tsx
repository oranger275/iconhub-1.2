
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Shield, Palette, Clock, ArrowRight } from 'lucide-react';

const Profile = () => {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    setProfileData(data);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const getRoleBadge = () => {
    switch (role) {
      case 'admin': return <span className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase"><Shield className="w-3 h-3" /> Admin</span>;
      case 'designer': return <span className="flex items-center gap-1 bg-black text-white px-3 py-1 rounded-full text-xs font-bold uppercase"><Palette className="w-3 h-3" /> Designer</span>;
      case 'pending_designer': return <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold uppercase"><Clock className="w-3 h-3" /> Pending Review</span>;
      default: return <span className="flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase"><User className="w-3 h-3" /> User</span>;
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Profile</h1>
      
      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm mb-6">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
             <User className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{profileData?.full_name || user?.email}</h2>
            <p className="text-gray-500 mb-2">{user?.email}</p>
            {getRoleBadge()}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
           <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Account Actions</h3>
           
           {/* Apply Logic */}
           {role === 'user' && (
             <div className="bg-gray-50 rounded-xl p-6 mb-4 border border-gray-100">
               <h4 className="font-bold text-gray-900 mb-2">Want to become a Designer?</h4>
               <p className="text-sm text-gray-500 mb-4">Upload your icons and share them with the community.</p>
               <button 
                 onClick={() => navigate('/apply-designer')}
                 className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors flex items-center gap-2"
               >
                 Apply Now <ArrowRight className="w-4 h-4" />
               </button>
             </div>
           )}

           {role === 'pending_designer' && (
             <div className="bg-yellow-50 rounded-xl p-4 mb-4 border border-yellow-100 text-yellow-800 text-sm">
               Your application is currently under review by our administrators.
             </div>
           )}
           
           <button 
             onClick={handleLogout}
             className="w-full py-3 border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 hover:text-red-600 transition-colors flex items-center justify-center gap-2"
           >
             <LogOut className="w-4 h-4" /> Sign Out
           </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
