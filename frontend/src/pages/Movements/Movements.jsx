// frontend/src/pages/Movements/Movements.jsx
import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { ArrowDownLeft, ArrowUpRight, PlusCircle, CheckCircle2, AlertCircle, Download } from 'lucide-react';

const Movements = () => {
  const [products, setProducts] = useState([]);
  const [recentMovements, setRecentMovements] = useState([]);
  const [formData, setFormData] = useState({
    productId: '',
    type: 'exit',
    quantity: '',
    reason: '',
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      const [prodsRes, dashRes] = await Promise.all([
        API.get('/products'),
        API.get('/movements/dashboard-summary'),
      ]);
      setProducts(prodsRes.data);
      setRecentMovements(dashRes.data.recentMovements || []);
      if (prodsRes.data.length > 0 && !formData.productId) {
        setFormData((prev) => ({ ...prev, productId: prodsRes.data[0].id }));
      }
    } catch (err) {
      console.error('Error al cargar datos:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      await API.post('/movements', formData);
      setMessage({ text: 'Movimiento registrado correctamente', type: 'success' });
      setFormData((prev) => ({ ...prev, quantity: '', reason: '' }));
      loadData();
    } catch (err) {
      setMessage({
        text: err.response?.data?.error || 'Error al registrar movimiento',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportMovements = () => {
    try {
      if (!recentMovements || recentMovements.length === 0) {
        alert('No hay movimientos disponibles para exportar.');
        return;
      }

      const headers = ['Fecha y Hora', 'Tipo', 'Producto', 'Cantidad', 'Precio Unitario', 'Total', 'Observación'];

      const rows = recentMovements.map((m) => {
        const fecha = new Date(m.createdAt).toLocaleDateString() + ' ' + new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const tipo = m.type === 'entry' ? 'Entrada (Compra)' : 'Salida (Venta)';
        const prod = m.product?.name || `ID #${m.productId}`;
        return [
          `"${fecha}"`,
          `"${tipo}"`,
          `"${prod.replace(/"/g, '""')}"`,
          `"${m.quantity}"`,
          `"${m.unitPrice}"`,
          `"${m.totalAmount}"`,
          `"${(m.reason || 'Sin observación').replace(/"/g, '""')}"`
        ].join(';');
      });

      const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte_movimientos_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error al exportar movimientos:', err);
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-7">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Entradas y Salidas de Mercancía</h1>
        <p className="text-cava-muted text-xs mt-0.5">Registra compras a distribuidores, ventas al mostrador y ajustes de cava.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario de registro */}
        <div className="bg-cava-surface rounded-xl p-6 border border-cava-border shadow-lg h-fit">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <PlusCircle size={18} className="text-amber-400" />
            Nuevo Movimiento
          </h2>

          {message.text && (
            <div
              className={`p-3 rounded-lg mb-4 flex items-center gap-2 text-xs font-semibold ${
                message.type === 'success'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}
            >
              {message.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-cava-muted uppercase mb-1.5">
                Tipo de Operación
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'exit' })}
                  className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    formData.type === 'exit'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-400 shadow-sm'
                      : 'border-cava-border text-cava-muted hover:bg-cava-card'
                  }`}
                >
                  <ArrowUpRight size={15} /> Salida (Venta)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'entry' })}
                  className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    formData.type === 'entry'
                      ? 'bg-slate-700/60 border-slate-500 text-slate-100 shadow-sm'
                      : 'border-cava-border text-cava-muted hover:bg-cava-card'
                  }`}
                >
                  <ArrowDownLeft size={15} /> Entrada (Compra)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-cava-muted uppercase mb-1.5">
                Producto
              </label>
              <select
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#1c2029] border border-cava-border text-white outline-none focus:border-amber-400"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#15181e] text-white">
                    {p.name} (Stock: {p.stock})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-cava-muted uppercase mb-1.5">
                Cantidad de Unidades
              </label>
              <input
                type="number"
                name="quantity"
                min="1"
                required
                value={formData.quantity}
                onChange={handleChange}
                placeholder="ej. 2"
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#1c2029] border border-cava-border text-white outline-none focus:border-amber-400 placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-cava-muted uppercase mb-1.5">
                Motivo / Detalle (Opcional)
              </label>
              <input
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="ej. Venta mostrador, Pedido distribuidor"
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#1c2029] border border-cava-border text-white outline-none focus:border-amber-400 placeholder:text-slate-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading || products.length === 0}
              className="w-full mt-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 px-4 rounded-lg shadow-md transition text-xs uppercase tracking-wider disabled:opacity-50"
            >
              {loading ? 'Procesando...' : 'Confirmar Movimiento'}
            </button>
          </form>
        </div>

        {/* Tabla de Movimientos */}
        <div className="lg:col-span-2 bg-cava-surface rounded-xl border border-cava-border shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white tracking-wide">Últimos Movimientos Registrados</h2>
            <button
              onClick={handleExportMovements}
              className="flex items-center gap-1.5 text-xs font-semibold text-cava-text hover:text-amber-400 bg-cava-card px-3 py-1.5 rounded-lg border border-cava-border transition"
            >
              <Download size={13} className="text-amber-400" />
              Exportar CSV / Excel
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-cava-border text-cava-muted uppercase font-semibold bg-cava-card/40">
                  <th className="py-2.5 px-3">Tipo</th>
                  <th className="py-2.5 px-3">Producto</th>
                  <th className="py-2.5 px-3 text-center">Cantidad</th>
                  <th className="py-2.5 px-3 text-right">Monto Total</th>
                  <th className="py-2.5 px-3">Motivo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cava-border/60">
                {recentMovements.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-cava-muted">
                      No hay movimientos registrados todavía.
                    </td>
                  </tr>
                ) : (
                  recentMovements.map((m) => {
                    const isEntry = m.type === 'entry';
                    return (
                      <tr key={m.id} className="hover:bg-cava-card/60 transition">
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                              isEntry
                                ? 'bg-slate-800 text-slate-300 border border-slate-700'
                                : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {isEntry ? <ArrowDownLeft size={11} /> : <ArrowUpRight size={11} />}
                            {isEntry ? 'Entrada' : 'Salida'}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-medium text-white">
                          {m.product?.name || 'Producto #' + m.productId}
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-slate-300">
                          {m.quantity} un.
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-amber-400">
                          ${Number(m.totalAmount).toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-cava-muted">
                          {m.reason || 'Sin observación'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movements;