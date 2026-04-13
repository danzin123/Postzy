import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { ensureUserAndCredits } from '@/lib/ensure-user'

const BrandSchema = z.object({
  name: z.string().min(2, 'O nome precisa ter pelo menos 2 caracteres.'),
  niche: z.string().min(2, 'O nicho precisa ter pelo menos 2 caracteres.'),
  tone: z.string().min(2, 'O tom precisa ter pelo menos 2 caracteres.'),
  primaryColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/, 'Cor HEX inválida.'),
})

async function getSession() {
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

  return supabase.auth.getSession()
}

export async function GET() {
  try {
    const {
      data: { session },
    } = await getSession()

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    await ensureUserAndCredits(session.user)

    const brand = await prisma.brand.findUnique({
      where: { userId: session.user.id },
    })

    return NextResponse.json({ brand })
  } catch (error: any) {
    console.error('[BRAND_GET_ERROR]', error)
    return NextResponse.json(
      { error: 'Erro ao buscar marca.' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      data: { session },
    } = await getSession()

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    await ensureUserAndCredits(session.user)

    const body = await req.json()
    const parsed = BrandSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Dados inválidos.' },
        { status: 400 }
      )
    }

    const brand = await prisma.brand.upsert({
      where: { userId: session.user.id },
      update: parsed.data,
      create: {
        userId: session.user.id,
        ...parsed.data,
      },
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