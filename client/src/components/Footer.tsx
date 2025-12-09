import { Scissors, Phone, Mail, MapPin, Instagram } from 'lucide-react'
import { Link } from 'wouter'

export default function Footer() {
  return (
    <footer className="bg-secondary-500 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-xl font-bold mb-4">
              <Scissors className="h-6 w-6" />
              <span>Barbearia</span>
            </div>
            <p className="text-gray-300 text-sm">
              A melhor experiencia em cuidados masculinos. Cortes modernos, barba impecavel e ambiente acolhedor.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Links Rapidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/servicos" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Servicos
                </Link>
              </li>
              <li>
                <Link href="/agendamento" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Agendar
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-300">
                <Phone className="h-4 w-4 text-primary-400" />
                <span>(11) 99999-9999</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Mail className="h-4 w-4 text-primary-400" />
                <span>contato@barbearia.com</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <MapPin className="h-4 w-4 text-primary-400" />
                <span>Rua Exemplo, 123 - Cidade</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Redes Sociais</h4>
            <div className="flex gap-4">
              <a
                href="https://botcom.com.br"
                className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-400 mt-8 pt-8 text-center text-gray-300 text-sm">
          <p>&copy; {new Date().getFullYear()} Barbearia. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
