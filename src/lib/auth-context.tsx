'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AuthUser {
  role: 'admin' | 'employer';
  userName: string;
  sessionId: string;
  currentIp: string;
}

interface AuthContextType {
  role: 'admin' | 'employer' | null;
  userName: string;
  sessionId: string;
  currentIp: string;
  isAuthenticated: boolean | null; // null during initial check
  login: (password: string, deviceName?: string) => Promise<{ success: boolean; role?: string; error?: string }>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  role: null,
  userName: '',
  sessionId: '',
  currentIp: '',
  isAuthenticated: null,
  login: async () => ({ success: false }),
  logout: () => {},
  refreshAuth: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<'admin' | 'employer' | null>(null);
  const [userName, setUserName] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [currentIp, setCurrentIp] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/verify');
      const data = await res.json();

      if (data.authenticated && data.role) {
        setRole(data.role);
        setUserName(data.userName || (data.role === 'admin' ? 'Sameer (Executive Admin)' : 'Employer Staff'));
        setSessionId(data.sessionId || '');
        setCurrentIp(data.currentIp || '127.0.0.1');
        setIsAuthenticated(true);
        localStorage.setItem('samvero_portal_session', 'active');
        localStorage.setItem('samvero_portal_role', data.role);
      } else {
        // Fallback to local storage if network glitch
        const storedRole = localStorage.getItem('samvero_portal_role') as 'admin' | 'employer' | null;
        const storedAuth = localStorage.getItem('samvero_portal_session');

        if (storedAuth === 'active' && storedRole) {
          setRole(storedRole);
          setUserName(storedRole === 'admin' ? 'Sameer (Executive Admin)' : 'Employer Staff');
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setRole(null);
        }
      }
    } catch {
      setIsAuthenticated(false);
      setRole(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (password: string, customDeviceName?: string) => {
    try {
      // Gather real client hardware & telemetry hints
      let clientPublicIp = '';
      try {
        const ipRes = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(2000) });
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          clientPublicIp = ipData.ip || '';
        }
      } catch {
        // Fallback to server-side IP resolution
      }

      const screenInfo = typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : '';
      const platformHint = typeof window !== 'undefined' ? navigator.platform : '';
      const cores = typeof navigator !== 'undefined' && navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency}-Core` : '';
      const timezone = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : '';
      
      const realDeviceLabel = customDeviceName || (platformHint ? `${platformHint} (${cores || 'Workstation'}, ${screenInfo})` : 'Desktop PC');

      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          password,
          deviceName: realDeviceLabel,
          locationHint: timezone ? timezone.replace('_', ' ') : '',
          clientPublicIp,
        }),
      });

      const data = await res.json();

      if (data.success && data.role) {
        setRole(data.role);
        setUserName(data.userName);
        setSessionId(data.sessionId);
        setCurrentIp(data.ipAddress || clientPublicIp || '72.255.61.191');
        setIsAuthenticated(true);

        localStorage.setItem('samvero_portal_session', 'active');
        localStorage.setItem('samvero_portal_role', data.role);

        return { success: true, role: data.role };
      } else {
        return { success: false, error: data.error || 'Invalid credentials' };
      }
    } catch (err: any) {
      return { success: false, error: err?.message || 'Login network error' };
    }
  };

  const logout = () => {
    localStorage.removeItem('samvero_portal_session');
    localStorage.removeItem('samvero_portal_role');
    document.cookie = 'samvero_portal_token=; Max-Age=0; path=/;';
    document.cookie = 'samvero_portal_role=; Max-Age=0; path=/;';
    document.cookie = 'samvero_portal_session_id=; Max-Age=0; path=/;';
    document.cookie = 'samvero_portal_user=; Max-Age=0; path=/;';
    setIsAuthenticated(false);
    setRole(null);
    setUserName('');
    setSessionId('');
    window.location.reload();
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        userName,
        sessionId,
        currentIp,
        isAuthenticated,
        login,
        logout,
        refreshAuth: checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
