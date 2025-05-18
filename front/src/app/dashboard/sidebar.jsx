"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  BarChart3,
  PieChart,
  Wallet,
  Clock,
  Target,
  LogOut,
  Library,
  Shield,
} from "lucide-react";
import Image from "next/image";

export default function Sidebar({ onLogout, userName, role }) {
  const pathname = usePathname();
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: BarChart3 },
    { name: "Transações", path: "/transactions", icon: Wallet },
    { name: "Categorias", path: "/categories", icon: PieChart },
    { name: "Relatórios", path: "/reports", icon: Library },
    { name: "Metas", path: "/goals", icon: Target },

    // Rota só para admin
    { name: "Admin Panel", path: "/admin", icon: Shield, role: "admin" },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-16 md:w-64 bg-gray-900 border-r border-purple-900/30 flex flex-col items-center md:items-start py z-10">
      <span className="mx-auto">
        <Image src="/logo.png" alt="Logo" width={150} height={150} />
      </span>

      <nav className="flex flex-col items-center md:items-start w-full">
        {menuItems.map((item) => {
          // Se a rota tem role e o usuário não é admin, não mostrar
          if (item.role === "admin" && role !== "admin") {
            return null;
          }

          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`w-full flex items-center justify-center md:justify-start md:px-6 py-3 transition-colors ${
                isActive
                  ? "text-purple-400 bg-purple-900/20 border-l-4 border-purple-500"
                  : "text-gray-400 hover:bg-gray-800/50 hover:text-purple-400 border-l-4 border-transparent"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="hidden md:block ml-3">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto w-full">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center md:justify-start md:px-6 py-3 text-gray-400 hover:bg-gray-800/50 hover:text-red-400 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="hidden md:block ml-3">Sair</span>
        </button>
      </div>
    </div>
  );
}
