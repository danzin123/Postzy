// app/(auth)/register/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { Loader2, AlertCircle, Mail, Lock, User } from 'lucide-react'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      setLoading(false)
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
        // O Supabase enviará o usuário para esta URL após confirmar o email
        emailRedirectTo: `${location.origin}/api/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      // Se não for exigida a confirmação de e-mail no painel do Supabase, já loga direto
      if (data.session) {
        router.push('/dashboard')
        router.refresh()
      } else {
        setSuccess(true)
        setLoading(false)
      }
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 font-['DM_Sans'] text-[#f0f0f5]">
        <div className="w-full max-w-md bg-[#111118] border border-white/10 rounded-3xl p-8 shadow-2xl text-center">
          <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail size={32} />
          </div>
          <h2 className="text-2xl font-bold font-['Syne'] mb-4">Verifique seu e-mail</h2>
          <p className="text-[#7a7a99] text-sm mb-6">
            Enviamos um link de confirmação para <strong className="text-white">{email}</strong>. Clique no link para ativar sua conta e receber seus 5 créditos gratuitos!
          </p>
          <Link href="/login" className="text-[#ff3d6e] hover:text-[#ff6b35] font-semibold text-sm transition-colors">
            Voltar para o login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 font-['DM_Sans'] text-[#f0f0f5]">
      {/* Elementos de fundo decorativos */}
      <div className="absolute w-[500px] h-[500px] bg-[#ff3d6e]/10 rounded-full blur-[100px] top-[-10%] right-[-10%] pointer-events-none"></div>
      <div className="absolute w-[400px] h-[400px] bg-[#a259ff]/10 rounded-full blur-[80px] bottom-[-10%] left-[-5%] pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#111118] border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="font-['Syne'] font-extrabold text-3xl tracking-tight inline-block mb-2">
            <span className="bg-gradient-to-br from-[#ff3d6e] to-[#ff8c42] bg-clip-text text-transparent">post</span>
            <span className="text-white">zy</span>
          </Link>
          <p className="text-[#7a7a99] text-sm">Crie sua conta e ganhe 5 créditos grátis.</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <AlertCircle size={18} className="flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#7a7a99] ml-1">Seu Nome</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#7a7a99]">
                <User size={18} />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Como quer ser chamado?"
                required
                disabled={loading}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-[#f0f0f5] placeholder-[#7a7a99] focus:outline-none focus:border-[#ff3d6e]/50 transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#7a7a99] ml-1">E-mail</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#7a7a99]">
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                disabled={loading}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-[#f0f0f5] placeholder-[#7a7a99] focus:outline-none focus:border-[#ff3d6e]/50 transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#7a7a99] ml-1">Senha</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#7a7a99]">
                <Lock size={18} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo de 6 caracteres"
                required
                disabled={loading}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-[#f0f0f5] placeholder-[#7a7a99] focus:outline-none focus:border-[#ff3d6e]/50 transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 relative group overflow-hidden bg-gradient-to-r from-[#ff3d6e] to-[#ff6b35] text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(255,61,110,0.3)] hover:shadow-[0_6px_30px_rgba(255,61,110,0.5)] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Criar minha conta'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-[#7a7a99]">
          Já possui uma conta?{' '}
          <Link href="/login" className="text-white font-semibold hover:text-[#ff3d6e] transition-colors">
            Fazer login
          </Link>
        </div>
      </div>
    </div>
  )
}