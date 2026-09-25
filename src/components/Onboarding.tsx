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
    description: 'Usa la barra de búsqueda para encontrar por nombre, equipo o jugador. También puedes filtrar por equipo o talla específica para encontrar justo lo que necesitas.',
    emoji: '🔍',
  },
  {
    title: 'Ve las fotos en grande',
    description: '¿Quieres ver los detalles de una camiseta? ¡Haz clic en la imagen! Se abrirá en pantalla completa para que aprecies cada detalle. Haz clic fuera o en la X para cerrar.',
    emoji: '🖼️',
  },
  {
    title: 'Elige tu camiseta',
    description: 'Haz clic en "Elegir jugador y talla", selecciona el jugador que quieras y la talla disponible. Cada jugador muestra sus tallas disponibles para que elijas rápido.',
    emoji: '👕',
  },
  {
    title: 'Haz tu pedido',
    description: 'Agrega al carrito, revisa tu selección y haz clic en "Pedir por WhatsApp". Completa tus datos, zona de entrega y el pedido se envía automáticamente.',
    emoji: '📱',
  },
];

export default function Onboarding() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('j21-onboarding-seen');
    if (!hasSeenOnboarding) {
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
    localStorage.setItem('j21-onboarding-seen', 'true');
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
