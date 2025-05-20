"use client";

import { useState, useEffect, useRef } from "react";
import { Star, User, ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Adicionei mais depoimentos para enriquecer o carrossel
const testimonials = [
  {
    id: 1,
    name: "Camila Peixoto",
    role: "Usuário Premium",
    rating: 5,
    text: "Estou usando o App a 1 ano e está sendo incrível. Minha vida toda eu não tinha controle dos meus gastos e do meu dinheiro, e com esse app eu consigo controlar tudo isso e ainda economizar. Recomendo para todos experimentar. Vocês não vão se arrepender",
    highlight: "Consegui controlar tudo e ainda economizar",
  },
  {
    id: 2,
    name: "Karim Meira",
    role: "Usuário",
    rating: 5,
    text: "Uso há mais de 3 ANOS, e sem condições, como um app bom desse não é pago? uma das melhores decisões que tomei na minha vida financeira foi me registrar aqui. Fiquei besta quando comecei a ENXERGAR meus vicíos e ganhar dinheiro pela ECONOMIA absurda que você alcança com organização e controle dentro de poucas semanas!",
    highlight: "Uma das melhores decisões da minha vida financeira",
  },
  {
    id: 3,
    name: "Luiz Gustavo",
    role: "Usuário Premium",
    rating: 5,
    text: "Excelente aplicativo atende a todas as minhas necessidades e ajuda a manter a minha saúde financeira. Nem acredito que é de graça.",
    highlight: "Ajuda a manter minha saúde financeira",
  },
  {
    id: 4,
    name: "Maria Clara Galvão",
    role: "Usuária",
    rating: 5,
    text: "Com a CMD consegui visualizar e passar a ter controle sobre cada gasto e cada entrada. O melhor é o fato de conseguir implementar um método de economia que eu já conhecia, mas que sem o app não está indo para frente.",
    highlight: "Controle sobre cada gasto e cada entrada",
  },
  {
    id: 5,
    name: "Bibiu Antoni",
    role: "Usuário",
    rating: 5,
    text: "Fantástico! Consegui finalmente organizar minha planilha financeira. Já testei diversos apps e este é excelente e tem ótimo atendimento da equipe!",
    highlight: "Excelente atendimento da equipe",
  },
  {
    id: 6,
    name: "Roberto Mendes",
    role: "Usuário",
    rating: 5,
    text: "Depois de tentar vários aplicativos de finanças, finalmente encontrei o CMD. A interface é intuitiva e as análises são precisas. Em apenas 3 meses, consegui identificar gastos desnecessários e economizar 15% do meu salário.",
    highlight: "Economizei 15% do meu salário em 3 meses",
  },
  {
    id: 7,
    name: "Juliana Costa",
    role: "Usuária Premium",
    rating: 5,
    text: "O CMD revolucionou minha vida financeira! Antes eu vivia no vermelho, agora consigo planejar meus gastos e até comecei a investir. O suporte ao cliente é incrível e sempre respondem rapidamente quando tenho dúvidas.",
    highlight: "Saí do vermelho e comecei a investir",
  },
  {
    id: 8,
    name: "Fernando Almeida",
    role: "Usuário",
    rating: 5,
    text: "Como autônomo, sempre tive dificuldade em separar finanças pessoais e do negócio. O CMD me ajudou a organizar tudo e ter uma visão clara da minha situação financeira. Recomendo para todos os profissionais independentes!",
    highlight: "Perfeito para autônomos e empreendedores",
  },
];

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const autoplayRef = useRef(null);
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = () => {
    if (isAnimating) return;
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    if (isAnimating) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (autoplay) {
      autoplayRef.current = setInterval(nextSlide, 6000);
    }
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [autoplay, currentIndex, isAnimating]);

  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);

  // Função para obter índices dos próximos slides para preview
  const getNextIndices = (current, count) => {
    const indices = [];
    for (let i = 1; i <= count; i++) {
      indices.push((current + i) % testimonials.length);
    }
    return indices;
  };

  const nextPreviews = getNextIndices(currentIndex, 3);

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
    }),
  };

  return (
    <section
      id="avaliacoes"
      className="relative py-20 overflow-hidden  bg-gradient-to-b from-gray-950 to-gray-900"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.png')] opacity-5"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-600/20 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-600/30 flex items-center justify-center">
              <User className="h-6 w-6 text-purple-300" />
            </div>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            O que nossos{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
              usuários
            </span>{" "}
            dizem
          </h2>
          <p className="text-gray-400 text-lg">
            Descubra como o CMD está transformando a vida financeira de milhares de
            pessoas
          </p>
        </div>

        {/* Main Carousel */}
        <div className="relative max-w-5xl mx-auto mb-16">
          {/* Main Testimonial Slide */}
          <div className="relative overflow-hidden h-[300px] md:h-[280px] rounded-2xl">
            <AnimatePresence
              initial={false}
              custom={direction}
              onExitComplete={() => setIsAnimating(false)}
            >
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute inset-0 w-full h-full"
                onAnimationStart={() => setIsAnimating(true)}
                onAnimationComplete={() => setIsAnimating(false)}
              >
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-900/30 rounded-2xl p-6 md:p-8 h-full shadow-lg">
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-b from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                          {testimonials[currentIndex].name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-lg">
                            {testimonials[currentIndex].name}
                          </h3>
                          <p className="text-purple-400 text-sm">
                            {testimonials[currentIndex].role}
                          </p>
                        </div>
                      </div>
                      <div className="flex">
                        {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 text-yellow-400 fill-yellow-400"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex-grow">
                      <p className="text-gray-300 text-base leading-relaxed">
                        {testimonials[currentIndex].text}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <p className="text-purple-400 font-medium">
                        "
                        {testimonials[currentIndex].highlight ||
                          testimonials[currentIndex].text.substring(0, 50)}
                        ..."
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={prevSlide}
              className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              disabled={isAnimating}
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Anterior</span>
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    currentIndex === index
                      ? "bg-purple-500 w-6"
                      : "bg-gray-600 hover:bg-gray-500"
                  }`}
                  aria-label={`Ir para depoimento ${index + 1}`}
                  disabled={isAnimating}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              disabled={isAnimating}
            >
              <span className="hidden sm:inline">Próximo</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Preview of Next Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {nextPreviews.map((index) => (
            <div
              key={index}
              onClick={() => goToSlide(index)}
              className="bg-gray-900/60 backdrop-blur-sm border border-purple-900/20 rounded-xl p-4 cursor-pointer hover:border-purple-500/40 transition-all hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-900/40 flex items-center justify-center text-white font-bold text-sm">
                  {testimonials[index].name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-medium text-white text-sm truncate">
                    {testimonials[index].name}
                  </h4>
                  <div className="flex">
                    {[...Array(testimonials[index].rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-sm line-clamp-2">
                {testimonials[index].highlight}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
      </div>
    </section>
  );
}
