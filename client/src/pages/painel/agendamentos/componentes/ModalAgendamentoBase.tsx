import { X } from "lucide-react"

interface Props {
    step: number
    totalSteps: number
    title: string
    onClose: () => void
    children: React.ReactNode
}

export function ModalAgendamentoBase({
    step,
    totalSteps,
    title,
    onClose,
    children,
}: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div
                className="
          bg-white rounded-2xl shadow-2xl
          w-full max-w-4xl
          h-[70vh]
          flex flex-col
        "
            >
                {/* HEADER */}
                <div className="flex items-center justify-between px-8 py-5 border-b">
                    <h3 className="text-2xl font-semibold text-secondary-500">
                        {title}
                    </h3>

                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* STEPPER */}
                <div className="flex justify-center py-6">
                    <div className="flex items-center gap-4">
                        {Array.from({ length: totalSteps }).map((_, i) => {
                            const s = i + 1
                            return (
                                <div key={s} className="flex items-center">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold
                      ${step >= s
                                                ? "bg-primary-500 text-white"
                                                : "bg-gray-200 text-gray-500"
                                            }`}
                                    >
                                        {s}
                                    </div>

                                    {s < totalSteps && (
                                        <div
                                            className={`w-16 h-1 ${step > s ? "bg-primary-500" : "bg-gray-200"
                                                }`}
                                        />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* CONTEÚDO (scrollável) */}
                <div className="flex-1 overflow-y-auto px-8 pb-8">
                    {children}
                </div>
            </div>
        </div>
    )
}
