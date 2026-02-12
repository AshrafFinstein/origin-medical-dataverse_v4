<script setup lang="ts">
import type { PropType } from 'vue'
import type { CESessionWithUsers } from '~/types/CESession'
import type { DLSessionWithUsers } from '~~/types/DLSession'
import type { RASessionWithUsers } from '~~/types/RASession'
import { NSpace, NSpin, NBreadcrumb, NBreadcrumbItem } from 'naive-ui'
import { computed } from 'vue'
import type { User } from '@auth0/auth0-spa-js'

const props = defineProps({

  session: {
    type: Object as PropType<CESessionWithUsers | DLSessionWithUsers | RASessionWithUsers>,
    required: true,
  },
  username: {
    type: String,
  },
  stage: {
    type: String,
    required: true,
  },
  labelled: {
    type: Number,
  },
  unLabelled: {
    type: Number,
  },
  annotated: {
    type: Number,
  },
  total: {
    type: Number,
  },
  annotatedStatus: {
    type: Boolean
  },
  annotatedLoading: {
    type: Boolean
  },
  pendingCompletedLoading: {
    type: Boolean
  },
  pending: {
    type: Number,
  },
  inReview: {
    type: Number,
  },
  completed: {
    type: Number,
  },
  loading: {
    type: Boolean
  },
  sessionType: {
    type: String,
    default: 'DL'
  },
  projectName : {
    type : String
  },
  epicName : {
    type : String
  },
  projectId : {
    type : String
  },
  epicId : {
    type : String
  }
})
const stageColor: { [stage: string]: string } = {
  'ACTIVITY': 'text-yellow-400',
  'QUALITY CHECKER': 'text-purple-400',
}
const router = useRouter()
const { $client } = useNuxtApp()
const user = useState<User>('user')

// Fetch time spent for DL sessions
const shouldFetchTimeSpent = computed(() => props.sessionType === 'DL' && !!user.value?.sub && !!props.session.id)

const { data: timeSpentData } = await $client.timeSpent.getTotalTimeSpentInDLSession.useQuery(
  { dLSessionId: props.session.id },
  {
    server: false,
  }
)

// Fetch annotated image time spent for DL sessions
const { data: annotatedImageTimeSpentData } = await $client.timeSpent.getAnnotatedImageTimeSpentInDLSession.useQuery(
  { dLSessionId: props.session.id },
  {
    server: false,
  }
)

// Get isAdmin from the API response
const isAdmin = computed(() => {
  return timeSpentData.value?.isAdmin ?? false
})

// Format time in human-readable format
const formatTime = (timeMs: number) => {
  if (!timeMs || timeMs === 0) {
    return '0s'
  }
  
  const totalSeconds = Math.floor(timeMs / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  } else {
    return `${seconds}s`
  }
}

// Format total time spent
const formattedTimeSpent = computed(() => {
  if (!timeSpentData.value || !timeSpentData.value.totalTimeMs || timeSpentData.value.totalTimeMs === 0) {
    return '0s'
  }
  return formatTime(timeSpentData.value.totalTimeMs)
})

// Calculate and format average time per image
const formattedAverageTime = computed(() => {
  if (!timeSpentData.value || !timeSpentData.value.totalTimeMs || !timeSpentData.value.imageCount || timeSpentData.value.imageCount === 0) {
    return '0s'
  }
  const averageTimeMs = timeSpentData.value.totalTimeMs / timeSpentData.value.imageCount
  return formatTime(averageTimeMs)
})

// Calculate and format average time for annotated images
const formattedAverageTimeForAnnotated = computed(() => {
  if (!annotatedImageTimeSpentData.value || !annotatedImageTimeSpentData.value.totalTimeMs || !annotatedImageTimeSpentData.value.annotatedImageCount || annotatedImageTimeSpentData.value.annotatedImageCount === 0) {
    return '0s'
  }
  const averageTimeMs = annotatedImageTimeSpentData.value.totalTimeMs / annotatedImageTimeSpentData.value.annotatedImageCount
  return formatTime(averageTimeMs)
})
function formatApprovalLevels(levels: any) {
  if(levels){
    return levels.map((level: any) => `Level ${level.approvalLevel}`).join(' , ');
  } else {
    return '-'
  }
}

function parseSOP(sop: string | null | undefined) {
  if (!sop || typeof sop !== 'string' || !sop.trim()) {
    return null;
  }
  try {
    const parsed = JSON.parse(sop);
    if (parsed && typeof parsed === 'object' && parsed.sopLink && parsed.name) {
      return parsed;
    }
    return null;
  } catch (error) {
    console.warn('Failed to parse SOP JSON:', sop, error);
    return null;
  }
}

</script>

