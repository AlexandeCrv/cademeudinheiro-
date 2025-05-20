"use client";

import Link from "next/link";
import Image from "next/image";
export default function Navbar() {
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <nav className="bg-[#0D001B] font-aliance w-full z-50   h-28 ">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex  items-center justify-between">
        <div>
          <Link href="/" className="flex items-center gap-2 ">
            <Image src="/logo.png" alt="Logo" width={150} height={150} />
          </Link>
        </div>

        {/* Links principais */}
        <div className="flex justify-between ">
          <div className="hidden md:flex mb-10 space-x-8 md:mr-[300px] text-[16px]">
            {[
              { href: "vantagens", label: "Vantagens" },
              { href: "avaliacoes", label: "Avaliações" },
            ].map((item) => (
              <button
                key={item.href}
                onClick={() => handleScroll(item.href)}
                className="relative group text-[#E2E2E2] font-medium"
              >
                {item.label}
                <span className="absolute left-0 -bottom-1 w-[30%] h-[2px] bg-[#A64EFF] transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* Botões à direita */}
          <div className="space-x-4">
            <Link
              href="/login"
              className="relative group text-[#CCCCCC] text-[16px] px-4  rounded-lg font-medium"
            >
              Entrar
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#A64EFF] transition-all duration-300 group-hover:w-full" />
            </Link>

            <Link
              href="/register"
              className="bg-[#1B2A38] hover:bg-[#0A3A4A] text-white px-6 py-3 text-md rounded-lg font-semibold transition"
            >
              Comece já!
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
