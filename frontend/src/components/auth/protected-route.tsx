import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { session } = useAuthStore();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}