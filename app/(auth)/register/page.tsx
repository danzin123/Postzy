'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleRegister = async () => {
    if (password.length < 6) { setError('Senha deve ter no mínimo 6 caracteres'); return }
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) return (
    <div style={{ minHeight:'100vh', background:'#0a0a0f', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'sans-serif' }}>
      <div style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.07)', borderRadius:24, padding:48, width:'100%', maxWidth:400, textAlign:'center' }}>
        <div style={{ fontSize:'3rem', marginBottom:16 }}>📧</div>
        <h2 style={{ color:'#f0f0f5', fontSize:'1.3rem', fontWeight:700, marginBottom:12 }}>Confirme seu email</h2>
        <p style={{ color:'#7a7a99', fontSize:'0.9rem', lineHeight:1.6 }}>Enviamos um link de confirmação para <strong style={{ color:'#f0f0f5' }}>{email}</strong>. Clique no link para ativar sua conta.</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#0a0a0f', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'sans-serif' }}>
      <div style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.07)', borderRadius:24, padding:48, width:'100%', maxWidth:400 }}>
        <div style={{ fontSize:'1.8rem', fontWeight:800, background:'linear-gradient(135deg,#ff3d6e,#ff8c42)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:8 }}>
          postzy
        </div>
        <h1 style={{ color:'#f0f0f5', fontSize:'1.4rem', fontWeight:700, marginBottom:8 }}>Criar conta grátis</h1>
        <p style={{ color:'#7a7a99', fontSize:'0.9rem', marginBottom:32 }}>5 créditos grátis para começar 🎉</p>

        {error && (
          <div style={{ background:'rgba(255,61,110,0.1)', border:'1px solid rgba(255,61,110,0.3)', borderRadius:8, padding:'10px 14px', color:'#ff3d6e', fontSize:'0.85rem', marginBottom:20 }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom:16 }}>
          <label style={{ color:'#7a7a99', fontSize:'0.8rem', fontWeight:600, textTransform:'uppercase', letterSpacing:1, display:'block', marginBottom:8 }}>Nome</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Seu nome"
            style={{ width:'100%', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'12px 14px', color:'#f0f0f5', fontSize:'0.95rem', outline:'none', boxSizing:'border-box' }}
          />
        </div>

        <div style={{ marginBottom:16 }}>
          <label style={{ color:'#7a7a99', fontSize:'0.8rem', fontWeight:600, textTransform:'uppercase', letterSpacing:1, display:'block', marginBottom:8 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="seu@email.com"
            style={{ width:'100%', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'12px 14px', color:'#f0f0f5', fontSize:'0.95rem', outline:'none', boxSizing:'border-box' }}
          />
        </div>

        <div style={{ marginBottom:24 }}>
          <label style={{ color:'#7a7a99', fontSize:'0.8rem', fontWeight:600, textTransform:'uppercase', letterSpacing:1, display:'block', marginBottom:8 }}>Senha</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            onKeyDown={e => e.key === 'Enter' && handleRegister()}
            style={{ width:'100%', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'12px 14px', color:'#f0f0f5', fontSize:'0.95rem', outline:'none', boxSizing:'border-box' }}
          />
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          style={{ width:'100%', background:'linear-gradient(135deg,#ff3d6e,#ff6b35)', border:'none', borderRadius:10, padding:'14px', color:'white', fontSize:'1rem', fontWeight:600, cursor:loading ? 'not-allowed' : 'pointer', opacity:loading ? 0.7 : 1 }}
        >
          {loading ? 'Criando conta...' : 'Criar conta grátis'}
        </button>

        <p style={{ color:'#7a7a99', fontSize:'0.85rem', textAlign:'center', marginTop:24 }}>
          Já tem conta?{' '}
          <Link href="/login" style={{ color:'#ff3d6e', textDecoration:'none', fontWeight:600 }}>Entrar</Link>
        </p>
      </div>
    </div>
  )
}