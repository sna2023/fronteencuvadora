import { useState, useEffect, Component, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Login } from './components/Login';
import { AdminDashboard } from './components/AdminDashboard';
import { MentorDashboard } from './components/MentorDashboard';
import { Dashboard } from './components/Dashboard';
import { logout as apiLogout, type User } from './api';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: string }> {
  state = { hasError: false, error: '' };
  static getDerivedStateFromError(err: Error) { return { hasError: true, error: err.message }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-50 gap-4 p-8 text-center">
          <p className="text-lg font-medium text-red-600">Algo salió mal</p>
          <p className="text-sm text-gray-500">{this.state.error}</p>
          <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
            className="px-4 py-2 bg-[#1A365D] text-white rounded-lg text-sm cursor-pointer">
            Volver al login
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Componente de redirección estable — evita el bucle de Navigate en React Router v7 + React 19
function Redirect({ to }: { to: string }) {
  const navigate = useNavigate();
  useEffect(() => { navigate(to, { replace: true }); }, [navigate, to]);
  return null;
}

function AppRoutes({ user, onLogin, onLogout }: {
  user: User | null;
  onLogin: (u: User, t: string) => void;
  onLogout: () => void;
}) {
  const destino = !user
    ? '/login'
    : user.rol === 'administrador' ? '/admin/dashboard'
    : user.rol === 'mentor'        ? '/mentor/dashboard'
    : '/emprendedor/dashboard';

  return (
    <Routes>
      {/* Raíz */}
      <Route path="/" element={<Redirect to={destino} />} />

      {/* Login */}
      <Route
        path="/login"
        element={user ? <Redirect to={destino} /> : <Login onLogin={onLogin} />}
      />

      {/* Admin */}
      <Route
        path="/admin/*"
        element={
          user?.rol === 'administrador'
            ? <AdminDashboard user={user} onLogout={onLogout} />
            : <Redirect to="/login" />
        }
      />

      {/* Mentor */}
      <Route
        path="/mentor/*"
        element={
          user?.rol === 'mentor'
            ? <MentorDashboard user={user} onLogout={onLogout} />
            : <Redirect to="/login" />
        }
      />

      {/* Emprendedor */}
      <Route
        path="/emprendedor/*"
        element={
          user?.rol === 'emprendedor'
            ? <Dashboard user={user} onLogout={onLogout} />
            : <Redirect to="/login" />
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Redirect to={destino} />} />
    </Routes>
  );
}

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
    try { await apiLogout(); } catch { /* ignorar */ } finally {
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

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes user={user} onLogin={handleLogin} onLogout={handleLogout} />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
