import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useBusiness } from '../context/BusinessContext';
import CartDrawer from './CartDrawer';

export default function Header() {
  const { itemCount } = useCart();
  const { settings } = useBusiness();
  const [cartOpen, setCartOpen] = useState(false);

  const LOGO_URL = 'https://fwempizdkfvorzfzjgtg.supabase.co/storage/v1/object/public/jerseys/products/1790305089491-hn6warfj9cb.jpg';

  return (
    <>
      <header className="sticky top-0 z-30 bg-black/90 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src={LOGO_URL} 
              alt={`${settings.business_name} logo`}
              className="w-10 h-10 object-contain rounded-lg"
            />
            <span className="text-white font-bold text-lg hidden sm:block">{settings.business_name}</span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link to="/" className="text-zinc-300 hover:text-emerald-400 text-sm font-medium transition-colors">
              Catálogo
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-zinc-300 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
