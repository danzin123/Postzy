'use client'

import { useState } from 'react'
import {
  Wand2,
  Copy,
  Download,
  Loader2,
  Sparkles,
  Image as ImageIcon,
  Hash,
  AlignLeft,
  Check,
  Info,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface GeneratorOutput {
  id: string
  imageUrl: string
  caption: string
  hashtags: string[]
  creditsRemaining: number
}

const NETWORKS = [
  { id: 'INSTAGRAM', label: 'Instagram', icon: '📸' },
  { id: 'FACEBOOK', label: 'Facebook', icon: '📘' },
  { id: 'TIKTOK', label: 'TikTok', icon: '🎵' },
  { id: 'LINKEDIN', label: 'LinkedIn', icon: '💼' },
  { id: 'TWITTER', label: 'Twitter', icon: '🐦' },
]

const STYLES = ['moderno', 'minimalista', 'bold', 'colorido', 'elegante']
const FORMATS = [
  { id: 'SQUARE', label: 'Feed 1:1' },
  { id: 'PORTRAIT', label: 'Feed 4:5' },
  { id: 'STORY', label: 'Story 9:16' },
  { id: 'LANDSCAPE', label: 'Horizontal 16:9' },
]

export function GeneratorForm() {
  const [prompt, setPrompt] = useState('')
  const [network, setNetwork] = useState('INSTAGRAM')
  const [style, setStyle] = useState('moderno')
  const [format, setFormat] = useState('SQUARE')
  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState<GeneratorOutput | null>(null)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim() || prompt.trim().length < 10) {
      toast.error('Descreva melhor o que você quer. Use pelo menos 10 caracteres.')
      return
    }

    setLoading(true)
    setOutput(null)
    const toastId = toast.loading('Gerando criativo com a nova experiência visual...')

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, network, style, format }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Erro ao gerar criativo.', { id: toastId })
        setLoading(false)
        return
      }

      setOutput(data.creative)
      toast.success('Criativo gerado com sucesso!', {
        id: toastId,
        description: `Créditos restantes: ${data.creative.creditsRemaining}`,
      })
    } catch {
      toast.error('Erro de conexão. Tente novamente.', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!output) return

    try {
      const response = await fetch(output.imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `postzy-${output.id}.webp`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success('Imagem baixada com sucesso!')
    } catch {
      toast.error('Não foi possível baixar a imagem agora.')
    }
  }

  const handleCopyCaption = async () => {
    if (!output) return
    const fullText = `${output.caption}\n\n${output.hashtags.join(' ')}`
    await navigator.clipboard.writeText(fullText)
    setCopied(true)
    toast.success('Legenda e hashtags copiadas!')
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.02fr,1.1fr]">
      <section className="glass-card rounded-[32px] p-6 sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="badge-pill mb-4">
              <Sparkles size={14} /> gerador premium
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Crie posts com estética refinada.</h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-400">
              Escolha a rede, o estilo e o formato. A interface inteira agora responde com brilho, vidro e feedback visual.
            </p>
          </div>
          <button type="button" onClick={() => toast.info('Dica: prompts com objetivo, oferta e emoção costumam render melhor.')} className="secondary-button h-fit px-4 py-3 text-sm">
            <Info size={16} /> Dica
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">Descreva seu criativo</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Quero um criativo para atrair alunos para minha academia com promoção de R$ 99,90 por mês. Transmita energia, urgência e um visual premium."
              className="input-glass min-h-[150px] resize-none"
              disabled={loading}
            />
          </div>

          <div>
            <label className="mb-3 block text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">Rede social</label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {NETWORKS.map((net) => (
                <button
                  key={net.id}
                  onClick={() => setNetwork(net.id)}
                  disabled={loading}
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-all ${
                    network === net.id
                      ? 'border-[#ff3d6e]/35 bg-[#ff3d6e]/10 text-white shadow-[0_0_0_1px_rgba(255,61,110,0.15)]'
                      : 'border-white/10 bg-white/5 text-zinc-400 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  <span className="mr-2">{net.icon}</span>
                  {net.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-3 block text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">Estilo visual</label>
              <div className="flex flex-wrap gap-2">
                {STYLES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStyle(s)}
                    disabled={loading}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold capitalize transition-all ${
                      style === s
                        ? 'border-[#9b6bff]/35 bg-[#9b6bff]/12 text-white'
                        : 'border-white/10 bg-white/5 text-zinc-400 hover:bg-white/8 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-3 block text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">Formato</label>
              <div className="space-y-2">
                {FORMATS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFormat(f.id)}
                    disabled={loading}
                    className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-all ${
                      format === f.id
                        ? 'border-white/18 bg-white/10 text-white'
                        : 'border-white/10 bg-white/5 text-zinc-400 hover:bg-white/8 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button onClick={handleGenerate} disabled={loading} className="primary-button w-full py-4 text-sm disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <><Wand2 size={18} /> Gerar criativo agora</>}
          </button>
        </div>
      </section>

      <section className="glass-card rounded-[32px] p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">resultado</div>
            <h2 className="mt-2 text-2xl font-black text-white">Preview final</h2>
          </div>
          {output ? (
            <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
              pronto
            </div>
          ) : null}
        </div>

        <AnimatePresence mode="wait">
          {output ? (
            <motion.div
              key="output"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5"
            >
              <div className="overflow-hidden rounded-[24px] border border-white/10 bg-black/30">
                <img src={output.imageUrl} alt={output.caption} className="aspect-[4/5] w-full object-cover" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <button onClick={handleDownload} className="secondary-button w-full py-3 text-sm">
                  <Download size={16} /> Baixar imagem
                </button>
                <button onClick={handleCopyCaption} className="primary-button w-full py-3 text-sm">
                  {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copiado' : 'Copiar legenda'}
                </button>
              </div>

              <div className="glass-soft rounded-[24px] p-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                  <AlignLeft size={16} className="text-[#ff8aa8]" /> Legenda
                </div>
                <p className="text-sm leading-7 text-zinc-300">{output.caption}</p>
              </div>

              <div className="glass-soft rounded-[24px] p-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                  <Hash size={16} className="text-[#c9b7ff]" /> Hashtags
                </div>
                <div className="flex flex-wrap gap-2">
                  {output.hashtags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex min-h-[620px] flex-col items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-black/20 px-6 text-center"
            >
              <div className="mb-5 flex h-18 w-18 items-center justify-center rounded-[28px] bg-white/6 text-[#ff8aa8]">
                <ImageIcon size={30} />
              </div>
              <h3 className="text-2xl font-bold text-white">Seu preview vai aparecer aqui</h3>
              <p className="mt-3 max-w-md text-sm leading-7 text-zinc-400">
                Depois da geração, a imagem, a legenda e as hashtags aparecem com animação e ações de download e cópia.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  )
}