import Link from "next/link";
import {
  Instagram,
  Github,
  Linkedin,
  Shield,
  CreditCard,
  Lock,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gray-950 text-gray-300 overflow-hidden pt-10 pb-6">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-900/10 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-violet-900/10 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
          {/* Logo e Descrição */}
          <div className="md:max-w-xs">
            <Link href="/" className="inline-block mb-3">
              <Image src="/logo.png" alt="Logo" width={100} height={100} />
            </Link>
            <p className="text-gray-400 text-sm">
              Transforme sua vida financeira com a CMD. Controle seus gastos, economize
              dinheiro e alcance seus objetivos financeiros.
            </p>
          </div>

          {/* Por que escolher CMD */}
          <div className="md:max-w-xs">
            <h4 className="text-white font-medium text-sm mb-3">Por que escolher CMD</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  Controle financeiro completo em um só lugar
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  Relatórios detalhados e personalizados
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  Economia comprovada em poucos meses
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  Suporte dedicado para todas as dúvidas
                </span>
              </li>
            </ul>
          </div>

          {/* Trust Badges */}
          <div className="space-y-3">
            <h4 className="text-white font-medium text-sm mb-2">
              Sua segurança é nossa prioridade
            </h4>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-900/20 flex items-center justify-center">
                <Shield className="h-4 w-4 text-purple-400" />
              </div>
              <p className="text-gray-400 text-sm">Dados protegidos com criptografia</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-900/20 flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-purple-400" />
              </div>
              <p className="text-gray-400 text-sm">Pagamentos seguros via Stripe</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-900/20 flex items-center justify-center">
                <Lock className="h-4 w-4 text-purple-400" />
              </div>
              <p className="text-gray-400 text-sm">Conformidade total com a LGPD</p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm">
            <p>© {currentYear} CMD. Todos os direitos reservados.</p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="https://www.instagram.com/xande.mirandac/"
              target="_blank"
              className="text-gray-400 hover:text-purple-400 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </Link>
            <Link
              href="https://www.linkedin.com/in/alexandre-carvalho-4b178a26b/"
              target="_blank"
              className="text-gray-400 hover:text-purple-400 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
            <Link
              href="https://github.com/AlexandeCrv"
              target="_blank"
              className="text-gray-400 hover:text-purple-400 transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
