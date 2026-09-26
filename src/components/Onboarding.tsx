import { useState, useEffect } from 'react';

interface OnboardingStep {
  title: string;
  description: string;
  emoji: string;
}

const steps: OnboardingStep[] = [
  {
    title: '¡Bienvenido a J21 Store!',
    description: 'Tu tienda de camisetas de fútbol. Te mostramos cómo funciona en unos pasos rápidos.',
    emoji: '⚽',
  },
  {
    title: 'Busca y filtra',
    description: 'Usa la barra de búsqueda para encontrar por nombre, equipo o jugador. Filtra por equipo, talla, disponibilidad (stock o encargo) y ofertas 🔥 para encontrar justo lo que necesitas.',
    emoji: '🔍',
  },
  {
    title: 'Dos tipos de productos',
    description: '📦 En stock: disponibles para entrega inmediata con jugadores y tallas específicas. 🕐 Por encargo: se fabrican especialmente para ti con tiempo de entrega estimado. ¡Elige según tu necesidad!',
    emoji: '📋',
  },
  {
    title: 'Precios con oferta',
    description: 'Algunos productos tienen precios especiales. Si ves un precio tachado (~~$25~~) junto al precio actual ($20), ¡es una oferta! Aprovecha los descuentos.',
    emoji: '💰',
  },
  {
    title: 'Ve las fotos en grande',
    description: '¿Quieres ver los detalles de una camiseta? ¡Haz clic en la imagen! Se abrirá en pantalla completa para que aprecies cada detalle. Haz clic fuera o en la X para cerrar.',
    emoji: '🖼️',
  },
  {
    title: 'Elige tu camiseta',
    description: 'En productos en stock: haz clic en "Elegir", selecciona jugador y talla. En productos por encargo: haz clic en "🕐 Encargo" y se agrega directo al carrito.',
    emoji: '👕',
  },
  {
    title: 'Carrito inteligente',
    description: 'El carrito guarda tus productos y controla el stock automáticamente. Puedes ajustar cantidades, eliminar productos y ver el total en USD. ¡Se mantiene aunque cierres el navegador!',
    emoji: '🛒',
  },
  {
    title: 'Haz tu pedido',
    description: 'Revisa tu carrito, haz clic en "Pedir por WhatsApp". Completa tus datos, zona de entrega (con costo en CUP) y hora de retiro. El pedido se envía automáticamente con todos los detalles.',
    emoji: '📱',
  },
];

export default function Onboarding() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const onboardingVersion = 'v3'; // Actualizar versión para mostrar tutorial actualizado
    const hasSeenOnboarding = localStorage.getItem('j21-onboarding-seen');
    
    if (hasSeenOnboarding !== onboardingVersion) {
      // Mostrar el onboarding después de 1 segundo
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleSkip = () => {
    handleClose();
  };

  const handleClose = () => {
    localStorage.setItem('j21-onboarding-seen', 'v3');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleSkip}
      />

      {/* Modal */}
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Progress bar */}
        <div className="h-1 bg-zinc-800">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-6">
          {/* Emoji */}
          <div className="text-center mb-4">
            <span className="text-5xl">{step.emoji}</span>
          </div>

          {/* Content */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white mb-2">
              {step.title}
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex justify-center gap-1.5 mb-6">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentStep
                    ? 'bg-emerald-500'
                    : idx < currentStep
                    ? 'bg-emerald-500/50'
                    : 'bg-zinc-700'
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {!isLastStep && (
              <button
                onClick={handleSkip}
                className="flex-1 py-2.5 rounded-lg text-zinc-400 hover:text-white text-sm font-medium transition-colors"
              >
                Saltar
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-2.5 rounded-lg transition-colors"
            >
              {isLastStep ? '¡Empezar!' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
