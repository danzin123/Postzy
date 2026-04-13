// app/(dashboard)/layout.tsx
import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { Sidebar } from '@/components/dashboard/Sidebar'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // ATENÇÃO: No Next.js 15+, cookies() precisa do 'await'
  const cookieStore = await cookies()

  // Inicializando o Supabase com o pacote moderno (SSR)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Se não estiver logado, chuta para o login
  if (!session) {
    redirect('/login')
  }

  // Busca o usuário no banco via Prisma
  let user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { credits: true },
  })

  // Cria o usuário com 5 créditos grátis se for o primeiro acesso
  if (!user) {
    user = await prisma.user.create({
      data: {
        id: session.user.id,
        email: session.user.email!,
        name: session.user.user_metadata?.full_name || null,
        avatarUrl: session.user.user_metadata?.avatar_url || null,
        credits: {
          create: { balance: 5 }
        }
      },
      include: { credits: true }
    })
  }

  const creditBalance = user.credits?.balance || 0

  return (
    <div className="flex h-screen bg-[#0a0a0f] overflow-hidden selection:bg-[#ff3d6e]/30 selection:text-white">
      <Sidebar userEmail={user.email} credits={creditBalance} />
      <main className="flex-1 ml-64 h-full overflow-y-auto">
        {children}
      </main>
    </div>
  )
}