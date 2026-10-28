// frontend/src/pages/Login/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const cleanEmail = email.trim();
      const cleanPassword = password.trim();
      const response = await API.post('/auth/login', { 
        email: cleanEmail, 
        password: cleanPassword 
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0f12] flex items-center justify-center p-4">
      <div className="bg-[#15181e] rounded-xl shadow-2xl border border-[#2b323f] max-w-sm w-full p-8 relative">
        {/* Cabecera */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl mb-3 text-xl font-bold shadow-sm">
            🍸
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-wide">
            Cava & Licorera
          </h2>
          <p className="text-xs text-[#8b9bb4] mt-1">Acceso administrativo exclusivo</p>
        </div>

        {/* Alerta de error */}
        {error && (
          <div className="mb-4 bg-rose-500/10 border border-rose-500/25 text-rose-400 px-3 py-2.5 rounded-lg flex items-center gap-2 text-xs">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-[#8b9bb4] uppercase tracking-wider mb-1.5">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@licorera.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-[#1c2029] border border-[#2b323f] text-white text-xs outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition placeholder:text-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#8b9bb4] uppercase tracking-wider mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-[#1c2029] border border-[#2b323f] text-white text-xs outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition placeholder:text-slate-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 px-4 rounded-lg shadow-md transition duration-150 flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <span>Entrar al Sistema</span>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;