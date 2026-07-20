import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, authPersistenceReady, firebaseConfigured, googleProvider } from '../services/firebase.js';

const AuthContext = createContext(null);
const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

async function loadProfile(firebaseUser) {
  const token = await firebaseUser.getIdToken();
  let response;
  try {
    response = await fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
  } catch (err) {
    throw new Error('Authentication service unavailable. Failed to fetch', { cause: err });
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || 'Unable to load your SKYRA profile.');
  return payload.data;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState('customer');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refreshProfile = useCallback(async (currentUser = auth?.currentUser) => {
    if (!currentUser) return null;
    const data = await loadProfile(currentUser);
    setProfile(data.user);
    setRole(data.role || 'customer');
    return data;
  }, []);

  useEffect(() => {
    if (!auth) { queueMicrotask(() => setLoading(false)); return undefined; }
    return onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setError('');
      if (!currentUser) { setProfile(null); setRole('customer'); setLoading(false); return; }
      try { await refreshProfile(currentUser); } catch (err) {
        setError(err.message);
        setProfile(null);
        setRole('customer');
      }
      finally { setLoading(false); }
    });
  }, [refreshProfile]);

  useEffect(() => {
    if (!user) return undefined;
    const timer = setInterval(() => {
      refreshProfile(user).catch(() => {});
    }, 30000);
    return () => clearInterval(timer);
  }, [refreshProfile, user]);

  const loginWithGoogle = useCallback(async () => {
    if (!auth || !googleProvider) throw new Error('Firebase is not configured.');
    setError('');
    await authPersistenceReady;
    return signInWithPopup(auth, googleProvider);
  }, []);
  const logout = useCallback(() => auth ? signOut(auth) : Promise.resolve(), []);

  const value = useMemo(() => ({ user, profile, role, loading, error, firebaseConfigured, isAuthenticated: Boolean(user), isAdmin: ['superadmin', 'admin', 'manager'].includes(role), loginWithGoogle, logout, refreshProfile }), [user, profile, role, loading, error, loginWithGoogle, logout, refreshProfile]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
