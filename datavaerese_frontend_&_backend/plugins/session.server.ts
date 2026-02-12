export default defineNuxtPlugin((nuxtApp) => {
  const session = nuxtApp.ssrContext?.event.context.session

  const redirect = async (path: string) => {
    if (nuxtApp.ssrContext) {
      nuxtApp.ssrContext.event.node.res.writeHead(302, {
        Location: path,
      })

      return nuxtApp.ssrContext.event.node.res.end()
    }

    return await useRouter().push(path)
  }

  if (nuxtApp.ssrContext?.event.req.url !== '/health') {
    if (session && session.user) {
      useState('user', () => session.user)
    }
    else {
      redirect(
        `/api/auth/login?returnTo=${encodeURIComponent(
          useRouter().currentRoute.value.fullPath,
        )}`,
      )
    }
  }
})
