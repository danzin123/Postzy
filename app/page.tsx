// app/page.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, Zap, Image as ImageIcon, ArrowRight, TrendingUp } from 'lucide-react'

export default function LandingPage() {
  // Variáveis para animação em cascata (Stagger)
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden selection:bg-[#ff3d6e]/30">
      
      {/* Elementos de Fundo (Brilhos Neon) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#ff3d6e]/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-[#ff5c85]/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Navbar Glassmorphism */}
      <nav className="fixed w-full z-50 top-0 border-b border-white/5 bg-[#0a0a0f]/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#ff3d6e] to-[#ff5c85] rounded-xl flex items-center justify-center shadow-lg shadow-[#ff3d6e]/20">
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight">Postzy</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Entrar
            </Link>
            <Link href="/register" className="text-sm font-bold bg-white text-black px-5 py-2.5 rounded-full hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              Começar Grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff3d6e]/10 border border-[#ff3d6e]/20 text-[#ff3d6e] text-sm font-bold mb-8"
        >
          <Zap size={16} /> A Revolução do Marketing Digital chegou
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6 max-w-4xl"
        >
          Crie posts que <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff3d6e] to-[#ff5c85]">convertem</span> em questão de segundos.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed"
        >
          Inteligência Artificial desenhada para gerar artes impressionantes e textos persuasivos com a identidade visual da sua marca.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link href="/register" className="flex items-center gap-2 bg-gradient-to-r from-[#ff3d6e] to-[#ff5c85] text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(255,61,110,0.5)] hover:scale-105 transition-all">
            Criar meu primeiro Post <ArrowRight size={20} />
          </Link>
          <p className="text-sm text-gray-500 font-medium">Ganhe 5 créditos gratuitos ao se cadastrar.</p>
        </motion.div>

        {/* Dashboard Mockup (Preview Visual) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-20 w-full max-w-5xl h-[400px] md:h-[600px] bg-[#13131a]/80 backdrop-blur-xl border border-white/10 rounded-t-3xl shadow-2xl overflow-hidden relative flex flex-col"
        >
          {/* Falso Header do Mockup */}
          <div className="h-12 bg-black/40 border-b border-white/5 flex items-center px-6 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          {/* Conteúdo Falso do Mockup */}
          <div className="flex-1 p-8 flex gap-8">
            <div className="w-1/3 space-y-4 hidden md:block">
              <div className="h-10 bg-white/5 rounded-lg w-full animate-pulse" />
              <div className="h-40 bg-white/5 rounded-lg w-full" />
              <div className="h-10 bg-[#ff3d6e]/20 rounded-lg w-full" />
            </div>
            <div className="flex-1 bg-black/50 rounded-2xl border border-white/5 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff3d6e]/10 to-transparent" />
              <ImageIcon size={64} className="text-gray-800" />
            </div>
          </div>
        </motion.div>
      </main>

      {/* Features Section */}
      <section className="relative z-10 bg-black/50 py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">Poder absurdo. Uso simples.</h2>
            <p className="text-gray-400">Tudo que você precisa para dominar as redes sociais da sua empresa.</p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Feature 1 */}
            <motion.div variants={itemVariants} className="bg-[#13131a] border border-white/5 p-8 rounded-3xl hover:border-[#ff3d6e]/50 transition-colors">
              <div className="w-12 h-12 bg-[#ff3d6e]/10 rounded-xl flex items-center justify-center mb-6">
                <ImageIcon className="text-[#ff3d6e]" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Artes Cinematográficas</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Deixe o design com a IA. Geramos imagens de altíssima qualidade seguindo as paletas de cores da sua própria marca.</p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={itemVariants} className="bg-[#13131a] border border-white/5 p-8 rounded-3xl hover:border-[#ff3d6e]/50 transition-colors">
              <div className="w-12 h-12 bg-[#ff3d6e]/10 rounded-xl flex items-center justify-center mb-6">
                <Zap className="text-[#ff3d6e]" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Copywriting Automático</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Legendas persuasivas, gatilhos mentais e as hashtags perfeitas geradas em segundos para engajar seu público.</p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={itemVariants} className="bg-[#13131a] border border-white/5 p-8 rounded-3xl hover:border-[#ff3d6e]/50 transition-colors">
              <div className="w-12 h-12 bg-[#ff3d6e]/10 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="text-[#ff3d6e]" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Pronto para Converter</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Foque nas suas vendas. O Postzy cuida de todo o processo criativo, formatando os posts para Instagram, Facebook e TikTok.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer Simples */}
      <footer className="border-t border-white/5 py-8 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} DM Labtech. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}