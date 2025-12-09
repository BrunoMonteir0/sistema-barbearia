import AgendaCard from "./AgendaCard";
import { Agendamento } from "./useAgenda";

interface Props {
    agendamentos: Agendamento[];
    pagina: number;
    updateStatus: (id: string, status: string) => void;
    getBadge: (ag: Agendamento) => any;
    setPagina: (v: number) => void;
}

export default function AgendaList({
    agendamentos,
    pagina,
    updateStatus,
    getBadge,
    setPagina,
}: Props) {
    return (
        <>
            <div className="space-y-4">
                {agendamentos.map((ag) => (
                    <AgendaCard
                        key={ag.id}
                        ag={ag}              // ← AGORA ESTÁ CORRETO
                        badge={getBadge(ag)}
                        updateStatus={updateStatus}
                    />
                ))}
            </div>

            <div className="flex justify-between items-center mt-6">
                <button
                    disabled={pagina === 1}
                    onClick={() => setPagina(pagina - 1)}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                    Anterior
                </button>

                <span className="text-gray-600">Página {pagina}</span>

                <button
                    onClick={() => setPagina(pagina + 1)}
                    className="px-3 py-1 bg-gray-200 rounded"
                >
                    Próxima
                </button>
            </div>
        </>
    );
}
