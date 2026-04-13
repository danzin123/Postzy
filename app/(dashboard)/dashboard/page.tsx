'use client'

import { motion } from 'framer-motion'
import {
  Sparkles,
  Zap,
  Wand2,
  History,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="page-shell p-6 md:p-10">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="badge-pill mb-4">
          <Sparkles size={14} />
          dashboard
        </div>

        <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
          Bem-vindo ao seu painel
        </h1>

        <p className="mt-3 max-w-xl text-sm text-zinc-400 md:text-base">
          Gere criativos, acompanhe seu histórico e gerencie sua marca com uma
          experiência visual premium.
        </p>
      </motion.div>

      {/* CARDS PRINCIPAIS */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* CRIAR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card card-premium-hover rounded-[28px] p-6"
        >
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff3d6e]/20 text-[#ff8aa8]">
            <Wand2 size={24} />
          </div>

          <h3 className="text-xl font-bold text-white">
            Criar novo criativo
          </h3>

          <p className="mt-2 text-sm text-zinc-400">
            Gere posts com imagem, legenda e hashtags em segundos.
          </p>

          <Link
            href="/criar"
            className="primary-button mt-6 inline-flex w-full justify-center py-3 text-sm"
          >
            Criar agora <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* HISTÓRICO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card card-premium-hover rounded-[28px] p-6"
        >
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#9b6bff]/20 text-[#c0a5ff]">
            <History size={24} />
          </div>

          <h3 className="text-xl font-bold text-white">
            Histórico
          </h3>

          <p className="mt-2 text-sm text-zinc-400">
            Veja todos os criativos que você já gerou.
          </p>

          <Link
            href="/historico"
            className="secondary-button mt-6 inline-flex w-full justify-center py-3 text-sm"
          >
            Ver histórico
          </Link>
        </motion.div>

        {/* MARCA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card card-premium-hover rounded-[28px] p-6"
        >
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff8c42]/20 text-[#ffb273]">
            <Sparkles size={24} />
          </div>

          <h3 className="text-xl font-bold text-white">
            Identidade da marca
          </h3>

          <p className="mt-2 text-sm text-zinc-400">
            Personalize como a IA cria seus conteúdos.
          </p>

          <Link
            href="/marca"
            className="secondary-button mt-6 inline-flex w-full justify-center py-3 text-sm"
          >
            Configurar marca
          </Link>
        </motion.div>
      </div>

      {/* ESTATÍSTICAS */}
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {/* USO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-[28px] p-6"
        >
          <div className="mb-4 flex items-center gap-3">
            <Zap className="text-[#ff3d6e]" />
            <h3 className="text-lg font-bold">Uso recente</h3>
          </div>

          <div className="space-y-3 text-sm text-zinc-400">
            <p>• Você gerou X criativos recentemente</p>
            <p>• Última geração: há poucos minutos</p>
            <p>• Continue criando para melhorar seus resultados</p>
          </div>
        </motion.div>

        {/* PERFORMANCE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-[28px] p-6"
        >
          <div className="mb-4 flex items-center gap-3">
            <TrendingUp className="text-[#9b6bff]" />
            <h3 className="text-lg font-bold">Performance</h3>
          </div>

          <div className="space-y-3 text-sm text-zinc-400">
            <p>• Seus criativos estão mais profissionais</p>
            <p>• Identidade visual consistente</p>
            <p>• Maior potencial de conversão</p>
          </div>
        </motion.div>
      </div>

      {/* CALL TO ACTION FINAL */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-12 glass-panel rounded-[32px] p-8 text-center"
      >
        <h2 className="text-2xl font-black text-white md:text-3xl">
          Pronto para criar seu próximo post?
        </h2>

        <p className="mt-3 text-zinc-400">
          Clique abaixo e gere um criativo com visual premium agora.
        </p>

        <Link
          href="/criar"
          className="primary-button mt-6 inline-flex px-8 py-4 text-sm"
        >
          Criar criativo <Wand2 size={18} />
        </Link>
      </motion.div>
    </div>
  )
}