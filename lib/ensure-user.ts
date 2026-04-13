import { prisma } from '@/lib/prisma'

type AuthUser = {
  id: string
  email?: string | null
  user_metadata?: {
    full_name?: string | null
    name?: string | null
    avatar_url?: string | null
  }
}

export async function ensureUserAndCredits(authUser: AuthUser) {
  const name =
    authUser.user_metadata?.full_name ||
    authUser.user_metadata?.name ||
    null

  const avatarUrl = authUser.user_metadata?.avatar_url || null

  const user = await prisma.user.upsert({
    where: { id: authUser.id },
    update: {
      email: authUser.email ?? '',
      name,
      avatarUrl,
    },
    create: {
      id: authUser.id,
      email: authUser.email ?? '',
      name,
      avatarUrl,
    },
  })

  const credit = await prisma.credit.upsert({
    where: { userId: authUser.id },
    update: {},
    create: {
      userId: authUser.id,
      balance: 5,
    },
  })

  return { user, credit }
}