interface Props {
  funcionarioId: string
  value: string
  onSelect: (data: string) => void
}

export function EtapaData({ value, onSelect }: Props) {
  return (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold">Selecione a data</h4>

      <input
        type="date"
        value={value}
        onChange={(e) => onSelect(e.target.value)}
        className="h-11 w-full px-4 rounded-xl border"
      />
    </div>
  )
}
