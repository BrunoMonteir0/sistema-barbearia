import { CalendarClock, Clock, Loader2, Pencil } from 'lucide-react'
import { Funcionario } from './funcionarios.types'

interface Props {
    funcionarios: Funcionario[]
    abrirModalHorarios: (func: Funcionario) => void
    abrirModalEdicao: (func: Funcionario) => void
    loading: boolean
}

export function FuncionariosTable({
    funcionarios,
    abrirModalHorarios,
    abrirModalEdicao,
    loading,
}: Props) {
    return (
        <div className="card">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CalendarClock className="h-5 w-5" />
                    Funcionários cadastrados
                </h3>
            </div>

            {loading ? (
                <div className="flex justify-center py-10">
                    <Loader2 className="h-6 w-6 animate-spin" />
                </div>
            ) : funcionarios.length === 0 ? (
                <p className="text-gray-500 text-sm">
                    Nenhum funcionário encontrado.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-500 border-b">
                                <th className="py-2 pr-4">Foto</th>
                                <th className="py-2 pr-4">Nome</th>
                                <th className="py-2 pr-4">Email</th>
                                <th className="py-2 pr-4">Resumo de horários</th>
                                <th className="py-2 pr-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {funcionarios.map((f) => {
                                const totalSlots =
                                    f.horarios.segunda.length +
                                    f.horarios.terca.length +
                                    f.horarios.quarta.length +
                                    f.horarios.quinta.length +
                                    f.horarios.sexta.length +
                                    f.horarios.sabado.length +
                                    f.horarios.domingo.length

                                return (
                                    <tr key={f.id} className="border-b last:border-0">
                                        {/* FOTO */}
                                        <td className="py-2 pr-4">
                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                                {f.usuario?.foto ? (
                                                    <img
                                                        src={f.usuario.foto}
                                                        alt={f.usuario.nome}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-xs text-gray-500">
                                                        Sem foto
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* NOME */}
                                        <td className="py-2 pr-4 font-medium">
                                            {f.usuario.nome}
                                        </td>

                                        {/* EMAIL */}
                                        <td className="py-2 pr-4 text-gray-600">
                                            {f.usuario.email}
                                        </td>

                                        {/* RESUMO */}
                                        <td className="py-2 pr-4 text-gray-600">
                                            {totalSlots === 0 ? (
                                                <span className="text-xs text-red-500">
                                                    Nenhum horário configurado
                                                </span>
                                            ) : (
                                                <span className="text-xs">
                                                    {totalSlots} horários em{' '}
                                                    {
                                                        Object.entries(f.horarios).filter(
                                                            ([, lista]) => lista.length > 0,
                                                        ).length
                                                    }{' '}
                                                    dia(s)
                                                </span>
                                            )}
                                        </td>

                                        {/* AÇÕES */}
                                        <td className="py-2 pr-4 text-right flex items-center justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => abrirModalHorarios(f)}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary-500 hover:bg-primary-600 text-white"
                                            >
                                                <Clock className="h-4 w-4" />
                                                Horários
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => abrirModalEdicao(f)}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-secondary-500 hover:bg-secondary-600 text-white"
                                            >
                                                <Pencil className="h-4 w-4" />
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
