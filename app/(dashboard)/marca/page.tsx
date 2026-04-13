'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Building2,
  Target,
  Palette,
  Megaphone,
  Loader2,
  Sparkles,
  CheckCircle2,
  Wand2,
} from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function MarcaPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [loadingBrand, setLoadingBrand] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    niche: '',
    tone: 'Profissional',
    primaryColor: '#ff3d6e',
  })

  useEffect(() => {
    async function loadBrand() {
      try {
        const res = await fetch('/api/brand/current', {
          cache: 'no-store',
        })

        if (!res.ok) {
          setLoadingBrand(false)
          return
        }

        const data = await res.json()

        if (data?.brand) {
          setFormData({
            name: data.brand.name || '',
            niche: data.brand.niche || '',
            tone: data.brand.tone || 'Profissional',
            primaryColor: data.brand.primaryColor || '#ff3d6e',
          })
        }
      } catch {
        toast.error('Não foi possível carregar os dados da marca.')
      } finally {
        setLoadingBrand(false)
      }
    }

    loadBrand()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!formData.name.trim() || !formData.niche.trim()) {
      toast.error('Preencha o nome da empresa e o nicho.')
      return
    }

    setLoading(true)
    const toastId = toast.loading('Salvando identidade da marca...')

    try {
      const res = await fetch('/api/brand', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data?.error || 'Erro ao salvar a marca.', {
          id: toastId,
        })
        setLoading(false)
        return
      }

      toast.success('Marca salva com sucesso!', {
        id: toastId,
        description: 'Agora você já pode gerar criativos com sua identidade.',
      })

      setTimeout(() => {
        router.push('/criar')
        router.refresh()
      }, 900)
    } catch {
      toast.error('Erro de conexão ao salvar.', { id: toastId })
      setLoading(false)
    }
  }

  if (loadingBrand) {
    return (
      <div className="page-shell flex min-h-[80vh] items-center justify-center p-6">
        <div className="glass-panel rounded-[28px] px-8 py-10 text-center">
          <Loader2 size={28} className="mx-auto animate-spin text-[#ff8aa8]" />
          <p className="mt-4 text-sm text-zinc-400">
            Carregando identidade da marca...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell p-6 md:p-10">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
      >
        <div>
          <div className="badge-pill mb-4">
            <Sparkles size={14} />
            identidade visual
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
            Configure sua marca
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400 md:text-base">
            Defina o nome, nicho, tom de voz e cor principal. Isso deixa a IA
            mais alinhada com o estilo da sua empresa.
          </p>
        </div>

        <div className="glass-soft rounded-2xl px-4 py-3">
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
            objetivo
          </div>
          <div className="mt-1 text-sm font-semibold text-white">
            Criativos consistentes e com mais identidade
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.8fr]">
        {/* FORM */}
        <motion.form
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="glass-panel gradient-border rounded-[32px] p-6 sm:p-8"
        >
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff3d6e]/15 text-[#ff8aa8]">
              <Building2 size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-black text-white">
                Dados da marca
              </h2>
              <p className="text-sm text-zinc-400">
                Personalize como o conteúdo será criado.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Nome */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
                Nome da empresa
              </label>

              <div className="relative">
                <Building2
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />
                <input
                  type="text"
                  placeholder="Ex: DM Labtech"
                  className="input-glass pl-11"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Nicho */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
                Nicho de mercado
              </label>

              <div className="relative">
                <Target
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />
                <input
                  type="text"
                  placeholder="Ex: Software, Barbearia, Contabilidade..."
                  className="input-glass pl-11"
                  value={formData.niche}
                  onChange={(e) =>
                    setFormData({ ...formData, niche: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Tom */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
                Tom de voz
              </label>

              <div className="relative">
                <Megaphone
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />
                <select
                  className="input-glass pl-11"
                  value={formData.tone}
                  onChange={(e) =>
                    setFormData({ ...formData, tone: e.target.value })
                  }
                >
                  <option value="Profissional">Profissional</option>
                  <option value="Moderno">Moderno</option>
                  <option value="Descontraído">Descontraído</option>
                  <option value="Luxuoso">Luxuoso</option>
                  <option value="Agressivo em vendas">Agressivo em vendas</option>
                </select>
              </div>
            </div>

            {/* Cor */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
                Cor principal
              </label>

              <div className="glass-soft flex items-center gap-3 rounded-2xl border border-white/10 px-3 py-3">
                <Palette size={18} className="text-zinc-500" />

                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) =>
                    setFormData({ ...formData, primaryColor: e.target.value })
                  }
                  className="h-10 w-14 cursor-pointer rounded-lg border-none bg-transparent"
                />

                <input
                  type="text"
                  className="input-glass h-10 border-none bg-transparent px-0 py-0 shadow-none focus:shadow-none"
                  value={formData.primaryColor}
                  onChange={(e) =>
                    setFormData({ ...formData, primaryColor: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={loading}
              className="primary-button w-full justify-center py-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Salvar identidade
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                router.push('/criar')
              }}
              className="secondary-button w-full justify-center py-3.5 text-sm"
            >
              <Wand2 size={18} />
              Ir para criação
            </button>
          </div>
        </motion.form>

        {/* PREVIEW */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="space-y-6"
        >
          <div className="glass-panel rounded-[32px] p-6">
            <div className="mb-5 flex items-center gap-3">
              <div
                className="h-12 w-12 rounded-2xl border border-white/10"
                style={{
                  background: formData.primaryColor || '#ff3d6e',
                }}
              />
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                  preview
                </div>
                <h3 className="text-xl font-black text-white">
                  Visual da marca
                </h3>
              </div>
            </div>

            <div className="glass-soft rounded-[24px] p-5">
              <div className="text-sm text-zinc-500">Empresa</div>
              <div className="mt-1 text-lg font-bold text-white">
                {formData.name || 'Sua empresa'}
              </div>

              <div className="mt-5 text-sm text-zinc-500">Nicho</div>
              <div className="mt-1 text-base font-semibold text-white">
                {formData.niche || 'Seu nicho'}
              </div>

              <div className="mt-5 text-sm text-zinc-500">Tom</div>
              <div className="mt-1 text-base font-semibold text-white">
                {formData.tone}
              </div>
            </div>
          </div>

          <div className="glass-card rounded-[28px] p-6">
            <div className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-zinc-500">
              impacto
            </div>

            <h3 className="text-xl font-bold text-white">
              O que isso melhora?
            </h3>

            <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-400">
              <p>• Deixa os criativos mais coerentes com sua empresa</p>
              <p>• Ajuda a IA a entender melhor seu posicionamento</p>
              <p>• Melhora consistência visual e textual</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}