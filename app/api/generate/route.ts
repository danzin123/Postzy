import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { prisma } from '@/lib/prisma'
import { getRedis } from '@/lib/redis'
import { ensureUserAndCredits } from '@/lib/ensure-user'
import { z } from 'zod'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

const GenerateSchema = z.object({
  prompt: z.string().min(10).max(500),
  network: z.enum(['INSTAGRAM', 'FACEBOOK', 'TIKTOK', 'LINKEDIN', 'TWITTER']),
  style: z.enum(['moderno', 'minimalista', 'bold', 'colorido', 'elegante']),
  format: z.enum(['SQUARE', 'PORTRAIT', 'STORY', 'LANDSCAPE']).default('SQUARE'),
})

const FORMAT_DIMENSIONS: Record<string, { width: number; height: number }> = {
  SQUARE: { width: 1024, height: 1024 },
  PORTRAIT: { width: 1024, height: 1280 },
  STORY: { width: 768, height: 1344 },
  LANDSCAPE: { width: 1280, height: 768 },
}

const NETWORK_TONE: Record<string, string> = {
  INSTAGRAM: 'conversacional, uso de emojis, engajador, chamada para ação clara',
  FACEBOOK: 'informativo, um pouco mais formal, foco em compartilhamento',
  TIKTOK: 'jovem, dinâmico, chamativo, muito informal',
  LINKEDIN: 'profissional, informativo, sem emojis excessivos, foco em valor corporativo',
  TWITTER: 'conciso, direto, impactante',
}

const STYLE_MODIFIERS: Record<string, string> = {
  moderno: 'clean modern design, sleek typography, professional advertising photography',
  minimalista: 'minimalist white space, simple composition, elegant',
  bold: 'bold vibrant colors, high impact, high contrast, eye-catching advertising',
  colorido: 'vibrant colorful palette, playful, energetic, gradient background',
  elegante: 'luxury aesthetic, premium feel, sophisticated lighting, high-end',
}

export async function POST(req: NextRequest) {
  try {
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
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    await ensureUserAndCredits(session.user)

    const redis = getRedis()
    if (redis) {
      const rlKey = `ratelimit:generate:${session.user.id}`
      const requests = await redis.incr(rlKey)

      if (requests === 1) {
        await redis.expire(rlKey, 60)
      }

      if (requests > 10) {
        return NextResponse.json(
          { error: 'Muitas requisições. Aguarde.' },
          { status: 429 }
        )
      }
    }

    const body = await req.json()
    const parsed = GenerateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }

    const { prompt, network, style, format } = parsed.data

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Chave GEMINI_API_KEY não configurada.' },
        { status: 500 }
      )
    }

    const credit = await prisma.credit.findUnique({
      where: { userId: session.user.id },
    })

    if (!credit || credit.balance < 1) {
      return NextResponse.json(
        { error: 'Créditos insuficientes', code: 'NO_CREDITS' },
        { status: 402 }
      )
    }

    const brand = await prisma.brand.findUnique({
      where: { userId: session.user.id },
    })

    const dimensions = FORMAT_DIMENSIONS[format]

    const textPrompt = `Você é especialista em marketing digital.
Marca: ${brand?.name || 'Geral'} | Nicho: ${brand?.niche || 'Geral'}
Tom da marca: ${brand?.tone || 'Profissional'}
Pedido do usuário: "${prompt}"
Rede: ${network} | Tom recomendado: ${NETWORK_TONE[network]}

Responda APENAS em JSON válido sem markdown com 3 propriedades:
1. "caption": legenda do post com CTA.
2. "hashtags": array com 10 hashtags.
3. "imagePromptEn": descreva a imagem ideal para esse post em inglês puro, focando no visual, cenário, cores e estilo fotográfico.

JSON:`

    const textResult = await genAI
      .getGenerativeModel({ model: 'gemini-2.5-flash-lite' })
      .generateContent(textPrompt)

    let parsedText: {
      caption: string
      hashtags: string[]
      imagePromptEn: string
    } = {
      caption: 'Legenda não gerada.',
      hashtags: [],
      imagePromptEn: 'Professional advertising photography, highly detailed, clean',
    }

    try {
      const clean = textResult.response
        .text()
        .replace(/```json|```/g, '')
        .trim()

      parsedText = JSON.parse(clean)
    } catch (error) {
      console.error('[GEMINI_JSON_PARSE_ERROR]', error)
    }

    const finalAiPrompt = `${parsedText.imagePromptEn}, ${STYLE_MODIFIERS[style]}`
    const encodedPrompt = encodeURIComponent(finalAiPrompt)
    const randomSeed = Math.floor(Math.random() * 1000000)

    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${dimensions.width}&height=${dimensions.height}&seed=${randomSeed}&nologo=true`

    const [creative] = await prisma.$transaction([
      prisma.creative.create({
        data: {
          userId: session.user.id,
          prompt,
          aiPrompt: finalAiPrompt,
          imageUrl,
          caption: parsedText.caption,
          hashtags: parsedText.hashtags,
          network: network as any,
          style,
          format: format as any,
          creditsUsed: 1,
        },
      }),
      prisma.credit.update({
        where: { userId: session.user.id },
        data: { balance: { decrement: 1 } },
      }),
      prisma.creditTransaction.create({
        data: {
          userId: session.user.id,
          amount: -1,
          type: 'CONSUMPTION',
          description: `Criativo: ${prompt.slice(0, 60)}`,
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      creative: {
        id: creative.id,
        imageUrl,
        caption: parsedText.caption,
        hashtags: parsedText.hashtags,
        creditsRemaining: credit.balance - 1,
      },
    })
  } catch (error: any) {
    console.error('[API_GENERATE_ERROR]', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno' },
      { status: 500 }
    )
  }
}