'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'
import {
  Mail,
  Lock,
  User,
  Loader2,
  Sparkles,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react'
import { toast } from 'sonner'

export default function RegisterPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()

    if (!name || !email || !password) {
      toast.error('Preencha todos os campos.')
      return
    }

    if (password.length < 6) {
      toast.error('A senha precisa ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)
    const toastId = toast.loading('Criando sua conta...')

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: `${location.origin}/callback`,
        },
      })

      if (error) {
        toast.error(error.message || 'Erro ao criar conta.', {
          id: toastId,
        })
        setLoading(false)
        return
      }

      if (data.session) {
        toast.success('Conta criada com sucesso!', { id: toastId })
        router.push('/dashboard')
        router.refresh()
        return
      }

      setSuccess(true)
      toast.success('Verifique seu e-mail para ativar a conta.', {
        id: toastId,
      })
      setLoading(false)
    } catch {
      toast.error('Erro de conexão.', { id: toastId })
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="page-shell flex min-h-screen items-center justify-center px-5">
        <div className="glass-panel gradient-border w-full max-w-md rounded-[32px] p-8 text-center">
          <div className="mb-5 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/20 text-green-400">
              <CheckCircle size={30} />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white">
            Verifique seu e-mail
          </h2>

          <p className="mt-3 text-sm text-zinc-400">
            Enviamos um link de confirmação para:
          </p>

          <p className="mt-2 font-semibold text-white">{email}</p>

          <Link
            href="/login"
            className="primary-button mt-6 w-full justify-center py-3 text-sm"
          >
            Ir para login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell relative min-h-screen overflow-hidden text-white">
      <div className="absolute left-0 top-0 h-72 w-72 bg-[#ff3d6e]/12 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-72 w-72 bg-[#9b6bff]/12 blur-[120px]" />

      <div className="relative z-10 flex min-h-screen">
        <div className="hidden w-1/2 items-center justify-center p-10 lg:flex">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-xl"
          >
            <Link
              href="/"
              className="secondary-button mb-8 inline-flex px-4 py-2.5 text-sm"
            >
              <ArrowLeft size={16} />
              Voltar
            </Link>

            <div className="badge-pill mb-5">
              <Sparkles size={14} />
              comece agora
            </div>

            <h1 className="text-5xl font-black leading-tight">
              Crie sua conta e comece a gerar criativos incríveis.
            </h1>

            <p className="mt-5 text-zinc-400">
              Ganhe créditos gratuitos e tenha acesso ao painel completo com
              identidade visual premium.
            </p>
          </motion.div>
        </div>

        <div className="flex w-full items-center justify-center px-5 py-10 lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel gradient-border w-full max-w-md rounded-[32px] p-8"
          >
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-black">Criar conta</h2>
              <p className="text-sm text-zinc-400">
                Comece grátis agora mesmo
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="text-xs text-zinc-500">Nome</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    className="input-glass pl-11"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-500">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    className="input-glass pl-11"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-500">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="password"
                    className="input-glass pl-11"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button className="primary-button w-full py-3">
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  'Criar conta'
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-400">
              Já tem conta?{' '}
              <Link href="/login" className="text-white underline">
                Entrar
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}