// components/dashboard/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Wand2, 
  History, 
  Paintbrush, 
  Zap, 
  LogOut 
} from 'lucide-react'

interface SidebarProps {
  userEmail: string
  credits: number
}

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/criar', label: 'Criar Criativo', icon: Wand2 },
  { href: '/historico', label: 'Histórico', icon: History },
  { href: '/marca', label: 'Minha Marca', icon: Paintbrush },
]

export function Sidebar({ userEmail, credits }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-[#111118] border-r border-white/10 flex flex-col h-screen fixed left-0 top-0 text-[#f0f0f5] font-['DM_Sans'] z-50">
      {/* Logo */}
      <div className="h-20 flex items-center px-8 border-b border-white/10">
        <Link href="/dashboard" className="font-['Syne'] font-extrabold text-2xl tracking-tight">
          <span className="bg-gradient-to-br from-[#ff3d6e] to-[#ff8c42] bg-clip-text text-transparent">
            post
          </span>
          <span className="text-white">zy</span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <div className="text-xs font-semibold uppercase tracking-wider text-[#7a7a99] mb-4 px-4">
          Menu Principal
        </div>
        
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href
          const Icon = link.icon
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-[#ff3d6e]/10 text-[#ff3d6e] font-semibold' 
                  : 'text-[#7a7a99] hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={20} />
              {link.label}
            </Link>
          )
        })}
      </nav>

      {/* Credits & Profile Section */}
      <div className="p-4 border-t border-white/10">
        <Link 
          href="/creditos"
          className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 mb-4 ${
            pathname === '/creditos'
              ? 'bg-[#a259ff]/10 border-[#a259ff]/40'
              : 'bg-white/5 border-white/10 hover:bg-white/10'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#a259ff]/20 rounded-lg text-[#a259ff]">
              <Zap size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#7a7a99]">Seus Créditos</span>
              <span className="text-sm font-bold">{credits} restantes</span>
            </div>
          </div>
        </Link>

        <div className="flex items-center justify-between px-2">
          <div className="flex flex-col overflow-hidden pr-2">
            <span className="text-sm font-medium truncate">{userEmail}</span>
            <span className="text-xs text-[#7a7a99]">Plano Gratuito</span>
          </div>
          <button className="p-2 text-[#7a7a99] hover:text-[#ff3d6e] transition-colors rounded-lg hover:bg-red-500/10 flex-shrink-0">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  )
}