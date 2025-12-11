
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, LayoutGrid, Upload, Shield } from 'lucide-react';

const NavBar = () => {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 flex items-center justify-center transition-transform group-hover:scale-105">
             <svg width="100%" height="100%" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.12501 39.2916C3.23804 39.2916 1.70834 37.762 1.70834 35.875C1.70834 33.988 3.23804 32.4583 5.12501 32.4583C7.01198 32.4583 8.54168 33.988 8.54168 35.875C8.54168 37.762 7.01198 39.2916 5.12501 39.2916Z" stroke="black" strokeWidth="1.36667" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M35.875 39.2916C33.988 39.2916 32.4583 37.762 32.4583 35.875C32.4583 33.988 33.988 32.4583 35.875 32.4583C37.762 32.4583 39.2917 33.988 39.2917 35.875C39.2917 37.762 37.762 39.2916 35.875 39.2916Z" stroke="black" strokeWidth="1.36667" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.12501 8.54168C3.23804 8.54168 1.70834 7.01198 1.70834 5.12501C1.70834 3.23804 3.23804 1.70834 5.12501 1.70834C7.01198 1.70834 8.54168 3.23804 8.54168 5.12501C8.54168 7.01198 7.01198 8.54168 5.12501 8.54168Z" stroke="black" strokeWidth="1.36667" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M35.875 8.54168C33.988 8.54168 32.4583 7.01198 32.4583 5.12501C32.4583 3.23804 33.988 1.70834 35.875 1.70834C37.762 1.70834 39.2917 3.23804 39.2917 5.12501C39.2917 7.01198 37.762 8.54168 35.875 8.54168Z" stroke="black" strokeWidth="1.36667" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M35.875 32.4583V8.54166" stroke="black" strokeWidth="1.36667" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.125 32.4583V8.54166" stroke="black" strokeWidth="1.36667" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.54166 5.125H32.4583" stroke="black" strokeWidth="1.36667" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.54166 35.875H32.4583" stroke="black" strokeWidth="1.36667" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">IconHub</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
          <Link to="/" className="hover:text-black transition-colors">Browse</Link>
          
          {role === 'designer' && (
            <>
              <Link to="/designer-dashboard" className="hover:text-black transition-colors">Dashboard</Link>
              <Link to="/editor" className="hover:text-black transition-colors">Workspace</Link>
              <Link to="/upload" className="hover:text-black transition-colors flex items-center gap-1">
                 <Upload className="w-3.5 h-3.5" /> Upload
              </Link>
            </>
          )}

          {role === 'admin' && (
            <Link to="/admin" className="hover:text-black transition-colors text-blue-600 flex items-center gap-1">
               <Shield className="w-3.5 h-3.5" /> Admin Review
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
             <Link to="/profile" className="flex flex-col items-end group">
                <span className="text-xs font-bold text-gray-900 group-hover:underline">{user.email}</span>
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">{role}</span>
             </Link>
             <button 
               onClick={handleLogout}
               className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-red-500"
               title="Sign Out"
             >
               <LogOut className="w-5 h-5" />
             </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
             <Link to="/login" className="text-sm font-bold text-gray-600 hover:text-black">Log In</Link>
             <Link to="/signup-designer" className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors shadow-sm">
               Apply as Designer
             </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
