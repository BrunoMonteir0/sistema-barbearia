import { useState, useEffect } from 'react'
import { Route, Switch, Link, useLocation } from 'wouter'
import {
  Home,
  Users,
  Calendar,
  Scissors,
  Package,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  ChevronDown,
  Bell,
  UserCog,
  CreditCard
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

import DashboardPage from './painel/DashboardPage'
import ClientesPage from './painel/ClientesPage'
import AgendamentosPage from './painel/AgendamentosPage'
import ServicosPage from './painel/ServicosAdminPage'
import ProdutosPage from './painel/ProdutosPage'
import FinanceiroPage from './painel/FinanceiroPage'
import ConfigPage from './painel/ConfigPage'
import UsuariosPage from './painel/UsuariosPage'
import FuncionariosPage from './painel/FuncionariosPage'
import MetodosPagamentoAdminPage from './painel/MetodosPagamentoAdminPage'

export default function PainelPage() {
  const [location, setLocation] = useLocation()
  const { user, profile, signOut, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) setLocation('/login')
  }, [user, loading])

  if (loading) return null
  if (!user) return null

  const menuItems = [
    { href: '/painel', icon: Home, label: 'Dashboard', exact: true },
    { href: '/painel/agendamentos', icon: Calendar, label: 'Agendamentos' },
    { href: '/painel/clientes', icon: Users, label: 'Clientes' },
    { href: '/painel/servicos', icon: Scissors, label: 'Serviços' },
    { href: '/painel/produtos', icon: Package, label: 'Produtos' },
    { href: '/painel/financeiro', icon: DollarSign, label: 'Financeiro' },
    { href: '/painel/metodos-pagamento', icon: CreditCard, label: 'Métodos de Pagamento' },
    { href: '/painel/funcionarios', icon: UserCog, label: 'Funcionários' },
    { href: '/painel/usuarios', icon: User, label: 'Usuários' },
    { href: '/painel/config', icon: Settings, label: 'Configurações' },
  ]

  async function handleLogout() {
    await signOut()
    toast.success('Logout realizado!')
    setLocation('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-secondary-500 text-white transition-all duration-300 
        ${sidebarOpen ? 'w-64' : 'w-20'}`}>

        <div className="flex items-center justify-between h-16 px-4 border-b">

          {/* ✅ AGORA É LINK PARA O DASHBOARD */}
          {sidebarOpen && (
            <Link href="/" className="font-bold text-lg hover:opacity-80">
              Barbearia
            </Link>
          )}

          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X /> : <Menu />}
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = item.exact
              ? location === item.href
              : location.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg
                ${isActive ? 'bg-primary-500' : 'hover:bg-secondary-400'}`}>
                <item.icon className="h-5 w-5" />
                {sidebarOpen && item.label}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t">
          <button onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-secondary-400 rounded-lg">
            <LogOut className="h-5 w-5" />
            {sidebarOpen && 'Sair'}
          </button>
        </div>
      </aside>

      {/* CONTEÚDO */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="bg-white h-16 shadow-sm flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">
            {menuItems.find(i => location.startsWith(i.href))?.label || 'Painel'}
          </h1>

          <div className="flex items-center gap-4">
            <Bell />
            <div className="flex items-center gap-2">
              <User />
              {profile?.nome}
            </div>
          </div>
        </header>

        <main className="p-6">
          <Switch>
            <Route path="/painel" component={DashboardPage} />
            <Route path="/painel/agendamentos" component={AgendamentosPage} />
            <Route path="/painel/clientes" component={ClientesPage} />
            <Route path="/painel/servicos" component={ServicosPage} />
            <Route path="/painel/produtos" component={ProdutosPage} />
            <Route path="/painel/financeiro" component={FinanceiroPage} />
            <Route path="/painel/metodos-pagamento" component={MetodosPagamentoAdminPage} />
            <Route path="/painel/funcionarios" component={FuncionariosPage} />
            <Route path="/painel/usuarios" component={UsuariosPage} />
            <Route path="/painel/config" component={ConfigPage} />
          </Switch>
        </main>
      </div>
    </div>
  )
}
