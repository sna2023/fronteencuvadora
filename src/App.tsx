import { useState, useEffect, Component, type ReactNode } from 'react';
import { getRedirectResult } from 'firebase/auth';
import { auth } from './firebase';
import { Login } from './components/Login';
import { AdminDashboard } from './components/AdminDashboard';
import { MentorDashboard } from './components/MentorDashboard';
import { Dashboard } from './components/Dashboard';
import { logout as apiLogout, firebaseLogin as apiFirebaseLogin, type User } from './api';

const originalRemoveChild = Node.prototype.removeChild;
Node.prototype.removeChild = function (child: Node) {
  try {
    return originalRemoveChild.call(this, child);
  } catch {
    return child;
  }
};

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: string }> {
  state = { hasError: false, error: '' };
  static getDerivedStateFromError(err: Error) { return { hasError: true, error: err.message }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-50 gap-4 p-8 text-center">
          <p className="text-lg font-medium text-red-600">Algo salio mal</p>
          <p className="text-sm text-gray-500">{this.state.error}</p>
          <button onClick={() => { localStorage.clear(); window.location.reload(); }}
            className="px-4 py-2 bg-[#1A365D] text-white rounded-lg text-sm cursor-pointer">
            Recargar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try { setUser(JSON.parse(savedUser)); } catch {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
      setReady(true);
    };
    init();
  }, []);

  useEffect(() => {
    if (!ready) return;
    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          const idToken = await result.user.getIdToken();
          const { user: loggedUser, token } = await apiFirebaseLogin(idToken);
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(loggedUser));
          setUser(loggedUser);
        }
      } catch {
        // silencioso
      }
    };
    handleRedirect();
  }, [ready]);

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

  return (
    <ErrorBoundary>
      {user.rol === 'administrador'
        ? <AdminDashboard user={user} onLogout={handleLogout} />
        : user.rol === 'mentor'
        ? <MentorDashboard user={user} onLogout={handleLogout} />
        : <Dashboard user={user} onLogout={handleLogout} />
      }
    </ErrorBoundary>
  );
}

export default App;
