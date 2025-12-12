interface Funcionario {
  id: string
  usuario: { nome: string }
}

interface Props {
  funcionarios: Funcionario[]
  value: string
  onSelect: (id: string) => void
}

export function EtapaFuncionario({
  funcionarios,
  value,
  onSelect,
}: Props) {
  return (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold">Selecione o profissional</h4>

      <select
        value={value}
        onChange={(e) => onSelect(e.target.value)}
        className="h-11 w-full px-4 rounded-xl border"
      >
        <option value="">Selecione um profissional</option>

        {[...funcionarios]
          .sort((a, b) =>
            a.usuario.nome.localeCompare(b.usuario.nome)
          )
          .map((f) => (
            <option key={f.id} value={f.id}>
              {f.usuario.nome}
            </option>
          ))}
      </select>
    </div>
  )
}
