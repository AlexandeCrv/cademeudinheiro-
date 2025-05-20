import Image from "next/image";
import { ArrowRight, Lock, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-[#0D001B] py-12 md:py-20 overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-900/20 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-violet-900/20 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-12">
          <div className="w-full md:w-1/2 mb-8 md:mb-0 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent rounded-3xl transform -rotate-3 scale-105"></div>
            <div className="animate-float">
              <Image
                height={500}
                width={500}
                src="/imgHero5.png"
                alt="Dashboard financeiro CMD"
                className="w-full max-w-[400px] md:max-w-[600px] mx-auto md:mx-0 rounded-3xl shadow-2xl"
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 text-center md:text-left space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 bg-purple-900/30 px-3 py-1 rounded-full mb-4 animate-pulse">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-400">
                Revolução Financeira
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[63px] leading-tight font-semibold text-[#E2E2E2]">
              Controle financeiro pessoal com toda a{" "}
              <span className="group inline-block relative z-10">
                <span className="text-transparent mr-2 relative bg-clip-text z-20 bg-gradient-to-r from-[#A64EFF] to-[#FF4EC7]">
                  praticidade
                  <span className="absolute left-0 -bottom-1 w-[28%] h-[2px] bg-[#A64EFF] transition-all duration-500 ease-in-out delay-100 group-hover:w-full" />
                </span>
              </span>
              que a planilha não te oferece.
            </h1>

            <div className="w-full">
              <p className="mt-4 md:mt-6 mb-6 md:mb-8 max-w-[520px] text-sm sm:text-base text-[#CCCCCC] font-normal mx-auto md:mx-0">
                Organize seu dinheiro em tempo real em uma solução completa, prática e
                segura. Tenha o controle de finanças que você sempre quis!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center md:justify-start">
              <Link
                href="/register"
                className="rounded-lg text-sm tracking-tight transition-all ease-in-out duration-300 select-none inline-flex shadow-md text-white font-semibold py-3 pl-6 pr-2 items-center justify-center bg-[#1B2A38] hover:bg-[#0A3A4A] hover:scale-105 w-full sm:w-auto"
              >
                Teste agora mesmo!
                <div className="ml-4 bg-[#111827] rounded-md w-10 h-10 inline-flex justify-center items-center">
                  <ArrowRight className="h-5 w-5 " />
                </div>
              </Link>

              <div className="flex items-center text-white mt-4 sm:mt-0 group">
                <div className="espelhado-transparente-nav h-10 mt-2 w-14 mr-2.5 bg-[#1f1f1f] rounded-lg flex items-center justify-center">
                  <Lock className="h-5 w-5 " />
                </div>
                <div>
                  <p className="text-xs sm:text-sm">
                    Segurança dos seus dados em primeiro lugar
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Imagem com efeito de flutuação */}
        </div>
      </div>
    </section>
  );
}
