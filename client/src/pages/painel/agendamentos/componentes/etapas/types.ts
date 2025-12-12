export interface Cliente {
  id: string;
  nome: string;
}

export interface Funcionario {
  id: string;
  usuario: { nome: string };
}

export interface NovoAgendamentoState {
  step: 1 | 2 | 3 | 4;
  clienteId: string;
  funcionarioId: string;
  data: string;
  hora: string;
}
