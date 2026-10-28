// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login/Login';
import Products from './pages/Products/Products';
import Movements from './pages/Movements/Movements';
import Dashboard from './pages/Dashboard/Dashboard';

/* Vistas temporales tipo placeholder
const DashboardPlaceholder = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold text-slate-800 mb-2">Dashboard de Ventas e Inventario</h1>
    <p className="text-slate-500">Aquí se visualizarán las tarjetas y gráficas de ingresos y salidas.</p>
  </div>
);

const ProductsPlaceholder = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold text-slate-800 mb-2">Inventario de Licores</h1>
    <p className="text-slate-500">Aquí se listarán, crearán y editarán los productos.</p>
  </div>
);

const MovementsPlaceholder = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold text-slate-800 mb-2">Registro de Entradas y Salidas</h1>
    <p className="text-slate-500">Aquí se registrarán compras y ventas de stock.</p>
  </div>
); */

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas (requieren token) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/movements" element={<Movements />} />
        </Route>

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;