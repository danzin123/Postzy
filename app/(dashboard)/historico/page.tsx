// app/(dashboard)/historico/page.tsx
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function HistoricoPage() {
  const cookieStore = await cookies()
  
  // 1. Autenticação
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() } } }
  )

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  // 2. Busca todos os criativos do usuário, dos mais recentes para os mais antigos
  const creatives = await prisma.creative.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Meu Histórico</h1>
        <p className="text-gray-400">Reveja e gerencie todos os criativos gerados pela IA.</p>
      </div>

      {creatives.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#13131a] rounded-2xl border border-gray-800">
          <p className="text-gray-400 text-lg">Você ainda não gerou nenhum criativo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {creatives.map((creative) => (
            <div key={creative.id} className="bg-[#13131a] border border-gray-800 rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02]">
              {/* Área da Imagem */}
              <div className="relative aspect-square bg-[#0a0a0f] border-b border-gray-800 flex items-center justify-center">
                <img
                  src={creative.imageUrl}
                  alt={creative.prompt}
                  className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>

              {/* Área de Conteúdo */}
              <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-[#ff3d6e] uppercase tracking-wider bg-[#ff3d6e]/10 px-3 py-1 rounded-full">
                    {creative.network}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {new Date(creative.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                
                <p className="text-sm text-gray-300 mb-4 line-clamp-4 leading-relaxed">
                  {creative.caption}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {creative.hashtags.map((tag: string) => (
                    <span key={tag} className="text-xs text-gray-400 bg-gray-800/50 border border-gray-700 px-2 py-1 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}