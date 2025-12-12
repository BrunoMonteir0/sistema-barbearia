interface Props {
  step: number
  onBack: () => void
  onConfirm: () => void
}

export function FooterAcoes({ step, onBack, onConfirm }: Props) {
  return (
    <div className="flex justify-between mt-8">
      {step > 1 ? (
        <button onClick={onBack} className="text-sm text-gray-500">
          Voltar
        </button>
      ) : <span />}

      {step === 4 && (
        <button
          onClick={onConfirm}
          className="h-11 px-6 rounded-xl bg-red-600 text-white"
        >
          Confirmar agendamento
        </button>
      )}
    </div>
  )
}
