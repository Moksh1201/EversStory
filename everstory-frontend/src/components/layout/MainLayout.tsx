import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { FaHome, FaCompass, FaPlusSquare, FaUser } from 'react-icons/fa';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-white border-b border-border fixed w-full top-0 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-primary">
              Everstory
            </Link>

            <div className="flex items-center space-x-4">
              <Link to="/" className="text-xl">
                <FaHome />
              </Link>
              <Link to="/explore" className="text-xl">
                <FaCompass />
              </Link>
              <Link to="/create" className="text-xl">
                <FaPlusSquare />
              </Link>
              <Link to={`/profile/${user?.username}`} className="text-xl">
                <FaUser />
              </Link>
              <button
                onClick={handleLogout}
                className="btn-secondary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}; 