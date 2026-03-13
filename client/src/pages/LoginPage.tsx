import { useEffect, useState } from 'react'
import { useLocation } from 'wouter'
import { Scissors, Mail, Lock, User, Eye, EyeOff, Phone } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { FcGoogle } from "react-icons/fc";


export default function LoginPage() {
  const [, setLocation] = useLocation()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmarSenha: '',
    telefone: ''
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // máscara (44) 9 0000-0000
  function handleTelefoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 11) value = value.slice(0, 11)

    if (value.length >= 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`
    }

    if (value.length >= 10) {
      value = value.replace(/(\d{1})(\d{4})(\d{4})$/, '$1 $2-$3')
    }

    setFormData(prev => ({ ...prev, telefone: value }))
  }

  /* ============================================================
     CHECAR USUÁRIO LOGADO (PÓS GOOGLE / RELOAD)
  ============================================================ */
  useEffect(() => {
    checkLoggedUser()
  }, [])

  async function checkLoggedUser() {
    const { data } = await supabase.auth.getUser()
    const user = data.user

    if (!user) return

    const { data: perfil } = await supabase
      .from("usuarios")
      .select("id, nome, telefone, nivel")
      .eq("id", user.id)
      .maybeSingle()

    // se não existe registro na tabela usuarios, cria um básico
    if (!perfil) {
      const { error } = await supabase.from("usuarios").insert({
        id: user.id,
        nome:
          (user.user_metadata?.nome as string) ||
          (user.user_metadata?.full_name as string) ||
          "Usuário",
        email: user.email!,
        telefone: null,
        nivel: "Cliente",
        role: "user",
        ativo: true,
        atendimento: false
      })

      if (error) {
        console.error(error)
        toast.error("Erro ao preparar seu cadastro")
        return
      }

      setLocation("/completar-cadastro")
      return
    }

    // se não tem telefone, força completar cadastro
    if (!perfil.telefone) {
      setLocation("/completar-cadastro")
      return
    }

    // se já está tudo ok, manda para o lugar certo
    if (perfil.nivel === "Administrador" || perfil.nivel === "Funcionario") {
      setLocation("/painel")
    } else {
      setLocation("/")
    }
  }

  /* ============================================================
     LOGIN COM GOOGLE
  ============================================================ */
  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/painel" }
    })
  }

  /* ============================================================
     REDIRECIONAR DEPOIS DO LOGIN (EMAIL/SENHA)
  ============================================================ */
  async function afterLoginRedirect(userId: string) {
    const { data } = await supabase
      .from("usuarios")
      .select("nivel, telefone")
      .eq("id", userId)
      .single()

    if (!data) {
      setLocation("/completar-cadastro")
      return
    }

    if (!data.telefone) {
      setLocation("/completar-cadastro")
      return
    }

    if (data.nivel === "Administrador" || data.nivel === "Funcionario") {
      setLocation("/painel")
    } else {
      setLocation("/")
    }
  }

  /* ============================================================
     LOGIN / CADASTRO NORMAL
  ============================================================ */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!isLogin) {
      if (formData.password !== formData.confirmarSenha) {
        toast.error("As senhas não conferem")
        return
      }

      if (!formData.telefone) {
        toast.error("Informe um telefone válido")
        return
      }
    }

    setLoading(true)

    try {
      let authResponse

      if (isLogin) {
        authResponse = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        })
      } else {
        authResponse = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              nome: formData.nome,
              role: "user"
            }
          }
        })
      }

      if (authResponse.error) {
        toast.error(authResponse.error.message)
        setLoading(false)
        return
      }

      const user = authResponse.data.user
      if (!user) {
        toast.error("Erro ao autenticar usuário")
        setLoading(false)
        return
      }

      const { data: existingUser } = await supabase
        .from("usuarios")
        .select("nivel")
        .eq("id", user.id)
        .maybeSingle()

      const { error: upsertError } = await supabase.from("usuarios").upsert({
        id: user.id,
        nome: formData.nome || (user.user_metadata?.nome as string) || "Usuário",
        email: user.email!,
        telefone: formData.telefone
          ? formData.telefone.replace(/\D/g, "")
          : existingUser ? undefined : null,
        nivel: existingUser?.nivel ?? "Cliente",
        role: "user",
        ativo: true,
        atendimento: false
      })

      if (upsertError) {
        console.error(upsertError)
        toast.error("Erro ao salvar usuário no banco")
        setLoading(false)
        return
      }

      toast.success(isLogin ? "Bem-vindo!" : "Conta criada com sucesso!")
      await afterLoginRedirect(user.id)

    } catch (err) {
      console.error(err)
      toast.error("Erro ao processar sua solicitação")
    }

    setLoading(false)
  }

  /* ============================================================
     UI
  ============================================================ */
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-500 to-secondary-700 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" />

      <div className="card max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-3xl font-bold text-secondary-500 mb-2">
            <Scissors className="h-8 w-8 text-primary-500" />
            <span>Barbearia</span>
          </div>
          <p className="text-gray-600">
            {isLogin ? 'Acesse sua conta' : 'Crie sua conta'}
          </p>
        </div>

        {/* Alternar entre login e criar conta */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-md font-medium transition-all ${isLogin ? 'bg-white shadow text-primary-500' : 'text-gray-500'
              }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-md font-medium transition-all ${!isLogin ? 'bg-white shadow text-primary-500' : 'text-gray-500'
              }`}
          >
            Criar Conta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* CAMPOS APENAS PARA CRIAR CONTA */}
          {!isLogin && (
            <>
              {/* NOME */}
              <div>
                <label className="label">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="Seu nome"
                    required
                  />
                </div>
              </div>

              {/* TELEFONE */}
              <div>
                <label className="label">Telefone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.telefone}
                    onChange={handleTelefoneChange}
                    className="input-field pl-10"
                    placeholder="(44) 9 0000-0000"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {/* EMAIL */}
          <div>
            <label className="label">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          {/* SENHA */}
          <div>
            <label className="label">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field pl-10 pr-10"
                placeholder="********"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* CONFIRMAR SENHA SÓ NO CADASTRO */}
          {!isLogin && (
            <div>
              <label className="label">Confirmar Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmarSenha"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  className="input-field pl-10 pr-10"
                  placeholder="********"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          )}

          {/* BOTÃO LOGIN / CRIAR */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? 'Carregando...' : isLogin ? 'Entrar' : 'Criar Conta'}
          </button>
        </form>

        {/* LOGIN COM GOOGLE */}
        <div className="mt-6">
          <button onClick={handleGoogleLogin} className="btn-google w-full flex items-center justify-center gap-2">
            <FcGoogle className="h-5 w-5" />
            Entrar com Google
          </button>

        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-gray-500 hover:text-primary-500">
            Voltar para o site
          </a>
        </div>
      </div>
    </div>
  )
}
