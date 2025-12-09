import { useState, useEffect } from 'react'
import {
  Plus, Search, Edit, Trash2, Phone, Mail, User, Scissors
} from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { mockClientes } from '@/lib/mockData'

interface Cliente {
  id: string
  nome: string
  telefone: string
  email: string | null
  data_nascimento: string | null
  created_at: string
  nivel?: string
  total_cortes?: number
}

interface Historico {
  id: string
  data: string
  hora: string
  servico: { nome: string; preco: number }
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showHistorico, setShowHistorico] = useState(false)
  const [historicoCliente, setHistoricoCliente] = useState<Cliente | null>(null)
  const [historico, setHistorico] = useState<Historico[]>([])
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)

  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    data_nascimento: ''
  })

  /* ============================
     BUSCAR CLIENTES
  ============================ */
  useEffect(() => {
    fetchClientes()
  }, [])

  async function fetchClientes() {
    if (!isSupabaseConfigured) {
      setClientes(mockClientes as Cliente[])
      setLoading(false)
      return
    }

    // Buscar somente usuários que NÃO são admin e nem funcionários
    const { data: clientes, error } = await supabase
      .from('usuarios')
      .select('*')
      .neq('nivel', 'Administrador')
      .neq('nivel', 'Funcionario')
      .order('nome')

    if (error) {
      console.log(error)
      return
    }

    // Buscar total de cortes concluídos
    const ids = clientes.map(c => c.id)

    const { data: ags } = await supabase
      .from('agendamentos')
      .select('id, cliente_id, status')
      .eq('status', 'Concluido')
      .in('cliente_id', ids)

    const contagem = new Map()
    ags?.forEach(a => {
      contagem.set(a.cliente_id, (contagem.get(a.cliente_id) || 0) + 1)
    })

    // Aplicar total por cliente
    const final = clientes.map(c => ({
      ...c,
      total_cortes: contagem.get(c.id) || 0
    }))

    setClientes(final)
    setLoading(false)
  }

  /* ============================
     HISTÓRICO DO CLIENTE
  ============================ */
  async function abrirHistorico(cliente: Cliente) {
    setHistoricoCliente(cliente)
    setShowHistorico(true)

    const { data } = await supabase
      .from('agendamentos')
      .select(`
      id,
      data,
      hora,
      servico:servicos(nome, preco)
    `)
      .eq('cliente_id', cliente.id)
      .eq('status', 'Concluido')
      .order('data', { ascending: false })

    // CORREÇÃO AQUI
    const ajustado = (data || []).map((h: any) => ({
      id: h.id,
      data: h.data,
      hora: h.hora,
      servico: Array.isArray(h.servico) ? h.servico[0] : h.servico
    }));

    setHistorico(ajustado as unknown as Historico[]);


  }


  /* ============================
     FILTRAGEM
  ============================ */
  const filteredClientes = clientes.filter(
    (c) =>
      c.nome.toLowerCase().includes(search.toLowerCase()) ||
      c.telefone.includes(search)
  )

  /* ============================
     ABRIR MODAL
  ============================ */
  function openModal(cliente?: Cliente) {
    if (cliente) {
      setEditingCliente(cliente)
      setFormData({
        nome: cliente.nome,
        telefone: cliente.telefone,
        email: cliente.email || '',
        data_nascimento: cliente.data_nascimento || ''
      })
    } else {
      setEditingCliente(null)
      setFormData({ nome: '', telefone: '', email: '', data_nascimento: '' })
    }
    setShowModal(true)
  }

  /* ============================
     SALVAR CLIENTE
  ============================ */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      if (editingCliente) {
        await supabase
          .from('usuarios')
          .update({
            nome: formData.nome,
            telefone: formData.telefone,
            email: formData.email || null,
            data_nascimento: formData.data_nascimento || null
          })
          .eq('id', editingCliente.id)

        toast.success('Cliente atualizado!')
      } else {
        await supabase
          .from('usuarios')
          .insert({
            nome: formData.nome,
            telefone: formData.telefone,
            email: formData.email || null,
            data_nascimento: formData.data_nascimento || null,
            nivel: 'Cliente'
          })

        toast.success('Cliente cadastrado!')
      }

      setShowModal(false)
      fetchClientes()
    } catch {
      toast.error('Erro ao salvar cliente')
    }
  }

  /* ============================
     EXCLUIR CLIENTE
  ============================ */
  async function handleDelete(id: string) {
    if (!confirm('Deseja remover este cliente?')) return

    await supabase.from('usuarios').delete().eq('id', id)
    toast.success('Cliente removido!')
    fetchClientes()
  }

  /* ============================
     RENDER
  ============================ */
  return (
    <div className="space-y-6">
      {/* Topo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Novo Cliente
        </button>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left">Cliente</th>
                  <th className="px-6 py-4 text-left">Telefone</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-1 py-4 text-center">Serviços Realizados</th>
                  <th className="px-6 py-4 text-center">Ações</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredClientes.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 cursor-pointer" onClick={() => abrirHistorico(c)}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary-500" />
                        </div>
                        <span className="font-medium">{c.nome}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        {c.telefone}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {c.email || <span className="text-gray-400">-</span>}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 justify-center">
                        <Scissors className="h-4 w-4" /> {c.total_cortes}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openModal(c)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      )}

      {/* ============================
           MODAL HISTÓRICO
      ============================ */}
      {showHistorico && historicoCliente && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl w-full max-w-lg p-6">
            <h3 className="text-xl font-semibold text-secondary-500 mb-4">
              Histórico – {historicoCliente.nome}
            </h3>

            {historico.length === 0 ? (
              <p className="text-gray-500 text-center py-6">Nenhum serviço concluído.</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {historico.map((h) => (
                  <div key={h.id} className="border rounded-lg p-4">
                    <p className="font-medium text-secondary-500">{h.servico.nome}</p>
                    <p className="text-gray-600 text-sm">
                      {new Date(h.data).toLocaleDateString('pt-BR')}
                      {' • '}
                      {h.hora.slice(0, 5)}
                    </p>
                    <p className="text-primary-600 mt-1 font-semibold">
                      R$ {h.servico.preco.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowHistorico(false)}
              className="btn-secondary w-full mt-6"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* ============================
           MODAL CLIENTE
      ============================ */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-secondary-500 mb-6">
              {editingCliente ? 'Editar Cliente' : 'Novo Cliente'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Nome</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="label">Telefone</label>
                <input
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="label">Email (opcional)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Data de Nascimento (opcional)</label>
                <input
                  type="date"
                  value={formData.data_nascimento}
                  onChange={(e) =>
                    setFormData({ ...formData, data_nascimento: e.target.value })
                  }
                  className="input-field"
                />
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>

                <button type="submit" className="btn-primary flex-1">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
