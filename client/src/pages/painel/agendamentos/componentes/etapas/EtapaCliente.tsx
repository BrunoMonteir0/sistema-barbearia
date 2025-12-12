interface Cliente {
    id: string
    nome: string
}

interface Props {
    clientes: Cliente[]
    value: string
    onSelect: (id: string) => void
}

export function EtapaCliente({ clientes, value, onSelect }: Props) {
    return (
        <div className="space-y-6">
            <h4 className="text-lg font-semibold">Selecione o cliente</h4>

            <select
                value={value}
                onChange={(e) => onSelect(e.target.value)}
                className="h-11 w-full px-4 rounded-xl border"
            >
                <option value="">Selecione um cliente</option>

                {[...clientes]
                    .sort((a, b) => a.nome.localeCompare(b.nome))
                    .map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.nome}
                        </option>
                    ))}
            </select>
        </div>
    )
}
