'use client'

import { motion } from 'framer-motion'
import {
  Coins,
  Zap,
  Crown,
  Rocket,
  Sparkles,
  CheckCircle2,
  CreditCard,
} from 'lucide-react'
import { toast } from 'sonner'

const plans = [
  {
    id: 'basic',
    name: 'Starter',
    credits: 10,
    price: 'R$ 19,90',
    icon: Coins,
    highlight: false,
    description: 'Ideal para quem está começando e quer testar o fluxo.',
    features: [
      '10 créditos para geração',
      'Uso imediato no painel',
      'Ideal para testes e pequenos projetos',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 30,
    price: 'R$ 49,90',
    icon: Zap,
    highlight: true,
    description: 'Melhor custo-benefício para gerar com frequência.',
    features: [
      '30 créditos para geração',
      'Mais economia por criativo',
      'Ótimo para uso recorrente',
    ],
  },
  {
    id: 'ultra',
    name: 'Ultra',
    credits: 100,
    price: 'R$ 129,90',
    icon: Crown,
    highlight: false,
    description: 'Para quem quer escalar produção de conteúdo.',
    features: [
      '100 créditos para geração',
      'Melhor volume',
      'Perfeito para operação contínua',
    ],
  },
]

export default function CreditosPage() {
  async function handleCheckout(planId: string) {
    const toastId = toast.loading('Preparando checkout...')

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data?.error || 'Não foi possível iniciar o checkout.', {
          id: toastId,
        })
        return
      }

      if (data?.url) {
        toast.success('Redirecionando para pagamento...', { id: toastId })
        window.location.href = data.url
        return
      }

      toast.error('Checkout retornou sem URL.', { id: toastId })
    } catch {
      toast.error('Erro de conexão ao abrir checkout.', { id: toastId })
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
            <Sparkles size={14} />
            créditos e upgrade
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
            Recarregue seus créditos
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400 md:text-base">
            Escolha um pacote para continuar gerando criativos com imagem,
            legenda e hashtags no seu painel premium.
          </p>
        </div>

        <div className="glass-soft rounded-2xl px-4 py-3">
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
            pagamento
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-white">
            <CreditCard size={15} className="text-[#ff8aa8]" />
            Checkout integrado
          </div>
        </div>
      </motion.div>

      <div className="mb-10 grid gap-6 md:grid-cols-3">
        {plans.map((plan, index) => {
          const Icon = plan.icon

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className={`relative rounded-[32px] p-[1px] ${
                plan.highlight
                  ? 'bg-gradient-to-br from-[#ff3d6e] via-[#ff8c42] to-[#9b6bff]'
                  : 'bg-white/10'
              }`}
            >
              <div className="glass-panel h-full rounded-[31px] p-6">
                {plan.highlight ? (
                  <div className="mb-4 inline-flex rounded-full border border-[#ff8aa8]/20 bg-[#ff3d6e]/12 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#ff9cb5]">
                    mais escolhido
                  </div>
                ) : null}

                <div className="mb-5 flex items-center gap-3">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                      plan.highlight
                        ? 'bg-[#ff3d6e]/15 text-[#ff9cb5]'
                        : 'bg-white/8 text-zinc-200'
                    }`}
                  >
                    <Icon size={24} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-black text-white">
                      {plan.name}
                    </h2>
                    <p className="text-sm text-zinc-400">{plan.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-4xl font-black tracking-tight text-white">
                    {plan.price}
                  </div>
                  <div className="mt-2 text-sm text-zinc-400">
                    {plan.credits} créditos inclusos
                  </div>
                </div>

                <div className="mb-6 space-y-3">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-3 text-sm text-zinc-300"
                    >
                      <CheckCircle2
                        size={16}
                        className="mt-0.5 shrink-0 text-[#7ef0b0]"
                      />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleCheckout(plan.id)}
                  className={`w-full justify-center py-3.5 text-sm ${
                    plan.highlight ? 'primary-button' : 'secondary-button'
                  }`}
                >
                  <Rocket size={16} />
                  Comprar agora
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="glass-panel rounded-[32px] p-6 md:p-8"
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#9b6bff]/14 text-[#d2c3ff]">
            <Zap size={24} />
          </div>

          <div>
            <h3 className="text-2xl font-black text-white">
              Como funcionam os créditos?
            </h3>
            <p className="text-sm text-zinc-400">
              Simples, direto e pensado para escalar.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="glass-soft rounded-[24px] p-5">
            <div className="text-sm font-bold text-white">1 crédito = 1 geração</div>
            <p className="mt-2 text-sm leading-7 text-zinc-400">
              Cada novo criativo consome um crédito no momento da geração.
            </p>
          </div>

          <div className="glass-soft rounded-[24px] p-5">
            <div className="text-sm font-bold text-white">Recarga imediata</div>
            <p className="mt-2 text-sm leading-7 text-zinc-400">
              Após a confirmação do pagamento, os créditos entram na conta.
            </p>
          </div>

          <div className="glass-soft rounded-[24px] p-5">
            <div className="text-sm font-bold text-white">Mais volume, mais velocidade</div>
            <p className="mt-2 text-sm leading-7 text-zinc-400">
              Ideal para manter constância de postagem e produção de campanha.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}