<template>
  <div class="bg-neutral-900 z-40">
    <div v-if="epicName && projectName" class="text-l p-2 text-neutral-100">
      <NBreadcrumb separator=">">
        <NBreadcrumbItem @click="router.push('../')">
          Home
        </NBreadcrumbItem>
        <NBreadcrumbItem @click="router.push({path: `/epic/${epicId}`})">
          {{ epicName ? epicName : 'Unknown' }}
        </NBreadcrumbItem>
        <NBreadcrumbItem @click="router.push({path: `/project/${projectId}`})">
          {{ projectName ? projectName : 'Unknown' }}
        </NBreadcrumbItem>
        <NBreadcrumbItem>
          {{ session.name }}
        </NBreadcrumbItem>
      </NBreadcrumb>
      <div class="text-2xl"><span>{{ session.name }}</span></div>
    </div>
    <div v-else class="text-2xl p-2 text-neutral-100">
      {{ session.name }}
    </div>
    <div class="flex flex-row items-center p-2 pt-0 text-neutral-300 gap-x-8">
    <div class="flex flex-col gap-2 basis-4/12">
      <div class="flex flex-row gap-2">
        <div class="text-neutral-300">
          Stage:
        </div>
        <div :class="`${stageColor[stage]} font-semibold`">
          {{ stage }}
        </div>
      </div>
      <div class="flex flex-row gap-2">
        <div class="text-neutral-300">
          Assignee:
        </div>
        <div class="text-neutral-100">
          {{ username }}
        </div>
      </div>
      <div class="flex flex-row gap-2">
        <div class="text-neutral-300">
          Approval Level:
        </div>
        <div class="text-neutral-100" >
          {{formatApprovalLevels(props.sessionType === 'DL' && 'approvalLevel' in session ? (session as DLSessionWithUsers & { approvalLevel?: any }).approvalLevel : null)}}
        </div>
      </div>
      <div v-if="sessionType === 'DL'" class="flex flex-row gap-2">
        <div class="text-neutral-300">
          <span v-if="isAdmin">Average Time/Time Spent:</span>
          <span v-else>Time Spent:</span>
        </div>
        <div class="text-yellow-400">
          <span v-if="isAdmin">{{ formattedAverageTime }} / </span>{{ formattedTimeSpent }}
        </div>
      </div>
      <div v-if="sessionType === 'DL' && isAdmin" class="flex flex-row gap-2">
        <div class="text-neutral-300">
          Average Time For Annotated Images:
        </div>
        <div class="text-yellow-400">
          {{ formattedAverageTimeForAnnotated }}
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-2 basis-4/12">
      <div class="flex flex-row items-center gap-2">
      <h5 v-if="session.sop.length" class="text-neutral-400 m-0 text-sm">
        Reference Links:
      </h5>
      <div class="flex flex-wrap items-center">
        <template v-for="(sop, index) in session.sop" :key="index">
          <template v-if="parseSOP(sop)">
            <a
              :href="parseSOP(sop)!.sopLink" 
              target="_blank"
              class="font-semibold text-primary-500"
            >
              {{ parseSOP(sop)!.name }}
            </a>
            <span v-if="index < session.sop.length - 1" class="mr-1">, </span>
          </template>
        </template>
      </div>
    </div>
      <div v-if="$props.sessionType == 'DL'" class="flex flex-row gap-2">
        <div class="text-neutral-300">
          Annotated / Unannotated Images:
        </div>
        <NSpace>
          <NSpin v-if="!annotatedLoading" :size="15" />
        </NSpace>
        <div class="text-neutral-100">
          {{ annotatedStatus == true ? 0 : (annotated ?? 0) }} / {{  annotatedStatus == true ? (total ?? 0) : ((total ?? 0) - (annotated ?? 0)) }}
        </div>
      </div>
      <div v-if="$props.sessionType == 'CE'" class="flex flex-row gap-2">
        <div class="text-neutral-300">
          Pending / In Review / Completed:
        </div>
        <NSpace>
          <NSpin v-if="!pendingCompletedLoading" :size="15" />
        </NSpace>
        <div class="text-neutral-100">
          {{ pending }} / {{ inReview }} / {{  completed }}
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-2 basis-4/12">
      <div class="flex flex-row gap-2">
        <div class="text-neutral-300">
          Date Created:
        </div>
        <div class="text-neutral-100">
          {{ session.createdAt.toLocaleString() }}
        </div>
      </div>
      <div class="flex flex-row gap-2">
        <div class="text-neutral-300">
          Last Updated:
        </div>
        <div class="text-neutral-100">
          {{ session.updatedAt.toLocaleString() }}
        </div>
      </div>
      <div class="flex flex-row gap-2">
        <div class="text-neutral-300">
          Description:
        </div>
        <div class="text-neutral-100">
          {{ session.description }}
        </div>
      </div>
      <div v-if="$props.sessionType == 'DL'" class="flex flex-row gap-2">
        <div class="text-neutral-300">
          Labelled / Unlabelled Images:
        </div>
        <NSpace>
          <NSpin v-if="!loading" :size="15" />
        </NSpace>
        <div class="text-neutral-100">
          {{ labelled }} / {{ unLabelled }}
        </div>
      </div>
    </div>
    </div>
  </div>
</template>
