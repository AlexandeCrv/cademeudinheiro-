"use client";

import { useState } from "react";
import {
  LineChart,
  Wallet,
  Clock,
  Shield,
  ArrowRight,
  BarChart3,
  PieChart,
  CreditCard,
  BellRing,
  TrendingUp,
  Smartphone,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Carrosel from "./testimonial-carousel";

export default function FeaturesSection() {
  const [activeTab, setActiveTab] = useState("analise");

  const features = {
    analise: {
      title: "Análise financeira completa",
      description:
        "Visualize todos os seus gastos e ganhos em gráficos interativos e relatórios detalhados. Entenda para onde seu dinheiro está indo e identifique oportunidades de economia.",
      icon: <LineChart className="h-6 w-6 text-purple-400" />,
      image: "/cmdimg.png",
      benefits: [
        "Gráficos interativos de gastos e receitas",
        "Relatórios personalizados por categoria",
        "Previsões financeiras baseadas no seu histórico",
      ],
    },
    economia: {
      title: "Economize tempo e dinheiro",
      description:
        "Concentre suas informações financeiras em um único app, e não perca tempo abrindo todos os aplicativos de banco para checar seus gastos. Economize até 32% em 3 meses.",
      icon: <Clock className="h-6 w-6 text-purple-400" />,
      image: "/cmdimg.png",
      benefits: [
        "Categorização automática de gastos",
        "Sugestões personalizadas de economia",
      ],
    },
    previsibilidade: {
      title: "Previsibilidade garantida",
      description:
        "As faturas de todos os seus cartões de crédito reunidas em um lugar só! Já imaginou? Tudo para garantir a previsibilidade que você precisa para planejar seu futuro financeiro.",
      icon: <Wallet className="h-6 w-6 text-purple-400" />,
      image: "/cmdimg.png",
      benefits: [
        "Controle de faturas de cartão de crédito",

        "Planejamento de gastos futuros",
        "Simulação de cenários financeiros",
      ],
    },
  };

  const featureCards = [
    {
      title: "Gráficos interativos",
      description:
        "Visualize seus gastos e receitas em gráficos interativos e personalizáveis",
      icon: <BarChart3 />,
    },
    {
      title: "Categorização inteligente",
      description: "Categorização automática de transações para melhor organização",
      icon: <PieChart />,
    },

    {
      title: "Metas financeiras",
      description: "Defina e acompanhe suas metas de economia e investimento",
      icon: <TrendingUp />,
    },
  ];

  return (
    <section id="vantagens" className="relative py-20 overflow-y-clip overflow-x-clip">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-gray-950 to-gray-900"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-900/20 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-violet-900/20 rounded-full filter blur-3xl"></div>

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
            Tudo que você precisa para{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-violet-400">
              dominar suas finanças
            </span>
          </h2>

          <p className="text-gray-400 text-lg">
            O CMD reúne ferramentas avançadas em uma interface intuitiva, permitindo que
            você tenha controle total sobre sua vida financeira.
          </p>
        </div>

        {/* Feature Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {Object.keys(features).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === key
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                {features[key].icon}
                <span>{features[key].title}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Feature Showcase */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-purple-900/50 p-6 md:p-10 mb-16 shadow-lg"
        >
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="lg:w-1/2 order-2 lg:order-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-900/30 rounded-xl flex items-center justify-center">
                  {features[activeTab].icon}
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {features[activeTab].title}
                </h3>
              </div>

              <p className="text-gray-300 mb-8 text-lg">
                {features[activeTab].description}
              </p>

              <ul className="space-y-4">
                {features[activeTab].benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3 group">
                    <div className="w-6 h-6 rounded-full bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-purple-600/50 transition-colors">
                      <ArrowRight className="h-3 w-3 text-purple-400" />
                    </div>
                    <span className="text-gray-300 group-hover:text-white transition-colors">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <a
                  href="/register"
                  className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all hover:translate-x-1"
                >
                  <span>Experimente agora</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="lg:w-1/2 order-1 lg:order-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-pink-600/20 rounded-xl transform rotate-3"></div>
                <div className="relative rounded-xl overflow-hidden border border-purple-900/30 shadow-2xl">
                  <Image
                    src={features[activeTab].image || "/placeholder.svg"}
                    alt={features[activeTab].title}
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 to-transparent"></div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  Exclusivo
                </div>

                <div className="absolute -bottom-3 left-10 bg-gray-900/90 backdrop-blur-sm border border-purple-900/50 text-white px-4 py-2 rounded-lg shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Economia de 32% em 3 meses</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {featureCards.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-900/80 backdrop-blur-sm border border-purple-900/30 rounded-xl p-6 hover:shadow-lg hover:shadow-purple-900/20 transition-all group hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-lg bg-purple-900/30 flex items-center justify-center mb-4 group-hover:bg-purple-600/40 transition-colors">
                {feature.icon && (
                  <div className="text-purple-400 h-6 w-6">{feature.icon}</div>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2 text-white group-hover:text-purple-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
      </div>
      <Carrosel />
    </section>
  );
}
