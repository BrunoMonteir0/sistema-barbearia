import { Link } from 'wouter'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-20">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-500 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-secondary-500 mb-4">Pagina nao encontrada</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          A pagina que voce esta procurando nao existe ou foi movida.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/" className="btn-primary flex items-center gap-2">
            <Home className="h-5 w-5" />
            Voltar ao Inicio
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </button>
        </div>
      </div>
    </div>
  )
}
