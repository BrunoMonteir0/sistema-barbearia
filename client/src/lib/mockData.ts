export const mockServicos = [
  {
    id: '1',
    nome: 'Corte de Cabelo',
    descricao: 'Corte moderno com acabamento perfeito',
    preco: 45.00,
    duracao_minutos: 30,
    categoria_id: null,
    imagem: null,
    ativo: true,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    nome: 'Barba Completa',
    descricao: 'Modelagem e hidratacao da barba',
    preco: 35.00,
    duracao_minutos: 25,
    categoria_id: null,
    imagem: null,
    ativo: true,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    nome: 'Corte + Barba',
    descricao: 'Combo completo com desconto especial',
    preco: 70.00,
    duracao_minutos: 50,
    categoria_id: null,
    imagem: null,
    ativo: true,
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    nome: 'Tratamento Capilar',
    descricao: 'Hidratacao profunda e revitalizacao',
    preco: 80.00,
    duracao_minutos: 45,
    categoria_id: null,
    imagem: null,
    ativo: true,
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    nome: 'Pigmentacao de Barba',
    descricao: 'Cobertura de falhas e grisalhos',
    preco: 50.00,
    duracao_minutos: 40,
    categoria_id: null,
    imagem: null,
    ativo: true,
    created_at: new Date().toISOString()
  },
  {
    id: '6',
    nome: 'Sobrancelha',
    descricao: 'Design e alinhamento de sobrancelhas',
    preco: 20.00,
    duracao_minutos: 15,
    categoria_id: null,
    imagem: null,
    ativo: true,
    created_at: new Date().toISOString()
  }
]

export const mockProdutos = [
  {
    id: '1',
    nome: 'Pomada Modeladora',
    descricao: 'Pomada para cabelo com fixacao forte',
    preco: 45.00,
    estoque: 15,
    estoque_minimo: 5,
    categoria_id: null,
    imagem: null,
    codigo: 'POM001',
    ativo: true,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    nome: 'Oleo para Barba',
    descricao: 'Oleo hidratante para barba',
    preco: 55.00,
    estoque: 8,
    estoque_minimo: 3,
    categoria_id: null,
    imagem: null,
    codigo: 'OLE001',
    ativo: true,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    nome: 'Shampoo Especial',
    descricao: 'Shampoo para cabelos masculinos',
    preco: 35.00,
    estoque: 12,
    estoque_minimo: 5,
    categoria_id: null,
    imagem: null,
    codigo: 'SHA001',
    ativo: true,
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    nome: 'Balm para Barba',
    descricao: 'Balm hidratante e modelador',
    preco: 40.00,
    estoque: 10,
    estoque_minimo: 3,
    categoria_id: null,
    imagem: null,
    codigo: 'BAL001',
    ativo: true,
    created_at: new Date().toISOString()
  }
]

export const mockClientes = [
  {
    id: '1',
    nome: 'Joao Silva',
    telefone: '(11) 99999-1111',
    email: 'joao@email.com',
    data_nascimento: '1990-05-15',
    cartoes: 5,
    alertado: false,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    nome: 'Pedro Santos',
    telefone: '(11) 99999-2222',
    email: 'pedro@email.com',
    data_nascimento: '1985-08-20',
    cartoes: 8,
    alertado: true,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    nome: 'Carlos Oliveira',
    telefone: '(11) 99999-3333',
    email: 'carlos@email.com',
    data_nascimento: '1995-03-10',
    cartoes: 3,
    alertado: false,
    created_at: new Date().toISOString()
  }
]

export const mockFuncionarios = [
  {
    id: "1",
    usuario: {
      nome: "Funcionário Teste",
      foto: null
    },
    horarios: [
      "08:00", "09:00", "10:00", "11:00",
      "13:00", "14:00", "15:00", "16:00"
    ]
  }
]


export const mockAgendamentos = [
  {
    id: '1',
    cliente_id: '1',
    funcionario_id: '1',
    servico_id: '1',
    data: new Date().toISOString().split('T')[0],
    hora: '09:00',
    status: 'Agendado' as const,
    observacoes: null,
    created_at: new Date().toISOString(),
    cliente: { nome: 'Joao Silva', telefone: '(11) 99999-1111' },
    funcionario: { nome: 'Ricardo Barbeiro' },
    servico: { nome: 'Corte de Cabelo', preco: 45.00 }
  },
  {
    id: '2',
    cliente_id: '2',
    funcionario_id: '2',
    servico_id: '3',
    data: new Date().toISOString().split('T')[0],
    hora: '10:00',
    status: 'Confirmado' as const,
    observacoes: 'Cliente VIP',
    created_at: new Date().toISOString(),
    cliente: { nome: 'Pedro Santos', telefone: '(11) 99999-2222' },
    funcionario: { nome: 'Fernando Cortes' },
    servico: { nome: 'Corte + Barba', preco: 70.00 }
  },
  {
    id: '3',
    cliente_id: '3',
    funcionario_id: '1',
    servico_id: '2',
    data: new Date().toISOString().split('T')[0],
    hora: '14:00',
    status: 'Agendado' as const,
    observacoes: null,
    created_at: new Date().toISOString(),
    cliente: { nome: 'Carlos Oliveira', telefone: '(11) 99999-3333' },
    funcionario: { nome: 'Ricardo Barbeiro' },
    servico: { nome: 'Barba Completa', preco: 35.00 }
  }
]

export const mockUsuarios = [
  {
    id: '1',
    nome: 'Admin Sistema',
    email: 'admin@barbearia.com',
    cpf: '123.456.789-00',
    nivel: 'Administrador' as const,
    telefone: '(11) 99999-0000',
    endereco: 'Rua Principal, 100',
    foto: null,
    ativo: true,
    atendimento: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    nome: 'Ricardo Barbeiro',
    email: 'ricardo@barbearia.com',
    cpf: '987.654.321-00',
    nivel: 'Funcionario' as const,
    telefone: '(11) 99999-1234',
    endereco: 'Rua Secundaria, 200',
    foto: null,
    ativo: true,
    atendimento: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

export const mockConfig = {
  id: '1',
  nome: 'Barbearia',
  email: 'contato@barbearia.com',
  telefone_whatsapp: '(11) 99999-9999',
  telefone_fixo: '(11) 3333-3333',
  endereco: 'Rua da Barbearia, 123 - Centro',
  logo: null,
  instagram: '@barbearia',
  tipo_comissao: 'Porcentagem' as const,
  texto_rodape: 'Barbearia - Todos os direitos reservados',
  img_banner: null,
  quantidade_cartoes: 10,
  texto_fidelidade: 'Acumule 10 cortes e ganhe 1 gratis!'
}

export const mockHorariosDisponiveis = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
]

export const mockDashboardStats = {
  agendamentosHoje: 8,
  agendamentosSemana: 42,
  receitaMes: 4850.00,
  novosClientes: 12,
  clientesFidelidade: 5
}
