"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Leo Pieta",
    rating: 5,
    text: "Estou usando o App a 1 ano e está sendo incrível. Minha vida toda eu não tinha controle dos meus gastos e do meu dinheiro, e com esse app eu consigo controlar tudo isso e ainda economizar. Recomendo para todos experimentar. Vocês não vão se arrepender",
  },
  {
    id: 2,
    name: "Ollimesmo",
    rating: 5,
    text: "Uso há mais de 3 ANOS, e pagar a assinatura foi uma das melhores decisões que tomei na minha vida toda. O valor é praticamente um trocado quando você começa a ENXERGAR seus vacíos e começa a ganhar dinheiro pela ECONOMIA absurda que você alcança com organização e controle dentro de poucas semanas!",
  },
  {
    id: 3,
    name: "NinjazinXPTO",
    rating: 5,
    text: "Excelente aplicativo atende a todas as minhas necessidades e ajuda a manter a minha saúde financeira. Vale cada centavo.",
  },
  {
    id: 4,
    name: "Eduardo",
    rating: 5,
    text: "Com o Organizze consegui visualizar e passar a ter controle sobre cada gasto e cada entrada. O melhor é o fato de conseguir implementar um método de economia que eu já conhecia, mas que sem o app não está indo para frente.",
  },
  {
    id: 5,
    name: "Marcela",
    rating: 5,
    text: "Fantástico! Consegui finalmente organizar minha planilha financeira. Já testei diversos apps e este é excelente e tem ótimo atendimento da equipe!",
  },
];

export default function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setActiveIndex((current) => (current + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  return (
    <div
      id="avaliacoes"
      className="relative mt-10 overflow-hidden bg-gradient-to-b from-gray-950 to-gray-900 py-16 md:py-24"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-600 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-violet-600 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Título com estilo completamente diferente - Centralizado com ícone grande */}
        <div className="relative mb-16">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
            <div className="w-16 h-16 rounded-full bg-purple-600/30 flex items-center justify-center shadow-glow">
              <Quote className="h-8 w-8 text-purple-300" />
            </div>
          </div>

          <div className="text-center pt-10">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Histórias de <span className="text-purple-400">sucesso</span>
            </h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              Descubra como o Organizze está transformando a vida financeira de milhares
              de pessoas
            </p>
          </div>
        </div>

        <div className="relative h-[400px] md:h-[300px] w-full">
          {testimonials.map((testimonial, index) => {
            // Determine position classes based on active index
            let positionClasses =
              "absolute top-0 left-0 w-full transition-all duration-700 ease-in-out";

            if (index === activeIndex) {
              positionClasses += " opacity-100 translate-x-0";
            } else if (
              index < activeIndex ||
              (activeIndex === 0 && index === testimonials.length - 1)
            ) {
              positionClasses += " opacity-0 -translate-x-full";
            } else {
              positionClasses += " opacity-0 translate-x-full";
            }

            return (
              <div key={testimonial.id} className={positionClasses}>
                <div className="bg-gray-900 border border-purple-900/50 rounded-xl p-6 md:p-8 shadow-glow max-w-3xl mx-auto">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < testimonial.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 text-lg">{testimonial.text}</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-purple-600/30 flex items-center justify-center text-purple-300 font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <p className="ml-3 font-medium text-white">
                      por <span className="text-purple-400">{testimonial.name}</span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mt-8 gap-2">
          {testimonials.map((_, index) => {
            const indicatorClasses = `rounded-full transition-all ${
              index === activeIndex
                ? "bg-purple-500 w-6 h-3 shadow-glow"
                : "bg-gray-600 hover:bg-purple-400 w-3 h-3"
            }`;

            return (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={indicatorClasses}
                aria-label={`Ver depoimento ${index + 1}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
