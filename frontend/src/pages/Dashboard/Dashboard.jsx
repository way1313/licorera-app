// frontend/src/pages/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import {
  DollarSign,
  TrendingUp,
  Wine,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('all');

  const fetchDashboardData = async (selectedPeriod = period) => {
    try {
      setLoading(true);
      const response = await API.get(`/movements/dashboard-summary?period=${selectedPeriod}`);
      setData(response.data);
    } catch (err) {
      console.error('Error al cargar dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(period);
  }, [period]);

  const { summary, lowStockProducts, recentMovements } = data || {
    summary: { totalProducts: 0, totalPurchasesCost: 0, totalSalesRevenue: 0, lowStockAlerts: 0 },
    lowStockProducts: [],
    recentMovements: [],
  };

  const chartData = [
    {
      name: 'Balance',
      'Compras (Costo)': Number(summary?.totalPurchasesCost || 0),
      'Ventas (Ingresos)': Number(summary?.totalSalesRevenue || 0),
    },
  ];

  const filterButtons = [
    { key: 'today', label: 'Hoy' },
    { key: 'week', label: '7 días' },
    { key: 'month', label: 'Este mes' },
    { key: 'all', label: 'Histórico' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-7">
      {/* Encabezado y Filtro adaptables */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Panel de Control</h1>
          <p className="text-cava-muted text-xs mt-0.5">Métricas financieras y estado de la cava en tiempo real.</p>
        </div>

        {/* Filtros con scroll horizontal en pantallas estrechas */}
        <div className="bg-cava-surface p-1 rounded-xl border border-cava-border shadow-md flex items-center gap-1 overflow-x-auto max-w-full">
          <div className="px-2 text-cava-muted shrink-0">
            <Calendar size={14} />
          </div>
          {filterButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setPeriod(btn.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                period === btn.key
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-cava-muted hover:text-white hover:bg-cava-card'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-amber-400 text-xs">Cargando métricas...</div>
      ) : (
        <>
          {/* Tarjetas KPI: 1 col en celular, 2 en tablet, 4 en desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            <div className="bg-cava-surface p-4 sm:p-5 rounded-xl border border-cava-border hover:border-amber-500/40 transition shadow-lg flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">Ventas (Ingresos)</p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                  ${Number(summary.totalSalesRevenue || 0).toLocaleString()}
                </h3>
              </div>
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-amber-500/10 border border-amber-500/25 text-amber-400 rounded-lg flex items-center justify-center font-bold">
                <DollarSign size={20} />
              </div>
            </div>

            <div className="bg-cava-surface p-4 sm:p-5 rounded-xl border border-cava-border hover:border-slate-600 transition shadow-lg flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-cava-muted uppercase tracking-wider">Compras (Costo)</p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-200 mt-1">
                  ${Number(summary.totalPurchasesCost || 0).toLocaleString()}
                </h3>
              </div>
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-slate-800 text-slate-300 rounded-lg flex items-center justify-center font-bold border border-slate-700">
                <TrendingUp size={20} />
              </div>
            </div>

            <div className="bg-cava-surface p-4 sm:p-5 rounded-xl border border-cava-border hover:border-amber-500/40 transition shadow-lg flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-cava-muted uppercase tracking-wider">Total Licores</p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">{summary.totalProducts}</h3>
              </div>
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-cava-card text-amber-400 rounded-lg flex items-center justify-center font-bold border border-cava-border">
                <Wine size={20} />
              </div>
            </div>

            <div className="bg-cava-surface p-4 sm:p-5 rounded-xl border border-cava-border hover:border-rose-500/40 transition shadow-lg flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">Stock Crítico</p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-rose-400 mt-1">{summary.lowStockAlerts}</h3>
              </div>
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-rose-500/10 border border-rose-500/25 text-rose-400 rounded-lg flex items-center justify-center font-bold">
                <AlertTriangle size={20} />
              </div>
            </div>
          </div>

          {/* Gráfico y Alertas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-cava-surface p-4 sm:p-6 rounded-xl border border-cava-border shadow-lg">
              <h2 className="text-sm font-bold text-white mb-4 tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Comparativa de Flujo de Caja
              </h2>
              <div className="h-64 sm:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222731" />
                    <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11, fill: '#8b9bb4' }} />
                    <YAxis
                      stroke="#64748b"
                      width={55}
                      tick={{ fontSize: 10, fill: '#8b9bb4' }}
                      tickFormatter={(value) => {
                        if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
                        if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
                        return `$${value}`;
                      }}
                    />
                    <Tooltip
                      formatter={(val) => [`$${Number(val).toLocaleString()}`, '']}
                      contentStyle={{
                        backgroundColor: '#1b1f27',
                        borderRadius: '8px',
                        border: '1px solid #2b323f',
                        color: '#f1f5f9',
                        fontSize: '11px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Bar dataKey="Ventas (Ingresos)" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={55} />
                    <Bar dataKey="Compras (Costo)" fill="#475569" radius={[4, 4, 0, 0]} maxBarSize={55} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Stock por agotarse */}
            <div className="bg-cava-surface p-4 sm:p-6 rounded-xl border border-cava-border shadow-lg">
              <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-400" />
                Alertas de Stock
              </h2>
              <div className="space-y-2.5 max-h-64 lg:max-h-72 overflow-y-auto pr-1">
                {lowStockProducts.length === 0 ? (
                  <p className="text-xs text-cava-muted py-6 text-center">Todo el inventario cuenta con stock óptimo.</p>
                ) : (
                  lowStockProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 bg-cava-card rounded-lg border border-cava-border flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-slate-200 truncate">{p.name}</h4>
                        <span className="text-[11px] text-amber-400">Mín: {p.minStock} un.</span>
                      </div>
                      <span className="text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-md shrink-0">
                        {p.stock} un.
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Tabla de Actividad Reciente */}
          <div className="bg-cava-surface rounded-xl border border-cava-border shadow-lg p-4 sm:p-6">
            <h2 className="text-sm font-bold text-white mb-4 tracking-wide">Actividad Reciente</h2>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                <table className="min-w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-cava-border text-cava-muted uppercase font-semibold">
                      <th className="py-2.5 px-3">Tipo</th>
                      <th className="py-2.5 px-3">Producto</th>
                      <th className="py-2.5 px-3 text-center">Cant.</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cava-border/60">
                    {recentMovements.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-6 text-cava-muted">
                          No hay movimientos registrados en este periodo.
                        </td>
                      </tr>
                    ) : (
                      recentMovements.slice(0, 5).map((m) => (
                        <tr key={m.id} className="hover:bg-cava-card/60 transition">
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md ${
                                m.type === 'entry'
                                  ? 'text-slate-300 bg-slate-800 border border-slate-700'
                                  : 'text-amber-300 bg-amber-500/10 border border-amber-500/25'
                              }`}
                            >
                              {m.type === 'entry' ? <ArrowDownLeft size={11} /> : <ArrowUpRight size={11} />}
                              {m.type === 'entry' ? 'Entrada' : 'Salida'}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-medium text-slate-200 truncate max-w-[140px] sm:max-w-none">
                            {m.product?.name || 'Producto #' + m.productId}
                          </td>
                          <td className="py-3 px-3 text-center text-slate-300 font-semibold">{m.quantity}</td>
                          <td className="py-3 px-3 text-right font-bold text-amber-400 whitespace-nowrap">
                            ${Number(m.totalAmount).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;