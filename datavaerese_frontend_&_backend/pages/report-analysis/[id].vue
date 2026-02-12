<script setup lang="ts">
import type { User } from '@auth0/auth0-spa-js'
import type { SessionUserRole } from '@prisma/client'
import type { RASessionWithUsers } from '~~/models/rASession'

definePageMeta({
  layout: 'default',
})

const client = useClient()
const route = useRoute()
const { createToast } = useToast()

const loading = ref(false)
const stage = ref<SessionUserRole>('ACTIVITY')

const user = useState<User>('user')
const isUserAllowed = ref(false)

const session = ref<RASessionWithUsers | null>(null)

async function fetchRASession() {
  loading.value = true
  setTimeout(() => {
    session.value = {
      id: 'xxxx-xxxx-xxxx-xxxx',
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Example',
      description: 'An example',
      priority: 2,
      sop: [],
      template: {},
      projectId: 'xxxx-xxxx-xxxx-xxxx',
      users: [
        {
          userId: 'xxxx-xxxx-xxxx-xxxx',
          userRole: 'ACTIVITY',
          rASessionId: 'xxxx-xxxx-xxxx-xxxx',
        },
      ],
    }
  })
}

await fetchRASession()
</script>

<template>
  <div v-if="loading" class="flex flex-row h-100vh justify-center items-center text-neutral-100">
    <ProgressSpinner />
  </div>
  <div
    v-else-if="!loading && session"
    class="text-neutral-100 divide-y divide-neutral-500 overflow-y-visible"
  >
    <ClientOnly>
      <SessionHeader
        :session="session"
        :username="user.username"
        :stage="stage"
      />
    </ClientOnly>
    <ClientOnly>
      <!-- <SessionRABody
        :session="session"
      /> -->
      <template #fallback>
        Loading session...
      </template>
    </ClientOnly>
  </div>
</template>
