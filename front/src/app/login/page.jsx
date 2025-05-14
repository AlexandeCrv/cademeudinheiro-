"use client";

import { ArrowLeft } from "lucide-react";
import { useLogin } from "./useLogin";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { email, setEmail, password, setPassword, error, handleSubmit } = useLogin();

  const router = useRouter();
  return (
    <main className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-gray-950 to-gray-900"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-900/20 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-violet-900/20 rounded-full filter blur-3xl"></div>
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full bg-[linear-gradient(to_right,#8B5CF6_1px,transparent_1px),linear-gradient(to_bottom,#8B5CF6_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>
      </div>

      {/* Botão de voltar */}
      <div
        className="absolute top-6 left-6 cursor-pointer text-purple-400 hover:text-purple-300 z-10"
        onClick={() => router.push("/")}
      >
        <ArrowLeft size={28} />
      </div>

      {/* Card de login */}
      <div className="max-w-md w-full bg-gray-900 border border-purple-900/50 p-8 rounded-2xl shadow-glow z-10">
        <h2 className="text-center text-3xl font-bold text-white mb-2">
          Entrar na conta
        </h2>
        <p className="text-center text-gray-400 mb-6">
          Não tem conta?{" "}
          <a href="/register" className="text-purple-400 hover:text-purple-300 underline">
            Crie uma
          </a>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}
