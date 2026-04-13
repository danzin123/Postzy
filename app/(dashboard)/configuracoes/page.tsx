'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Settings,
  User,
  Mail,
  Bell,
  Shield,
  Sparkles,
  Save,
  Loader2,
  Palette,
} from 'lucide-react'
import { toast } from 'sonner'
import { createBrowserClient } from '@supabase/ssr'

export default function ConfiguracoesPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    notifications: true,
    themeColor: '#ff3d6e',
  })

  useEffect(() => {
    async function loadUser() {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        if (error) {
          throw error
        }

        if (user) {
          setFormData((prev) => ({
            ...prev,
            name:
              user.user_metadata?.full_name ||
              user.user_metadata?.name ||
              '',
            email: user.email || '',
          }))
        }
      } catch {
        toast.error('Não foi possível carregar as configurações.')
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const toastId = toast.loading('Salvando configurações...')

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.name,
          theme_color: formData.themeColor,
          notifications_enabled: formData.notifications,
        },
      })

      if (error) {
        toast.error(error.message || 'Erro ao salvar configurações.', {
          id: toastId,
        })
        setSaving(false)
        return
      }

      toast.success('Configurações salvas com sucesso!', {
        id: toastId,
      })
    } catch {
      toast.error('Erro de conexão ao salvar.', { id: toastId })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="page-shell flex min-h-[80vh] items-center justify-center p-6">
        <div className="glass-panel rounded-[28px] px-8 py-10 text-center">
          <Loader2 size={28} className="mx-auto animate-spin text-[#ff8aa8]" />
          <p className="mt-4 text-sm text-zinc-400">
            Carregando configurações...
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
            ajustes do sistema
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
            Configurações
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400 md:text-base">
            Gerencie seus dados básicos, preferências visuais e opções da conta.
          </p>
        </div>

        <div className="glass-soft rounded-2xl px-4 py-3">
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
            status
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-white">
            <Shield size={15} className="text-[#7ef0b0]" />
            Conta protegida
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.8fr]">
        <motion.form
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSave}
          className="glass-panel gradient-border rounded-[32px] p-6 sm:p-8"
        >
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff3d6e]/15 text-[#ff9cb5]">
              <Settings size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-black text-white">
                Preferências da conta
              </h2>
              <p className="text-sm text-zinc-400">
                Ajuste suas informações principais.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
                Nome
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />
                <input
                  type="text"
                  className="input-glass pl-11"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
                E-mail
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />
                <input
                  type="email"
                  className="input-glass pl-11 opacity-80"
                  value={formData.email}
                  disabled
                />
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                O e-mail é exibido para referência da conta conectada.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
                Cor de destaque
              </label>

              <div className="glass-soft flex items-center gap-3 rounded-2xl border border-white/10 px-3 py-3">
                <Palette size={18} className="text-zinc-500" />
                <input
                  type="color"
                  value={formData.themeColor}
                  onChange={(e) =>
                    setFormData({ ...formData, themeColor: e.target.value })
                  }
                  className="h-10 w-14 cursor-pointer rounded-lg border-none bg-transparent"
                />
                <input
                  type="text"
                  value={formData.themeColor}
                  onChange={(e) =>
                    setFormData({ ...formData, themeColor: e.target.value })
                  }
                  className="input-glass h-10 border-none bg-transparent px-0 py-0 shadow-none focus:shadow-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
                Notificações
              </label>

              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    notifications: !prev.notifications,
                  }))
                }
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition-all ${
                  formData.notifications
                    ? 'border-[#7ef0b0]/25 bg-[#7ef0b0]/10 text-white'
                    : 'border-white/10 bg-white/5 text-zinc-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Bell
                    size={18}
                    className={
                      formData.notifications
                        ? 'text-[#7ef0b0]'
                        : 'text-zinc-500'
                    }
                  />
                  <div>
                    <div className="text-sm font-semibold">
                      {formData.notifications ? 'Ativadas' : 'Desativadas'}
                    </div>
                    <div className="text-xs opacity-80">
                      Preferência salva no perfil
                    </div>
                  </div>
                </div>

                <div
                  className={`h-6 w-11 rounded-full p-1 transition-all ${
                    formData.notifications
                      ? 'bg-[#7ef0b0]/30'
                      : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`h-4 w-4 rounded-full bg-white transition-all ${
                      formData.notifications ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={saving}
              className="primary-button w-full justify-center py-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Salvar configurações
                </>
              )}
            </button>
          </div>
        </motion.form>

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
                  background: formData.themeColor || '#ff3d6e',
                }}
              />
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                  preview
                </div>
                <h3 className="text-xl font-black text-white">
                  Aparência escolhida
                </h3>
              </div>
            </div>

            <div className="glass-soft rounded-[24px] p-5">
              <div className="text-sm text-zinc-500">Nome</div>
              <div className="mt-1 text-lg font-bold text-white">
                {formData.name || 'Seu nome'}
              </div>

              <div className="mt-5 text-sm text-zinc-500">Notificações</div>
              <div className="mt-1 text-base font-semibold text-white">
                {formData.notifications ? 'Ativadas' : 'Desativadas'}
              </div>

              <div className="mt-5 text-sm text-zinc-500">Cor</div>
              <div className="mt-1 text-base font-semibold text-white">
                {formData.themeColor}
              </div>
            </div>
          </div>

          <div className="glass-card rounded-[28px] p-6">
            <div className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-zinc-500">
              observações
            </div>

            <h3 className="text-xl font-bold text-white">
              Sobre essa tela
            </h3>

            <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-400">
              <p>• O nome é salvo no perfil autenticado</p>
              <p>• O e-mail é apenas informativo nesta versão</p>
              <p>• A cor pode ser usada depois para personalizar ainda mais o app</p>
              <p>• As notificações ficam preparadas para expansão futura</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}