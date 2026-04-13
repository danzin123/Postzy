// app/(dashboard)/marca/page.tsx
'use client'

import { useState, useEffect } from 'react'
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

  // Busca dados existentes para não ter que digitar de novo
  useEffect(() => {
    async function fetchBrand() {
      try {
        const res = await fetch('/api/brand/current') // Opcional: criar esta rota depois
        if (res.ok) {
          const data = await res.json()
          if (data.brand) setFormData(data.brand)
        }
      } catch (e) { /* silent fail */ }
    }
    fetchBrand()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    
    setLoading(true)
    const toastId = toast.loading('Treinando inteligência artificial...')

    try {
      const res = await fetch('/api/brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await res.json()

      if (res.ok) {
        toast.success('Marca configurada com sucesso!', {
          id: toastId,
          description: 'Sua IA está pronta. Redirecionando...',
        })
        
        // Redirecionamento forçado para evitar travamento de cache/compilação
        setTimeout(() => {
          window.location.href = '/criar'
        }, 1500)
      } else {
        toast.error(data.error || 'Falha ao salvar', { id: toastId })
        setLoading(false)
      }
    } catch (err) {
      toast.error('Erro de conexão com o servidor', { id: toastId })
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 mb-2">
          Identidade da Marca
        </h1>
        <p className="text-gray-400">
          Personalize como a IA gera seus conteúdos.
        </p>
      </motion.div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit} 
        className="space-y-6 bg-[#13131a]/60 backdrop-blur-xl p-8 rounded-2xl border border-white/5 shadow-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <Megaphone size={14} className="text-[#ff3d6e]" /> Tom de Voz
            </label>
            <select
              className="w-full bg-[#0a0a0f]/50 border border-white/10 rounded-xl p-4 text-white focus:border-[#ff3d6e] outline-none transition-all appearance-none"
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

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <Palette size={14} className="text-[#ff3d6e]" /> Cor Principal
            </label>
            <div className="flex gap-4 items-center bg-[#0a0a0f]/50 border border-white/10 rounded-xl p-2 pr-4 transition-all">
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

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={loading}
          className="w-full mt-6 py-4 bg-gradient-to-r from-[#ff3d6e] to-[#ff5c85] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 shadow-[0_0_20px_rgba(255,61,110,0.3)] border border-white/20"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Salvando Identity...
            </>
          ) : (
            'Confirmar e Treinar IA'
          )}
        </motion.button>
      </motion.form>
    </div>
  )
}