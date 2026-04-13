'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Wand2, History, Paintbrush, Zap, LogOut, Settings, Sparkles } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { PopupDialog } from '@/components/ui/PopupDialog'

interface SidebarProps {
  userEmail: string
  credits: number
}

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/criar', label: 'Criar Criativo', icon: Wand2 },
  { href: '/historico', label: 'Histórico', icon: History },
  { href: '/marca', label: 'Minha Marca', icon: Paintbrush },
  { href: '/configuracoes', label: 'Configurações', icon: Settings },
]

export function Sidebar({ userEmail, credits }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [logoutOpen, setLogoutOpen] = useState(false)
  const initials = useMemo(() => (userEmail?.[0] || 'P').toUpperCase(), [userEmail])

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const promise = supabase.auth.signOut()
    toast.promise(promise, {
      loading: 'Encerrando sessão...',
      success: 'Sessão encerrada com sucesso.',
      error: 'Não foi possível sair agora.',
    })

    await promise
    setLogoutOpen(false)
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      <aside className="glass-panel fixed left-0 top-0 z-50 hidden h-screen w-72 flex-col border-r border-white/8 lg:flex">
        <div className="flex h-22 items-center justify-between border-b border-white/8 px-6">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="animate-glow flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff3d6e] via-[#ff5b80] to-[#ff8c42] shadow-[0_12px_40px_rgba(255,61,110,0.35)]">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-white">Postzy</div>
              <div className="text-xs text-zinc-400">painel criativo premium</div>
            </div>
          </Link>
        </div>

        <div className="border-b border-white/8 px-4 py-5">
          <Link
            href="/creditos"
            className="glass-soft gradient-border flex items-center justify-between rounded-2xl p-4 hover:bg-white/8"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#9b6bff]/15 text-[#c0a5ff]">
                <Zap size={18} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.16em] text-zinc-500">créditos</div>
                <div className="text-sm font-semibold text-white">{credits} restantes</div>
              </div>
            </div>
            <span className="rounded-full border border-[#9b6bff]/25 bg-[#9b6bff]/10 px-2.5 py-1 text-[11px] font-bold text-[#d6c8ff]">
              upgrade
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-5">
          <div className="px-3 text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">menu</div>
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#ff3d6e]/16 via-[#ff3d6e]/10 to-transparent text-white shadow-[0_0_0_1px_rgba(255,61,110,0.15)]'
                    : 'text-zinc-400 hover:bg-white/6 hover:text-white'
                }`}
              >
                {isActive ? <span className="absolute left-0 top-2 h-8 w-1 rounded-r-full bg-[#ff5c85]" /> : null}
                <Icon size={18} className={isActive ? 'text-[#ff7a9b]' : 'text-zinc-500 group-hover:text-white'} />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-white/8 p-4">
          <div className="glass-soft mb-3 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-white/20 to-white/5 text-sm font-bold text-white">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-white">{userEmail}</div>
                <div className="text-xs text-zinc-500">Plano gratuito</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setLogoutOpen(true)}
            className="secondary-button w-full justify-center"
          >
            <LogOut size={16} /> Sair da conta
          </button>
        </div>
      </aside>

      <PopupDialog
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        title="Sair da conta?"
        description="A sessão atual será encerrada e o painel será fechado neste navegador."
        footer={(
          <>
            <button onClick={() => setLogoutOpen(false)} className="secondary-button px-4 py-2.5 text-sm">
              Cancelar
            </button>
            <button onClick={handleLogout} className="primary-button px-4 py-2.5 text-sm">
              Confirmar saída
            </button>
          </>
        )}
      />
    </>
  )
}