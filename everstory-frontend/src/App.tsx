import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Login } from './components/auth/Login';
import { Signup } from './components/auth/Signup';
import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Feed } from './components/feed/Feed';
import { UserProfilePage } from './components/user/UserProfile';
import { ImageUpload } from './components/image/ImageUpload';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Feed />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ImageUpload />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/profile/:username"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <UserProfilePage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <ToastContainer position="bottom-right" />
    </QueryClientProvider>
  );
}

export default App;
