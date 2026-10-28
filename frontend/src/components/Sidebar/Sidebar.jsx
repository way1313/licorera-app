// frontend/src/components/Sidebar/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Wine, ArrowDownUp, LogOut } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Productos', path: '/products', icon: Wine },
    { name: 'Movimientos', path: '/movements', icon: ArrowDownUp },
  ];

  return (
    <aside className="w-64 bg-cava-surface border-r border-cava-border min-h-screen flex flex-col justify-between p-5 shadow-2xl shrink-0">
      <div>
        {/* Logo de la Licorera */}
        <div className="flex items-center gap-3.5 px-2 py-3 mb-8 border-b border-cava-border/80 pb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/15 text-lg">
            🍸
          </div>
          <div>
            <span className="font-extrabold text-base tracking-wide text-white block">
              LICORERA
            </span>
            <span className="text-[10px] text-amber-400 font-semibold tracking-widest uppercase block">
              Cava & Licores
            </span>
          </div>
        </div>

        {/* Enlaces de Navegación */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg font-medium text-xs transition duration-150 ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25 font-semibold shadow-sm'
                      : 'text-cava-muted hover:text-white hover:bg-cava-card'
                  }`
                }
              >
                <Icon size={17} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-cava-border/80">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition"
        >
          <LogOut size={16} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;