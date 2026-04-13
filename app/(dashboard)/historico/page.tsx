'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  History,
  Search,
  Sparkles,
  Image as ImageIcon,
  Copy,
  Download,
  Loader2,
  Hash,
  Trash2,
  CalendarDays,
  Filter,
  Check,
} from 'lucide-react'
import { toast } from 'sonner'
import { PopupDialog } from '@/components/ui/PopupDialog'

type CreativeItem = {
  id: string
  prompt: string
  aiPrompt?: string | null
  imageUrl: string
  caption: string
  hashtags: string[]
  network: string
  style: string
  format: string
  creditsUsed?: number
  createdAt?: string
}

export default function HistoricoPage() {
  const [items, setItems] = useState<CreativeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [networkFilter, setNetworkFilter] = useState('ALL')
  const [selectedItem, setSelectedItem] = useState<CreativeItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<CreativeItem | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    loadHistory()
  }, [])

  async function loadHistory() {
    setLoading(true)
    try {
      const res = await fetch('/api/history', {
        cache: 'no-store',
      })

      if (!res.ok) {
        throw new Error('Falha ao carregar histórico')
      }

      const data = await res.json()

      const list = Array.isArray(data?.creatives)
        ? data.creatives
        : Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data)
        ? data
        : []

      setItems(list)
    } catch {
      toast.error('Não foi possível carregar o histórico.')
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const networks = useMemo(() => {
    const unique = [...new Set(items.map((item) => item.network).filter(Boolean))]
    return ['ALL', ...unique]
  }, [items])

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesNetwork =
        networkFilter === 'ALL' ? true : item.network === networkFilter

      const content = `${item.prompt} ${item.caption} ${item.network} ${item.style} ${item.format} ${item.hashtags?.join(' ')}`
        .toLowerCase()

      const matchesSearch = content.includes(search.toLowerCase())

      return matchesNetwork && matchesSearch
    })
  }, [items, search, networkFilter])

  function formatDate(date?: string) {
    if (!date) return 'Sem data'
    try {
      return new Date(date).toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
      })
    } catch {
      return date
    }
  }

  async function handleCopy(item: CreativeItem) {
    const fullText = `${item.caption}\n\n${(item.hashtags || []).join(' ')}`
    try {
      await navigator.clipboard.writeText(fullText)
      setCopiedId(item.id)
      toast.success('Legenda e hashtags copiadas!')
      setTimeout(() => setCopiedId(null), 1800)
    } catch {
      toast.error('Não foi possível copiar agora.')
    }
  }

  async function handleDownload(item: CreativeItem) {
    try {
      const response = await fetch(item.imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `postzy-historico-${item.id}.webp`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success('Imagem baixada com sucesso!')
    } catch {
      toast.error('Não foi possível baixar a imagem.')
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return

    const toastId = toast.loading('Removendo item do histórico...')

    try {
      const res = await fetch(`/api/history/${deleteTarget.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Falha ao excluir')
      }

      setItems((prev) => prev.filter((item) => item.id !== deleteTarget.id))
      toast.success('Item removido com sucesso!', { id: toastId })

      if (selectedItem?.id === deleteTarget.id) {
        setSelectedItem(null)
      }

      setDeleteTarget(null)
    } catch {
      toast.error('Não foi possível remover este item.', { id: toastId })
    }
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
            <History size={14} />
            histórico criativo
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
            Seus criativos salvos
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400 md:text-base">
            Veja tudo o que já foi gerado, filtre por rede social, copie as legendas e baixe novamente suas imagens.
          </p>
        </div>

        <button
          onClick={loadHistory}
          className="secondary-button w-full justify-center py-3 text-sm md:w-auto"
        >
          <Sparkles size={16} />
          Atualizar histórico
        </button>
      </motion.div>

      <div className="mb-8 grid gap-4 md:grid-cols-[1fr,220px]">
        <div className="glass-panel rounded-[24px] p-3">
          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="text"
              placeholder="Buscar por prompt, legenda, hashtags, estilo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-glass pl-11"
            />
          </div>
        </div>

        <div className="glass-panel rounded-[24px] p-3">
          <div className="relative">
            <Filter
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <select
              value={networkFilter}
              onChange={(e) => setNetworkFilter(e.target.value)}
              className="input-glass pl-11"
            >
              {networks.map((network) => (
                <option key={network} value={network}>
                  {network === 'ALL' ? 'Todas as redes' : network}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="glass-panel flex min-h-[420px] items-center justify-center rounded-[32px]">
          <div className="text-center">
            <Loader2 size={30} className="mx-auto animate-spin text-[#ff8aa8]" />
            <p className="mt-4 text-sm text-zinc-400">Carregando histórico...</p>
          </div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="glass-panel flex min-h-[460px] flex-col items-center justify-center rounded-[32px] px-6 text-center">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-[28px] bg-white/6 text-[#ff8aa8]">
            <ImageIcon size={34} />
          </div>
          <h2 className="text-2xl font-bold text-white">
            Nenhum criativo encontrado
          </h2>
          <p className="mt-3 max-w-md text-sm leading-7 text-zinc-400">
            Gere seu primeiro criativo ou ajuste os filtros para encontrar itens já salvos.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ delay: index * 0.03 }}
                className="glass-card overflow-hidden rounded-[30px]"
              >
                <div className="relative">
                  <img
                    src={item.imageUrl}
                    alt={item.prompt}
                    className="aspect-[4/5] w-full object-cover"
                  />

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[11px] font-bold text-white">
                        {item.network}
                      </span>
                      <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[11px] font-bold text-zinc-200">
                        {item.style}
                      </span>
                      <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[11px] font-bold text-zinc-200">
                        {item.format}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="mb-3 flex items-center gap-2 text-xs text-zinc-500">
                    <CalendarDays size={14} />
                    {formatDate(item.createdAt)}
                  </div>

                  <h3 className="line-clamp-2 text-lg font-bold text-white">
                    {item.prompt}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-zinc-400">
                    {item.caption}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(item.hashtags || []).slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-[11px] text-zinc-300"
                      >
                        {tag}
                      </span>
                    ))}
                    {(item.hashtags || []).length > 4 ? (
                      <span className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-[11px] text-zinc-400">
                        +{item.hashtags.length - 4}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="secondary-button w-full justify-center py-3 text-sm"
                    >
                      Ver mais
                    </button>

                    <button
                      onClick={() => handleCopy(item)}
                      className="primary-button w-full justify-center py-3 text-sm"
                    >
                      {copiedId === item.id ? <Check size={16} /> : <Copy size={16} />}
                      {copiedId === item.id ? 'Copiado' : 'Copiar'}
                    </button>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleDownload(item)}
                      className="secondary-button w-full justify-center py-3 text-sm"
                    >
                      <Download size={16} />
                      Baixar
                    </button>

                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="secondary-button w-full justify-center py-3 text-sm text-rose-300 hover:text-rose-200"
                    >
                      <Trash2 size={16} />
                      Excluir
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <PopupDialog
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.prompt || 'Detalhes do criativo'}
        description={selectedItem ? `Rede: ${selectedItem.network} • Estilo: ${selectedItem.style} • Formato: ${selectedItem.format}` : ''}
        footer={
          selectedItem ? (
            <>
              <button
                onClick={() => handleDownload(selectedItem)}
                className="secondary-button px-4 py-2.5 text-sm"
              >
                <Download size={16} />
                Baixar imagem
              </button>
              <button
                onClick={() => handleCopy(selectedItem)}
                className="primary-button px-4 py-2.5 text-sm"
              >
                <Copy size={16} />
                Copiar legenda
              </button>
            </>
          ) : null
        }
      >
        {selectedItem ? (
          <div className="space-y-5">
            <div className="overflow-hidden rounded-[22px] border border-white/10 bg-black/25">
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.prompt}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>

            <div className="glass-soft rounded-[22px] p-4">
              <div className="mb-2 text-sm font-semibold text-white">Legenda</div>
              <p className="text-sm leading-7 text-zinc-300">{selectedItem.caption}</p>
            </div>

            <div className="glass-soft rounded-[22px] p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                <Hash size={15} className="text-[#c9b7ff]" />
                Hashtags
              </div>

              <div className="flex flex-wrap gap-2">
                {(selectedItem.hashtags || []).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-xs text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {selectedItem.aiPrompt ? (
              <div className="glass-soft rounded-[22px] p-4">
                <div className="mb-2 text-sm font-semibold text-white">Prompt interno da IA</div>
                <p className="text-sm leading-7 text-zinc-400">{selectedItem.aiPrompt}</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </PopupDialog>

      <PopupDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Excluir criativo?"
        description="Essa ação remove o item do histórico. Se a API ainda não tiver a rota DELETE implementada, basta esconder o botão por enquanto."
        footer={
          <>
            <button
              onClick={() => setDeleteTarget(null)}
              className="secondary-button px-4 py-2.5 text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              className="primary-button px-4 py-2.5 text-sm"
            >
              Confirmar exclusão
            </button>
          </>
        }
      />
    </div>
  )
}