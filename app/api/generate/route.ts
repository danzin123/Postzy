import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { GoogleGenerativeAI } from '@google/generative-ai'
import Replicate from 'replicate'
import { prisma } from '@/lib/prisma'
import { redis } from '@/lib/redis'
import { z } from 'zod'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN })

const GenerateSchema = z.object({
  prompt: z.string().min(10).max(500),
  network: z.enum(['INSTAGRAM', 'FACEBOOK', 'TIKTOK', 'LINKEDIN', 'TWITTER']),
  style: z.enum(['moderno', 'minimalista', 'bold', 'colorido', 'elegante']),
  format: z.enum(['SQUARE', 'PORTRAIT', 'STORY', 'LANDSCAPE']).default('SQUARE'),
})

const FORMAT_DIMENSIONS: Record<string, { width: number; height: number }> = {
  SQUARE:    { width: 1024, height: 1024 },
  PORTRAIT:  { width: 1024, height: 1280 },
  STORY:     { width: 768,  height: 1344 },
  LANDSCAPE: { width: 1280, height: 768  },
}

const NETWORK_TONE: Record<string, string> = {
  INSTAGRAM: 'conversacional, uso de emojis, engajador, chamada para ação clara',
  FACEBOOK:  'informativo, um pouco mais formal, foco em compartilhamento',
  TIKTOK:    'jovem, dinâmico, chamativo, muito informal',
  LINKEDIN:  'profissional, informativo, sem emojis excessivos, foco em valor corporativo',
  TWITTER:   'conciso, direto, impactante',
}

const STYLE_MODIFIERS: Record<string, string> = {
  moderno:     'clean modern design, sleek typography, professional advertising photography',
  minimalista: 'minimalist white space, simple composition, elegant',
  bold:        'bold vibrant colors, high impact, high contrast, eye-catching advertising',
  colorido:    'vibrant colorful palette, playful, energetic, gradient background',
  elegante:    'luxury aesthetic, premium feel, sophisticated lighting, high-end',
}

export async function POST(req: NextRequest) {
  try {
    // 1. Autenticação
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() } } }
    )
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    // 2. Rate limiting — 10 req/min por usuário
    const rlKey = `ratelimit:generate:${session.user.id}`
    const requests = await redis.incr(rlKey)
    if (requests === 1) await redis.expire(rlKey, 60)
    if (requests > 10) return NextResponse.json({ error: 'Muitas requisições. Aguarde.' }, { status: 429 })

    // 3. Validação
    const body = await req.json()
    const parsed = GenerateSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    const { prompt, network, style, format } = parsed.data

    // 4. Verificar chaves de API
    if (!process.env.GEMINI_API_KEY || !process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json({ error: 'Chaves de API não configuradas.' }, { status: 500 })
    }

    // 5. Verificar créditos
    const credit = await prisma.credit.findUnique({ where: { userId: session.user.id } })
    if (!credit || credit.balance < 1) {
      return NextResponse.json({ error: 'Créditos insuficientes', code: 'NO_CREDITS' }, { status: 402 })
    }

    // 6. Buscar identidade de marca
    const brand = await prisma.brand.findUnique({ where: { userId: session.user.id } })

    // 7. Montar prompts
    const dimensions = FORMAT_DIMENSIONS[format]
    const imagePrompt = `High quality social media post graphic for ${network}, promoting: ${prompt}. Style: ${STYLE_MODIFIERS[style]}${brand?.niche ? `, for ${brand.niche} industry` : ''}${brand?.primaryColor ? `, color palette inspired by ${brand.primaryColor}` : ''}. 8k resolution, no text in image, masterpiece.`

    const textPrompt = `Você é especialista em marketing digital e copywriting brasileiro.
${brand ? `Marca: "${brand.name}", nicho: "${brand.niche ?? 'geral'}", tom: "${brand.tone}".` : ''}
Gere legenda e hashtags para: "${prompt}"
Rede: ${network} | Tom: ${NETWORK_TONE[network]}
REGRAS: legenda autêntica, CTA obrigatório no final, 10-15 hashtags em minúsculo com #, não inclua hashtags na legenda.
Responda APENAS em JSON válido sem markdown:
{"caption": "...", "hashtags": ["#tag1", "#tag2"]}`

    // 8. Geração paralela
    const [imageOutput, textResult] = await Promise.all([
      replicate.run('black-forest-labs/flux-schnell', {
        input: { prompt: imagePrompt, width: dimensions.width, height: dimensions.height, num_inference_steps: 4, output_format: 'webp', output_quality: 80 }
      }),
      genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }).generateContent(textPrompt)
    ])

    const imageUrl = Array.isArray(imageOutput) ? imageOutput[0] : null
    if (!imageUrl) throw new Error('Falha ao gerar imagem.')

    let parsedText = { caption: 'Legenda não gerada.', hashtags: [] as string[] }
    try {
      const clean = textResult.response.text().replace(/```json|```/g, '').trim()
      parsedText = JSON.parse(clean)
    } catch { /* mantém fallback */ }

    // 9. Transação atômica: salvar criativo + debitar crédito
    const [creative] = await prisma.$transaction([
      prisma.creative.create({
        data: {
          userId: session.user.id,
          prompt,
          aiPrompt: imagePrompt,
          imageUrl: imageUrl as string,
          caption: parsedText.caption,
          hashtags: parsedText.hashtags,
          network: network as any,
          style,
          format: format as any,
          creditsUsed: 1,
        }
      }),
      prisma.credit.update({
        where: { userId: session.user.id },
        data: { balance: { decrement: 1 } }
      }),
      prisma.creditTransaction.create({
        data: {
          userId: session.user.id,
          amount: -1,
          type: 'CONSUMPTION',
          description: `Criativo: ${prompt.slice(0, 60)}`,
        }
      })
    ])

    return NextResponse.json({
      success: true,
      creative: {
        id: creative.id,
        imageUrl: imageUrl,
        caption: parsedText.caption,
        hashtags: parsedText.hashtags,
        creditsRemaining: credit.balance - 1,
      }
    })

  } catch (error: any) {
    console.error('[API_GENERATE_ERROR]', error)
    return NextResponse.json({ error: error.message || 'Erro interno' }, { status: 500 })
  }
}