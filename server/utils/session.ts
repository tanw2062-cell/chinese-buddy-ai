import { createHmac, timingSafeEqual } from 'node:crypto'

export interface AuthUser {
  id: number
  google_id: string
  email: string
  name: string | null
  avatar: string | null
  energy: number
  is_premium: boolean
}

const cookieName = 'companion_session'

const secret = () => {
  const config = useRuntimeConfig()
  return String(config.googleClientSecret || 'dev-session')
}

const sign = (payload: string) => {
  const sig = createHmac('sha256', secret()).update(payload).digest('base64url')
  return `${payload}.${sig}`
}

const verify = (token: string) => {
  const idx = token.lastIndexOf('.')
  if (idx <= 0) {
    return null
  }
  const payload = token.slice(0, idx)
  const sig = token.slice(idx + 1)
  const expected = createHmac('sha256', secret()).update(payload).digest('base64url')
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return null
  }
  return payload
}

export const setAuthCookie = (event: Parameters<typeof setCookie>[0], userId: number) => {
  setCookie(event, cookieName, sign(String(userId)), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 14
  })
}

export const clearAuthCookie = (event: Parameters<typeof deleteCookie>[0]) => {
  deleteCookie(event, cookieName, { path: '/' })
}

export const getAuthUser = async (event: Parameters<typeof getCookie>[0]) => {
  const raw = getCookie(event, cookieName)
  if (!raw) {
    return null
  }
  const userId = verify(raw)
  if (!userId) {
    return null
  }
  let { data, error } = await getSupabase()
    .from('users')
    .select('id, google_id, email, name, avatar, energy, is_premium')
    .eq('id', userId)
    .maybeSingle()
  if (error) {
    const fallback = await getSupabase()
      .from('users')
      .select('id, google_id, email, name, avatar, energy')
      .eq('id', userId)
      .maybeSingle()
    data = fallback.data ? { ...fallback.data, is_premium: false } : null
    error = fallback.error
  }
  if (error || !data) {
    return null
  }
  return {
    ...data,
    is_premium: Boolean((data as { is_premium?: boolean }).is_premium)
  } as AuthUser
}
