import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product, ProductVariant, SIZES } from '../types';
import JerseyImage from '../components/JerseyImage';
import AdminSettings from './AdminSettings';
import AdminDeliveryZones from './AdminDeliveryZones';

type AdminTab = 'products' | 'settings' | 'delivery';

interface VariantForm {
  id?: string;
  player_name: string;
  sizes: string[];
  stock: number;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState('');
  const [team, setTeam] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [originalImageUrl, setOriginalImageUrl] = useState(''); // Para trackear cambios de imagen
  const [variants, setVariants] = useState<VariantForm[]>([]);

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
      .select('*, variants:product_variants(*)')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setName('');
    setTeam('');
    setPrice('');
    setImageUrl('');
    setOriginalImageUrl('');
    setVariants([]);
    setEditingProduct(null);
    setShowForm(false);
  };

  const addVariant = () => {
    setVariants([...variants, { player_name: '', sizes: [], stock: 0 }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: keyof VariantForm, value: string | string[] | number) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const toggleSize = (variantIndex: number, size: string) => {
    const updated = [...variants];
    const currentSizes = updated[variantIndex].sizes;
    if (currentSizes.includes(size)) {
      updated[variantIndex].sizes = currentSizes.filter(s => s !== size);
    } else {
      updated[variantIndex].sizes = [...currentSizes, size];
    }
    setVariants(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (variants.length === 0) {
      alert('Debes agregar al menos una variante (jugador + tallas)');
      return;
    }

    const productData = {
      name,
      team,
      price: Number(price),
      image_url: imageUrl,
    };

    let productId: string;

    if (editingProduct) {
      // Si la imagen cambió, eliminar la imagen anterior del storage
      if (originalImageUrl && imageUrl !== originalImageUrl) {
        await deleteImageFromStorage(originalImageUrl);
      }

      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.id);
      if (error) { alert('Error al actualizar: ' + error.message); return; }
      productId = editingProduct.id;

      // Eliminar variantes anteriores
      await supabase.from('product_variants').delete().eq('product_id', productId);
    } else {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();
      if (error) { alert('Error al crear: ' + error.message); return; }
      productId = data.id;
    }

    // Insertar nuevas variantes
    const variantsToInsert = variants
      .filter(v => v.player_name.trim() && v.sizes.length > 0)
      .map(v => ({
        product_id: productId,
        player_name: v.player_name.trim(),
        sizes: v.sizes,
        stock: v.stock || 0,
      }));

    if (variantsToInsert.length > 0) {
      const { error } = await supabase
        .from('product_variants')
        .insert(variantsToInsert);
      if (error) { alert('Error al guardar variantes: ' + error.message); return; }
    }

    resetForm();
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return;
    
    console.log('Eliminando producto con ID:', id);
    
    // Obtener el producto para eliminar su imagen del storage
    const productToDelete = products.find(p => p.id === id);
    console.log('Producto a eliminar:', productToDelete);
    
    if (productToDelete?.image_url) {
      console.log('Producto tiene imagen, intentando eliminar del storage');
      await deleteImageFromStorage(productToDelete.image_url);
    } else {
      console.log('Producto no tiene imagen o image_url está vacío');
    }
    
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) { 
      console.error('Error al eliminar producto de la base de datos:', error);
      alert('Error al eliminar: ' + error.message); 
      return; 
    }
    
    console.log('Producto eliminado exitosamente de la base de datos');
    fetchProducts();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setTeam(product.team);
    setPrice(String(product.price));
    setImageUrl(product.image_url);
    setOriginalImageUrl(product.image_url); // Guardar URL original
    setVariants(
      (product.variants || []).map(v => ({
        id: v.id,
        player_name: v.player_name,
        sizes: v.sizes,
        stock: v.stock || 0,
      }))
    );
    setShowForm(true);
  };

  // Helper: Extraer el path del archivo desde la URL de Supabase Storage
  const extractFilePath = (url: string): string | null => {
    if (!url) {
      console.log('URL vacía, no se puede extraer path');
      return null;
    }
    
    // La URL tiene el formato: https://xxx.supabase.co/storage/v1/object/public/jerseys/products/filename.jpg
    // Necesitamos extraer: products/filename.jpg
    const match = url.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)/);
    const filePath = match ? match[1] : null;
    
    console.log('Extracting file path:', { url, filePath });
    return filePath;
  };

  // Helper: Eliminar archivo del bucket de Supabase Storage
  const deleteImageFromStorage = async (imageUrl: string) => {
    console.log('Intentando eliminar imagen:', imageUrl);
    
    const filePath = extractFilePath(imageUrl);
    if (!filePath) {
      console.warn('No se pudo extraer el path del archivo');
      return;
    }

    console.log('Eliminando archivo del storage:', filePath);
    
    const { data, error } = await supabase.storage
      .from('jerseys')
      .remove([filePath]);

    if (error) {
      console.error('Error al eliminar imagen del storage:', error);
      console.error('Error message:', error.message);
      console.error('Error name:', error.name);
    } else {
      console.log('Imagen eliminada exitosamente:', data);
    }
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
          onClick={() => setActiveTab('delivery')}
          className={`flex-1 py-2.5 rounded-md text-sm font-semibold transition-colors ${
            activeTab === 'delivery'
              ? 'bg-emerald-500 text-black'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          🚚 Envíos
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2.5 rounded-md text-sm font-semibold transition-colors ${
            activeTab === 'settings'
              ? 'bg-emerald-500 text-black'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          ⚙️ Config
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'settings' ? (
        <AdminSettings />
      ) : activeTab === 'delivery' ? (
        <AdminDeliveryZones />
      ) : (
        <>
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <p className="text-zinc-400 text-sm">
              {products.filter(p => {
                if (!searchTerm) return true;
                const term = searchTerm.toLowerCase();
                return p.name.toLowerCase().includes(term) || p.team.toLowerCase().includes(term);
              }).length} producto(s)
            </p>
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

                    {/* Variantes */}
                    <div className="border-t border-zinc-800 pt-4">
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-zinc-400 text-xs font-medium">
                          Jugadores y tallas
                        </label>
                        <button
                          type="button"
                          onClick={addVariant}
                          className="text-emerald-400 hover:text-emerald-300 text-xs font-medium"
                        >
                          + Agregar jugador
                        </button>
                      </div>

                      {variants.length === 0 && (
                        <p className="text-zinc-500 text-xs text-center py-3">
                          No hay jugadores agregados. Hacé clic en "+ Agregar jugador"
                        </p>
                      )}

                      {variants.map((variant, index) => (
                        <div key={index} className="bg-zinc-800 rounded-lg p-3 mb-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-zinc-300 text-xs font-medium">Jugador {index + 1}</span>
                            <button
                              type="button"
                              onClick={() => removeVariant(index)}
                              className="text-red-400 hover:text-red-300 text-xs"
                            >
                              Eliminar
                            </button>
                          </div>
                          <input
                            type="text"
                            value={variant.player_name}
                            onChange={e => updateVariant(index, 'player_name', e.target.value)}
                            placeholder="Nombre del jugador"
                            className="w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-2 text-white text-sm mb-2 focus:border-emerald-500 focus:outline-none"
                          />
                          <p className="text-zinc-400 text-xs mb-1">Tallas disponibles:</p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {SIZES.map(size => (
                              <button
                                key={size}
                                type="button"
                                onClick={() => toggleSize(index, size)}
                                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                                  variant.sizes.includes(size)
                                    ? 'bg-emerald-500 text-black'
                                    : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600'
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                          <div>
                            <label className="text-zinc-400 text-xs mb-1 block">Stock para este jugador:</label>
                            <input
                              type="number"
                              value={variant.stock}
                              onChange={e => updateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                              min="0"
                              placeholder="0"
                              className="w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
                            />
                            <p className="text-zinc-500 text-xs mt-1">
                              Stock total disponible para todas las tallas de este jugador
                            </p>
                          </div>
                        </div>
                      ))}
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
            </div>
          ) : (
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left text-zinc-400 text-xs font-medium px-4 py-3">Imagen</th>
                      <th className="text-left text-zinc-400 text-xs font-medium px-4 py-3">Producto</th>
                      <th className="text-left text-zinc-400 text-xs font-medium px-4 py-3 hidden md:table-cell">Variantes</th>
                      <th className="text-left text-zinc-400 text-xs font-medium px-4 py-3">Precio</th>
                      <th className="text-left text-zinc-400 text-xs font-medium px-4 py-3">Stock</th>
                      <th className="text-right text-zinc-400 text-xs font-medium px-4 py-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.filter(product => {
                      if (!searchTerm) return true;
                      const term = searchTerm.toLowerCase();
                      return product.name.toLowerCase().includes(term) || product.team.toLowerCase().includes(term);
                    }).map(product => (
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
                          <p className="text-zinc-400 text-xs">{product.team}</p>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <p className="text-zinc-300 text-xs">
                            {product.variants?.length || 0} jugador{(product.variants?.length || 0) !== 1 ? 'es' : ''}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-white text-sm font-semibold">${product.price.toLocaleString()}</span>
                        </td>
                        <td className="px-4 py-3">
                          {(() => {
                            const totalVariantStock = (product.variants || []).reduce((sum, v) => sum + (v.stock || 0), 0);
                            return (
                              <span className={`text-sm font-medium ${totalVariantStock <= 0 ? 'text-red-400' : totalVariantStock <= 3 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                {totalVariantStock}
                              </span>
                            );
                          })()}
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
