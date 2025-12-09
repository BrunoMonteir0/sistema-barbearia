import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
    Home,
    Calendar,
    User,
    CreditCard,
    FileText,
    Clock,
    Menu,
    X,
    Bell,
    ChevronDown,
    LogOut,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function MinhaContaPage() {
    const [location, setLocation] = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    const [proximoAgendamento, setProximoAgendamento] = useState<any>(null);

    useEffect(() => {
        carregarUsuario();
        carregarProximoAgendamento();
    }, []);

    async function carregarUsuario() {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) return;

        const { data } = await supabase
            .from("usuarios")
            .select("nome, email, foto")
            .eq("id", user.id)
            .single();

        setUserData(data);
    }

    async function carregarProximoAgendamento() {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) return;

        const today = new Date().toISOString().split("T")[0];

        const { data } = await supabase
            .from("agendamentos")
            .select("id, data, hora, status")
            .eq("cliente_id", user.id)
            .gte("data", today)
            .order("data", { ascending: true })
            .order("hora", { ascending: true })
            .limit(1)
            .single();

        setProximoAgendamento(data || null);
    }

    const menuItems = [
        { href: "/minha-conta", icon: Home, label: "Visão Geral", exact: true },
        { href: "/minha-conta/agendamentos", icon: Calendar, label: "Agendamentos" },
        { href: "/minha-conta/dados", icon: User, label: "Meus Dados" },
        { href: "/minha-conta/pagamentos", icon: CreditCard, label: "Pagamentos" },
        { href: "/minha-conta/assinaturas", icon: FileText, label: "Assinaturas" },
        { href: "/minha-conta/historico", icon: Clock, label: "Histórico" },
    ];

    async function handleLogout() {
        await supabase.auth.signOut();
        setLocation("/login");
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* SIDEBAR */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 bg-secondary-500 text-white transition-all duration-300 
        ${sidebarOpen ? "w-64" : "w-20"}`}
            >
                <div className="flex items-center justify-between h-16 px-4 border-b border-secondary-400">
                    {sidebarOpen && (
                        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                            <Home className="h-6 w-6" />
                            <span>Barbearia</span>
                        </Link>
                    )}

                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-secondary-400 rounded-lg transition-colors"
                    >
                        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = item.exact
                            ? location === item.href
                            : location.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${isActive
                                        ? "bg-primary-500 text-white"
                                        : "hover:bg-secondary-400 text-gray-300"
                                    }`}
                            >
                                <item.icon className="h-5 w-5 flex-shrink-0" />
                                {sidebarOpen && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-secondary-400">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-400 text-gray-300 w-full transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        {sidebarOpen && <span>Sair</span>}
                    </button>
                </div>
            </aside>

            {/* ÁREA PRINCIPAL */}
            <div
                className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"
                    }`}
            >
                {/* TOPO */}
                <header className="bg-white h-16 shadow-sm flex items-center justify-between px-6 sticky top-0 z-40">
                    <h1 className="text-xl font-semibold text-secondary-500">
                        Visão Geral
                    </h1>

                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-gray-100 rounded-full relative">
                            <Bell className="h-5 w-5 text-gray-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                                    <User className="h-4 w-4 text-white" />
                                </div>
                                <span className="font-medium text-gray-700">
                                    {userData?.nome || "Usuário"}
                                </span>
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                            </button>

                            {userMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border">
                                    <div className="px-4 py-2 border-b">
                                        <p className="font-medium text-gray-700">
                                            {userData?.nome}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {userData?.email}
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                                    >
                                        Sair
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* CONTEÚDO */}
                <main className="p-6 space-y-6">
                    {/* GRID DE RESUMO */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <p className="text-gray-500 text-sm">Status da Conta</p>
                            <p className="text-xl font-bold text-green-600 mt-1">Ativa</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <p className="text-gray-500 text-sm">Próximo Agendamento</p>
                            <p className="text-secondary-500 font-semibold mt-1">
                                {proximoAgendamento
                                    ? `${proximoAgendamento.data} — ${proximoAgendamento.hora}`
                                    : "Nenhum agendamento"}
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <p className="text-gray-500 text-sm">Total de Agendamentos</p>
                            <p className="text-secondary-500 font-semibold mt-1">
                                Em breve
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <p className="text-gray-500 text-sm">Cortes Realizados</p>
                            <p className="text-secondary-500 font-semibold mt-1">
                                Em breve
                            </p>
                        </div>
                    </div>

                    {/* PERFIL */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-secondary-500 mb-4">
                            Meu Perfil
                        </h2>

                        <div className="space-y-2 text-sm text-gray-600">
                            <p><strong>Nome:</strong> {userData?.nome || "-"}</p>
                            <p><strong>Email:</strong> {userData?.email || "-"}</p>
                        </div>
                    </div>

                    {/* FINANCEIRO */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-secondary-500 mb-4">
                            Status Financeiro
                        </h2>

                        <p className="text-gray-500">
                            Nenhum pagamento pendente no momento.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}
