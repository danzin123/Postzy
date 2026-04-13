'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ConfiguracoesPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    niche: '',
    tone: 'Profissional',
    primaryColor: '#ff3d6e'
  })

  // Carrega os dados atuais da marca ao abrir a página
  useEffect(() => {
    async function loadBrand() {
      const res = await fetch('/api/brand/current') // Você pode criar essa rota simples ou buscar via Server Component
      if (res.ok) {
        const data = await res.json()
        if (data.brand) setFormData(data.brand)
      }
    }
    // loadBrand() // Opcional: implementar busca inicial
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/brand', {
        method: 'POST',
        body: JSON.stringify(formData)
      })
      if (res.ok) alert('Identidade de marca salva com sucesso!')
    } catch (err) {
      alert('Erro ao salvar configurações.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Identidade da Marca</h1>
        <p className="text-gray-400 text-sm">Configure como a IA deve se comportar e quais cores usar nos criativos.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-[#13131a] p-8 rounded-2xl border border-gray-800">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nome da Empresa</label>
          <input
            type="text"
            className="w-full bg-[#0a0a0f] border border-gray-800 rounded-lg p-3 text-white focus:border-[#ff3d6e] outline-none transition-all"
            placeholder="Ex: GymPass"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nicho / Setor</label>
          <input
            type="text"
            className="w-full bg-[#0a0a0f] border border-gray-800 rounded-lg p-3 text-white focus:border-[#ff3d6e] outline-none transition-all"
            placeholder="Ex: Academia de Ginástica"
            value={formData.niche}
            onChange={e => setFormData({ ...formData, niche: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Tom de Voz</label>
          <select
            className="w-full bg-[#0a0a0f] border border-gray-800 rounded-lg p-3 text-white focus:border-[#ff3d6e] outline-none transition-all"
            value={formData.tone}
            onChange={e => setFormData({ ...formData, tone: e.target.value })}
          >
            <option>Profissional</option>
            <option>Engraçado/Meme</option>
            <option>Inspirador</option>
            <option>Agressivo (Vendas)</option>
            <option>Minimalista</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Cor Principal (HEX)</label>
          <div className="flex gap-4 items-center">
            <input
              type="color"
              className="w-12 h-12 rounded-lg bg-transparent border-none cursor-pointer"
              value={formData.primaryColor}
              onChange={e => setFormData({ ...formData, primaryColor: e.target.value })}
            />
            <input
              type="text"
              className="flex-1 bg-[#0a0a0f] border border-gray-800 rounded-lg p-3 text-white outline-none"
              value={formData.primaryColor}
              readOnly
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-[#ff3d6e] text-white font-bold rounded-xl hover:bg-[#e63563] transition-all disabled:opacity-50 shadow-lg shadow-[#ff3d6e]/20"
        >
          {loading ? 'Salvando...' : 'Salvar Identidade'}
        </button>
      </form>
    </div>
  )
}