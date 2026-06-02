import { useEffect, useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppLayout } from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import ProxySettings from './pages/ProxySettings';
import { LoginDialog } from './components/auth/LoginDialog';
import { authApi } from './lib/api';

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setAuthenticated(false);
      setChecking(false);
      return;
    }
    try {
      await authApi.check();
      setAuthenticated(true);
    } catch {
      localStorage.removeItem('auth_token');
      setAuthenticated(false);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    const handler = () => {
      setAuthenticated(false);
    };
    window.addEventListener('auth-required', handler);
    return () => window.removeEventListener('auth-required', handler);
  }, [checkAuth]);

  const handleLoginSuccess = () => {
    setAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setAuthenticated(false);
  };

  if (checking) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">正在验证身份...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <>
        <Toaster position="top-right" richColors closeButton />
        <LoginDialog open={true} onSuccess={handleLoginSuccess} />
      </>
    );
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors closeButton />
      <Routes>
        <Route element={<AppLayout onLogout={handleLogout} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/proxy" element={<ProxySettings />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
