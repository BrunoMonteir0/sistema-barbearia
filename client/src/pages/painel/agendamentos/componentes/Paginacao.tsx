interface Props {
    pagina: number
    setPagina: (pagina: number) => void
    total: number
    porPagina: number
}

export function Paginacao({
    pagina,
    setPagina,
    total,
    porPagina,
}: Props) {
    const totalPaginas = Math.ceil(total / porPagina)

    if (totalPaginas <= 1) return null

    return (
        <div className="flex justify-between items-center mt-6">
            <button
                disabled={pagina === 1}
                onClick={() => setPagina(pagina - 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
                Anterior
            </button>

            <span className="text-gray-600">
                Página {pagina} de {totalPaginas}
            </span>

            <button
                disabled={pagina >= totalPaginas}
                onClick={() => setPagina(pagina + 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
                Próxima
            </button>
        </div>
    )
}
