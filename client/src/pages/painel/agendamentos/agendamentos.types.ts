export interface Agendamento {
  id: string
  data: string
  hora: string
  status: string
  cliente: { nome: string; telefone: string }
  servico: { nome: string; preco: number }
  funcionario: { usuario: { nome: string } } | null
}

export interface Funcionario {
  id: string
  usuario: { nome: string }
}
