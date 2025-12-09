import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Scissors, Clock, DollarSign } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

interface Servico {
  id: string
  nome: string
  descricao: string | null
  preco: number
  duracao_minutos: number
  ativo: boolean
  imagem?: string | null
}

export default function ServicosAdminPage() {
  const [servicos, setServicos] = useState<Servico[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingServico, setEditingServico] = useState<Servico | null>(null)
  const [imagemFile, setImagemFile] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    duracao_minutos: '30',
    ativo: true
  })

  /* ======================================================
     BUSCAR SERVIÇOS
  ====================================================== */
  useEffect(() => {
    fetchServicos()
  }, [])

  async function fetchServicos() {
    const { data, error } = await supabase
      .from('servicos')
      .select('*')
      .order('nome')

    if (!error && data) setServicos(data)
    setLoading(false)
  }

  const filteredServicos = servicos.filter((s) =>
    s.nome.toLowerCase().includes(search.toLowerCase())
  )

  /* ======================================================
     ABRIR MODAL
  ====================================================== */
  function openModal(servico?: Servico) {
    if (servico) {
      setEditingServico(servico)
      setFormData({
        nome: servico.nome,
        descricao: servico.descricao || '',
        preco: servico.preco.toString(),
        duracao_minutos: servico.duracao_minutos.toString(),
        ativo: servico.ativo
      })
    } else {
      setEditingServico(null)
      setFormData({
        nome: '',
        descricao: '',
        preco: '',
        duracao_minutos: '30',
        ativo: true
      })
    }

    setImagemFile(null)
    setShowModal(true)
  }

  /* ======================================================
     UPLOAD IMAGEM
  ====================================================== */
  async function uploadImagem(id: string, file: File) {
    const ext = file.name.split('.').pop()
    const filePath = `${id}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('servicos')
      .upload(filePath, file, { upsert: true })

    if (uploadError) throw uploadError

    const { data: urlData } = supabase.storage
      .from('servicos')
      .getPublicUrl(filePath)

    return urlData.publicUrl
  }

  /* ======================================================
     SALVAR SERVIÇO
  ====================================================== */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      let imagemUrl = editingServico?.imagem || null

      // Upload se o usuário escolher nova imagem
      if (imagemFile) {
        const idBase = editingServico?.id || crypto.randomUUID()
        imagemUrl = await uploadImagem(idBase, imagemFile)
      }

      const payload = {
        nome: formData.nome,
        descricao: formData.descricao || null,
        preco: parseFloat(formData.preco),
        duracao_minutos: parseInt(formData.duracao_minutos),
        ativo: formData.ativo,
        imagem: imagemUrl
      }

      if (editingServico) {
        const { error } = await supabase
          .from('servicos')
          .update(payload)
          .eq('id', editingServico.id)

        if (error) throw error

        toast.success('Serviço atualizado!')
      } else {
        const { data: novo, error } = await supabase
          .from('servicos')
          .insert(payload)
          .select()
          .single()

        if (error) throw error

        // Upload final usando o ID real gerado pelo banco
        if (imagemFile) {
          const finalUrl = await uploadImagem(novo.id, imagemFile)
          await supabase
            .from('servicos')
            .update({ imagem: finalUrl })
            .eq('id', novo.id)
        }

        toast.success('Serviço criado!')
      }

      setShowModal(false)
      fetchServicos()

    } catch (error) {
      console.error(error)
      toast.error('Erro ao salvar serviço')
    }
  }

  /* ======================================================
     DELETAR
  ====================================================== */
  async function handleDelete(id: string) {
    if (!confirm('Deseja excluir este serviço?')) return

    const { error } = await supabase.from('servicos').delete().eq('id', id)
    if (error) return toast.error('Erro ao excluir')

    toast.success('Serviço excluído!')
    fetchServicos()
  }

  /* ======================================================
     ATIVAR / DESATIVAR
  ====================================================== */
  async function toggleAtivo(id: string, ativo: boolean) {
    const { error } = await supabase
      .from('servicos')
      .update({ ativo: !ativo })
      .eq('id', id)

    if (error) return toast.error('Erro ao alterar status')

    toast.success(`Serviço ${!ativo ? 'ativado' : 'desativado'}!`)
    fetchServicos()
  }

  /* ======================================================
     RENDER
  ====================================================== */
  return (
    <div className="space-y-6">

      {/* Topo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar serviços..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Novo Serviço
        </button>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-12 w-12 border-b-2 border-primary-500 rounded-full"></div>
        </div>
      ) : (
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {filteredServicos.map((servico) => (
              <div
                key={servico.id}
                className={`bg-white rounded-xl shadow-sm overflow-hidden p-0 ${!servico.ativo ? "opacity-60" : ""
                  }`}
              >
                {/* IMAGEM DO SERVIÇO */}
                <div className="w-full aspect-[4/3] bg-gray-200 overflow-hidden rounded-t-xl">
                  {servico.imagem ? (
                    <img
                      src={servico.imagem}
                      alt={servico.nome}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-secondary-500 to-secondary-700 flex items-center justify-center">
                      <Scissors className="h-14 w-14 text-white/40" />
                    </div>
                  )}
                </div>

                {/* INFO */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-secondary-500">
                      {servico.nome}
                    </h3>

                    {!servico.ativo && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                        Inativo
                      </span>
                    )}
                  </div>

                  <p className="text-gray-500 text-sm mb-4 min-h-[40px]">
                    {servico.descricao || "Sem descrição"}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{servico.duracao_minutos} min</span>
                    </div>

                    <div className="flex items-center gap-1 text-primary-500 font-bold">
                      <DollarSign className="h-4 w-4" />
                      <span>R$ {servico.preco.toFixed(2).replace(".", ",")}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleAtivo(servico.id, servico.ativo)}
                      className={`flex-1 py-2 rounded-lg font-medium transition-colors ${servico.ativo
                          ? "bg-red-100 text-red-600 hover:bg-red-200"
                          : "bg-green-100 text-green-600 hover:bg-green-200"
                        }`}
                    >
                      {servico.ativo ? "Desativar" : "Ativar"}
                    </button>

                    <button
                      onClick={() => openModal(servico)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-5 w-5" />
                    </button>

                    <button
                      onClick={() => handleDelete(servico.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
      )}



      {/* ======================================================
         MODAL
      ====================================================== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">

            <h3 className="text-xl font-semibold text-secondary-500 mb-6">
              {editingServico ? 'Editar Serviço' : 'Novo Serviço'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* NOME */}
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

              {/* DESCRIÇÃO */}
              <div>
                <label className="label">Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="input-field"
                  rows={3}
                />
              </div>

              {/* PREÇO + DURAÇÃO */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.preco}
                    onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="label">Duração (min)</label>
                  <input
                    type="number"
                    value={formData.duracao_minutos}
                    onChange={(e) => setFormData({ ...formData, duracao_minutos: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              {/* IMAGEM */}
              <div>
                <label className="label">Imagem do Serviço</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImagemFile(e.target.files?.[0] || null)}
                  className="input-field"
                />

                {(editingServico?.imagem && !imagemFile) && (
                  <img
                    src={editingServico.imagem}
                    alt="Prévia"
                    className="w-24 h-24 object-cover rounded mt-3 border"
                  />
                )}

                {imagemFile && (
                  <p className="text-xs text-gray-500 mt-2">
                    Nova imagem selecionada: {imagemFile.name}
                  </p>
                )}
              </div>

              {/* ATIVO */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="ativo"
                  checked={formData.ativo}
                  onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="ativo">Serviço ativo</label>
              </div>

              {/* BOTÕES */}
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
