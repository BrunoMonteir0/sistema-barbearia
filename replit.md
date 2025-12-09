# Sistema de Barbearia - TypeScript/React

## Visao Geral
Sistema completo de gestao para barbearia, refatorado de PHP para TypeScript. Utiliza React + Vite no frontend e Node.js/Express no backend, com Supabase para banco de dados e autenticacao.

## Estrutura do Projeto
```
/
├── client/                 # Frontend React (Vite)
│   ├── src/
│   │   ├── components/     # Componentes reutilizaveis
│   │   ├── contexts/       # React Contexts (Auth)
│   │   ├── lib/           # Bibliotecas (Supabase client)
│   │   ├── pages/         # Paginas da aplicacao
│   │   │   └── painel/    # Paginas do painel administrativo
│   │   └── App.tsx        # Componente principal com rotas
│   └── package.json
├── server/                 # Backend Express (planejado)
│   └── src/
│       └── index.ts
├── supabase-schema.sql    # Schema do banco de dados
└── replit.md
```

## Funcionalidades

### Site Publico
- **Home**: Apresentacao da barbearia com banner hero
- **Servicos**: Lista de servicos oferecidos com precos e duracao
- **Agendamento**: Wizard de 4 etapas para marcar horario
- **Login**: Autenticacao com email/senha via Supabase

### Painel Administrativo
- **Dashboard**: Visao geral com metricas e graficos
- **Clientes**: Gestao completa de clientes com programa fidelidade
- **Agendamentos**: Calendario e lista de agendamentos
- **Servicos**: CRUD de servicos da barbearia
- **Produtos**: Gestao de estoque e vendas de produtos
- **Financeiro**: Vendas, contas a pagar e receber
- **Usuarios**: Gestao de funcionarios e niveis de acesso
- **Configuracoes**: Personalizacao do sistema

## Tecnologias
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, React Router
- **Backend**: Node.js, Express, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth

## Configuracao do Supabase

Para conectar com banco de dados real:

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o SQL em `supabase-schema.sql` no SQL Editor do Supabase
3. Configure as variaveis de ambiente:
   - `VITE_SUPABASE_URL`: URL do seu projeto Supabase
   - `VITE_SUPABASE_ANON_KEY`: Chave anonima do projeto

## Comandos

```bash
# Rodar frontend em desenvolvimento
cd client && npm run dev

# Build para producao
cd client && npm run build
```

## Niveis de Acesso
- **Administrador**: Acesso total ao sistema
- **Funcionario**: Acesso ao painel com restricoes
- **Cliente**: Apenas agendamento e visualizacao

## Historico de Alteracoes
- 27/11/2024: Refatoracao completa de PHP para TypeScript/React
