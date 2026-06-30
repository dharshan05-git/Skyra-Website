import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminGuard() {
  const { loading, isAuthenticated, isAdmin, firebaseConfigured, loginWithGoogle, error } = useAuth();
  const location = useLocation();

  const mark = <div className="admin-gate__mark"><span>S</span></div>;
  if (loading) return <div className="admin-gate">{mark}<div className="admin-spinner"/><p>Preparing your workspace…</p></div>;
  if (!firebaseConfigured) return <div className="admin-gate">{mark}<p className="admin-eyebrow">Configuration required</p><h1>Connect Firebase to open the studio</h1><p>Add the Vite Firebase credentials to the frontend environment, then refresh this page.</p></div>;
  if (!isAuthenticated) return <div className="admin-gate">{mark}<p className="admin-eyebrow">SKYRA administration</p><h1>Welcome back</h1><p>Sign in with an approved administrator Google account.</p>{error&&<div className="admin-alert admin-alert--error">{error}</div>}<button className="admin-button admin-button--primary" onClick={() => loginWithGoogle().catch(() => {})}>Continue with Google</button></div>;
  if (error) return <div className="admin-gate">{mark}<p className="admin-eyebrow">Authentication service unavailable</p><h1>We couldn’t verify your admin access</h1><p>{error}</p><button className="admin-button admin-button--secondary" onClick={() => window.location.reload()}>Try again</button></div>;
  if (!isAdmin) return <div className="admin-gate">{mark}<p className="admin-eyebrow">Access restricted</p><h1>This account is not an administrator</h1><p>Ask a SKYRA super administrator to add your email, then sign in again.</p><a className="admin-button admin-button--secondary" href="/">Return to storefront</a></div>;
  if (location.pathname === '/admin/') return <Navigate to="/admin" replace />;
  return <Outlet />;
}
