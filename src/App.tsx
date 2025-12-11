
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import NavBar from './components/NavBar';

// Pages
import UserBrowse from './pages/UserBrowse';
import DesignerEditor from './pages/DesignerEditor'; // Acts as Workspace
import AdminReview from './pages/AdminReview';
import Login from './pages/Login';
import SignupDesigner from './pages/SignupDesigner';
import Profile from './pages/Profile';
import ApplyDesigner from './pages/ApplyDesigner';
import DesignerDashboard from './pages/DesignerDashboard';
import UploadIcon from './pages/UploadIcon';

// Route Guard Component
const ProtectedRoute = ({ children, allowedRoles }: { children?: React.ReactNode, allowedRoles?: string[] }) => {
  const { user, role, loading } = useAuth();

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Redirect based on actual role
    if (role === 'user') return <Navigate to="/profile" replace />;
    if (role === 'designer') return <Navigate to="/designer-dashboard" replace />;
    if (role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-slate-800 font-sans">
          <NavBar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<UserBrowse />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup-designer" element={<SignupDesigner />} />

            {/* User & Generic Protected */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/apply-designer" element={
              <ProtectedRoute allowedRoles={['user']}>
                <ApplyDesigner />
              </ProtectedRoute>
            } />

            {/* Designer Routes */}
            <Route path="/designer-dashboard" element={
              <ProtectedRoute allowedRoles={['designer', 'admin']}>
                <DesignerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/editor" element={
              <ProtectedRoute allowedRoles={['designer', 'admin']}>
                <DesignerEditor />
              </ProtectedRoute>
            } />
            <Route path="/upload" element={
              <ProtectedRoute allowedRoles={['designer', 'admin']}>
                <UploadIcon />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminReview />
              </ProtectedRoute>
            } />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
