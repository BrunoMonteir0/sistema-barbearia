-- Schema do Supabase para o Sistema de Barbearia
-- Execute este SQL no painel do Supabase (SQL Editor)

-- Tabela de configuracoes do sistema
CREATE TABLE IF NOT EXISTS config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL DEFAULT 'Barbearia',
  email VARCHAR(255) NOT NULL,
  telefone_whatsapp VARCHAR(20),
  telefone_fixo VARCHAR(20),
  endereco TEXT,
  logo VARCHAR(255),
  instagram VARCHAR(100),
  tipo_comissao VARCHAR(20) DEFAULT 'Porcentagem',
  texto_rodape TEXT,
  img_banner VARCHAR(255),
  quantidade_cartoes INTEGER DEFAULT 10,
  texto_fidelidade TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de usuarios (integrada com Supabase Auth)
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  cpf VARCHAR(20),
  senha_hash VARCHAR(255),
  nivel VARCHAR(20) NOT NULL DEFAULT 'Cliente' CHECK (nivel IN ('Administrador', 'Funcionario', 'Cliente')),
  telefone VARCHAR(20),
  endereco TEXT,
  foto VARCHAR(255),
  ativo BOOLEAN DEFAULT TRUE,
  atendimento BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de cargos
CREATE TABLE IF NOT EXISTS cargos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de categorias de servicos
CREATE TABLE IF NOT EXISTS categorias_servicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de servicos
CREATE TABLE IF NOT EXISTS servicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2) NOT NULL,
  duracao_minutos INTEGER NOT NULL DEFAULT 30,
  categoria_id UUID REFERENCES categorias_servicos(id),
  imagem VARCHAR(255),
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de funcionarios
CREATE TABLE IF NOT EXISTS funcionarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  cargo_id UUID REFERENCES cargos(id),
  comissao DECIMAL(5,2) DEFAULT 0,
  horarios JSONB,
  dias_trabalho TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de clientes
CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  data_nascimento DATE,
  cartoes INTEGER DEFAULT 0,
  alertado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de agendamentos
CREATE TABLE IF NOT EXISTS agendamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  funcionario_id UUID REFERENCES funcionarios(id),
  servico_id UUID NOT NULL REFERENCES servicos(id),
  data DATE NOT NULL,
  hora TIME NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Agendado' CHECK (status IN ('Agendado', 'Confirmado', 'Concluido', 'Cancelado')),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de categorias de produtos
CREATE TABLE IF NOT EXISTS categorias_produtos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS produtos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2) NOT NULL,
  estoque INTEGER DEFAULT 0,
  estoque_minimo INTEGER DEFAULT 5,
  categoria_id UUID REFERENCES categorias_produtos(id),
  imagem VARCHAR(255),
  codigo VARCHAR(50),
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de vendas
CREATE TABLE IF NOT EXISTS vendas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES clientes(id),
  funcionario_id UUID REFERENCES funcionarios(id),
  total DECIMAL(10,2) NOT NULL,
  forma_pagamento VARCHAR(50),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de itens da venda
CREATE TABLE IF NOT EXISTS venda_itens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venda_id UUID NOT NULL REFERENCES vendas(id) ON DELETE CASCADE,
  produto_id UUID REFERENCES produtos(id),
  servico_id UUID REFERENCES servicos(id),
  quantidade INTEGER DEFAULT 1,
  preco_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL
);

-- Tabela de contas a pagar
CREATE TABLE IF NOT EXISTS contas_pagar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  descricao VARCHAR(255) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  pago BOOLEAN DEFAULT FALSE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de contas a receber
CREATE TABLE IF NOT EXISTS contas_receber (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  descricao VARCHAR(255) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  data_recebimento DATE,
  recebido BOOLEAN DEFAULT FALSE,
  cliente_id UUID REFERENCES clientes(id),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar politicas de seguranca (RLS)
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE config ENABLE ROW LEVEL SECURITY;

-- Politica para usuarios autenticados lerem config
CREATE POLICY "Usuarios podem ler config" ON config FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins podem editar config" ON config FOR ALL TO authenticated USING (true);

-- Politica para servicos (leitura publica)
CREATE POLICY "Servicos sao publicos" ON servicos FOR SELECT USING (true);
CREATE POLICY "Admins podem gerenciar servicos" ON servicos FOR ALL TO authenticated USING (true);

-- Politica para produtos (leitura publica)
CREATE POLICY "Produtos sao publicos" ON produtos FOR SELECT USING (true);
CREATE POLICY "Admins podem gerenciar produtos" ON produtos FOR ALL TO authenticated USING (true);

-- Politica para clientes
CREATE POLICY "Usuarios autenticados podem ver clientes" ON clientes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Usuarios podem criar clientes" ON clientes FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins podem gerenciar clientes" ON clientes FOR ALL TO authenticated USING (true);

-- Politica para agendamentos
CREATE POLICY "Agendamentos podem ser criados" ON agendamentos FOR INSERT WITH CHECK (true);
CREATE POLICY "Usuarios autenticados podem ver agendamentos" ON agendamentos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins podem gerenciar agendamentos" ON agendamentos FOR ALL TO authenticated USING (true);

-- Politica para usuarios
CREATE POLICY "Usuarios podem ver seus dados" ON usuarios FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Admins podem ver todos usuarios" ON usuarios FOR SELECT TO authenticated USING (true);
CREATE POLICY "Usuarios podem atualizar seus dados" ON usuarios FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Inserir dados iniciais
INSERT INTO config (nome, email, telefone_whatsapp, quantidade_cartoes)
VALUES ('Barbearia', 'contato@barbearia.com', '(11) 99999-9999', 10)
ON CONFLICT DO NOTHING;

INSERT INTO cargos (nome) VALUES ('Administrador'), ('Barbeiro'), ('Atendente')
ON CONFLICT DO NOTHING;

-- Inserir servicos de exemplo
INSERT INTO servicos (nome, descricao, preco, duracao_minutos, ativo) VALUES
('Corte de Cabelo', 'Corte moderno com acabamento perfeito', 45.00, 30, true),
('Barba Completa', 'Modelagem e hidratacao da barba', 35.00, 25, true),
('Corte + Barba', 'Combo completo com desconto especial', 70.00, 50, true),
('Tratamento Capilar', 'Hidratacao profunda e revitalizacao', 80.00, 45, true),
('Pigmentacao de Barba', 'Cobertura de falhas e grisalhos', 50.00, 40, true),
('Sobrancelha', 'Design e alinhamento de sobrancelhas', 20.00, 15, true)
ON CONFLICT DO NOTHING;

-- Inserir produtos de exemplo
INSERT INTO produtos (nome, descricao, preco, estoque, estoque_minimo, ativo) VALUES
('Pomada Modeladora', 'Pomada para cabelo com fixacao forte', 45.00, 15, 5, true),
('Oleo para Barba', 'Oleo hidratante para barba', 55.00, 8, 3, true),
('Shampoo Especial', 'Shampoo para cabelos masculinos', 35.00, 12, 5, true),
('Balm para Barba', 'Balm hidratante e modelador', 40.00, 10, 3, true)
ON CONFLICT DO NOTHING;
