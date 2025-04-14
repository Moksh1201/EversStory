import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'sonner';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Feed } from './components/feed/Feed';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { MainLayout } from './components/layout/MainLayout';
import { UserProfilePage } from './components/user/UserProfile';
import { ImageUpload } from './components/image/ImageUpload';

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
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
        <Toaster position="bottom-right" />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
