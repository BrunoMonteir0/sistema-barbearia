import { Clock } from "lucide-react"
import { Agendamento } from "../agendamentos.types"
import { getBadge } from "../agendamentos.utils"

interface Props {
    agendamentos: Agendamento[]
    updateStatus: (id: string, status: string) => void
}

export function ListaAgendamentos({ agendamentos, updateStatus }: Props) {
    return (
        <div className="space-y-4">
            {agendamentos.map((ag) => {
                const badge = getBadge(ag)
                const isPast = new Date(`${ag.data}T${ag.hora}`) < new Date()

                return (
                    <div
                        key={ag.id}
                        className={`bg-white p-4 rounded-lg shadow grid grid-cols-1 md:grid-cols-5 gap-4 ${isPast ? "opacity-50" : ""
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-red-100 text-red-500 p-3 rounded-full">
                                <Clock className="h-6 w-6" />
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold">{ag.hora}</h3>
                                <p className="text-gray-500 text-sm">
                                    {ag.data.split("-").reverse().join("/")}
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

                        <div>
                            <p className="font-semibold">Cliente</p>
                            <p>{ag.cliente.nome}</p>
                            <p className="text-sm text-gray-500">{ag.cliente.telefone}</p>
                        </div>

                        <div>
                            <p className="font-semibold">Serviço</p>
                            <p>{ag.servico.nome}</p>
                            <p className="text-primary-500 font-bold text-sm">
                                R$ {ag.servico.preco.toFixed(2).replace(".", ",")}
                            </p>
                        </div>

                        <div>
                            <p className="font-semibold">Profissional</p>
                            <p>{ag.funcionario?.usuario.nome || "—"}</p>
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                            {ag.status === "Agendado" && (
                                <>
                                    <button
                                        onClick={() => updateStatus(ag.id, "Confirmado")}
                                        className="px-4 py-2.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors text-lg font-medium"
                                    >
                                        Confirmar
                                    </button>


                                    <button
                                        onClick={() => updateStatus(ag.id, "Cancelado")}
                                        className="px-4 py-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-lg font-medium"
                                    >
                                        Cancelar
                                    </button>
                                </>
                            )}

                            {ag.status === "Confirmado" && (
                                <button
                                    onClick={() => updateStatus(ag.id, "Concluido")}
                                    className="px-4 py-2.5  bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-xs font-medium"
                                >
                                    Concluir Corte
                                </button>
                            )}
                        </div>

                    </div>
                )
            })}
        </div>
    )
}
