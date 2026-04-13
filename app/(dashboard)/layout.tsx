// app/(dashboard)/marca/page.tsx
'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Building2, Target, Megaphone, Palette, Loader2 } from 'lucide-react'

export default function MarcaPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    niche: '',
    tone: 'Profissional',
    primaryColor: '#ff3d6e'
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    
    // Inicia um toast de carregamento
    const toastId = toast.loading('Salvando identidade visual...')

    try {
      const res = await fetch('/api/brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        // Atualiza o toast para sucesso
        toast.success('Marca configurada com sucesso!', {
          id: toastId,
          description: 'A IA agora vai usar sua identidade nos próximos posts.',
        })
      } else {
        toast.error('Falha ao salvar', { id: toastId })
      }
    } catch (err) {
      toast.error('Erro de conexão', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Cabeçalho Animado */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 mb-2">
          Identidade da Marca
        </h1>
        <p className="text-gray-400">
          Eduque a inteligência artificial sobre a alma do seu negócio.
        </p>
      </motion.div>

      {/* Formulário com Efeito Glassmorphism e Entrada Suave */}
      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit} 
        className="space-y-6 bg-[#13131a]/60 backdrop-blur-xl p-8 rounded-2xl border border-white/5 shadow-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <Building2 size={14} className="text-[#ff3d6e]" /> Nome da Empresa
            </label>
            <input
              type="text"
              className="w-full bg-[#0a0a0f]/50 border border-white/10 rounded-xl p-4 text-white focus:border-[#ff3d6e] focus:ring-1 focus:ring-[#ff3d6e] outline-none transition-all"
              placeholder="Ex: DM Labtech"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {/* Nicho */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <Target size={14} className="text-[#ff3d6e]" /> Nicho de Mercado
            </label>
            <input
              type="text"
              className="w-full bg-[#0a0a0f]/50 border border-white/10 rounded-xl p-4 text-white focus:border-[#ff3d6e] focus:ring-1 focus:ring-[#ff3d6e] outline-none transition-all"
              placeholder="Ex: Software SaaS"
              value={formData.niche}
              onChange={e => setFormData({ ...formData, niche: e.target.value })}
              required
            />
          </div>

          {/* Tom de Voz */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <Megaphone size={14} className="text-[#ff3d6e]" /> Tom de Voz
            </label>
            <select
              className="w-full bg-[#0a0a0f]/50 border border-white/10 rounded-xl p-4 text-white focus:border-[#ff3d6e] focus:ring-1 focus:ring-[#ff3d6e] outline-none transition-all appearance-none"
              value={formData.tone}
              onChange={e => setFormData({ ...formData, tone: e.target.value })}
            >
              <option value="Profissional">Profissional e Direto</option>
              <option value="Engraçado/Meme">Descontraído / Humor</option>
              <option value="Inspirador">Inspirador / Motivacional</option>
              <option value="Agressivo (Vendas)">Agressivo (Foco em Vendas)</option>
              <option value="Minimalista">Minimalista e Chique</option>
            </select>
          </div>

          {/* Cor Principal */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <Palette size={14} className="text-[#ff3d6e]" /> Cor Principal
            </label>
            <div className="flex gap-4 items-center bg-[#0a0a0f]/50 border border-white/10 rounded-xl p-2 pr-4 focus-within:border-[#ff3d6e] transition-all">
              <input
                type="color"
                className="w-10 h-10 rounded-lg bg-transparent border-none cursor-pointer"
                value={formData.primaryColor}
                onChange={e => setFormData({ ...formData, primaryColor: e.target.value })}
              />
              <input
                type="text"
                className="flex-1 bg-transparent text-white outline-none font-mono text-sm uppercase"
                value={formData.primaryColor}
                onChange={e => setFormData({ ...formData, primaryColor: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Botão Salvar Animado */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full mt-6 py-4 bg-gradient-to-r from-[#ff3d6e] to-[#ff5c85] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 shadow-[0_0_20px_rgba(255,61,110,0.3)] hover:shadow-[0_0_30px_rgba(255,61,110,0.5)] border border-white/20"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Processando...
            </>
          ) : (
            'Salvar e Treinar IA'
          )}
        </motion.button>
      </motion.form>
    </div>
  )
}