import { useModalScrollLock } from '../hooks/useModalScrollLock';

interface ImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
}

export default function ImageLightbox({ isOpen, onClose, src, alt }: ImageLightboxProps) {
  useModalScrollLock(isOpen);

  if (!isOpen || !src) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center text-white transition-colors"
        aria-label="Cerrar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Imagen ampliada */}
      <div
        className="max-w-4xl max-h-[90vh] w-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
        />
      </div>

      {/* Info debajo */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 rounded-lg px-4 py-2">
        <p className="text-white text-sm font-medium">{alt}</p>
      </div>
    </div>
  );
}
