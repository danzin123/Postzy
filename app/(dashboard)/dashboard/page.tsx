import Link from 'next/link'
import { Wand2, History, Zap } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="p-8 font-['DM_Sans'] text-[#f0f0f5] max-w-6xl mx-auto animate-in fade-in zoom-in duration-500">
      <h1 className="text-3xl font-bold font-['Syne'] mb-2">Visão Geral</h1>
      <p className="text-[#7a7a99] mb-8">Bem-vindo ao seu painel do Postzy. O que vamos criar hoje?</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card: Criar Novo */}
        <div className="bg-[#111118] border border-white/10 p-6 rounded-3xl shadow-xl flex flex-col items-start hover:border-[#ff3d6e]/30 transition-all hover:-translate-y-1">
          <div className="w-12 h-12 bg-[#ff3d6e]/10 text-[#ff3d6e] rounded-xl flex items-center justify-center mb-4">
            <Wand2 size={24} />
          </div>
          <h3 className="font-bold text-lg mb-2">Novo Criativo</h3>
          <p className="text-sm text-[#7a7a99] mb-6">Gere imagem, legenda e hashtags com um clique.</p>
          <Link href="/criar" className="mt-auto text-sm font-semibold text-[#ff3d6e] hover:text-[#ff6b35] transition-colors">
            Começar agora &rarr;
          </Link>
        </div>

        {/* Card: Histórico */}
        <div className="bg-[#111118] border border-white/10 p-6 rounded-3xl shadow-xl flex flex-col items-start hover:border-white/20 transition-all hover:-translate-y-1">
          <div className="w-12 h-12 bg-white/5 text-white rounded-xl flex items-center justify-center mb-4">
            <History size={24} />
          </div>
          <h3 className="font-bold text-lg mb-2">Seu Histórico</h3>
          <p className="text-sm text-[#7a7a99] mb-6">Acesse os últimos criativos gerados pela IA.</p>
          <Link href="/historico" className="mt-auto text-sm font-semibold text-white hover:text-gray-300 transition-colors">
            Ver galeria &rarr;
          </Link>
        </div>

        {/* Card: Créditos */}
        <div className="bg-gradient-to-br from-[#a259ff]/10 to-transparent border border-[#a259ff]/20 p-6 rounded-3xl shadow-xl flex flex-col items-start transition-all hover:-translate-y-1 hover:border-[#a259ff]/40">
          <div className="w-12 h-12 bg-[#a259ff]/20 text-[#a259ff] rounded-xl flex items-center justify-center mb-4">
            <Zap size={24} />
          </div>
          <h3 className="font-bold text-lg mb-2">Créditos</h3>
          <p className="text-sm text-[#7a7a99] mb-6">Adquira pacotes avulsos ou assine um plano.</p>
          <Link href="/creditos" className="mt-auto text-sm font-semibold text-[#a259ff] hover:text-[#b87cff] transition-colors">
            Fazer upgrade &rarr;
          </Link>
        </div>
      </div>
    </div>
  )
}