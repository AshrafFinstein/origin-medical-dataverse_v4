const {
  AUTH0_SECRET,
  AUTH0_BASE_URL,
  AUTH0_DOMAIN,
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_AUDIENCE,
  AUTH0_COOKIE_NAME,
  AUTH0_DATABASE_CONNECTION,

  AWS_S3_BUCKET,
  AWS_REGION,
  AWS_S3_BUCKET_THUMBNAIL_IMAGES,
  AWS_S3_BUCKET_VERSIONS,
  AWS_VERSION_REGION,
  API_URL,
} = process.env

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  runtimeConfig: {
    AUTH0_SECRET,
    AUTH0_BASE_URL,
    AUTH0_DOMAIN,
    AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET,
    AUTH0_AUDIENCE,
    AUTH0_COOKIE_NAME,
    AUTH0_DATABASE_CONNECTION,
    AWS_S3_BUCKET_THUMBNAIL_IMAGES,
    AWS_S3_BUCKET,
    AWS_S3_BUCKET_VERSIONS,
    AWS_REGION,
    AWS_VERSION_REGION,

    public: {
      API_URL,
    },
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    'nuxt-icon',
    'nuxt-scheduler',
  ],
  tailwindcss: {
    exposeConfig: true,
    injectPosition: 'last',
  },
  build: {
    transpile: process.env.NODE_ENV === 'production'
      ? [
          'naive-ui',
          'vueuc',
          '@css-render/vue3-ssr',
          'juggle/resize-observer',
          'trpc-nuxt',
        ]
      : [
          'juggle/resize-observer',
          'trpc-nuxt',
        ],
  },
  vite: {
    optimizeDeps: {
      include:
        process.env.NODE_ENV === 'development'
          ? ['naive-ui', 'vueuc', 'date-fns-tz/esm/formatInTimeZone']
          : [],
    },
  },
  typescript: {
    strict: true,
  },
})
