export default defineEventHandler(() => {
  throw createError({
    statusCode: 410,
    statusMessage: 'Chat API retired. DevUICraft is a Tailwind component library.'
  })
})
