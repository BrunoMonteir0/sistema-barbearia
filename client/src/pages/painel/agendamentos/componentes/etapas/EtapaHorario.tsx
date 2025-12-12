interface Props {
  funcionarioId: string
  data: string
  value: string
  onSelect: (hora: string) => void
}

export function EtapaHorario({ value, onSelect }: Props) {
  const horarios = ["09:00", "10:00", "11:00", "14:00", "15:00"]

  return (
    <div className="grid grid-cols-3 gap-3">
      {horarios.map((h) => (
        <button
          key={h}
          type="button"
          onClick={() => onSelect(h)}
          className={`h-10 rounded-xl border ${
            value === h
              ? "bg-red-600 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          {h}
        </button>
      ))}
    </div>
  )
}
