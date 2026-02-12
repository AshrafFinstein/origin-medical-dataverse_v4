import Iron from '@hapi/iron'
import * as jose from 'jose'

export default defineEventHandler(async (event) => {
  const {
    AUTH0_BASE_URL,
    AUTH0_DOMAIN,
    AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET,
    AUTH0_COOKIE_NAME,
  } = useRuntimeConfig()
  const query = getQuery(event)

  if (query.error)
    throw new Error(Array.isArray(query.error) ? query.error[0] : query.error)

  const body = JSON.stringify({
    grant_type: 'authorization_code',
    client_id: AUTH0_CLIENT_ID,
    client_secret: AUTH0_CLIENT_SECRET,
    code: String(query.code),
    redirect_uri: `${AUTH0_BASE_URL}/api/auth/callback`,
  }).toString()

  const data = await fetch(`https://${AUTH0_DOMAIN}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body,
  })

  const response = await data.json()

  if (response.error)
    throw new Error(response.error)

  const { access_token, id_token, scope, expires_in, token_type } = response

  const JWKS = jose.createRemoteJWKSet(
    new URL(`https://${AUTH0_DOMAIN}/.well-known/jwks.json`),
  )

  const { payload: user } = await jose.jwtVerify(id_token, JWKS, {
    issuer: `https://${AUTH0_DOMAIN}/`,
  })

  const cookie = {
    user,
    id_token,
    access_token,
    scope,
    expires_in,
    token_type,
  }

  const sealedCookie = await Iron.seal(
    cookie,
    AUTH0_CLIENT_SECRET as Iron.Password,
    Iron.defaults,
  )

  const date = new Date(Date.now() + expires_in * 1000)

  event.node.res.writeHead(302, {
    'Set-cookie': `${AUTH0_COOKIE_NAME}=${sealedCookie}; Path=/; Secure; HttpOnly; SameSite=Lax; Expires=${date.toUTCString()}`,
    'Location': '/?login=success',
  })
  event.node.res.end()
})