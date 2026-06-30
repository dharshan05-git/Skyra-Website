import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function NewAdminGuard() {
  const { loading, isAuthenticated, isAdmin, firebaseConfigured, loginWithGoogle, error } = useAuth();
  const location = useLocation();

  if (loading) return <div className="new-admin-gate"><span className="new-admin-gate__gem">◇</span><div className="new-admin-loader"/><p>Preparing your dashboard…</p></div>;
  if (!firebaseConfigured) return <div className="new-admin-gate"><span className="new-admin-gate__gem">◇</span><h1>Firebase configuration required</h1><p>Add the frontend Firebase credentials before opening the admin dashboard.</p><Link to="/">Return to store</Link></div>;
  if (!isAuthenticated) return <div className="new-admin-gate"><span className="new-admin-gate__gem">◇</span><p className="new-admin-kicker">SKYRA administration</p><h1>Sign in to continue</h1><p>Use an approved Google account to access this private workspace.</p>{error&&<small>{error}</small>}<button onClick={()=>loginWithGoogle().catch(()=>{})}>Continue with Google</button><Link to="/">Return to store</Link></div>;
  if (!isAdmin) return <Navigate to="/" replace state={{ deniedFrom: location.pathname }} />;
  return <Outlet/>;
}
