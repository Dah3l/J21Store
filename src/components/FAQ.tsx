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

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Preguntas Frecuentes
        </h2>
        <p className="text-zinc-400 text-sm">
          Resolvemos tus dudas más comunes
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors"
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
                  openIndex === index ? 'rotate-180' : ''
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
                openIndex === index ? 'max-h-96' : 'max-h-0'
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
    </section>
  );
}
