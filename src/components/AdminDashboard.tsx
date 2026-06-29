import React, { useState } from 'react';
import { LogOut, LayoutDashboard, UserCog, ClipboardCheck, UserCheck, BarChart3 } from 'lucide-react';
import { NotificacionesBell } from './NotificacionesBell';
import type { User } from '../api';
import { AdminDashboardPage } from '../pages/admin/DashboardPage';
import { GestionUsuariosPage } from '../pages/admin/GestionUsuariosPage';
import { AprobarProyectosPage } from '../pages/admin/AprobarProyectosPage';
import { AsignarDocentePage } from '../pages/admin/AsignarDocentePage';
import { ReportesPage } from '../pages/admin/ReportesPage';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [page, setPage] = useState('dashboard');

  const navItems = [
    { id: 'dashboard',      label: 'Control Principal', icon: LayoutDashboard },
    { id: 'proyectos',      label: 'Aprobar Proyectos', icon: ClipboardCheck },
    { id: 'asignar-mentor', label: 'Asignar Mentor',    icon: UserCheck },
    { id: 'usuarios',       label: 'Gestión Usuarios',  icon: UserCog },
    { id: 'reportes',       label: 'Reportes',          icon: BarChart3 },
  ];

  const renderPage = () => {
    switch (page) {
      case 'proyectos':      return <AprobarProyectosPage />;
      case 'asignar-mentor': return <AsignarDocentePage />;
      case 'usuarios':       return <GestionUsuariosPage />;
      case 'reportes':       return <ReportesPage />;
      default:               return <AdminDashboardPage onNavigate={setPage} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans selection:bg-[#1A365D] selection:text-white overflow-hidden">

      <aside className="w-64 bg-[#1A365D] text-white flex flex-col relative z-20 shrink-0">
        <div className="h-16 flex items-center gap-3 px-5 border-b border-white/10 bg-[#0F2442]">
          <LayoutDashboard className="w-5 h-5 text-white opacity-80" />
          <span className="text-base font-medium tracking-tight">Portal Administrador</span>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-normal transition-colors cursor-pointer text-sm
                ${page === item.id
                  ? 'bg-white text-[#1A365D]'
                  : 'text-blue-200 hover:bg-white/10 hover:text-white'}`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-normal text-sm text-blue-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer">
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end gap-2 px-8 z-10 shrink-0">
          <NotificacionesBell accentColor="#1A365D" onNavigate={(url) => {
            if (url.includes('/usuarios')) setPage('usuarios');
            else if (url.includes('/proyectos')) setPage('proyectos');
            else if (url.includes('/asignar-mentor')) setPage('asignar-mentor');
            else if (url.includes('/reportes')) setPage('reportes');
          }} />
          <div className="relative" onMouseEnter={() => setIsProfileOpen(true)} onMouseLeave={() => setIsProfileOpen(false)}>
            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer p-2 rounded-lg hover:bg-gray-50">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-[#1A365D] leading-none">{user.nombre}</p>
                <p className="text-xs text-gray-500 mt-1">{user.correo}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#1A365D] text-white flex items-center justify-center text-sm">
                {user.nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-6xl mx-auto w-full">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
};
