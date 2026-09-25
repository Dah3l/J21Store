import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product, SIZES } from '../types';
import ProductCard from '../components/ProductCard';
import { useBusiness } from '../context/BusinessContext';
import InfoMenu from '../components/InfoMenu';

export default function Catalog() {
  const { settings } = useBusiness();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTeam, setFilterTeam] = useState('');
  const [filterSize, setFilterSize] = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState<number>(0);
  const [teams, setTeams] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      // Fallback demo data
      setProducts(getDemoProducts());
      setTeams([...new Set(getDemoProducts().map(p => p.team))]);
    } else {
      setProducts(data || []);
      setTeams([...new Set((data || []).map(p => p.team))]);
    }
    setLoading(false);
  };

  const filteredProducts = products.filter(p => {
    // Búsqueda por nombre o equipo
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        p.name.toLowerCase().includes(term) ||
        p.team.toLowerCase().includes(term);
      if (!matchesSearch) return false;
    }
    if (filterTeam && p.team !== filterTeam) return false;
    if (filterSize && p.size !== filterSize) return false;
    if (filterMaxPrice > 0 && p.price > filterMaxPrice) return false;
    return true;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setFilterTeam('');
    setFilterSize('');
    setFilterMaxPrice(0);
  };

  const hasActiveFilters = searchTerm || filterTeam || filterSize || filterMaxPrice > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Hero */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
          {settings.business_name}
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base">
          {settings.description || 'Encontrá la camiseta de tu equipo. Pedila fácil por WhatsApp.'}
        </p>
      </div>

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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por equipo o nombre..."
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

      {/* Filters */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[140px]">
            <label className="text-zinc-400 text-xs font-medium mb-1 block">Equipo</label>
            <select
              value={filterTeam}
              onChange={e => setFilterTeam(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
            >
              <option value="">Todos</option>
              {teams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[100px]">
            <label className="text-zinc-400 text-xs font-medium mb-1 block">Talla</label>
            <select
              value={filterSize}
              onChange={e => setFilterSize(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
            >
              <option value="">Todas</option>
              {SIZES.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[120px]">
            <label className="text-zinc-400 text-xs font-medium mb-1 block">Precio máx.</label>
            <input
              type="number"
              value={filterMaxPrice || ''}
              onChange={e => setFilterMaxPrice(Number(e.target.value))}
              placeholder="Sin límite"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-emerald-400 hover:text-emerald-300 text-sm font-medium whitespace-nowrap"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden animate-pulse">
              <div className="aspect-square bg-zinc-800" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-zinc-800 rounded w-1/2" />
                <div className="h-4 bg-zinc-800 rounded w-3/4" />
                <div className="h-8 bg-zinc-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">😕</p>
          <p className="text-zinc-400">No se encontraron productos</p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-emerald-400 mt-2 text-sm hover:underline">
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Results count */}
      {!loading && filteredProducts.length > 0 && (
        <p className="text-center text-zinc-500 text-sm mt-6">
          {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Info Menu Section */}
      <InfoMenu />
    </div>
  );
}

function getDemoProducts(): Product[] {
  return [
    { id: '1', name: 'Camiseta Local 2024', team: 'Boca Juniors', size: 'M', price: 25000, image_url: '', stock: 5, created_at: '' },
    { id: '2', name: 'Camiseta Visitante 2024', team: 'River Plate', size: 'L', price: 25000, image_url: '', stock: 3, created_at: '' },
    { id: '3', name: 'Camiseta Local 2024', team: 'Real Madrid', size: 'M', price: 30000, image_url: '', stock: 8, created_at: '' },
    { id: '4', name: 'Camiseta Local 2024', team: 'Barcelona', size: 'S', price: 30000, image_url: '', stock: 0, created_at: '' },
    { id: '5', name: 'Camiseta Alternativa', team: 'PSG', size: 'XL', price: 28000, image_url: '', stock: 2, created_at: '' },
    { id: '6', name: 'Camiseta Local 2024', team: 'Manchester City', size: 'L', price: 27000, image_url: '', stock: 6, created_at: '' },
  ];
}
