export default defineEventHandler(async () => {
  const res = await googleFetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=authorization_code'
  })
  const body = await res.text()
  return {
    ok: res.status === 400,
    status: res.status,
    proxy: googleProxyInUse() || null,
    google: body.slice(0, 160)
  }
})
