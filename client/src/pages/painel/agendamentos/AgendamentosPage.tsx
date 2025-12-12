import { useEffect, useState } from "react"
import { Plus } from "lucide-react"

import { Agendamento } from "./agendamentos.types"
import {
    fetchAgendamentos,
    fetchFuncionarios,
    fetchClientes,
    updateStatusAgendamento,
} from "./agendamentos.service"

import { FiltrosAgendamentos } from "./componentes/FiltrosAgendamentos"
import { ListaAgendamentos } from "./componentes/ListaAgendamentos"
import { Paginacao } from "./componentes/Paginacao"
import { ModalNovoAgendamento } from "./componentes/ModalNovoAgendamento"

export default function AgendamentosPage() {
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
    const [funcionarios, setFuncionarios] = useState<any[]>([])
    const [clientes, setClientes] = useState<any[]>([])
    const [modalAberto, setModalAberto] = useState(false)

    // filtros
    const [periodo, setPeriodo] = useState("todos")
    const [statusFiltro, setStatusFiltro] = useState("Todos")
    const [funcFiltro, setFuncFiltro] = useState("Todos")
    const [ordenarPor, setOrdenarPor] = useState("data")
    const [dataInicio, setDataInicio] = useState<string>()
    const [dataFim, setDataFim] = useState<string>()

    // paginação
    const [pagina, setPagina] = useState(1)
    const [total, setTotal] = useState(0)

    /* =========================
       Funcionários + Clientes
    ========================= */
    useEffect(() => {
        fetchFuncionarios().then(setFuncionarios)
        fetchClientes().then(setClientes)
    }, [])

    /* =========================
       Agendamentos
    ========================= */
    useEffect(() => {
        carregarAgendamentos()
    }, [periodo, statusFiltro, funcFiltro, ordenarPor, pagina, dataInicio, dataFim])

    async function carregarAgendamentos() {
        const { dados, total } = await fetchAgendamentos({
            periodo,
            statusFiltro,
            funcFiltro,
            ordenarPor,
            pagina,
            dataInicio,
            dataFim,
        })

        setAgendamentos(dados)
        setTotal(total)
    }

    async function updateStatus(id: string, status: string) {
        await updateStatusAgendamento(id, status)
        carregarAgendamentos()
    }

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-semibold text-secondary-500">
                        Agendamentos
                    </h2>
                    <span className="text-sm text-gray-500">
                        {total} resultado(s)
                    </span>
                </div>

                <button
                    onClick={() => setModalAberto(true)}
                    className="
            flex items-center gap-2
            h-11 px-5
            bg-red-600 hover:bg-red-700
            text-white text-sm font-medium
            rounded-xl
          "
                >
                    <Plus size={18} />
                    Novo agendamento
                </button>
            </div>

            <FiltrosAgendamentos
                periodo={periodo}
                setPeriodo={setPeriodo}
                statusFiltro={statusFiltro}
                setStatusFiltro={setStatusFiltro}
                funcFiltro={funcFiltro}
                setFuncFiltro={setFuncFiltro}
                ordenarPor={ordenarPor}
                setOrdenarPor={setOrdenarPor}
                funcionarios={funcionarios}
                dataInicio={dataInicio}
                setDataInicio={setDataInicio}
                dataFim={dataFim}
                setDataFim={setDataFim}
            />

            <ListaAgendamentos
                agendamentos={agendamentos}
                updateStatus={updateStatus}
            />

            <Paginacao
                pagina={pagina}
                setPagina={setPagina}
                total={total}
                porPagina={10}
            />

            {/* MODAL */}
            <ModalNovoAgendamento
                aberto={modalAberto}
                onClose={() => setModalAberto(false)}
                onSuccess={carregarAgendamentos}
                clientes={clientes}
                funcionarios={funcionarios}
            />


        </div>
    )
}
