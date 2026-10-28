// frontend/src/pages/Products/Products.jsx
import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Plus, Wine, Trash2, Edit3, AlertTriangle, Search, X, Download } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialFormState = {
    name: '',
    category: 'Whisky',
    price: '',
    costPrice: '',
    stock: '',
    minStock: 5,
    imageUrl: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  const categories = [
    'Whisky',
    'Ron',
    'Aguardiente',
    'Tequila',
    'Vinos',
    'Cervezas',
    'Ginebra',
    'Vodka',
    'Otros',
  ];

  const fetchProducts = async () => {
    try {
      const response = await API.get('/products');
      setProducts(response.data);
    } catch (err) {
      console.error('Error al cargar productos:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      costPrice: product.costPrice,
      stock: product.stock,
      minStock: product.minStock,
      imageUrl: product.imageUrl || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/products/${editingId}`, formData);
      } else {
        await API.post('/products', formData);
      }

      setIsModalOpen(false);
      setEditingId(null);
      setFormData(initialFormState);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al guardar el producto');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
      try {
        await API.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        alert('Error al eliminar el producto');
      }
    }
  };

  const handleExportProducts = () => {
    try {
      if (!products || products.length === 0) {
        alert('No hay productos disponibles para exportar.');
        return;
      }

      const headers = ['Producto', 'Categoría', 'Costo Compra', 'Precio Venta', 'Stock Actual', 'Stock Mínimo'];

      const rows = products.map((p) => [
        `"${(p.name || '').replace(/"/g, '""')}"`,
        `"${(p.category || '').replace(/"/g, '""')}"`,
        `"${p.costPrice || 0}"`,
        `"${p.price || 0}"`,
        `"${p.stock || 0}"`,
        `"${p.minStock || 0}"`
      ].join(';'));

      const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `inventario_licorera_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error detallado:', err);
      alert('Error: ' + err.message);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Inventario de Productos</h1>
          <p className="text-cava-muted text-xs mt-0.5">Gestiona el catálogo de licores, costos y precios de venta.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportProducts}
            className="flex items-center gap-2 bg-cava-surface hover:bg-cava-card text-cava-text font-medium px-4 py-2 rounded-lg border border-cava-border shadow-sm transition text-xs"
          >
            <Download size={15} className="text-amber-400" />
            Exportar Inventario
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg shadow-md transition text-xs"
          >
            <Plus size={16} />
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* Buscador */}
      <div className="bg-cava-surface p-3.5 rounded-xl border border-cava-border shadow-md flex items-center gap-3">
        <Search size={17} className="text-cava-muted shrink-0" />
        <input
          type="text"
          placeholder="Buscar licor por nombre o categoría..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs outline-none bg-transparent text-white placeholder:text-cava-muted"
        />
      </div>

      {/* Tabla de Productos */}
      <div className="bg-cava-surface rounded-xl border border-cava-border shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-cava-border text-cava-muted uppercase font-semibold bg-cava-card/50">
                <th className="py-3 px-4">Producto</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4 text-right">Precio Venta</th>
                <th className="py-3 px-4 text-right">Costo</th>
                <th className="py-3 px-4 text-center">Stock</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cava-border/60">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-cava-muted">
                    No se encontraron productos registrados.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((item) => {
                  const isLow = Number(item.stock) <= Number(item.minStock);
                  return (
                    <tr key={item.id} className="hover:bg-cava-card/60 transition">
                      <td className="py-3.5 px-4 flex items-center gap-3 font-medium text-white">
                        <div className="w-8 h-8 rounded-lg bg-cava-card text-amber-400 border border-cava-border flex items-center justify-center shrink-0">
                          <Wine size={16} />
                        </div>
                        {item.name}
                      </td>
                      <td className="py-3.5 px-4 text-cava-muted">
                        <span className="bg-cava-card border border-cava-border px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-300">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-amber-400">
                        ${Number(item.price).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right text-cava-muted">
                        ${Number(item.costPrice).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                            isLow
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {isLow && <AlertTriangle size={11} />}
                          {item.stock} un.
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 text-cava-muted hover:text-amber-400 hover:bg-cava-card rounded-md transition"
                            title="Editar producto"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 text-cava-muted hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition"
                            title="Eliminar producto"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Reutilizable Crear / Editar */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#15181e] rounded-xl p-6 w-full max-w-lg shadow-2xl border border-[#2b323f]">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#2b323f]">
              <h3 className="font-bold text-white text-base">
                {editingId ? 'Editar Producto' : 'Registrar Nuevo Producto'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-cava-muted hover:text-white p-1 rounded-md"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-cava-muted uppercase mb-1">Nombre</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="ej. Whisky Buchanan's 12 Años 750ml"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#1c2029] border border-[#2b323f] text-white focus:border-amber-400 focus:outline-none placeholder:text-slate-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-cava-muted uppercase mb-1">Categoría</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[#1c2029] border border-[#2b323f] text-white focus:border-amber-400 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c} className="bg-[#15181e] text-white">{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-cava-muted uppercase mb-1">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    min="0"
                    required
                    placeholder="0"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[#1c2029] border border-[#2b323f] text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-cava-muted uppercase mb-1">Costo Compra ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="costPrice"
                    required
                    placeholder="80000"
                    value={formData.costPrice}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[#1c2029] border border-[#2b323f] text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-cava-muted uppercase mb-1">Precio Venta ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    required
                    placeholder="115000"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[#1c2029] border border-[#2b323f] text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-cava-muted uppercase mb-1">Stock Mínimo (Alerta)</label>
                <input
                  type="number"
                  name="minStock"
                  min="1"
                  value={formData.minStock}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#1c2029] border border-[#2b323f] text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-cava-muted hover:text-white rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg shadow transition"
                >
                  {editingId ? 'Guardar Cambios' : 'Guardar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;