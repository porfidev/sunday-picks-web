import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth.ts';

export function ProtectedRoute() {
  const { authData } = useAuth();
  if (!authData) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
