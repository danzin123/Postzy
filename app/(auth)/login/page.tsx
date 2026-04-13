'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'
import { Mail, Lock, Loader2, LogIn, Sparkles, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()

    if (!email.trim() || !password.trim()) {
      toast.error('Preencha e-mail e senha.')
      return
    }

    setLoading(true)
    const toastId = toast.loading('Entrando na sua conta...')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(error.message || 'Não foi possível fazer login.', {
          id: toastId,
        })
        setLoading(false)
        return
      }

      toast.success('Login realizado com sucesso!', {
        id: toastId,
        description: 'Redirecionando para o painel...',
      })

      router.push('/dashboard')
      router.refresh()
    } catch {
      toast.error('Erro de conexão ao tentar entrar.', { id: toastId })
      setLoading(false)
    }
  }

  return (
    <div className="page-shell relative min-h-screen overflow-hidden bg-[#07070b] text-white">
      <div className="grid-overlay pointer-events-none fixed inset-0 opacity-[0.05]" />

      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-[#ff3d6e]/12 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#9b6bff]/12 blur-[120px]" />

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
              acesso premium
            </div>

            <h1 className="text-5xl font-black leading-tight tracking-tight text-white">
              Entre no painel e gere criativos com cara de campanha profissional.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-8 text-zinc-400">
              Acesse seu dashboard, veja seus créditos, histórico, identidade da marca e gere novos posts com a estética glass premium em segundos.
            </p>

            <div className="mt-10 grid gap-4">
              <div className="glass-card rounded-[24px] p-5">
                <div className="mb-2 text-sm font-semibold text-white">
                  Visual unificado
                </div>
                <p className="text-sm leading-7 text-zinc-400">
                  Login, dashboard, histórico e geração com a mesma identidade visual sofisticada.
                </p>
              </div>

              <div className="glass-card rounded-[24px] p-5">
                <div className="mb-2 text-sm font-semibold text-white">
                  Fluxo rápido
                </div>
                <p className="text-sm leading-7 text-zinc-400">
                  Entrou, salvou a marca, gerou. Sem tela quebrada e sem etapa travando.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex w-full items-center justify-center px-5 py-10 lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="glass-panel gradient-border w-full max-w-md rounded-[32px] p-6 sm:p-8"
          >
            <div className="mb-8 text-center">
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff3d6e] via-[#ff5b80] to-[#ff8c42] shadow-[0_18px_40px_rgba(255,61,110,0.35)]">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-black tracking-tight text-white">
                    Postzy
                  </div>
                  <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                    dm labtech
                  </div>
                </div>
              </Link>

              <h2 className="mt-6 text-3xl font-black tracking-tight text-white">
                Fazer login
              </h2>
              <p className="mt-2 text-sm leading-7 text-zinc-400">
                Entre com seu e-mail e senha para acessar o painel.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
                  E-mail
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  />
                  <input
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="input-glass pl-11"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
                  Senha
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  />
                  <input
                    type="password"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="input-glass pl-11"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="primary-button w-full py-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    Entrar no painel
                  </>
                )}
              </button>
            </form>

            <div className="my-6 h-px w-full bg-white/8" />

            <div className="space-y-3 text-center">
              <p className="text-sm text-zinc-400">
                Ainda não tem conta?
              </p>
              <Link
                href="/register"
                className="secondary-button w-full justify-center py-3 text-sm"
              >
                Criar conta grátis
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}