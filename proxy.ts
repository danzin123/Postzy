// proxy.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/', '/login', '/register', '/api/stripe/webhook']

export async function proxy(request: NextRequest) {
  // 1. Cria a resposta inicial que será modificada se necessário
  let supabaseResponse = NextResponse.next({
    request,
  })

  // 2. Cria o cliente Supabase moderno (SSR)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. Extrai a sessão do usuário de forma segura
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const isPublic = PUBLIC_ROUTES.some(route => request.nextUrl.pathname === route)

  // 4. Lógica de bloqueio: Redireciona para login se não estiver logado
  if (!session && !isPublic && !request.nextUrl.pathname.startsWith('/api/stripe')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Aplica o proxy em todas as rotas, EXCETO:
     * - Arquivos estáticos (_next/static, _next/image, favicon.ico)
     * - Extensões de imagem para não bloquear o carregamento visual
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}