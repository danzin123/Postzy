// app/api/brand/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validação rigorosa dos dados
const BrandSchema = z.object({
  name: z.string().min(2),
  niche: z.string().min(2),
  tone: z.string().min(2),
  primaryColor: z.string().min(4),
})

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() } } }
    )

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = BrandSchema.parse(body)

    // UPSERT: Evita duplicação e garante que o usuário só tenha UMA marca configurada
    const brand = await prisma.brand.upsert({
      where: { userId: session.user.id },
      update: {
        name: parsed.name,
        niche: parsed.niche,
        tone: parsed.tone,
        primaryColor: parsed.primaryColor,
      },
      create: {
        userId: session.user.id,
        name: parsed.name,
        niche: parsed.niche,
        tone: parsed.tone,
        primaryColor: parsed.primaryColor,
      }
    })

    return NextResponse.json({ success: true, brand })
  } catch (error: any) {
    console.error('[BRAND_POST_ERROR]', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao salvar marca' }, 
      { status: 500 }
    )
  }
}