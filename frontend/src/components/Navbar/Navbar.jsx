// frontend/src/components/Navbar/Navbar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ChevronDown, Bell, Crown } from 'lucide-react';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : { name: 'Administrador', email: 'admin@licorera.com', role: 'admin' };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="h-16 bg-cava-surface border-b border-cava-border px-8 flex items-center justify-between sticky top-0 z-40 shadow-md">
      <div className="flex items-center gap-2 text-xs text-cava-muted">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
        <span className="font-medium tracking-wide uppercase text-[11px] text-slate-300">Terminal Principal</span>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="p-2 text-cava-muted hover:text-amber-400 hover:bg-cava-card rounded-lg transition relative"
        >
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-cava-surface"></span>
        </button>

        <div className="h-4 w-px bg-cava-border"></div>

        {/* Dropdown de Administrador */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-cava-card transition border border-transparent hover:border-cava-border"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow-sm">
              {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-bold text-slate-200 flex items-center gap-1">
                {user.name}
                <Crown size={12} className="text-amber-400" />
              </p>
              <p className="text-[10px] text-amber-400 font-medium tracking-wider uppercase">Admin</p>
            </div>
            <ChevronDown size={14} className={`text-cava-muted transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)}></div>
              {/* Contenedor sólido opaco para evitar transparencias */}
              <div className="absolute right-0 mt-2 w-56 bg-[#1a1e27] border border-cava-border rounded-xl shadow-2xl py-2 z-40">
                <div className="px-4 py-2.5 border-b border-cava-border">
                  <p className="text-xs font-semibold text-slate-200">{user.name}</p>
                  <p className="text-[11px] text-cava-muted truncate">{user.email}</p>
                </div>
                <div className="px-2 pt-1.5">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                  >
                    <LogOut size={14} />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;