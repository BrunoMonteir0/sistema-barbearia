import { Link } from "wouter";

export default function UserSidebar() {
    const links = [
        { href: "/minha-conta", label: "Visão Geral" },
        { href: "/minha-conta/agendamentos", label: "Meus Agendamentos" },
        { href: "/minha-conta/dados", label: "Meus Dados" },
        { href: "/minha-conta/pagamentos", label: "Pagamentos" },
        { href: "/minha-conta/assinaturas", label: "Assinaturas" },
        { href: "/minha-conta/historico", label: "Histórico de Cortes" },
    ];

    return (
        <aside className="w-full md:w-64 bg-white border rounded-lg p-4 h-fit">
            <nav className="space-y-2">
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="block p-3 rounded-lg border hover:bg-gray-100 transition text-secondary-500"
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
