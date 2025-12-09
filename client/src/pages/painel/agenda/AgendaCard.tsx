import { Agendamento } from "./useAgenda";
import { Clock } from "lucide-react";

interface Props {
    ag: Agendamento;
    badge: { label: string; classe: string } | null;
    updateStatus: (id: string, status: string) => void;
}

export default function AgendaCard({ ag, badge, updateStatus }: Props) {
    const isPast = new Date(`${ag.data}T${ag.hora}`) < new Date();

    return (
        <div
            className={`bg-white p-4 rounded-lg shadow grid grid-cols-1 md:grid-cols-5 gap-4 transition ${isPast ? "opacity-50" : ""
                }`}
        >
            {/* Horário */}
            <div className="flex items-center gap-4">
                <div className="bg-red-100 text-red-500 p-3 rounded-full">
                    <Clock className="h-6 w-6" />
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-secondary-500">{ag.hora}</h3>
                    <p className="text-gray-500 capitalize text-sm leading-tight">
                        {new Date(ag.data).toLocaleDateString("pt-BR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                        })}
                    </p>

                    {badge && (
                        <span
                            className={`inline-block mt-1 px-2 py-1 text-xs rounded ${badge.classe}`}
                        >
                            {badge.label}
                        </span>
                    )}
                </div>
            </div>

            {/* Cliente */}
            <div>
                <p className="font-semibold text-secondary-500 mb-1">Cliente</p>
                <p className="text-gray-600">{ag.cliente.nome}</p>
                <p className="text-gray-500 text-sm">{ag.cliente.telefone}</p>
            </div>

            {/* Serviço */}
            <div>
                <p className="font-semibold text-secondary-500 mb-1">Serviço</p>
                <p className="text-gray-600">{ag.servico.nome}</p>
                <p className="text-primary-500 font-bold text-sm">
                    R$ {ag.servico.preco.toFixed(2).replace(".", ",")}
                </p>
            </div>

            {/* Profissional */}
            <div>
                <p className="font-semibold text-secondary-500 mb-1">Profissional</p>
                <p className="text-gray-600">{ag.funcionario?.usuario.nome || "—"}</p>
            </div>

            {/* Status + Ações */}
            <div className="flex flex-col items-start md:items-end gap-2">
                <span
                    className={`px-3 py-1 text-sm rounded-full w-fit ${ag.status === "Concluido"
                            ? "bg-blue-100 text-blue-600"
                            : ag.status === "Cancelado"
                                ? "bg-red-100 text-red-600"
                                : ag.status === "Confirmado"
                                    ? "bg-green-100 text-green-600"
                                    : "bg-gray-200 text-gray-600"
                        }`}
                >
                    {ag.status}
                </span>

                <p className="text-xs text-gray-400 font-medium mt-1">Ações</p>

                <div className="flex items-center gap-2 mt-1">
                    {ag.status === "Agendado" && (
                        <>
                            <button
                                onClick={() => updateStatus(ag.id, "Confirmado")}
                                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                            >
                                Confirmar
                            </button>

                            <button
                                onClick={() => updateStatus(ag.id, "Cancelado")}
                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            >
                                Cancelar
                            </button>
                        </>
                    )}

                    {ag.status === "Confirmado" && (
                        <button
                            onClick={() => updateStatus(ag.id, "Concluido")}
                            className="px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-xs font-medium"
                        >
                            Concluir Corte
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
