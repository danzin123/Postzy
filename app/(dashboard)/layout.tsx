import { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { ensureUserAndCredits } from '@/lib/ensure-user'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const cookieStore = await cookies()

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

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const { credit } = await ensureUserAndCredits(session.user)

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Sidebar
        userEmail={session.user.email ?? 'Sem e-mail'}
        credits={credit.balance}
      />
      <main className="lg:ml-64 min-h-screen">{children}</main>
    </div>
  )
}