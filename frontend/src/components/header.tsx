import { Link } from 'react-router-dom';
import { Camera, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../store/auth';

export function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          <Camera className="w-8 h-8" />
          <span>Everstory</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link
            to={`/profile/${user?.id}`}
            className="flex items-center gap-2 hover:text-gray-600"
          >
            <User className="w-5 h-5" />
            <span>{user?.name}</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-red-500 hover:text-red-600"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}