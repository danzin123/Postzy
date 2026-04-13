// app/(auth)/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { Loader2, AlertCircle, Mail, Lock } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message === 'Invalid login credentials' 
        ? 'E-mail ou senha incorretos.' 
        : 'Ocorreu um erro ao tentar fazer login.')
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 font-['DM_Sans'] text-[#f0f0f5]">
      {/* Elementos de fundo decorativos */}
      <div className="absolute w-[500px] h-[500px] bg-[#ff3d6e]/10 rounded-full blur-[100px] top-[-10%] left-[-10%] pointer-events-none"></div>
      <div className="absolute w-[400px] h-[400px] bg-[#a259ff]/10 rounded-full blur-[80px] bottom-[-10%] right-[-5%] pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#111118] border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="font-['Syne'] font-extrabold text-3xl tracking-tight inline-block mb-2">
            <span className="bg-gradient-to-br from-[#ff3d6e] to-[#ff8c42] bg-clip-text text-transparent">post</span>
            <span className="text-white">zy</span>
          </Link>
          <p className="text-[#7a7a99] text-sm">Bem-vindo de volta! Acesse sua conta.</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <AlertCircle size={18} className="flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
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
            <div className="flex items-center justify-between ml-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#7a7a99]">Senha</label>
              <Link href="#" className="text-xs text-[#ff3d6e] hover:text-[#ff6b35] transition-colors">Esqueceu?</Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#7a7a99]">
                <Lock size={18} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Entrar na plataforma'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-[#7a7a99]">
          Ainda não tem uma conta?{' '}
          <Link href="/register" className="text-white font-semibold hover:text-[#ff3d6e] transition-colors">
            Criar conta grátis
          </Link>
        </div>
      </div>
    </div>
  )
}