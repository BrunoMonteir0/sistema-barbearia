import { useAgenda } from "./useAgenda";
import AgendaFilters from "./AgendaFilters";
import AgendaList from "./AgendaList";

export default function AgendaPage() {
    const agenda = useAgenda();

    return (
        <div className="w-full">
            <div className="flex justify-between mb-6 items-center">
                <h2 className="text-2xl font-semibold text-secondary-500">Agendamentos</h2>
                <span className="text-gray-600 text-sm">
                    {agenda.totalAgendamentos} resultado(s)
                </span>
            </div>

            <AgendaFilters {...agenda} />
            <AgendaList {...agenda} />
        </div>
    );
}
