
import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Check, X, ExternalLink, ShieldAlert, Loader2 } from 'lucide-react';

const AdminReview = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // 获取所有待审核的设计师
  const fetchApplications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'pending_designer');

    if (error) {
      console.error('Error fetching applications:', error);
    } else {
      setApplications(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleReview = async (id, status) => {
    // status: 'designer' (通过) 或 'user' (拒绝，降级为普通用户)
    const { error } = await supabase
      .from('profiles')
      .update({ role: status })
      .eq('id', id);

    if (error) {
      alert('操作失败');
    } else {
      // 从本地列表中移除已处理的项
      setApplications(applications.filter(app => app.id !== id));
      alert(status === 'designer' ? '已批准该申请' : '已拒绝该申请');
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-red-100 rounded-xl text-red-600">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">管理员审核台</h1>
          <p className="text-gray-500">审批设计师入驻申请</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
          <p className="text-gray-500 font-medium">当前没有待审核的申请</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  {app.full_name || '未命名用户'}
                  <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full uppercase tracking-wider">Pending</span>
                </h3>
                <p className="text-sm text-gray-500 mb-2">{app.email}</p>
                {app.portfolio_url && (
                  <a 
                    href={app.portfolio_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline font-medium"
                  >
                    查看作品集 <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleReview(app.id, 'user')}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-red-600 font-medium text-sm transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" /> 拒绝
                </button>
                <button
                  onClick={() => handleReview(app.id, 'designer')}
                  className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 font-medium text-sm shadow-md transition-colors flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> 批准
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReview;
