'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, Zap, Image as ImageIcon, ArrowRight, TrendingUp, Layers3, Wand2 } from 'lucide-react'

const features = [
  {
    icon: ImageIcon,
    title: 'Criativos com cara de campanha premium',
    description: 'Imagens, copy e hashtags alinhadas com a identidade visual da marca em segundos.',
  },
  {
    icon: Wand2,
    title: 'Fluxo rápido e sem fricção',
    description: 'Escolha a rede, o estilo e o formato. O resto sai pronto para postar.',
  },
  {
    icon: TrendingUp,
    title: 'Feito para vender mais',
    description: 'Legendas com CTA, artes chamativas e consistência visual para melhorar resultado.',
  },
]

export default function LandingPage() {
  return (
    <div className="page-shell min-h-screen overflow-hidden text-white">
      <div className="grid-overlay pointer-events-none fixed inset-0 opacity-[0.06]" />

      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-[#08080d]/55 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff3d6e] via-[#ff5d84] to-[#ff8c42] shadow-[0_18px_40px_rgba(255,61,110,0.35)]">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <div className="text-2xl font-black tracking-tight">Postzy</div>
              <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">dm labtech</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="secondary-button hidden px-5 py-3 text-sm sm:inline-flex">
              Entrar
            </Link>
            <Link href="/register" className="primary-button px-5 py-3 text-sm">
              Começar grátis <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center px-6 pb-24 pt-36 text-center">
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          className="badge-pill animate-float"
        >
          <Zap size={14} /> IA criativa com visual premium
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 max-w-5xl text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-8xl"
        >
          Gere posts que parecem feitos por uma <span className="gradient-text">agência cara</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="mt-7 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg"
        >
          O Postzy transforma uma ideia simples em arte, legenda e hashtags prontas para publicar no Instagram, Facebook, TikTok, LinkedIn e mais.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Link href="/register" className="primary-button px-7 py-4 text-base">
            Criar meu primeiro post <ArrowRight size={18} />
          </Link>
          <Link href="/login" className="secondary-button px-7 py-4 text-base">
            Ver painel
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="glass-panel gradient-border mt-16 w-full max-w-6xl overflow-hidden rounded-[30px]"
        >
          <div className="flex items-center justify-between border-b border-white/8 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-400/80" />
              <span className="h-3 w-3 rounded-full bg-amber-400/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-400">
              experiência glass premium
            </div>
          </div>

          <div className="grid gap-6 p-5 md:grid-cols-[280px,1fr] md:p-8">
            <div className="space-y-4 rounded-[24px] border border-white/8 bg-black/30 p-4 text-left">
              <div className="glass-soft rounded-2xl p-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ff3d6e]/15 text-[#ff8aa8]">
                    <Layers3 size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Painel criativo</div>
                    <div className="text-xs text-zinc-500">rede, estilo e formato</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-10 rounded-xl bg-white/5" />
                  <div className="h-28 rounded-xl bg-white/5" />
                  <div className="h-10 rounded-xl bg-gradient-to-r from-[#ff3d6e]/30 to-[#ff8c42]/20" />
                </div>
              </div>
              <div className="glass-soft rounded-2xl p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">social proof</div>
                <div className="mt-3 text-sm text-zinc-300">Posts mais rápidos, identidade consistente e fluxo bonito de verdade.</div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[28px] border border-white/8 bg-black/35 p-5 sm:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,61,110,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(155,107,255,0.14),transparent_32%)]" />
              <div className="relative grid h-full gap-5 md:grid-cols-2">
                <div className="glass-soft flex min-h-[290px] flex-col rounded-[24px] p-5 text-left">
                  <div className="flex items-center justify-between">
                    <span className="badge-pill">geração</span>
                    <span className="text-xs text-zinc-500">4:5 vertical</span>
                  </div>
                  <div className="mt-5 flex-1 rounded-[20px] border border-white/8 bg-gradient-to-br from-white/10 to-transparent p-4">
                    <div className="h-full rounded-[18px] border border-dashed border-white/12 bg-black/25" />
                  </div>
                </div>
                <div className="glass-soft flex min-h-[290px] flex-col rounded-[24px] p-5 text-left">
                  <div className="text-sm font-semibold text-white">Legenda + hashtags</div>
                  <div className="mt-5 space-y-3 text-sm text-zinc-400">
                    <div className="h-4 rounded-full bg-white/8" />
                    <div className="h-4 w-11/12 rounded-full bg-white/8" />
                    <div className="h-4 w-10/12 rounded-full bg-white/8" />
                    <div className="mt-6 flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-xs">#marketing</span>
                      <span className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-xs">#criativo</span>
                      <span className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-xs">#vendas</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <section className="relative z-10 border-t border-white/8 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <div className="badge-pill mx-auto">efeitos, brilho e resultado</div>
            <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">Tudo com a mesma estética premium.</h2>
            <p className="mt-4 text-zinc-400">Glassmorphism, microanimações e feedback visual em todas as áreas da plataforma.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="glass-card rounded-[28px] p-7"
                >
                  <div className="mb-5 flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff3d6e]/20 to-[#9b6bff]/15 text-[#ff8aa8]">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                  <p className="mt-3 leading-7 text-zinc-400">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/8 py-8 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} DM Labtech. Postzy com visual premium e fluxo criativo.
      </footer>
    </div>
  )
}