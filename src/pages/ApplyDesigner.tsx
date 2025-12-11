
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Send, Link as LinkIcon, Loader2 } from 'lucide-react';

const ApplyDesigner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [portfolio, setPortfolio] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: 'pending_designer',
          portfolio_url: portfolio
          // You could add a 'bio' or 'application_reason' column to DB if needed
        })
        .eq('id', user.id);

      if (error) throw error;
      
      alert("Application submitted successfully!");
      navigate('/profile');
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Designer Application</h1>
      <p className="text-gray-500 mb-8 text-sm">Submit your portfolio to join our creator community.</p>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Portfolio URL</label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="url" 
              required
              placeholder="https://dribbble.com/yourname"
              value={portfolio}
              onChange={e => setPortfolio(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all"
            />
          </div>
        </div>

        <div>
           <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Why do you want to join?</label>
           <textarea 
             className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all h-32"
             placeholder="Tell us about your style..."
             value={reason}
             onChange={e => setReason(e.target.value)}
           ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Submit Application <Send className="w-4 h-4" /></>}
        </button>
      </form>
    </div>
  );
};

export default ApplyDesigner;
