import Iron from '@hapi/iron'
import { parse } from 'cookie'
import { createError, setCookie } from 'h3'
import * as jose from 'jose'
import { successLog } from '../logger'

export default defineEventHandler(async (event) => {
  const { AUTH0_COOKIE_NAME, AUTH0_CLIENT_SECRET, AUTH0_DOMAIN } = useRuntimeConfig()
  const cookies = parse(event.node.req.headers.cookie || '')
  
  // Check for Authorization header (Bearer token)
  const authHeader = event.node.req.headers.authorization
  const bearerToken = authHeader?.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : null
  // Try Authorization header first (for API clients)
  if (bearerToken && AUTH0_DOMAIN) {
    try {
      const JWKS = jose.createRemoteJWKSet(
        new URL(`https://${AUTH0_DOMAIN}/.well-known/jwks.json`),
      )

      const { payload: user } = await jose.jwtVerify(bearerToken, JWKS, {
        issuer: `https://${AUTH0_DOMAIN}/`,
      })

      event.context.session = {
        user: user as any,
        id_token: bearerToken,
        access_token: bearerToken,
      }

      successLog.info({
        requestMethod: event.node.req.method,
        apiURL: event.node.req.url,
        userDetails: event.context.session.user,
        statusCode: event.node.res ? event.node.res.statusCode : 'Unknown',
      })

      return // Exit early if token authentication succeeded
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to validate authorization token'
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Invalid or expired authorization token. Please sign in again.',
      })
    }
  }

  // Fall back to cookie authentication (for browser clients)
  if (
    AUTH0_COOKIE_NAME
    && AUTH0_CLIENT_SECRET
    && cookies[AUTH0_COOKIE_NAME] != null
  ) {
    try {
      event.context.session = await Iron.unseal(
        cookies[AUTH0_COOKIE_NAME],
        AUTH0_CLIENT_SECRET,
        Iron.defaults,
      )
      successLog.info({
        requestMethod: event.node.req.method,
        apiURL: event.node.req.url,
        userDetails: event.context.session.user,
        statusCode: event.node.res ? event.node.res.statusCode : 'Unknown',
      });
    } catch (error) {
      if (AUTH0_COOKIE_NAME) {
        setCookie(event, AUTH0_COOKIE_NAME, '', {
          path: '/',
          expires: new Date(0),
        })
      }

      const message = error instanceof Error ? error.message : 'Failed to validate session cookie'
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: message === 'Bad hmac value'
          ? 'Your session is invalid or has expired. Please sign in again.'
          : message,
      })
    }
  }
})
