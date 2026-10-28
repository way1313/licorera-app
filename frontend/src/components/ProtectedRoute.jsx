// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import Navbar from './Navbar/Navbar';

const ProtectedRoute = () => {
    const token = localStorage.getItem('token');

    // Si no hay token, redirigir a /login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Si está autenticado, renderizar el Sidebar junto al contenido protegido
    return (
    <div className="flex min-h-screen bg-cava-bg text-cava-text">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProtectedRoute;