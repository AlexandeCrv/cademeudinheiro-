import Link from "next/link";
import {
  Instagram,
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Shield,
  CreditCard,
  Lock,
} from "lucide-react";
import Image from "next/image";
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gray-950 text-gray-300 overflow-hidden pt-16 pb-8">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-900/10 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-violet-900/10 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-4">
            <div>
              <Link href="/" className="flex items-center ">
                <Image src="/logo.png" alt="Logo" width={150} height={150} />
              </Link>
            </div>

            <p className="text-gray-400 mb-6">
              Transforme sua vida financeira com a CMD. Controle seus gastos, economize
              dinheiro e alcance seus objetivos financeiros com a plataforma mais completa
              do mercado.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-purple-400" />
                <span>contato@CMD.com.br</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-purple-400" />
                <span>(11) 9999-9999</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <span>Av. Paulista, 1590 - Urbis 2, São Paulo - SP, 92421-500</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold text-lg mb-4">Empresa</h3>
            <ul className="space-y-2">
              {["Sobre nós", "Carreiras", "Blog", "Imprensa", "Contato"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-1"
                  >
                    <span>{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold text-lg mb-4">Recursos</h3>
            <ul className="space-y-2">
              {["Guias", "Tutoriais", "Ferramentas", "API", "Desenvolvedores"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-1"
                    >
                      <span>{item}</span>
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              {["Termos de Uso", "Privacidade", "Cookies", "Segurança", "Compliance"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-1"
                    >
                      <span>{item}</span>
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold text-lg mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Receba dicas financeiras e novidades da CMD diretamente no seu e-mail.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="bg-gray-900 border border-gray-800 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent flex-grow"
              />
              <button className="bg-purple-600 hover:bg-purple-700 text-white rounded-r-lg px-4 transition-colors">
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-gray-800 pt-8 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-900/20 flex items-center justify-center">
                <Shield className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h4 className="text-white font-medium">Dados Protegidos</h4>
                <p className="text-gray-400 text-sm">Criptografia de ponta a ponta</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-900/20 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h4 className="text-white font-medium">Pagamento Seguro</h4>
                <p className="text-gray-400 text-sm">Processamento seguro via Stripe</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-900/20 flex items-center justify-center">
                <Lock className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h4 className="text-white font-medium">Conformidade LGPD</h4>
                <p className="text-gray-400 text-sm">Seus dados são seus</p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-6 mb-4 md:mb-0">
            <Link
              href="https://www.instagram.com/xande.mirandac/"
              target="_blank"
              className="text-gray-400 hover:text-purple-400 transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link
              href="https://www.linkedin.com/in/alexandre-carvalho-4b178a26b/"
              target="_blank"
              className="text-gray-400 hover:text-purple-400 transition-colors"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link
              href="https://github.com/AlexandeCrv"
              target="_blank"
              className="text-gray-400 hover:text-purple-400 transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>

          <div className="text-gray-500 text-sm">
            <p>© {currentYear} CMD. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
