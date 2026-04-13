// app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { GoogleGenerativeAI } from '@google/generative-ai'
import Replicate from 'replicate'
import { z } from 'zod'

// 1. Instanciando as IAs (as chaves virão do seu .env.local)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

// 2. Validador do corpo da requisição
const GenerateSchema = z.object({
  prompt: z.string().min(10).max(500),
  network: z.enum(['INSTAGRAM', 'FACEBOOK', 'TIKTOK', 'LINKEDIN', 'TWITTER']),
  style: z.enum(['moderno', 'minimalista', 'bold', 'colorido', 'elegante']),
  format: z.enum(['SQUARE', 'PORTRAIT', 'STORY', 'LANDSCAPE']).default('SQUARE'),
})

// Dicionários para ajudar a IA
const FORMAT_DIMENSIONS: Record<string, { width: number; height: number }> = {
  SQUARE:    { width: 1024, height: 1024 },
  PORTRAIT:  { width: 1024, height: 1280 },
  STORY:     { width: 768, height: 1344 },
  LANDSCAPE: { width: 1280, height: 768 },
}

const NETWORK_TONE: Record<string, string> = {
  INSTAGRAM: 'conversacional, uso de emojis, engajador, chamada para ação clara',
  FACEBOOK:  'informativo, um pouco mais formal, foco em compartilhamento',
  TIKTOK:    'jovem, dinâmico, chamativo, muito informal',
  LINKEDIN:  'profissional, informativo, sem emojis excessivos, foco em valor corporativo',
  TWITTER:   'conciso, direto, impactante, sem blá blá blá',
}

const STYLE_MODIFIERS: Record<string, string> = {
  moderno:     'clean modern design, sleek typography, professional advertising photography',
  minimalista: 'minimalist white space, simple composition, elegant, less is more',
  bold:        'bold vibrant colors, high impact, high contrast, eye-catching advertising',
  colorido:    'vibrant colorful palette, playful, energetic, gradient background',
  elegante:    'luxury aesthetic, premium feel, sophisticated lighting, high-end',
}

export async function POST(req: NextRequest) {
  try {
    // A. Autenticação (Garante que só usuário logado gasta crédito)
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
        },
      }
    )

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // B. Validação dos dados que vieram do front-end
    const body = await req.json()
    const parsed = GenerateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Dados inválidos', details: parsed.error.flatten() }, { status: 400 })
    }

    const { prompt, network, style, format } = parsed.data

    // VERIFICAÇÃO DE CHAVES (Apenas para dev)
    if (!process.env.GEMINI_API_KEY || !process.env.REPLICATE_API_TOKEN) {
       return NextResponse.json({ error: 'As chaves de API da IA não estão configuradas no .env.local.' }, { status: 500 })
    }

    // C. Preparando Prompts
    const dimensions = FORMAT_DIMENSIONS[format]
    const styleModifier = STYLE_MODIFIERS[style]
    const networkTone = NETWORK_TONE[network]

    const imagePrompt = `High quality social media post graphic for ${network}, promoting: ${prompt}. Style: ${styleModifier}, 8k resolution, highly detailed, no text in the image, masterpiece.`
    
    const textPrompt = `
      Você é um especialista em marketing digital e copywriting.
      Gere uma legenda e hashtags para a seguinte solicitação do cliente: "${prompt}"
      
      Rede social alvo: ${network}
      Tom de voz desejado: ${networkTone}

      REGRAS OBRIGATÓRIAS:
      - Termine SEMPRE com uma chamada para ação (CTA).
      - Responda APENAS em formato JSON válido, usando exatamente esta estrutura:
      {
        "caption": "texto da legenda aqui",
        "hashtags": ["#tag1", "#tag2", "#tag3"]
      }
    `

    // D. Execução Paralela (Imagem + Texto)
    const [imageOutput, textResult] = await Promise.all([
      // Gera Imagem via Replicate (FLUX Schnell é muito rápido e barato)
      replicate.run(
        'black-forest-labs/flux-schnell',
        {
          input: {
            prompt: imagePrompt,
            width: dimensions.width,
            height: dimensions.height,
            num_inference_steps: 4,
            output_format: 'webp',
            output_quality: 80,
          }
        }
      ),
      // Gera Texto via Gemini 1.5 Flash
      genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }).generateContent(textPrompt)
    ])

    // E. Tratamento do Retorno da Imagem
    const imageUrl = Array.isArray(imageOutput) && imageOutput.length > 0 ? imageOutput[0] : null
    if (!imageUrl) {
      throw new Error('Falha ao gerar a imagem no Replicate.')
    }

    // F. Tratamento do Retorno do Texto
    const responseText = textResult.response.text().trim()
    let parsedText = { caption: 'Erro ao gerar legenda.', hashtags: [] }
    try {
      // Remove possíveis blocos de formatação markdown do Gemini (```json ... ```)
      const cleanJson = responseText.replace(/```json|```/g, '').trim()
      parsedText = JSON.parse(cleanJson)
    } catch (e) {
      console.error('Erro ao fazer parse do JSON do Gemini:', responseText)
    }

    // G. Resposta para o Front-end
    return NextResponse.json({
      success: true,
      creative: {
        id: `temp-${Date.now()}`, // ID temporário enquanto não salvamos no banco
        imageUrl: imageUrl,
        caption: parsedText.caption,
        hashtags: parsedText.hashtags || [],
        creditsRemaining: 4 // Hardcoded por enquanto
      }
    })

  } catch (error: any) {
    console.error('[API_GENERATE_ERROR]', error)
    return NextResponse.json({ error: error.message || 'Erro interno ao gerar criativo' }, { status: 500 })
  }
}