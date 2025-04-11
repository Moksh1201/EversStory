import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage } from './features/auth/pages/LoginPage';
import { RegisterPage } from './features/auth/pages/RegisterPage';
import { ProtectedRoute } from './shared/components/ProtectedRoute';
import { useAuthStore } from './features/auth/store';
import { useEffect } from 'react';
import { getCurrentUser } from './features/auth/api';

function App() {
  const { token, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const user = await getCurrentUser(token);
          setUser(user);
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token, setUser, setLoading]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div>Home Page (Protected)</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
