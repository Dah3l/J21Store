import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: '¿Cómo puedo hacer un pedido?',
    answer: 'Hacer un pedido es muy fácil. Navegá por nuestro catálogo, seleccioná las camisetas que te gusten agregándolas al carrito. Cuando estés listo, hacé clic en el ícono del carrito y luego en "Pedir por WhatsApp". Completá el formulario con tu nombre, zona de entrega y hora preferida, y automáticamente se abrirá WhatsApp con tu pedido prellenado. ¡Así de simple!'
  },
  {
    question: '¿Cuáles son las diferencias entre los tipos de camisetas?',
    answer: 'Ofrecemos diferentes tipos de camisetas según la calidad y el precio. Las camisetas estándar son ideales para el uso diario, con buena durabilidad y comodidad. Las camisetas premium tienen mejores acabados, telas de mayor calidad y detalles más fieles a las originales. Cada producto en nuestro catálogo indica claramente su tipo y características específicas.'
  },
  {
    question: '¿Cuánto tardan los pedidos por encargo?',
    answer: 'Los pedidos de productos en stock se entregan en 24-48 horas según tu zona. Si el producto no está disponible actualmente, podemos hacer un pedido especial que tarda entre 7-15 días hábiles dependiendo del proveedor. Te mantendremos informado sobre el estado de tu pedido por WhatsApp en todo momento.'
  }
];

export default function InfoMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'nosotros' | 'faq'>('nosotros');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      {/* Botón principal desplegable */}
      <div className="mb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 rounded-xl px-6 py-4 flex items-center justify-between transition-all"
        >
          <span className="text-white font-semibold text-lg">
            {isOpen ? '✕ Cerrar' : 'ℹ️ Más Información'}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-6 h-6 text-emerald-400 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Contenido desplegable */}
      {isOpen && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-zinc-800">
            <button
              onClick={() => setActiveTab('nosotros')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                activeTab === 'nosotros'
                  ? 'bg-emerald-500/10 text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              🏪 Nosotros
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                activeTab === 'faq'
                  ? 'bg-emerald-500/10 text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              ❓ Preguntas Frecuentes
            </button>
          </div>

          {/* Contenido de las tabs */}
          <div className="p-6">
            {activeTab === 'nosotros' ? (
              <div className="prose prose-invert max-w-none">
                <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
                  J21 Store es tu destino para vivir la pasión del fútbol. Nos especializamos en camisetas de clubes, selecciones y jugadores que marcan la diferencia, ofreciendo productos de calidad, atención personalizada y una experiencia de compra confiable.
                </p>
                <p className="text-zinc-300 leading-relaxed text-sm sm:text-base mt-4">
                  Más que una tienda, somos una comunidad de aficionados que comparte la emoción del deporte rey. En J21 Store trabajamos para que encuentres la camiseta que te representa y puedas llevar tus colores con orgullo dentro y fuera de la cancha.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-zinc-800 rounded-lg overflow-hidden hover:border-zinc-700 transition-colors"
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left"
                    >
                      <span className="text-white font-semibold text-sm sm:text-base pr-4">
                        {faq.question}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`w-5 h-5 text-emerald-400 transition-transform duration-300 shrink-0 ${
                          openFaqIndex === index ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        openFaqIndex === index ? 'max-h-96' : 'max-h-0'
                      }`}
                    >
                      <div className="px-5 pb-4 pt-0">
                        <p className="text-zinc-400 text-sm leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
