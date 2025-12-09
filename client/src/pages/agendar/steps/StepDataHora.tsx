import { useHorarios } from "../hooks/useHorarios";

export default function StepDataHora({
    funcionario,
    data,
    setData,
    horario,
    setHorario,
    nextStep,
    prevStep,
}: any) {
    const { horarios, horariosOcupados, loading } = useHorarios(
        funcionario,
        data
    );

    const hojeStr = new Date().toISOString().split("T")[0];
    const agora = new Date();
    const horaAtual = `${String(agora.getHours()).padStart(2, "0")}:${String(
        agora.getMinutes()
    ).padStart(2, "0")}`;

    function isPast(slot: string) {
        if (data !== hojeStr) return false;
        return slot < horaAtual;
    }

    function isOcupado(slot: string) {
        return horariosOcupados.includes(slot);
    }

    return (
        <div className="card">
            <h3 className="text-xl font-semibold mb-6">Escolha o horário</h3>

            {/* DATA */}
            <div className="mb-6">
                <label className="label">Data</label>
                <input
                    type="date"
                    value={data}
                    min={hojeStr}
                    onChange={(e) => setData(e.target.value)}
                    className="input-field"
                    required
                />
            </div>

            {loading && <p>Carregando horários...</p>}

            {!loading && (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {horarios.map((slot) => {
                        const disabled = isPast(slot) || isOcupado(slot);

                        return (
                            <button
                                key={slot}
                                type="button"
                                disabled={disabled}
                                onClick={() => !disabled && setHorario(slot)}
                                className={`
                  text-sm py-2 px-3 rounded-lg border text-center transition
                  ${disabled
                                        ? "bg-gray-200 text-gray-400 border-gray-200 opacity-50 cursor-not-allowed"
                                        : horario === slot
                                            ? "bg-primary-500 text-white border-primary-500"
                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                    }
                `}
                            >
                                {slot}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* AÇÕES */}
            <div className="flex justify-between mt-8">
                <button type="button" onClick={prevStep} className="btn-secondary">
                    Voltar
                </button>

                {/* ✅ AGORA SUBMETE O FORMULÁRIO REALMENTE */}
                <button
                    type="submit"
                    disabled={!horario}
                    className="btn-primary"
                >
                    Agendar
                </button>
            </div>
        </div>
    );
}
