import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Product, ProductVariant, SIZES } from '../types';
import JerseyImage from './JerseyImage';
import ImageLightbox from './ImageLightbox';
import { useModalScrollLock } from '../hooks/useModalScrollLock';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, getQuantityInCart } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [feedback, setFeedback] = useState<'added' | 'limit' | null>(null);

  // Bloquear scroll cuando el modal está abierto
  useModalScrollLock(showModal || showLightbox);

  const variants = product.variants || [];
  const totalInCart = variants.reduce((sum, v) => 
    sum + v.sizes.reduce((sizeSum, size) => sizeSum + getQuantityInCart(product.id, v.player_name, size), 0), 0
  );
  // Calcular stock total de todas las variantes
  const totalStock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);
  const isOutOfStock = totalStock <= 0;

  const handleOpenModal = () => {
    if (isOutOfStock || variants.length === 0) return;
    setShowModal(true);
    setSelectedVariant(null);
    setSelectedSize('');
  };

  const handleSelectVariant = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setSelectedSize('');
  };

  const handleAddToCart = () => {
    if (!selectedVariant || !selectedSize) return;

    // Usar el stock de la variante seleccionada
    const variantStock = selectedVariant.stock || 0;
    const remaining = variantStock - getQuantityInCart(product.id, selectedVariant.player_name, selectedSize);
    if (remaining <= 0) {
      setFeedback('limit');
      setTimeout(() => setFeedback(null), 2500);
      return;
    }

    const success = addItem(product, selectedVariant.player_name, selectedSize);
    if (success) {
      setFeedback('added');
      setTimeout(() => {
        setFeedback(null);
        setShowModal(false);
      }, 1000);
    }
  };

  return (
    <>
      <div className="group bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
        <div 
          className="aspect-square overflow-hidden bg-zinc-800 relative cursor-pointer"
          onClick={() => setShowLightbox(true)}
        >
          <JerseyImage
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Overlay con icono de lupa al hacer hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-zinc-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center pointer-events-none">
              <span className="text-red-400 font-bold text-lg">Sin stock</span>
            </div>
          )}
          {!isOutOfStock && totalStock <= 3 && totalInCart === 0 && (
            <div className="absolute top-2 right-2 bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded-full pointer-events-none">
              ¡Últimas {totalStock}!
            </div>
          )}
          {totalInCart > 0 && (
            <div className="absolute top-2 left-2 bg-emerald-500 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              {totalInCart} en carrito
            </div>
          )}
          {variants.length > 1 && !isOutOfStock && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full pointer-events-none">
              {variants.length} jugador{variants.length > 1 ? 'es' : ''}
            </div>
          )}
        </div>
        <div className="p-4">
          <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">{product.team}</span>
          <h3 className="text-white font-semibold text-sm mb-2 truncate">{product.name}</h3>
          
          {/* Mostrar jugadores y tallas disponibles */}
          {variants.length > 0 && (
            <div className="mb-3 space-y-2">
              {variants.slice(0, 3).map((variant, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-zinc-300 text-xs font-medium whitespace-nowrap min-w-[60px]">
                    {variant.player_name}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {variant.sizes.map((size, sizeIdx) => (
                      <span
                        key={sizeIdx}
                        className="bg-zinc-800 text-zinc-400 text-[10px] px-1.5 py-0.5 rounded border border-zinc-700"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              {variants.length > 3 && (
                <p className="text-zinc-500 text-[10px] italic">
                  +{variants.length - 3} jugador{variants.length - 3 > 1 ? 'es' : ''} más
                </p>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-bold text-lg">${product.price} <span className="text-xs text-zinc-400">USD</span></span>
          </div>
          <button
            onClick={handleOpenModal}
            disabled={isOutOfStock || variants.length === 0}
            className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
              isOutOfStock || variants.length === 0
                ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-400 text-black active:scale-95'
            }`}
          >
            {isOutOfStock ? 'Sin stock' : variants.length === 0 ? 'Sin variantes' : 'Elegir jugador y talla'}
          </button>
        </div>
      </div>

      {/* Modal de selección */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-md max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <JerseyImage
                    src={product.image_url}
                    alt={product.name}
                    className="w-14 h-14 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-white font-bold">{product.name}</h3>
                    <p className="text-emerald-400 text-sm">{product.team}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-zinc-400 hover:text-white text-2xl leading-none"
                >
                  &times;
                </button>
              </div>

              {/* Selección de jugador y talla */}
              <div className="mb-4">
                <label className="text-zinc-400 text-xs font-medium mb-2 block">
                  Elegí el jugador y la talla
                </label>
                <div className="space-y-3">
                  {variants.map(variant => (
                    <div
                      key={variant.id}
                      className={`p-3 rounded-lg border transition-all ${
                        selectedVariant?.id === variant.id
                          ? 'bg-emerald-500/20 border-emerald-500'
                          : 'bg-zinc-800 border-zinc-700'
                      }`}
                    >
                      <button
                        onClick={() => handleSelectVariant(variant)}
                        className="w-full text-left mb-2"
                      >
                        <span className={`text-sm font-semibold ${
                          selectedVariant?.id === variant.id ? 'text-emerald-400' : 'text-white'
                        }`}>
                          {variant.player_name}
                        </span>
                      </button>
                      <div className="flex flex-wrap gap-1.5">
                        {variant.sizes.map(size => (
                          <button
                            key={size}
                            onClick={() => {
                              handleSelectVariant(variant);
                              setSelectedSize(size);
                            }}
                            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                              selectedVariant?.id === variant.id && selectedSize === size
                                ? 'bg-emerald-500 text-black'
                                : selectedVariant?.id === variant.id
                                ? 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                                : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600 hover:text-white'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumen y botón */}
              <div className="border-t border-zinc-800 pt-4 mt-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-zinc-400 text-sm">Precio:</span>
                  <span className="text-emerald-400 font-bold text-lg">${product.price} USD</span>
                </div>
                {selectedVariant && selectedSize && (
                  <p className="text-zinc-500 text-xs mb-3">
                    Seleccionado: <span className="text-white">{selectedVariant.player_name}</span> · Talla <span className="text-white">{selectedSize}</span>
                  </p>
                )}
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || !selectedSize}
                  className={`w-full py-3 rounded-lg font-bold text-sm transition-all ${
                    feedback === 'added'
                      ? 'bg-emerald-500 text-black'
                      : feedback === 'limit'
                      ? 'bg-amber-500 text-black'
                      : !selectedVariant || !selectedSize
                      ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-black active:scale-95'
                  }`}
                >
                  {feedback === 'added'
                    ? '✓ Agregado al carrito'
                    : feedback === 'limit'
                    ? '⚠ Stock máximo alcanzado'
                    : !selectedVariant || !selectedSize
                    ? 'Seleccioná jugador y talla'
                    : 'Agregar al carrito'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox para ver imagen ampliada */}
      <ImageLightbox
        isOpen={showLightbox}
        onClose={() => setShowLightbox(false)}
        src={product.image_url}
        alt={product.name}
      />
    </>
  );
}
