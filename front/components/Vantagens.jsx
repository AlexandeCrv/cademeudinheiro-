import {
  ArrowUpRight,
  Clock,
  Shield,
  ChevronRight,
  LineChart,
  Wallet,
} from "lucide-react";
import TestimonialCarousel from "./testimonial-carousel";
export default function FeaturesSection() {
  return (
    <div id="vantagens" className="relative py-10 pb-32 overflow-x-clip ">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-gray-950 to-gray-900"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-900/20 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-violet-900/20 rounded-full filter blur-3xl"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full bg-[linear-gradient(to_right,#8B5CF6_1px,transparent_1px),linear-gradient(to_bottom,#8B5CF6_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 bg-purple-900/30 px-4 py-2 rounded-full mb-4">
            <Shield className="h-5 w-5 text-purple-400" />
            <span className="text-sm font-medium text-purple-400">
              Recursos Poderosos
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl text-white font-bold mb-6">
            Tudo que você precisa para
            <span className="bg-gradient-to-r from-purple-500 to-violet-400 bg-clip-text text-transparent">
              {" "}
              dominar suas finanças
            </span>
          </h2>

          <p className="text-gray-400 text-lg">
            O CMD reúne ferramentas avançadas em uma interface intuitiva, permitindo que
            você tenha controle total sobre sua vida financeira.
          </p>
        </div>

        {/* Main Feature */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-purple-900/50 p-8 mb-12 shadow-glow">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <div className="w-16 h-16 bg-purple-900/30 rounded-xl flex items-center justify-center mb-6">
                <LineChart className="text-purple-400 h-8 w-8" />
              </div>

              <h3 className="text-2xl font-bold mb-4 text-white">
                Análise financeira completa
              </h3>

              <p className="text-gray-300 mb-6">
                Visualize todos os seus gastos e ganhos em gráficos interativos e
                relatórios detalhados. Entenda para onde seu dinheiro está indo e
                identifique oportunidades de economia.
              </p>

              <ul className="space-y-3">
                {[
                  "Gráficos interativos de gastos e receitas",
                  "Relatórios personalizados por categoria",
                  "Previsões financeiras baseadas no seu histórico",
                  "Alertas de gastos excessivos",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:w-1/2 relative">
              <div className="aspect-video bg-gray-800 rounded-xl overflow-hidden border border-purple-900/30 shadow-lg">
                <img
                  src="cmdimg.png"
                  className="w-full h-full object-cover brightness-40"
                  alt=""
                />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-violet-900/20 opacity-50"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-purple-600/30 rounded-full flex items-center justify-center mb-4">
                      <LineChart className="h-8 w-8 text-purple-300" />
                    </div>
                    <p className="text-white font-medium">
                      Visualização de dados financeiros
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-glow">
                Exclusivo
              </div>

              <div className="absolute -bottom-3 left-10 bg-gray-900 border border-purple-900/50 text-white px-4 py-2 rounded-lg shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Economia de 32% em 3 meses</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid - Redesenhado com cards mais interessantes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-gray-900 rounded-xl border border-purple-900/50 overflow-hidden group hover:shadow-glow transition-all duration-300">
            <div className="h-2 bg-gradient-to-r from-purple-500 to-violet-500"></div>
            <div className="p-6">
              <div className="w-14 h-14 bg-purple-900/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-900/40 transition-all duration-300">
                <ArrowUpRight className="text-purple-400 h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-400 transition-all duration-300">
                Seu futuro mais seguro
              </h3>
              <p className="text-gray-400">
                Com seu dinheiro organizado fica muito mais fácil planejar o futuro. Para
                te ajudar, a CMD te mostra previsões valiosas das suas finanças.
              </p>

              <div className="mt-6 pt-4 border-t border-gray-800">
                <a
                  href="#"
                  className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <span className="mr-2">Saiba mais</span>
                  <ChevronRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-900 rounded-xl border border-purple-900/50 overflow-hidden group hover:shadow-glow transition-all duration-300">
            <div className="h-2 bg-gradient-to-r from-purple-500 to-violet-500"></div>
            <div className="p-6">
              <div className="w-14 h-14 bg-purple-900/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-900/40 transition-all duration-300">
                <Clock className="text-purple-400 h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-400 transition-all duration-300">
                Economize tempo e dinheiro
              </h3>
              <p className="text-gray-400">
                Concentre suas informações financeiras em um único app, e não perca tempo
                abrindo todos os aplicativos de banco para checar seus gastos.
              </p>

              <div className="mt-6 pt-4 border-t border-gray-800">
                <a
                  href="#"
                  className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <span className="mr-2">Saiba mais</span>
                  <ChevronRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-900 rounded-xl border border-purple-900/50 overflow-hidden group hover:shadow-glow transition-all duration-300">
            <div className="h-2 bg-gradient-to-r from-purple-500 to-violet-500"></div>
            <div className="p-6">
              <div className="w-14 h-14 bg-purple-900/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-900/40 transition-all duration-300">
                <Wallet className="text-purple-400 h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-400 transition-all duration-300">
                Previsibilidade garantida
              </h3>
              <p className="text-gray-400">
                As faturas de todos os seus cartões de crédito reunidas em um lugar só! Já
                imaginou? Tudo para garantir a previsibilidade que você precisa.
              </p>

              <div className="mt-6 pt-4 border-t border-gray-800">
                <a
                  href="#"
                  className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <span className="mr-2">Saiba mais</span>
                  <ChevronRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TestimonialCarousel />
    </div>
  );
}
