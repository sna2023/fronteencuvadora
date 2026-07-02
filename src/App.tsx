import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { AdminDashboard } from './components/AdminDashboard';
import { MentorDashboard } from './components/MentorDashboard';
import { Dashboard } from './components/Dashboard';
import { logout as apiLogout, type User } from './api';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setReady(true);
  }, []);

  const handleLogin = (loggedUser: User, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(loggedUser));
    setUser(loggedUser);
  };

  const handleLogout = async () => {
    try { await apiLogout(); } catch {} finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  if (!ready) return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return user.rol === 'administrador'
    ? <AdminDashboard user={user} onLogout={handleLogout} />
    : user.rol === 'mentor'
    ? <MentorDashboard user={user} onLogout={handleLogout} />
    : <Dashboard user={user} onLogout={handleLogout} />;
}

export default App;
