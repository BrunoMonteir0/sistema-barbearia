import { Funcionario } from "./useAgenda";

interface Props {
    periodo: string;
    statusFiltro: string;
    funcFiltro: string;
    ordenarPor: string;
    dataInicio: string;
    dataFim: string;
    funcionarios: Funcionario[];

    setPeriodo: (v: string) => void;
    setStatusFiltro: (v: string) => void;
    setFuncFiltro: (v: string) => void;
    setOrdenarPor: (v: string) => void;
    setDataInicio: (v: string) => void;
    setDataFim: (v: string) => void;
    setPagina: (v: number) => void;
}

export default function AgendaFilters(props: Props) {
    const statusOptions = ["Todos", "Agendado", "Confirmado", "Concluido", "Cancelado"];

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm flex flex-wrap gap-4 mb-6">

            {/* Período */}
            <div className="flex flex-col">
                <label className="admin-label">Período</label>
                <select
                    value={props.periodo}
                    onChange={(e) => {
                        props.setPeriodo(e.target.value);
                        props.setPagina(1);
                    }}
                    className="admin-select w-48"
                >
                    <option value="todos">Próximos</option>
                    <option value="hoje">Hoje</option>
                    <option value="7dias">Próximos 7 dias</option>
                    <option value="30dias">Próximos 30 dias</option>
                    <option value="semanal">Resto da semana</option>
                    <option value="mensal">Resto do mês</option>
                    <option value="anual">Resto do ano</option>
                    <option value="custom">Intervalo personalizado</option>
                </select>
            </div>

            {props.periodo === "custom" && (
                <>
                    <div className="flex flex-col">
                        <label className="admin-label">Início</label>
                        <input
                            type="date"
                            className="admin-input"
                            value={props.dataInicio}
                            onChange={(e) => props.setDataInicio(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="admin-label">Fim</label>
                        <input
                            type="date"
                            className="admin-input"
                            value={props.dataFim}
                            onChange={(e) => props.setDataFim(e.target.value)}
                        />
                    </div>
                </>
            )}

            {/* Status */}
            <div className="flex flex-col">
                <label className="admin-label">Status</label>
                <select
                    value={props.statusFiltro}
                    onChange={(e) => props.setStatusFiltro(e.target.value)}
                    className="admin-select w-48"
                >
                    {statusOptions.map((s) => (
                        <option key={s}>{s}</option>
                    ))}
                </select>
            </div>

            {/* Funcionário */}
            <div className="flex flex-col">
                <label className="admin-label">Profissional</label>
                <select
                    value={props.funcFiltro}
                    onChange={(e) => props.setFuncFiltro(e.target.value)}
                    className="admin-select w-48"
                >
                    <option value="Todos">Todos</option>
                    {props.funcionarios.map((f) => (
                        <option key={f.id} value={f.id}>
                            {f.usuario.nome}
                        </option>
                    ))}
                </select>
            </div>

            {/* Ordenação */}
            <div className="flex flex-col">
                <label className="admin-label">Ordenar por</label>
                <select
                    value={props.ordenarPor}
                    onChange={(e) => props.setOrdenarPor(e.target.value)}
                    className="admin-select w-48"
                >
                    <option value="data">Data</option>
                    <option value="profissional">Profissional</option>
                </select>
            </div>
        </div>
    );
}
