import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth.ts';

export function AdminRoute() {
  const { user } = useAuth();

  if (user?.is_admin !== 1) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}
