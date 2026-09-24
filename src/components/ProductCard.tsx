import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
      <div className="aspect-square overflow-hidden bg-zinc-800 relative">
        <img
          src={product.image_url || '/placeholder-jersey.png'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="text-red-400 font-bold text-lg">Sin stock</span>
          </div>
        )}
        {product.stock > 0 && product.stock <= 3 && (
          <div className="absolute top-2 right-2 bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded-full">
            ¡Últimas {product.stock}!
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">{product.team}</span>
        </div>
        <h3 className="text-white font-semibold text-sm mb-1 truncate">{product.name}</h3>
        <div className="flex items-center justify-between mb-3">
          <span className="text-zinc-400 text-xs">Talla: {product.size}</span>
          <span className="text-white font-bold text-lg">${product.price.toLocaleString()}</span>
        </div>
        <button
          onClick={handleAdd}
          disabled={product.stock <= 0}
          className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
            added
              ? 'bg-emerald-500 text-black'
              : product.stock <= 0
              ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
              : 'bg-emerald-500 hover:bg-emerald-400 text-black active:scale-95'
          }`}
        >
          {added ? '✓ Agregado' : product.stock <= 0 ? 'Sin stock' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
}
