interface Props {
    periodo: string
    setPeriodo: (v: string) => void
    statusFiltro: string
    setStatusFiltro: (v: string) => void
    funcFiltro: string
    setFuncFiltro: (v: string) => void
    ordenarPor: string
    setOrdenarPor: (v: string) => void
    funcionarios: { id: string; usuario: { nome: string } }[]

    dataInicio?: string
    setDataInicio?: (v: string) => void
    dataFim?: string
    setDataFim?: (v: string) => void
}

export function FiltrosAgendamentos({
    periodo,
    setPeriodo,
    statusFiltro,
    setStatusFiltro,
    funcFiltro,
    setFuncFiltro,
    ordenarPor,
    setOrdenarPor,
    funcionarios,
    dataInicio,
    setDataInicio,
    dataFim,
    setDataFim,
}: Props) {
    const statusOptions = [
        'Todos',
        'Agendado',
        'Confirmado',
        'Concluido',
        'Cancelado',
    ]

    const inputBase =
        'h-11 w-62 px-4 rounded-xl border border-gray-300 bg-white text-sm ' +
        'focus:ring-2 focus:ring-primary-500 hover:border-red-500 transition-colors'

    return (
        <div className="bg-red-100 border border-red-400 p-5 rounded-xl shadow-sm flex flex-wrap gap-5 mb-6">

            {/* 🔴 BLOCO PERÍODO + DATAS (MESMA LINHA) */}
            <div className="flex items-end gap-3">
                {/* PERÍODO */}
                <div className="flex flex-col">
                    <label className="admin-label mb-1">Período</label>
                    <select
                        value={periodo}
                        onChange={(e) => setPeriodo(e.target.value)}
                        className={inputBase}
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

                {/* DATAS — APARECEM À DIREITA DO PERÍODO */}
                {periodo === 'custom' && setDataInicio && setDataFim && (
                    <>
                        <div className="flex flex-col">
                            <label className="admin-label mb-1">Data início</label>
                            <input
                                type="date"
                                value={dataInicio || ''}
                                onChange={(e) => setDataInicio(e.target.value)}
                                className={inputBase}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="admin-label mb-1">Data fim</label>
                            <input
                                type="date"
                                value={dataFim || ''}
                                onChange={(e) => setDataFim(e.target.value)}
                                className={inputBase}
                            />
                        </div>
                    </>
                )}
            </div>

            {/* STATUS */}
            <div className="flex flex-col">
                <label className="admin-label mb-1">Status</label>
                <select
                    value={statusFiltro}
                    onChange={(e) => setStatusFiltro(e.target.value)}
                    className={inputBase}
                >
                    {statusOptions.map((s) => (
                        <option key={s}>{s}</option>
                    ))}
                </select>
            </div>

            {/* PROFISSIONAL */}
            <div className="flex flex-col">
                <label className="admin-label mb-1">Profissional</label>
                <select
                    value={funcFiltro}
                    onChange={(e) => setFuncFiltro(e.target.value)}
                    className={inputBase}
                >
                    <option value="Todos">Todos</option>
                    {funcionarios.map((f) => (
                        <option key={f.id} value={f.id}>
                            {f.usuario.nome}
                        </option>
                    ))}
                </select>
            </div>

            {/* ORDENAR */}
            <div className="flex flex-col">
                <label className="admin-label mb-1">Ordenar por</label>
                <select
                    value={ordenarPor}
                    onChange={(e) => setOrdenarPor(e.target.value)}
                    className={inputBase}
                >
                    <option value="data">Data</option>
                    <option value="profissional">Profissional</option>
                </select>
            </div>
        </div>
    )
}
