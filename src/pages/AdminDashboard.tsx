import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product, SIZES } from '../types';
import JerseyImage from '../components/JerseyImage';
import AdminSettings from './AdminSettings';

type AdminTab = 'products' | 'settings';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState('');
  const [team, setTeam] = useState('');
  const [size, setSize] = useState<string>(SIZES[0] as string);
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [stock, setStock] = useState('');

  useEffect(() => {
    checkAuth();
    fetchProducts();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin/login');
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setName('');
    setTeam('');
    setSize(SIZES[0] as string);
    setPrice('');
    setImageUrl('');
    setStock('');
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name,
      team,
      size,
      price: Number(price),
      image_url: imageUrl,
      stock: Number(stock),
    };

    if (editingProduct) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.id);
      if (error) { alert('Error al actualizar: ' + error.message); return; }
    } else {
      const { error } = await supabase
        .from('products')
        .insert([productData]);
      if (error) { alert('Error al crear: ' + error.message); return; }
    }

    resetForm();
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) { alert('Error al eliminar: ' + error.message); return; }
    fetchProducts();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setTeam(product.team);
    setSize(product.size);
    setPrice(String(product.price));
    setImageUrl(product.image_url);
    setStock(String(product.stock));
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('jerseys')
      .upload(filePath, file);

    if (uploadError) {
      alert('Error al subir imagen: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('jerseys')
      .getPublicUrl(filePath);

    // Agregar cache-busting para que la imagen nueva se cargue correctamente
    setImageUrl(`${publicUrl}?t=${Date.now()}`);
    setUploading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Panel Admin</h1>
          <p className="text-zinc-400 text-sm">Gestión de J21 Store</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-sm transition-colors self-start sm:self-auto"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-900 rounded-lg p-1 border border-zinc-800 mb-6">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-2.5 rounded-md text-sm font-semibold transition-colors ${
            activeTab === 'products'
              ? 'bg-emerald-500 text-black'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          📦 Productos
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2.5 rounded-md text-sm font-semibold transition-colors ${
            activeTab === 'settings'
              ? 'bg-emerald-500 text-black'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          ⚙️ Configuración
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'settings' ? (
        <AdminSettings />
      ) : (
        <>
          {/* Products section */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-zinc-400 text-sm">{products.length} producto{products.length !== 1 ? 's' : ''}</p>
            <button
              onClick={() => { resetForm(); setShowForm(true); }}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
            >
              + Nuevo Producto
            </button>
          </div>

          {/* Product Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
              <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">
                      {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                    </h2>
                    <button onClick={resetForm} className="text-zinc-400 hover:text-white text-2xl">&times;</button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-zinc-400 text-xs font-medium mb-1 block">Nombre</label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
                        placeholder="Camiseta Local 2024"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 text-xs font-medium mb-1 block">Equipo</label>
                      <input
                        type="text"
                        value={team}
                        onChange={e => setTeam(e.target.value)}
                        required
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
                        placeholder="Boca Juniors"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-zinc-400 text-xs font-medium mb-1 block">Talla</label>
                        <select
                          value={size}
                          onChange={e => setSize(e.target.value)}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
                        >
                          {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-zinc-400 text-xs font-medium mb-1 block">Stock</label>
                        <input
                          type="number"
                          value={stock}
                          onChange={e => setStock(e.target.value)}
                          required
                          min="0"
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
                          placeholder="10"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-zinc-400 text-xs font-medium mb-1 block">Precio ($)</label>
                      <input
                        type="number"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        required
                        min="0"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
                        placeholder="25000"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 text-xs font-medium mb-1 block">Imagen</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={imageUrl}
                          onChange={e => setImageUrl(e.target.value)}
                          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
                          placeholder="URL de imagen"
                        />
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap disabled:opacity-50"
                        >
                          {uploading ? '...' : 'Subir'}
                        </button>
                      </div>
                      {imageUrl && (
                        <JerseyImage src={imageUrl} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded-lg border border-zinc-700" />
                      )}
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-2.5 rounded-lg transition-colors"
                      >
                        {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                      </button>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Products Table */}
          {loading ? (
            <div className="text-center py-12 text-zinc-500">Cargando productos...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">📦</p>
              <p className="text-zinc-400">No hay productos todavía</p>
              <p className="text-zinc-500 text-sm mt-1">Creá tu primer producto</p>
            </div>
          ) : (
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left text-zinc-400 text-xs font-medium px-4 py-3">Imagen</th>
                      <th className="text-left text-zinc-400 text-xs font-medium px-4 py-3">Producto</th>
                      <th className="text-left text-zinc-400 text-xs font-medium px-4 py-3 hidden sm:table-cell">Equipo</th>
                      <th className="text-left text-zinc-400 text-xs font-medium px-4 py-3 hidden md:table-cell">Talla</th>
                      <th className="text-left text-zinc-400 text-xs font-medium px-4 py-3">Precio</th>
                      <th className="text-left text-zinc-400 text-xs font-medium px-4 py-3">Stock</th>
                      <th className="text-right text-zinc-400 text-xs font-medium px-4 py-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                        <td className="px-4 py-3">
                          <JerseyImage
                            src={product.image_url}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-lg"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-white text-sm font-medium truncate max-w-[150px]">{product.name}</p>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className="text-zinc-300 text-sm">{product.team}</span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-zinc-300 text-sm">{product.size}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-white text-sm font-semibold">${product.price.toLocaleString()}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-sm font-medium ${product.stock <= 0 ? 'text-red-400' : product.stock <= 3 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-zinc-400 hover:text-emerald-400 text-sm transition-colors"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-zinc-400 hover:text-red-400 text-sm transition-colors"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
