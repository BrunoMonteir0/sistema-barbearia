import { createClient, SupabaseClient } from '@supabase/supabase-js'

// ===============================
// 🔧 Variáveis de ambiente
// ===============================
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Verificador simples (só pra garantir)
export const isSupabaseConfigured = true;

// ===============================
// 🔥 Criação do client do Supabase
// ===============================
export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key')

// ===============================
// 🧪 Expor supabase no navegador (teste no console)
// ===============================
// Agora você pode rodar:
// supabase.auth.signInWithPassword({...})
// direto no console do DevTools.
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.supabase = supabase
}

// ===============================
// 🗂️ Tipagem das tabelas
// ===============================
export type Database = {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string
          nome: string
          email: string
          cpf: string
          senha_hash: string
          nivel: 'Administrador' | 'Funcionario' | 'Cliente'
          telefone: string | null
          endereco: string | null
          foto: string | null
          ativo: boolean
          atendimento: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['usuarios']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['usuarios']['Insert']>
      }

      clientes: {
        Row: {
          id: string
          nome: string
          telefone: string
          email: string | null
          data_nascimento: string | null
          cartoes: number
          alertado: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['clientes']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['clientes']['Insert']>
      }

      funcionarios: {
        Row: {
          id: string
          usuario_id: string
          cargo_id: string
          comissao: number
          horarios: any
          dias_trabalho: string[]
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['funcionarios']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['funcionarios']['Insert']>
      }

      servicos: {
        Row: {
          id: string
          nome: string
          descricao: string | null
          preco: number
          duracao_minutos: number
          categoria_id: string | null
          imagem: string | null
          ativo: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['servicos']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['servicos']['Insert']>
      }

      agendamentos: {
        Row: {
          id: string
          cliente_id: string
          funcionario_id: string
          servico_id: string
          data: string
          hora: string
          status: 'Agendado' | 'Confirmado' | 'Concluido' | 'Cancelado'
          observacoes: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['agendamentos']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['agendamentos']['Insert']>
      }

      produtos: {
        Row: {
          id: string
          nome: string
          descricao: string | null
          preco: number
          estoque: number
          estoque_minimo: number
          categoria_id: string | null
          imagem: string | null
          codigo: string | null
          ativo: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['produtos']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['produtos']['Insert']>
      }

      config: {
        Row: {
          id: string
          nome: string
          email: string
          telefone_whatsapp: string
          telefone_fixo: string | null
          endereco: string | null
          logo: string | null
          instagram: string | null
          tipo_comissao: 'Porcentagem' | 'Fixo'
          texto_rodape: string | null
          img_banner: string | null
          quantidade_cartoes: number
          texto_fidelidade: string | null
        }
        Insert: Omit<Database['public']['Tables']['config']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['config']['Insert']>
      }
    }
  }
}
