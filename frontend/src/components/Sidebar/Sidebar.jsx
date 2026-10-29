// frontend/src/components/Sidebar/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Wine, ArrowDownUp, LogOut, X } from 'lucide-react';

const Sidebar = ({ isOpen = false, onClose = () => {} }) => {
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
    <>
      {/* Fondo oscuro traslúcido para móviles */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Menú lateral deslizable */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-cava-surface border-r border-cava-border flex flex-col justify-between p-5 shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Cabecera Sidebar con botón cerrar en móvil */}
          <div className="flex items-center justify-between gap-3 px-2 py-3 mb-6 border-b border-cava-border/80 pb-5">
            <div className="flex items-center gap-3">
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

            <button 
              type="button"
              onClick={onClose} 
              className="p-1 text-cava-muted hover:text-white lg:hidden rounded-lg cursor-pointer"
              title="Cerrar menú"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navegación */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
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
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition cursor-pointer"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;