// components/HeroSection.js
import Image from "next/image";
import { ArrowUpRight, Clock, BarChart3, Sparkles } from "lucide-react";
export default function HeroSection() {
  return (
    <section className="bg-[#0D001B] py-12 ">
      <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center justify-between">
        <div className="md:w-1/2 text-center md:text-left space-y-10">
          <div className="inline-flex items-center gap-2 bg-purple-900/30 px-3 py-1 rounded-full mb-4">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-400">
              Revolução Financeira
            </span>
          </div>
          <h1 className="text-4xl md:text-[63px] leading-tight font-semibold text-[#E2E2E2]">
            Controle financeiro pessoal com toda a{" "}
            <span className="group inline-block relative z-10">
              <span className="text-transparent mr-2 relative bg-clip-text z-20 bg-gradient-to-r from-[#A64EFF] to-[#FF4EC7]">
                praticidade
                <span className="absolute left-0 -bottom-1 w-[28%] h-[2px] bg-[#A64EFF] transition-all duration-500 ease-in-out delay-100 " />
              </span>
            </span>
            que a planilha não te oferece.
          </h1>

          <div className="w-full md:w-[490px]">
            <p className="mt-6 mb-8 max-w-[520px] text-base text-[#CCCCCC] font-normal text-center md:text-left">
              Organize seu dinheiro em tempo real em uma solução completa, prática e
              segura. Tenha o controle de finanças que você sempre quis!
            </p>
          </div>

          <div>
            <a
              href="/register"
              className="rounded-lg text-base tracking-tight transition-colors ease-in-out duration-300 select-none inline-flex shadow-md text-white font-semibold py-2 pl-6 pr-2 items-center justify-center bg-[#1B2A38] hover:bg-[#0A3A4A]"
            >
              Teste agora mesmo!
              <div className="ml-4 bg-[#111827] rounded-md w-10 h-10 inline-flex justify-center items-center">
                <img
                  src="https://www.organizze.com.br/assets/images/arrow-right-R7RZTDAN.svg"
                  alt=""
                />
              </div>
            </a>
          </div>
        </div>

        {/* Imagem */}
        <div className="md:w-1/2  md:mb-0">
          <Image
            height={2500}
            width={2500}
            src="/imgHero2.png"
            alt="herosection"
            className="h-full w-full object-contain md:rounded-3xl shadow-lg shadow-purple-900/30"
          />
        </div>
      </div>
    </section>
  );
}
