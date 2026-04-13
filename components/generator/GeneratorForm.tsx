// components/generator/GeneratorForm.tsx
'use client'

import { useState } from 'react'
import { 
  Wand2, 
  Image as ImageIcon, 
  AlignLeft, 
  Hash, 
  Download, 
  Copy, 
  AlertCircle, 
  CheckCircle2,
  Loader2,
  Zap
} from 'lucide-react'

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
  { id: 'SQUARE', label: 'Feed (1:1)' },
  { id: 'PORTRAIT', label: 'Feed Vertical (4:5)' },
  { id: 'STORY', label: 'Story/Reels (9:16)' },
  { id: 'LANDSCAPE', label: 'Horizontal (16:9)' }
]

export function GeneratorForm() {
  const [prompt, setPrompt] = useState('')
  const [network, setNetwork] = useState('INSTAGRAM')
  const [style, setStyle] = useState('moderno')
  const [format, setFormat] = useState('SQUARE')
  
  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState<GeneratorOutput | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim() || prompt.length < 10) {
      setError('Descreva melhor o que você quer (mínimo de 10 caracteres).')
      return
    }

    setLoading(true)
    setError(null)
    setOutput(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, network, style, format }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.code === 'NO_CREDITS') {
          setError('Você não tem créditos suficientes. Adquira mais créditos para continuar.')
        } else {
          setError(data.error || 'Erro ao gerar criativo. Tente novamente.')
        }
        return
      }

      setOutput(data.creative)
    } catch (err) {
      setError('Erro de conexão. Verifique sua internet e tente novamente.')
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
    } catch (err) {
      console.error('Erro ao baixar imagem', err)
    }
  }

  const handleCopyCaption = () => {
    if (!output) return
    const fullText = `${output.caption}\n\n${output.hashtags.join(' ')}`
    navigator.clipboard.writeText(fullText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl mx-auto p-4 md:p-8 bg-[#0a0a0f] min-h-screen text-[#f0f0f5] font-['DM_Sans']">
      
      {/* LEFT COLUMN - CONTROLS */}
      <div className="bg-[#111118] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold font-['Syne'] mb-2 flex items-center gap-2">
            <Wand2 className="text-[#ff3d6e]" />
            Criar novo post
          </h2>
          <p className="text-[#7a7a99] text-sm">
            Descreva seu objetivo e deixe a IA fazer o trabalho pesado.
          </p>
        </div>

        {/* PROMPT INPUT */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#7a7a99]">
            Descreva seu criativo
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ex: Quero um criativo para atrair alunos para minha academia com promoção de R$ 99,90 por mês. Transmita energia e motivação!"
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-[#f0f0f5] h-32 resize-none focus:outline-none focus:border-[#ff3d6e]/50 transition-colors"
            disabled={loading}
          />
        </div>

        {/* NETWORK SELECTION */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#7a7a99]">
            Rede Social
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {NETWORKS.map((net) => (
              <button
                key={net.id}
                onClick={() => setNetwork(net.id)}
                disabled={loading}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm transition-all ${
                  network === net.id
                    ? 'bg-[#ff3d6e]/10 border-[#ff3d6e]/40 text-white'
                    : 'bg-white/5 border-white/10 text-[#7a7a99] hover:bg-white/10'
                }`}
              >
                <span>{net.icon}</span> {net.label}
              </button>
            ))}
          </div>
        </div>

        {/* STYLE & FORMAT SELECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#7a7a99]">
              Estilo Visual
            </label>
            <div className="flex flex-wrap gap-2">
              {STYLES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  disabled={loading}
                  className={`px-3 py-1.5 rounded-lg border text-xs capitalize transition-all ${
                    style === s
                      ? 'bg-[#ff3d6e]/10 border-[#ff3d6e]/40 text-[#ff3d6e]'
                      : 'bg-white/5 border-white/10 text-[#7a7a99] hover:bg-white/10'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#7a7a99]">
              Formato
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              disabled={loading}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-[#f0f0f5] focus:outline-none focus:border-[#ff3d6e]/50 appearance-none"
            >
              {FORMATS.map((f) => (
                <option key={f.id} value={f.id} className="bg-[#111118]">
                  {f.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <div className="mt-auto pt-4 border-t border-white/10">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full relative group overflow-hidden bg-gradient-to-r from-[#ff3d6e] to-[#ff6b35] text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(255,61,110,0.3)] hover:shadow-[0_6px_30px_rgba(255,61,110,0.5)] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Gerando mágica...
              </>
            ) : (
              <>
                <Wand2 size={20} />
                Gerar Criativo Completo
              </>
            )}
          </button>
          <div className="flex items-center justify-center gap-1 mt-3 text-xs text-[#7a7a99]">
            <Zap size={14} className="text-[#ff8c42]" />
            Custa 1 crédito
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN - OUTPUT */}
      <div className="bg-[#111118] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col">
        {!output && !loading && (
          <div className="flex-1 flex flex-col items-center justify-center text-[#7a7a99] opacity-50 min-h-[400px]">
            <ImageIcon size={64} className="mb-4 opacity-50" />
            <p className="font-['Syne'] text-lg">Seu resultado aparecerá aqui</p>
          </div>
        )}

        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center text-[#ff3d6e] min-h-[400px]">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-[#ff3d6e]/20 border-t-[#ff3d6e] rounded-full animate-spin"></div>
            </div>
            <p className="mt-6 font-medium animate-pulse text-[#f0f0f5]">Processando IA de imagem e texto...</p>
          </div>
        )}

        {output && !loading && (
          <div className="flex flex-col gap-6 animate-in fade-in zoom-in duration-500">
            {/* IMAGE RESULT */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#7a7a99] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff3d6e]"></span>
                  Imagem Gerada
                </label>
                <button 
                  onClick={handleDownload}
                  className="text-xs flex items-center gap-1 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg transition-colors text-[#f0f0f5]"
                >
                  <Download size={14} />
                  Baixar Imagem
                </button>
              </div>
              
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black group aspect-square flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={output.imageUrl} 
                  alt="Criativo Gerado" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* CAPTION RESULT */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#7a7a99] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a259ff]"></span>
                  Copy Otimizada
                </label>
                <button 
                  onClick={handleCopyCaption}
                  className="text-xs flex items-center gap-1 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg transition-colors text-[#f0f0f5]"
                >
                  {copied ? <CheckCircle2 size={14} className="text-green-400" /> : <Copy size={14} />}
                  {copied ? 'Copiado!' : 'Copiar Texto'}
                </button>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 relative">
                <AlignLeft className="absolute top-4 right-4 text-white/10" size={24} />
                <p className="text-[#f0f0f5] text-sm whitespace-pre-wrap leading-relaxed pr-8">
                  {output.caption}
                </p>
                
                <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-2">
                  {output.hashtags.map((tag, i) => (
                    <span key={i} className="text-[#a259ff] text-xs font-medium bg-[#a259ff]/10 px-2 py-1 rounded-md flex items-center gap-1">
                      <Hash size={10} />
                      {tag.replace('#', '')}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* BALANCE ALERT */}
            <div className="text-xs text-center text-[#7a7a99] mt-2">
              Saldo atual: <strong className="text-[#f0f0f5]">{output.creditsRemaining} créditos</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}