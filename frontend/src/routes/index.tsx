import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout';
import { AuthLayout } from '../components/auth/auth-layout';
import { LoginPage } from '../pages/login';
import { RegisterPage } from '../pages/register';
import { FeedPage } from '../pages/feed';
import { ProfilePage } from '../pages/profile';
import { ProtectedRoute } from '../components/auth/protected-route';

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/',
        element: <FeedPage />,
      },
      {
        path: '/profile/:id',
        element: <ProfilePage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);