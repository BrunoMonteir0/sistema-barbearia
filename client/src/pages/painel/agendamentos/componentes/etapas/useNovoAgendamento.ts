import { useState } from "react";
import { NovoAgendamentoState } from "./types";

export function useNovoAgendamento() {
  const [state, setState] = useState<NovoAgendamentoState>({
    step: 1,
    clienteId: "",
    funcionarioId: "",
    data: "",
    hora: "",
  });

  function next() {
    setState((s) => ({ ...s, step: Math.min(s.step + 1, 4) as any }));
  }

  function back() {
    setState((s) => ({ ...s, step: Math.max(s.step - 1, 1) as any }));
  }

  function set<K extends keyof NovoAgendamentoState>(
    key: K,
    value: NovoAgendamentoState[K]
  ) {
    setState((s) => ({ ...s, [key]: value }));
  }

  return {
    state,
    set,
    next,
    back,
  };
}
