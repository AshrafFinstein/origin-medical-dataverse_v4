<script setup lang="ts">
import type { User } from '@auth0/auth0-spa-js'
import type { Label, UsersInDLSessions } from '@prisma/client'
import { ExtractedResourceStatus, SessionUserRole } from '@prisma/client'
import { nextTick, computed } from 'vue'
import type { SelectRenderLabel, SelectRenderTag, UploadCustomRequestOptions, UploadFileInfo, UploadInst } from 'naive-ui'
import { NButton, NCheckbox, NPagination, NSelect, NSkeleton, NTag, NUpload, NUploadDragger, useNotification, NInput, NModal, NCard, NForm, NFormItem, NDatePicker, NDropdown, NTabs, NTabPane, NDataTable, NPopconfirm} from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import type { ExtractedResourceLong, ListExtractedResourcesInDLSessionInput, ListPatientsInput, TimeSpentInDLSessionCreateInput, IGenerateVersion } from '~~/types'
import Preview from '~/components/Session/DL/Preview.vue';
import { defineAbilitiesFor } from '~/types/ability'
import { Module, Action } from '~/types/enum'
import { useErrorFormatter } from '~/composables/useErrorFormatter'
import type { ErrorWithCode, ExtractedResource } from '~/types/error'

const route = useRoute()
const router = useRouter()

const { $client } = useNuxtApp()
const { downloadExtractedResources, fetchExtractedResourcesJSON, downloadVersionMetadata } = useDownloader()
const notification = useNotification()
const { formatErrorMessage } = useErrorFormatter()
const dLPreviewSession = ref<InstanceType<typeof Preview> | null>(null);

// Generate Version for Download
const generateVersion  = ref<IGenerateVersion>({
  purposeForDownload : null,
  majorVersion : null,
  minorVersion : null,
  date : new Date()
});
const isGenerateVersion = ref<boolean>(false);
const isVersionDownload = ref<boolean>(true);
const activeVersionTab = ref<string>('generate');
const versionsLoaded = ref<boolean>(false); // Flag to track if versions have been loaded



// Version History
interface VersionHistoryItem {
  id: string;
  version: string;
  session: string;
  purpose: string;
  dateTime: string;
  createdBy: string;
  status: string | null;
}

 interface TRPCError {
  data?: {
    code?: string
    message?: string
    httpStatus?: number
  }
  message?: string
}

const { data: versionsData, pending: versionHistoryLoading, refresh: refreshVersions } = await $client.dLSession.listVersions.useQuery(
  { dLSessionId: route.params.id.toString() },
  { 
  server: false,
  immediate: false
   }
);

watch(activeVersionTab, async (newTab) => {
  if (newTab === 'history' && !versionsLoaded.value && !versionsData.value) {
    versionsLoaded.value = true;
    await refreshVersions();
  }
});

const versionHistoryData = computed<VersionHistoryItem[]>(() => {
  if (!versionsData.value?.versions) {
    return [];
  }
  return versionsData.value.versions.map((version: any, index: number) => {
    const date = new Date(version.createdAt);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return {
      id: version.id,
      version: `${version.majorVersion}.${version.minorVersion}`,
      session: session.value?.name || '',
      purpose: version.purpose,
      dateTime: `${day}/${month}/${year} ${hours}:${minutes}`,
      createdBy: version.createdBy,
      status: index === 0 ? 'Latest' : null
    };
  });
});

const versionHistoryColumns = computed<DataTableColumns<VersionHistoryItem>>(() => [
  {
    key: 'version',
    title: 'Version',
    width: '10%',
    align: 'center',
    render: (row) => {
      return h('span', { style: { color: '#1890ff', textAlign: 'center', display: 'block' } }, row.version);
    }
  },
  {
    key: 'session',
    title: 'Session',
    width: '15%',
    align: 'center',
    render: (row) => {
      return h('span', { style: { fontWeight: 'bold', color: '#FFF', textAlign: 'center', display: 'block' } }, row.session);
    }
  },
  {
    key: 'purpose',
    title: 'Purpose',
    width: '25%',
    align: 'center',
    render: (row) => {
      return h('span', { 
        style: { 
          textAlign: 'center', 
          display: 'block',
          wordWrap: 'break-word',
          whiteSpace: 'normal',
          overflowWrap: 'break-word'
        } 
      }, row.purpose);
    }
  },
  {
    key: 'dateTime',
    title: 'Date & Time',
    width: '15%',
    align: 'center',
    render: (row) => {
      return h('span', { style: { textAlign: 'center', display: 'block' } }, row.dateTime);
    }
  },
  {
    key: 'createdBy',
    title: 'Created By',
    width: '15%',
    align: 'center',
    render: (row) => {
      return h('span', { style: { fontWeight: 'bold', color: '#FFF', textAlign: 'center', display: 'block' } }, row.createdBy);
    }
  },
  {
    key: 'action',
    title: 'Action',
    width: '10%',
    align: 'center',
    render: (row) => {
      return h('div', { style: { display: 'flex', justifyContent: 'center' } }, [
        h(NButton, {
          size: 'small',
          secondary: true,
          onClick: () => {
            downloadVersionMetadataHandler(row);
          }
        }, { default: () => 'Download' })
      ]);
    }
  }
]);

// Annotation modal state tracking
const isAnnotationModalOpen = ref<boolean>(false)

// Filters
interface Filter {
  labelIds: string[]
  status: ExtractedResourceStatus | null
  patientId: string | null
  unLabelled: boolean
  unAnnotated: boolean
  annotated: boolean
  imageId: string | null
  isApproved: boolean
  freeze: boolean
}

interface DuplicateCheckResponse {
  hasDuplicates: boolean
  duplicateCount: number
}
const filter = reactive<Filter>({
  status: null,
  labelIds: [],
  patientId: null,
  unLabelled: false,
  unAnnotated: false,
  annotated: false,
  imageId: null,
  isApproved: false,
  freeze: false
})

// User
const user = useState<User>('user')
const sessionUserRole = ref<SessionUserRole>('ACTIVITY') // role of the user in this session

onBeforeMount(() => {
  if (route.query.page) {
    pagination.page = Number(route.query.page)
    imageIndex.value = Number(route.query.imageIndex);
  }
})

// Fetch session
const epicName = ref('');
const projectName = ref('');
const epicId  = ref('');
const projectId = ref('');



/**
 * Regex pattern for extracting project ID from referrer URL
 * Matches: /project/{uuid}
 */
const PROJECT_ID_REGEX = /\/project\/([a-f0-9-]+)/

async function handleSessionError(error: TRPCError | null | undefined): Promise<void> {
  if (!error) return
  
  if (error.data?.code === 'UNAUTHORIZED') {
    // Redirect back to previous page without showing notification
    router.go(-1)
  } else if (error.data?.code === 'FORBIDDEN') {
    // Redirect user back to the project page (session table) immediately
    // Try to get project ID from referrer if available
    if (process.client) {
      const referrer = document.referrer
      const projectIdMatch = referrer.match(PROJECT_ID_REGEX)
      if (projectIdMatch && projectIdMatch[1]) {
        await router.push(`/project/${projectIdMatch[1]}`)
        return
      }
    }
    
    // Fallback: go back in history
    router.go(-1)
  }
}

// Use server: false to prevent SSR errors when session is locked
// This ensures the error is handled on client side where we can properly redirect
const { data: session, error: sessionError } = await $client.dLSession.one.useQuery(
  route.params.id.toString())

// Check for existing error immediately (in case error occurred during query setup)
if (sessionError.value) {
  await handleSessionError(sessionError.value)
}

// Watch for errors that occur after initial load
watch(sessionError, async (error) => {
  await handleSessionError(error)
})

// Set session data if available
if (session.value) {
  epicName.value = session.value.project.epic.name;
  projectName.value = session.value.project.name
  epicId.value  = session.value.project.epic.id;
  projectId.value = session.value.project.id;
}

let activityTimer: NodeJS.Timeout;
const startTime = ref(Date.now());
const endTime = ref(Date.now());
const timeSpent = ref(0);
let isInactive = false; // Flag to track inactivity
const activityTimeout = 60000; // 5 Minutes of inactivity
const newTimeSpent = ref<TimeSpentInDLSessionCreateInput>({ dlSessionId: '', startTime: 0})

// Function to handle user activity
const handleUserActivity = () => {
  if (isInactive) {
    // User was inactive and is now active again
    // console.log('User has become active again, restarting timer.');
    localStorage.setItem('startSessionTime', Date.now().toString());
    isInactive = false;
  }
  resetActivityTimer();
};

// Function to reset activity timer
const resetActivityTimer = () => {
  clearTimeout(activityTimer);
  activityTimer = setTimeout(async () => {
    // console.log('User is inactive.');
    // API Call
    const startTime = parseInt(localStorage.getItem('startSessionTime'));
    const endTime = Date.now();
    timeSpent.value = endTime - startTime;
    // console.log(`Time spent on page: ${timeSpent.value / 1000} seconds`);
    if ((endTime - startTime) / 1000 > 10) {
      newTimeSpent.value.dlSessionId = route.params.id.toString()
      newTimeSpent.value.startTime = Number(startTime)
      await $client.timeSpent.createTimeSpentInDLSession.mutate(newTimeSpent.value)
    }

    isInactive = true;
  }, activityTimeout);
};

onMounted(() => {
  // console.log('mounted');
  const startTime = parseInt(localStorage.getItem('startSessionTime')) || Date.now();
  localStorage.setItem('startSessionTime', startTime.toString());

  document.addEventListener('mousemove', handleUserActivity);
  document.addEventListener('keydown', handleUserActivity);

  resetActivityTimer();
})

onUnmounted( async () => {
  // console.log('unmounted');
  const endTime = Date.now();
  const startTime = parseInt(localStorage.getItem('startSessionTime'));
  timeSpent.value = endTime - startTime;
  // console.log(`Time spent on page: ${timeSpent.value / 1000} seconds`);
  if ((endTime - startTime) / 1000 > 10) {
    newTimeSpent.value.dlSessionId = route.params.id.toString()
    newTimeSpent.value.startTime = Number(startTime)
    await $client.timeSpent.createTimeSpentInDLSession.mutate(newTimeSpent.value)
  }
  clearTimeout(activityTimer);
  document.removeEventListener('mousemove', handleUserActivity);
  document.removeEventListener('keydown', handleUserActivity);

  localStorage.setItem('startSessionTime', Date.now().toString());
})

watch(session, () => {
  if (session.value) {
    session.value.users.forEach((sessionUser: UsersInDLSessions) => {
      if (sessionUser.userId === user.value.sub) {
        sessionUserRole.value = sessionUser.userRole
        filter.status = sessionUserRole.value === SessionUserRole.QUALITY_CONTROLLER ? 'IN_REVIEW' : undefined
        filter.isApproved = sessionUserRole.value === SessionUserRole.QUALITY_CONTROLLER ? true : false
      }
    })
  }
}, {
  immediate: true,
})

// Fetch labels - with freeze support
const labelColors: { [labelId: string]: string } = reactive({})

// Fetch all labels (for unfrozen state)
const { data: allLabels } = await $client.label.list.useQuery({
  filter: { dLSessionId: route.params.id.toString() },
  sort: [{ name: 'asc' }],
}, {
  transform: (response) => {
    return response.data
  },
  server: false,
})

const renderLabelTags: SelectRenderTag = ({ option, handleClose }) => {
  return h(
    NTag,
    {
      color: {
        color: labelColors[option.id as string],
        textColor: 'black',
        borderColor: 'black',
      },
      strong: true,
      type: 'primary',
      closable: true,
      onMousedown: (e: FocusEvent) => {
        e.preventDefault()
      },
      onClose: (e: MouseEvent) => {
        e.stopPropagation()
        handleClose()
      },
    },
    { default: () => option.name },
  )
}

// Fetch extracted resources
const status = ref<ExtractedResourceStatus>()
const imageIndex = ref<number>(0)
const pageNumber = ref<number>(1)
const comment = ref<string>('')
const chosenExtractedResources = ref<Array<ExtractedResourceLong>>([])
const searchNoResults = ref<boolean>(false) // Track if search returned no results
const pagination = reactive({
  page: 1,
  perPage: 200,
})

const allPending = computed(() => {
  return Array.isArray(chosenExtractedResources.value)
    ? chosenExtractedResources.value.every(item => item.status === 'PENDING')
    : false;
});




// Fetch patients (must be after pagination is defined)
const listPatientsInput = computed(() => {
  const input: ListPatientsInput = {
    filter: {
      dLSessionId: route.params.id.toString(),
    },
    limit: pagination.perPage,
    offset: (pagination.page - 1) * pagination.perPage,
  }
  
  input.filter.unLabelled = filter.unLabelled
  input.filter.unAnnotated = filter.unAnnotated
  input.filter.annotated = filter.annotated
  input.filter.isApproved = filter.isApproved
  input.filter.freeze = filter.freeze
  if (filter.status)
    input.filter!.status = filter.status
  if (filter.labelIds.length)
    input.filter!.labelIds = filter.labelIds
  if(input.filter.unLabelled)
    input.filter!.labelIds = []

  return input
})
const { data: patients, pending: loadingPatients } = $client.dLSession.listPatients.useQuery(listPatientsInput, {
  server: false,
})
const renderPatientOptions: SelectRenderLabel = (option) => {
  return h(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '450px',
      },
    },
    [
      h(
        'span',
        null,
        [option.patientId as string],
      )
      // ,
      // h(
      //   'span',
      //   null,
      //   [option.noExtractedResources as string],
      // ),
    ],
  )
}
const totalCount = ref(0) 
const fullUnfilteredTotalCount = ref(0) 
const frozenTotalCount = ref<number | null>(null)
const labelledCount = ref(0)
const unLabelledCount = ref(0)
const annotatedCount = ref(0)
const annotatedCountLoading = ref(false)
const labelCountLoading = ref(false)

// Freeze state tracking
const frozenPage = ref<number | null>(null)
const frozenPerPage = ref<number | null>(null)
const isUnfreezing = ref(false)
const isPageChangeFromFilter = ref(false) // Flag to track if page change is from filter reset

// Filter options input (must be after pagination is defined)
const filterOptionsInput = computed(() => ({
  filter: {
    dLSessionId: route.params.id.toString(),
    freeze: filter.freeze,
  },
  limit: pagination.perPage,
  offset: (pagination.page - 1) * pagination.perPage,
}))

const { data: filterOptions, refresh: refreshFilterOptions } = await $client.dLSession.listFilterOptions.useQuery(filterOptionsInput, {
  server: false,
})

// Use filtered labels when freeze is enabled, otherwise use all labels
const dropdownLabels = computed(() => {
  if (filter.freeze && filterOptions.value?.labels) {
    return filterOptions.value.labels
  }
  return allLabels.value || []
})

watch(allLabels, () => {
  let initial = 0
  if (allLabels.value && Array.isArray(allLabels.value)) {
    allLabels.value.forEach((label: any) => {
      initial += 0.15
      labelColors[label.id] = `hsl(${initial * 360}, 100%, 75%)`
    })
  }
}, {
  immediate: true,
})
const listExtractedResourcesInput = computed(() => {
  const input: ListExtractedResourcesInDLSessionInput = {
    limit: pagination.perPage,
    offset: (pagination.page - 1) * pagination.perPage,
    filter: {
      dLSessionId: route.params.id.toString(),
    },
    sort: [
      {
        createdAt: 'desc',
      },
    ],
  }

  input.filter.isApproved = filter.isApproved
  input.filter.unLabelled = filter.unLabelled
  input.filter.unAnnotated = filter.unAnnotated
  input.filter.annotated = filter.annotated
  input.filter.freeze = filter.freeze
  if (filter.patientId)
    input.filter.patientId = filter.patientId
  if (filter.status)
    input.filter.status = filter.status
  if (filter.labelIds.length)
    input.filter.labelIds = filter.labelIds
  if (filter.imageId)
    input.filter.imageId = filter.imageId
  if(input.filter.unLabelled)
    input.filter!.labelIds = []
  return input
})

const {
  data: extractedResources,
  refresh: refreshResources,
  pending: loadingResources,
  error: sessionErrors
} = await $client.dLSession.listExtractedResources.useQuery(listExtractedResourcesInput, {
  transform: (response) => {
    chosenExtractedResources.value = []
    return response.data
  },
  server: false,
})

// Watch for changes in sessionErrors
let lastErrorMessage: string | null = null; // Store the last error message
let notificationShown = false; // Flag to track if notification has been shown

watch(sessionErrors, (newError) => {
  if (newError) {
    if (newError.message !== lastErrorMessage) {
      lastErrorMessage = newError.message; // Update the last error message
      notificationShown = false; // Reset the flag for new error

      // Show notification only if it hasn't been shown yet
      if (!notificationShown) {
        notification.create({
          title: 'Error',
          type: 'error',
          content: newError.message,
          duration: 5000,
          closable: true,
        });
        notificationShown = true; // Set the flag to true after showing

        // Route to the existing project ID for the current session
        if (session.value) {
          const projectId = session.value.project.id; // Extract the project ID
          router.push(`/project/${projectId}`); // Route to the project page
        }
      }
    }
  } else {
    lastErrorMessage = null; // Reset if there's no error
    notificationShown = false; // Reset the flag when there's no error
  }
}, { immediate: true }) // Trigger immediately on mount


await $client.dLSession.listExtractedResourcesLabelCount.useQuery(listExtractedResourcesInput, {
  transform: (response) => {
    totalCount.value = response.totalCount
    fullUnfilteredTotalCount.value = response.fullDatasetTotalCount ?? 0
    frozenTotalCount.value = response.frozenTotalCount ?? null
    labelledCount.value = response.labelledcount
    unLabelledCount.value = totalCount.value - response.labelledcount
    labelCountLoading.value = true
  },
  server: false,
})

const displayedTotalCount = computed(() => {
  if (filter.freeze && frozenTotalCount.value !== null) {
    return frozenTotalCount.value
  }
  return totalCount.value
})

const paginationItemCount = computed(() => {
  if (filter.freeze) {
    return fullUnfilteredTotalCount.value
  }
  return totalCount.value
})

await $client.dLSession.listExtractedResourcesAnnotatedCount.useQuery(listExtractedResourcesInput, {
  transform: (response) => {
    annotatedCount.value = response.annotatedcount
    annotatedCountLoading.value = true
  },
  server: false,
})

// const { data: taxonomyData } = await $client.apiService.getTaxonomyData.useQuery({
//   dLSessionId: route.params.id.toString(),
// }, {
//   transform: (response) => {
//     console.log(response)
//     return response.data
//   },
//   server: false,
// }) 
//   const {data: labelsBySession} = await $client.apiService.getLabelData.useQuery({
//     dLSessionId: route.params.id.toString(),
//   }, {
//     transform: (response) => {
//       console.log(response)
//       return response.data
//     },
//     server: false,
//   })

watch(() => [totalCount.value, labelledCount.value], async () => {
  unLabelledCount.value = totalCount.value - labelledCount.value
})
  
watch(
  () => filter.imageId,
  async (newImageId) => {
    // Early exit: if imageId is not provided, reset and return
    if (!newImageId || newImageId.trim() === '') {
      searchNoResults.value = false
      return
    }

    searchNoResults.value = false

    // Build filter input
    const buildInput = () => {
      const baseFilter: ListExtractedResourcesInDLSessionInput = {
        limit: pagination.perPage,
        offset: (pagination.page - 1) * pagination.perPage,
        filter: {
          dLSessionId: route.params.id.toString(),
        },
        sort: [{ createdAt: 'desc' }],
      }

      Object.assign(baseFilter.filter, {
        unLabelled: filter.unLabelled,
        unAnnotated: filter.unAnnotated,
        annotated: filter.annotated,
        isApproved: filter.isApproved,
        freeze: filter.freeze,
      })

      if (filter.patientId) baseFilter.filter.patientId = filter.patientId
      if (filter.status) baseFilter.filter.status = filter.status
      if (filter.labelIds.length) baseFilter.filter.labelIds = filter.labelIds
      if (newImageId) baseFilter.filter.imageId = newImageId
      if (filter.unLabelled) baseFilter.filter.labelIds = []
      return baseFilter
    }

    try {
      const response = await $client.dLSession.extractedResourcesPageCount.query(buildInput())
      const data = response.data
      const found =
        data &&
        typeof data.pageNumber !== 'undefined' &&
        typeof data.imageIndex !== 'undefined'

      if (found) {
        searchNoResults.value = false

        const foundPage = Number(data.pageNumber || 1)
        const isSamePage = pagination.page === foundPage
        pageNumber.value = foundPage
        imageIndex.value =
          Math.abs(pagination.perPage * (pageNumber.value - 1) - Number(data.imageIndex))

        if (!filter.freeze) {
          isPageChangeFromFilter.value = true
          pagination.page = foundPage || 1
          nextTick(() => {
            isPageChangeFromFilter.value = false
          })
        }

        if (isSamePage) {
          const imgElem = document.querySelector(`#image_${imageIndex.value}`)
          if (imgElem) {
            scrollToImage()
            ;(imgElem as HTMLElement).click()
            setTimeout(() => {
              imageIndex.value = 0
            }, 1000)
          }
        } else if (filter.freeze) {
          // Freeze mode: not on current page
          searchNoResults.value = true
          activeResource.value = null
          chosenExtractedResources.value = []
        }
      } else {
        // No result
        searchNoResults.value = true
        activeResource.value = null
        chosenExtractedResources.value = []
      }
    } catch {
      // On error: treat as no result
      searchNoResults.value = true
      activeResource.value = null
      chosenExtractedResources.value = []
    }
  }
)

// Function to clear all filters
function clearAllFilters() {
  filter.status = null
  filter.labelIds = []
  filter.patientId = null
  filter.unLabelled = false
  filter.unAnnotated = false
  filter.annotated = false
  filter.imageId = null
}

function handleFreeze() {
  if (!filter.freeze) {
    frozenPage.value = pagination.page
    frozenPerPage.value = pagination.perPage
    filter.freeze = true
  }
}

function handleUnfreeze() {
  const wasFrozen = filter.freeze
  filter.freeze = false
  frozenPage.value = null
  frozenPerPage.value = null
  if (wasFrozen && !isUnfreezing.value) {
    isPageChangeFromFilter.value = true
    pagination.page = 1
    nextTick(() => {
      isPageChangeFromFilter.value = false
    })
  }
}

watch(() => filter.status, () => {
  // Don't reset page if: frozen, unfreezing, or page change is from filter/navigation (not user filter change)
  if (!filter.freeze && !isUnfreezing.value && !isPageChangeFromFilter.value) {
    isPageChangeFromFilter.value = true
    pagination.page = 1
    nextTick(() => {
      isPageChangeFromFilter.value = false
    })
  }
})

watch(() => filter.labelIds,  () => {
  // Don't reset page if: frozen, unfreezing, or page change is from filter/navigation (not user filter change)
  if (!filter.freeze && !isUnfreezing.value && !isPageChangeFromFilter.value) {
    isPageChangeFromFilter.value = true
    pagination.page = 1
    nextTick(() => {
      isPageChangeFromFilter.value = false
    })
  }
})

watch(() => filter.patientId, () => {
  // Don't reset page if: frozen, unfreezing, or page change is from filter/navigation (not user filter change)
  if (!filter.freeze && !isUnfreezing.value && !isPageChangeFromFilter.value) {
    isPageChangeFromFilter.value = true
    pagination.page = 1
    nextTick(() => {
      isPageChangeFromFilter.value = false
    })
  }
})


watch(() => pagination.page, (newPage, oldPage) => {
  if (isUnfreezing.value) {
    return
  }
  
  if (oldPage === undefined || newPage === oldPage || isPageChangeFromFilter.value) {
    return
  }
  
  if (filter.freeze && frozenPage.value !== null) {
    if (newPage !== frozenPage.value) {
      isUnfreezing.value = true
      const targetPage = newPage
      filter.freeze = false
      frozenPage.value = null
      frozenPerPage.value = null
      // Set flag to prevent filter watchers from resetting page when we clear filters
      isPageChangeFromFilter.value = true
      clearAllFilters()
      // Clear activeResource when page changes (even when unfreezing) to prevent accessing undefined resource's id
      activeResource.value = null
      chosenExtractedResources.value = []
      nextTick(() => {
        if (pagination.page !== targetPage) {
          pagination.page = targetPage
        }
        isPageChangeFromFilter.value = false
        isUnfreezing.value = false
      })
    }
  } else if (!filter.freeze) {
    // Set flag to prevent filter watchers from resetting page when we clear filters
    isPageChangeFromFilter.value = true
    // Clear activeResource when page changes to prevent accessing undefined resource's id
    activeResource.value = null
    chosenExtractedResources.value = []
    // clearAllFilters()
    // Reset flag after filters are cleared
    nextTick(() => {
      isPageChangeFromFilter.value = false
    })
  }
})

watch(() => pagination.perPage, (newPerPage) => {
  if (isUnfreezing.value) {
    return
  }
  
  if (filter.freeze && frozenPerPage.value !== null) {
    if (newPerPage !== frozenPerPage.value) {
      isUnfreezing.value = true
      filter.freeze = false
      frozenPage.value = null
      frozenPerPage.value = null
      nextTick(() => {
        isUnfreezing.value = false
      })
    }
  } else if (!filter.freeze) {
    isPageChangeFromFilter.value = true
    pagination.page = 1
    nextTick(() => {
      isPageChangeFromFilter.value = false
    })
  }
})

const activeResource = ref<ExtractedResourceLong | null>(null)


const canSaveTaxonomyAtApprovalLevel = computed(() => {
  // Get all selected resources - checks ALL resources in the array, not just first or last
  const resources = chosenExtractedResources.value

  // If no resources selected, disable
  if (resources.length === 0) {
    return true;
  }

  // Rule 1: Check ALL resources - If ALL resources are ACCEPTED → disable (prevent label menu)
  if (resources.every(r => r.status === 'ACCEPTED')) {
    return true;
  }

  // Rule 2: Check ALL resources - If ANY resource is IN_REVIEW and user is ACTIVITY role → disable
  if (sessionUserRole.value === 'ACTIVITY' && 
      resources.some(r => r.status === 'IN_REVIEW')) {
    return true;
  }

  // Rule 3: Check ALL resources - If ANY resource is ACCEPTED OR (REJECTED with approvalLevel!=null and isReSubmitApprover=false) → disable
  if (resources.some(r => 
    r.status === 'ACCEPTED' || 
    (r.status === 'REJECTED' && r.approvalLevel != null && r.isReSubmitApprover === false)
  )) {
    return true;
  }

  // Rule 4: Check ALL resources - If ALL resources are (REJECTED or PENDING) with approvalLevel=null and user is ACTIVITY → enable
  if (sessionUserRole.value === 'ACTIVITY' && 
      resources.every(r => 
        (r.status === 'REJECTED' || r.status === 'PENDING') && r.approvalLevel == null
      )) {
    return false;
  }

  // Rule 5: Check ALL resources - If ALL resources are PENDING and user is ACTIVITY → enable
  if (sessionUserRole.value === 'ACTIVITY' && 
      resources.every(r => r.status === 'PENDING')) {
    return false;
  }

  // Rule 6: Check ALL resources - If ALL resources are (REJECTED or ACCEPTED) with isReSubmitApprover=true → enable
  if (resources.every(r => 
    (r.status === 'REJECTED' || r.status === 'ACCEPTED') && r.isReSubmitApprover === true
  )) {
    return false;
  }

  // Rule 7: Check ALL resources - Complex approver conditions
  // If ALL have isNextApprover=false and ALL have isReSubmitApprover defined (true/false) → disable
  const allNextApproverFalse = resources.every(r => r.isNextApprover === false);
  const allHaveReSubmitApproverDefined = resources.every(r => 
    r.isReSubmitApprover === true || r.isReSubmitApprover === false
  );
  
  if (allNextApproverFalse && allHaveReSubmitApproverDefined) {
    return true;
  }

  // Rule 8: Check ALL resources - If ANY resource has conflicting approver conditions → disable
  // (isNextApprover=false AND isReSubmitApprover=false) OR 
  // (isNextApprover=true AND isReSubmitApprover=true)
  if (resources.some(r => 
    (r.isNextApprover === false && r.isReSubmitApprover === false) ||
    (r.isNextApprover === true && r.isReSubmitApprover === true)
  )) {
    return true;
  }

  // Default: enable
  return false;
}); 

// Resources tagging
// const contextMenuElement = ref<HTMLElement>()
const labelMenu = reactive<{ visible: boolean; x: number; y: number; resources: ExtractedResourceLong[] }>({
  visible: false,
  x: 0,
  y: 0,
  resources: [],
})
const labelMenuEl = ref(null)
onClickOutside(labelMenuEl, e => showLabelMenu(e))

// Search query for label menu filtering
const labelMenuSearchQuery = ref<string>('')

// Computed property to filter labels based on search query
const filteredLabels = computed(() => {
  if (!allLabels.value) return []
  
  const search = labelMenuSearchQuery.value.toLowerCase().trim()
  if (!search) {
    return allLabels.value
  }
  
  return allLabels.value.filter((label: Label) => 
    label.name.toLowerCase().includes(search)
  )
})

function showLabelMenu(e: MouseEvent) {
  // Prevent label popup if canSaveTaxonomyAtApprovalLevel is true (saving is disabled)
  if (canSaveTaxonomyAtApprovalLevel.value) {
    return;
  }
  
  if (chosenExtractedResources.value.length) {
    e.preventDefault()
    labelMenu.visible = !labelMenu.visible
    labelMenu.x = e.pageX
    labelMenu.y = e.pageY
    labelMenu.resources = JSON.parse(JSON.stringify(chosenExtractedResources.value))
    labelMenuSearchQuery.value = ''
  }
}
function getLabelCheckedStatus(resources: ExtractedResourceLong[], labelId: string) {
  if (resources.every(resource => resource.labelIds.includes(labelId)))
    return 2

  else if (resources.some(resource => resource.labelIds.includes(labelId)))
    return 1

  else return 0
}
function handleLabelStatusChange(label: Label) {
  const status = getLabelCheckedStatus(labelMenu.resources, label.id)

  if (status === 1) {
    labelMenu.resources.forEach((resource) => {
      if (!resource.labelIds || resource.labelIds.includes(label.id))
        return
      resource.labelIds.push(label.id)
    })
  }
  else if (status === 2) {
    labelMenu.resources.forEach((resource) => {
      resource.labelIds = resource.labelIds.filter(l => l !== label.id)
    })
  }
  else if (status === 0) {
    const initialStatus = getLabelCheckedStatus(chosenExtractedResources.value, label.id)
    if (initialStatus === 1) {
      labelMenu.resources = JSON.parse(JSON.stringify(chosenExtractedResources.value))
    }
    else {
      labelMenu.resources.forEach((resource) => {
        if (resource.labelIds.includes(label.id))
          return
        resource.labelIds.push(label.id)
      })
    }
  }
}

// Computed property to check if at least one label is selected across all resources
const hasSelectedLabels = computed(() => {
  if (!labelMenu.resources || labelMenu.resources.length === 0) {
    return false
  }
  // Check if any resource has at least one label selected
  return labelMenu.resources.some(resource => 
    resource.labelIds && 
    Array.isArray(resource.labelIds) && 
    resource.labelIds.length > 0
  )
})

const isSelectAllChecked = ref(false)
watch(isSelectAllChecked, () => {
  chosenExtractedResources.value = isSelectAllChecked.value === true ? extractedResources.value.map((resource: any) => toRaw(resource)) : []
})
const isShowStatusSelected = ref(true)

async function saveExtractedResourcesLabels(e: MouseEvent) {
  
  await $client.dLSession.updateManyExtractedResources.mutate({
    dLSessionId: route.params.id != null ? route.params.id.toString() : '',
    extractedResources: labelMenu.resources.map(resource => ({
      id: resource.id,
      status : resource.status,
      labelIds: resource.labelIds,
    })),
  })
  showLabelMenu(e)
  notification.success({ 
    content: `Successfully Labelled ${chosenExtractedResources.value.length} Images`,
    duration: 11000,
    closable: true
  })
  await refreshResources()
  // Refresh filter options if freeze is active to show newly added labels in dropdown
  if (filter.freeze) {
    await refreshFilterOptions()
  }
}

// WHEN SENDING FOR QC
async function submitManyExtractedResources(selectedResources: Array<ExtractedResourceLong>, selectedStatus: ExtractedResourceStatus) {
  const extractedResources: { id: string; status: ExtractedResourceStatus; isFinalApproval:boolean; isReSubmit:boolean }[] = []
  selectedResources.forEach((resource) => {
    extractedResources.push({ id: resource.id, status: selectedStatus, labelIds: resource.labelIds, isFinalApproval : resource.isFinalApproval, isReSubmit: ((selectedStatus === "ACCEPTED" || selectedStatus === "IN_REVIEW") && (resource.status === "REJECTED")) ? true : false })
  })
  try{
    await $client.dLSession.submitManyExtractedResources.mutate({
      dLSessionId: route.params.id != null ? route.params.id.toString() : '',
      extractedResources,
    })
    await refreshResources()
    // Clear resources after refresh
    await nextTick()
    chosenExtractedResources.value = []
  } catch (error: unknown) {
    const errorMessage = formatErrorMessage(error)
    notification.error({ 
      content: errorMessage, 
      duration: 5000,
      closable: true
    });
  }
}

// WHEN SENDING FOR REJECT
async function rejectManyExtractedResources(selectedResources: Array<ExtractedResourceLong>, selectedStatus: ExtractedResourceStatus) {
  const resourcesToUpdate: { id: string; status: ExtractedResourceStatus; isFinalApproval:boolean; isReSubmit:boolean }[] = []
  selectedResources.forEach((resource) => {
    resourcesToUpdate.push({ id: resource.id, status: selectedStatus, labelIds: resource.labelIds, isFinalApproval : resource.isFinalApproval, isReSubmit: ((selectedStatus === "ACCEPTED" || selectedStatus === "IN_REVIEW") && (resource.status === "REJECTED")) ? true : false })
  })
  try {
    await $client.dLSession.rejectManyExtractedResources.mutate({
      dLSessionId: route.params.id != null ? route.params.id.toString() : '',
      extractedResources: resourcesToUpdate,
    })
    notification.success({ content: `Successfully rejected ${selectedResources.length} Image${selectedResources.length > 1 ? 's' : ''}`, duration: 2000 })
    chosenExtractedResources.value = []
    
    // Refresh resources from server
    await refreshResources()
    
    // Wait for the query to complete and data to be available
    await nextTick()
    
    // If active resource was one of the rejected resources, update it with fresh data
    if (activeResource.value) {
      const activeResourceId = activeResource.value.id
      const wasRejected = selectedResources.some(r => r.id === activeResourceId)
      
      if (wasRejected) {
        // Find the updated resource by ID
        const updatedResource = extractedResources.value?.find((d: ExtractedResourceLong) => d.id === activeResourceId)
        
        if (updatedResource) {
          // Update active resource with fresh data from server
          activeResource.value = updatedResource
          
          // Wait for Vue to update the prop before refreshing preview
          await nextTick()
          
          // Refresh the preview component to reflect the updated resource data
          if (dLPreviewSession.value) {
            dLPreviewSession.value.refreshActiveResource()
          }
        } else {
          // Resource not found - might be filtered out due to status change
          activeResource.value = null
        }
      }
    }
  } catch (error: any) {
    notification.error({ content: `Error in rejecting Image: ${error.message || 'Unknown error'}`, duration: 2000 })
  }
}

// WHEN SENDING FOR ACCEPT
async function acceptManyExtractedResources(selectedResources: Array<ExtractedResourceLong>, selectedStatus: ExtractedResourceStatus) {
  const resourcesToUpdate: { id: string; status: ExtractedResourceStatus; isFinalApproval:boolean; isReSubmit:boolean }[] = []
  selectedResources.forEach((resource) => {
    resourcesToUpdate.push({ id: resource.id, status: selectedStatus, labelIds: resource.labelIds, isFinalApproval : resource.isFinalApproval, isReSubmit: ((selectedStatus === "ACCEPTED" || selectedStatus === "IN_REVIEW") && (resource.status === "REJECTED")) ? true : false })
  })
  try {
    await $client.dLSession.acceptManyExtractedResources.mutate({
      dLSessionId: route.params.id != null ? route.params.id.toString() : '',
      extractedResources: resourcesToUpdate,
    })
    notification.success({ content: `Successfully accepted ${selectedResources.length} Image${selectedResources.length > 1 ? 's' : ''}`, duration: 2000 })
    chosenExtractedResources.value = []
    
    // Refresh resources from server
    await refreshResources()
    
    // Wait for the query to complete and data to be available
    await nextTick()
    
    // If active resource was one of the accepted resources, update it with fresh data
    if (activeResource.value) {
      const activeResourceId = activeResource.value.id
      const wasAccepted = selectedResources.some(r => r.id === activeResourceId)
      
      if (wasAccepted) {
        // Find the updated resource by ID
        const updatedResource = extractedResources.value?.find((d: ExtractedResourceLong) => d.id === activeResourceId)
        
        if (updatedResource) {
          // Update active resource with fresh data from server
          activeResource.value = updatedResource
          
          // Wait for Vue to update the prop before refreshing preview
          await nextTick()
          
          // Refresh the preview component to reflect the updated resource data
          if (dLPreviewSession.value) {
            dLPreviewSession.value.refreshActiveResource()
          }
        } else {
          // Resource not found - might be filtered out due to status change
          activeResource.value = null
        }
      }
    }
  } catch (error: any) {
    notification.error({ content: `Error in accepting Image: ${error.message || 'Unknown error'}`, duration: 2000 })
  }
}
async function sendPatientForQC() {
  let filterPendingPatient:any = extractedResources.value?.filter(l => l.status === "PENDING" || l.isReSubmitApprover === true).map((resource: any) => toRaw({resource})) ?? []
  let filetrArray  = JSON.parse(JSON.stringify(filterPendingPatient));
  const idAndStatusArray = filetrArray.map((item:any) => ({ id: item.resource.id, status: item.resource.status }));

  if (filter.patientId && filterPendingPatient?.length > 0){
    try{
      await $client.dLSession.sendPatientForQC.mutate({
        dLSessionId: route.params.id != null ? route.params.id.toString() : '',
        patientId: filter.patientId,
        patientApproval : idAndStatusArray
      })
      chosenExtractedResources.value = []
      filterPendingPatient = []
      await refreshResources()
    } catch (error: unknown) {
      const errorMessage = formatErrorMessage(error)
      notification.error({ 
        content: errorMessage, 
        duration: 5000,
        closable: true
      });
    }
  }
    
}
// Add Comment
watch (() => [comment.value], () => {
  updateSingleComment()
})
async function updateSingleComment() {
  if (activeResource.value) {
    // Check if activeResource exists before accessing its properties
    if (!activeResource.value) {
      return
    }
    
    // Get the comment value (already trimmed by Preview component)
    const commentToSave = comment.value || ''
    
    // Save the comment (empty string is allowed to clear comments)
    // The Preview component already handles preventing whitespace-only comments
    await $client.extractedResource.update.mutate({
      id: activeResource.value.id,
      sessionId:route.params.id as string,
      metadata: { ...activeResource.value.metadata, comment: commentToSave },
    })
    
    activeResource.value.metadata.comment = commentToSave
    notification.success({ content: `Comment Updated Successfully`, duration: 2000 })
  }
}

// Resources download
async function downloadResources(versionName?: string, purpose? : string) {
  var sessionName : string = ''
  if(versionName){
    sessionName = versionName
  } else {
    sessionName = session.value?.name
  }

  const downloadFilter = {
    sessionName: sessionName ?? undefined,
    dLSessionId: route.params.id as string,
    labelIds: filter.labelIds,
    patientId: filter.patientId ?? undefined,
    unLabelled: filter.unLabelled ?? undefined,
    unAnnotated: filter.unAnnotated ?? undefined,
    annotated: filter.annotated ?? undefined,
    isApproved: filter.isApproved ?? undefined,
    imageId: filter.imageId ?? undefined,
    status: filter.status ?? undefined,
    name: session.value?.name ?? undefined,
    versionName: versionName ?? undefined,
    purpose : purpose ?? undefined
  }

  if (versionName && generateVersion.value.majorVersion && generateVersion.value.minorVersion) {
    try {
      const majorVersion = generateVersion.value.majorVersion ?? '';
      const minorVersion = generateVersion.value.minorVersion ?? '';

      // Validate version format: prevent trailing zeros (e.g., 1.000000000)
      if (minorVersion !== String(parseInt(minorVersion, 10))) {
        notification.error({ 
          content: `Invalid minor version format: ${minorVersion}. Version must not have leading zeros or trailing zeros. Use single digit format (0-9).`, 
          duration: 5000 
        });
        return;
      }

      if (majorVersion !== String(parseInt(majorVersion, 10))) {
        notification.error({ 
          content: `Invalid major version format: ${majorVersion}. Version must not have leading zeros.`, 
          duration: 5000 
        });
        return;
      }

      const majorVersionNum = parseInt(majorVersion, 10);
      const minorVersionNum = parseInt(minorVersion, 10);

      if (isNaN(majorVersionNum) || isNaN(minorVersionNum)) {
        notification.error({ 
          content: `Invalid version format. Both major and minor versions must be numbers.`, 
          duration: 5000 
        });
        return;
      }

      // Prevent version 0.0 - only allow versions starting from 1.0
      if (majorVersionNum === 0 && minorVersionNum === 0) {
        notification.error({ 
          content: `Version 0.0 is not allowed. Versions must start from 1.0.`, 
          duration: 5000 
        });
        return;
      }

      // Prevent major version less than 1
      if (majorVersionNum < 1) {
        notification.error({ 
          content: `Major version must be at least 1. Version ${majorVersion}.${minorVersion} is invalid. Please start from 1.0.`, 
          duration: 5000 
        });
        return;
      }

      // Check if version already exists before fetching JSON data
      const versionCheck = await $client.dLSession.checkVersionExists.query({
        dLSessionId: route.params.id as string,
        majorVersion: majorVersion,
        minorVersion: minorVersion
      })

      if (versionCheck.exists) {
        notification.error({ 
          content: `Version ${versionCheck.version} already exists for this session`, 
          duration: 5000 
        });
        return;
      }

      const jsonString = await fetchExtractedResourcesJSON(downloadFilter)
      const jsonData = JSON.parse(jsonString)

      
      const versionResponse = await $client.dLSession.createVersion.mutate({
        dLSessionId: route.params.id as string,
        purpose: generateVersion.value.purposeForDownload ?? '',
        majorVersion: majorVersion,
        minorVersion: minorVersion,
        versionMetaData: jsonData
      })
      
      if (versionResponse.success && versionResponse.version) {
        versionName = versionResponse.version?.majorVersion + '.' + versionResponse.version?.minorVersion
        versionsLoaded.value = true;
        await refreshVersions()
        notification.success({ content: 'Version created successfully', duration: 3000 });
      } else {
        notification.error({ content: 'Failed to create version', duration: 5000 });
        return;
      }
    } catch (error: unknown) {
      const errorMessage = formatErrorMessage(error)
      notification.error({ 
        content: `Error creating version: ${errorMessage}`, 
        duration: 5000,
        closable: true
      });
      return;
    }
  }

  await downloadExtractedResources(downloadFilter)
  
  closeGenerateVersion();
}

// Download version metadata
async function downloadVersionMetadataHandler(row: VersionHistoryItem) {
  try {
    // Format date as DDMMYY
    const dateOnly = row.dateTime.split(' ')[0]; // Gets "DD/MM/YYYY"
    const [day, month, year] = dateOnly.split('/');
    const dateStr = `${day}${month}${year.slice(-2)}`; // Converts to "DDMMYY"
    const fileName = `${row.session}_${row.version}_created-${dateStr}.json`;
    
    await downloadVersionMetadata(row.id, fileName);
    notification.success({ content: 'Version downloaded successfully', duration: 3000 });
  } catch (error: unknown) {
    const errorMessage = formatErrorMessage(error)
    notification.error({ 
      content: `Failed to download version: ${errorMessage}`, 
      duration: 5000,
      closable: true
    });
  }
}

// Resources upload
async function uploadToLinkExtractedResources({
  file,
  onProgress,
  onFinish,
  onError,
}: UploadCustomRequestOptions) {
  const reader = new FileReader()
  if (reader && file.file !== null) {
    const filename = file.file.name.trim()  
    if (filename.startsWith('.')) {
      notification.error({
        content: 'Filename cannot be empty',
        duration: 5000,
      })
      onError()
      return
    }
    
    reader.onload = async (event) => {
      if (event.target?.result) {
        const result = JSON.parse(event.target.result as string)
        const formattedData = result.extractedResources ? 
        result : 
        {
          extractedResources: Array.isArray(result) ? result : [result]
        }
        await $client.dLSession.linkExtractedResources.mutate({
          dLSessionId: route.params.id.toString(),
          filename: filename,
          extractedResources: formattedData.extractedResources,
        }).then((response) => {
          notification.success({ 
            content: `The File Extracted Successfully ${filename} and Linked ${response.count} resources`,
            duration: 11000,
            closable: true
          })
          onFinish()
        }).catch((error: unknown) => {
          const errorMessage = formatErrorMessage(error)
          const errorWithCode = error as ErrorWithCode
          
          // Handle duplicate error from service layer
          if (errorWithCode?.data?.code === 'CONFLICT' || errorMessage.toLowerCase().includes('already exist') || errorMessage.toLowerCase().includes('duplicate')) {
            notification.warning({ 
              content: errorMessage,
              duration: 5000 
            })
          } else {
            notification.error({
              content: `Error linking extracted resources: ${errorMessage}`,
              duration: 5000,
              closable: true
            })
          }
          onError() 
        })
      }
    }
    reader.addEventListener('progress', (event) => {
      if (event.loaded && event.total) {
        const percent = (event.loaded / event.total) * 100
        onProgress({ percent })
      }
    })
    reader.readAsText(file.file)
  }
}
const uploadRef = ref<UploadInst | null>(null)
// Upload is disabled when pending filter is selected
const showFileUpload = computed(
  () => false, // Always hide upload - disabled when pending filter is active
)
const isFileImported = ref(false)
const pendingUploadFiles = ref<Array<{ file: File, filename: string, extractedResources: ExtractedResource[] }>>([])
const showDuplicateConfirmationModal = ref<boolean>(false)
const duplicateInfo = ref<{ filesWithDuplicates: Array<{ filename: string, totalImages: number, duplicateCount: number }>, totalDuplicates: number, totalImages: number } | null>(null)
const uploadedFiles = ref<UploadFileInfo[]>([])

function handleFileChange(data: { fileList: UploadFileInfo[] }) {
  uploadedFiles.value = data.fileList || []
  if (uploadedFiles.value.length > 0) {
    isFileImported.value = true
  } else {
    isFileImported.value = false
  }
}

async function upload() {
  if (!uploadRef.value || uploadedFiles.value.length === 0) {
    notification.warning({ content: 'Please select at least one file to upload', duration: 3000 })
    return
  }

  // Read all files and collect extracted resources
  const filesData: Array<{ file: File, filename: string, extractedResources: any[] }> = []
  const allExtractedResourceIds: string[] = []

  try {
    // Read all files
    for (const uploadFile of uploadedFiles.value) {
      if (!uploadFile.file) continue
      
      const file = uploadFile.file
      const filename = file.name.trim()
      
      if (filename.startsWith('.')) {
        notification.error({
          content: `Filename cannot be empty: ${filename}`,
          duration: 5000,
        })
        continue
      }

      // Read file content
      try {
        const fileContent = await readFileContent(file)
        const result = JSON.parse(fileContent)
        const formattedData = result.extractedResources ? 
          result : 
          {
            extractedResources: Array.isArray(result) ? result : [result]
          }

        // Collect all resource IDs
        formattedData.extractedResources.forEach((resource: any) => {
          if (resource.id) {
            allExtractedResourceIds.push(resource.id)
          }
        })

        filesData.push({
          file,
          filename,
          extractedResources: formattedData.extractedResources
        })
      } catch (fileError: unknown) {
        const errorMessage = formatErrorMessage(fileError)
        notification.error({
          content: `Error reading file "${filename}": ${errorMessage}`,
          duration: 5000,
          closable: true
        })
        // Continue with other files
        continue
      }
    }

    if (filesData.length === 0) {
      notification.error({ content: 'No valid files to upload', duration: 5000 })
      return
    }

    // Check for duplicates using existing function with returnDuplicateInfo flag
    // We'll check each file separately to get per-file duplicate info
    const filesWithDuplicates: Array<{ filename: string, totalImages: number, duplicateCount: number }> = []
    let totalDuplicates = 0
    let totalImages = 0
    
    // Calculate total images across all files
    filesData.forEach(fileData => {
      totalImages += fileData.extractedResources.length
    })
    
    for (const fileData of filesData) {
      const fileResourceIds = fileData.extractedResources.map((r: ExtractedResource) => r.id).filter(Boolean)
      
      if (fileResourceIds.length > 0) {
        try {
          // Use linkExtractedResources with returnDuplicateInfo=true to check duplicates
          const duplicateCheck = await $client.dLSession.linkExtractedResources.mutate({
            dLSessionId: route.params.id.toString(),
            filename: fileData.filename,
            extractedResources: fileData.extractedResources,
            returnDuplicateInfo: true,
          }) as DuplicateCheckResponse

          if (duplicateCheck && duplicateCheck.hasDuplicates) {
            filesWithDuplicates.push({
              filename: fileData.filename,
              totalImages: fileData.extractedResources.length,
              duplicateCount: duplicateCheck.duplicateCount || 0,
            })
            totalDuplicates += duplicateCheck.duplicateCount || 0
          }
        } catch (error: unknown) {
          // If error, assume no duplicates for this file
          console.error(`Error checking duplicates for ${fileData.filename}:`, error)
          // Don't throw - continue processing other files
        }
      }
    }

    if (filesWithDuplicates.length > 0) {
      // Show confirmation modal
      duplicateInfo.value = {
        filesWithDuplicates,
        totalDuplicates,
        totalImages,
      }
      pendingUploadFiles.value = filesData
      showDuplicateConfirmationModal.value = true
    } else {
      // No duplicates, proceed with upload
      await processUpload(filesData, false)
    }
  } catch (error: unknown) {
    const errorMessage = formatErrorMessage(error)
    notification.error({
      content: `Error reading files: ${errorMessage}`,
      duration: 5000,
      closable: true
    })
  }
}

// Helper function to read file content
function readFileContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('File is null or undefined'))
      return
    }
    
    const reader = new FileReader()
    
    reader.onload = (event) => {
      try {
        if (event.target?.result) {
          resolve(event.target.result as string)
        } else {
          reject(new Error('Failed to read file: No result from FileReader'))
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        reject(new Error(`Error processing file: ${errorMessage}`))
      }
    }
    
    reader.onerror = (error) => {
      reject(new Error(`FileReader error: ${error.type || 'Unknown error'}`))
    }
    
    reader.onabort = () => {
      reject(new Error('File reading was aborted'))
    }
    
    try {
      reader.readAsText(file)
    } catch (error: any) {
      reject(new Error(`Error starting file read: ${error.message}`))
    }
  })
}

// Process upload with or without duplicates
async function processUpload(filesData: Array<{ file: File, filename: string, extractedResources: ExtractedResource[] }>, skipDuplicates: boolean) {
  try {
    let totalLinked = 0
    let totalSkipped = 0
    const uploadedFilesList: Array<{ filename: string, count: number }> = []

    // Process each file
    for (const fileData of filesData) {
      try {
        const result = await $client.dLSession.linkExtractedResources.mutate({
          dLSessionId: route.params.id.toString(),
          filename: fileData.filename,
          extractedResources: fileData.extractedResources,
          skipDuplicates: skipDuplicates,
        })
        
        totalLinked += result.count
        const skipped = fileData.extractedResources.length - result.count
        if (skipped > 0) {
          totalSkipped += skipped
        }
        
        // Track successful uploads for the list
        uploadedFilesList.push({
          filename: fileData.filename,
          count: result.count
        })
      } catch (error: unknown) {
        const errorMessage = formatErrorMessage(error)
        notification.error({
          content: `Error uploading file "${fileData.filename}": ${errorMessage}`,
          duration: 5000,
          closable: true
        })
      }
    }

    // Show success message with file list
    if (uploadedFilesList.length > 0) {
      let successMessage = '\n'
      uploadedFilesList.forEach((fileInfo) => {
        successMessage += `File: ${fileInfo.filename} and Extracted ${fileInfo.count} Resources\n`
      })
      
      // Remove trailing newline
      successMessage = successMessage.trim()
      
      // Add duplicate info if any
      if (totalSkipped > 0) {
        successMessage += `\n${totalSkipped} duplicate(s) skipped.`
      }
      notification.success({ 
        content: successMessage,
        duration: 11000,
        closable: true,
      })
    }

    // Clear upload and refresh
    uploadRef.value?.clear()
    isFileImported.value = false
    pendingUploadFiles.value = []
    uploadedFiles.value = []
    await refreshResources()
  } catch (error: unknown) {
    const errorMessage = formatErrorMessage(error)
    notification.error({
      content: `Error during file upload: ${errorMessage}`,
      duration: 11000,
      closable: true
    })
  }
}

// Handle confirmation modal responses
async function handleDuplicateConfirmation(proceed: boolean) {
  showDuplicateConfirmationModal.value = false
  
  if (proceed && pendingUploadFiles.value.length > 0) {
    // User clicked Yes - proceed with upload skipping duplicates
    await processUpload(pendingUploadFiles.value, true)
  } else {
    // User clicked No - cancel upload
    uploadRef.value?.clear()
    isFileImported.value = false
    pendingUploadFiles.value = []
    uploadedFiles.value = []
  }
  
  duplicateInfo.value = null
}

function scrollToImage() {
  if(imageIndex.value) {
    let wrapper = document.querySelector('#image-wrapper')
    let image = wrapper.querySelector('#image_' + Number(imageIndex.value))
    image.scrollIntoView({ behavior: 'smooth' })
    imageIndex.value = 0
  }
}

watch(() => filter.unLabelled, (newUnLabelled) => {
  if (newUnLabelled) {
    filter.labelIds = []
  }
})

watch(() => filter.unAnnotated, (newunAnnotated) => {
  if (filter.unAnnotated) {
    filter.annotated = false
  }
})

watch(() => filter.annotated, (newannotated) => {
  if (filter.annotated) {
    filter.unAnnotated = false
  }
})

function handleSelectLabelChange(value: string[] | null) {
  if (value && value.length > 0) {
    filter.unLabelled = false
  }
}

const activeChoosenImage = (data: any)=>{
  chosenExtractedResources.value = []
  activeResource.value = data
  chosenExtractedResources.value.push(data)
}

// Generate Version for Download
function openGenerateVersionSession(){
  isGenerateVersion.value = true;
  activeVersionTab.value = 'generate';
  versionsLoaded.value = true;
  refreshVersions();
}

async function generateVersionForDownload() {
  if (!generateVersion.value.majorVersion || !generateVersion.value.minorVersion) {
    notification.warning({ 
      content: 'Please enter both major and minor version numbers', 
      duration: 5000 
    });
    return;
  }

  try {
    const majorVersion = generateVersion.value.majorVersion ?? '';
    const minorVersion = generateVersion.value.minorVersion ?? '';
    const dLSessionId = route.params.id as string;

    // Validate version format: prevent trailing zeros (e.g., 1.000000000)
    // Check if minor version has leading zeros or multiple zeros
    if (minorVersion !== String(parseInt(minorVersion, 10))) {
      notification.error({ 
        content: `Invalid minor version format: ${minorVersion}. Version must not have leading zeros or trailing zeros. Use single digit format (0-9).`, 
        duration: 5000 
      });
      isVersionDownload.value = true;
      return;
    }

    // Validate major version format: prevent trailing zeros
    if (majorVersion !== String(parseInt(majorVersion, 10))) {
      notification.error({ 
        content: `Invalid major version format: ${majorVersion}. Version must not have leading zeros.`, 
        duration: 5000 
      });
      isVersionDownload.value = true;
      return;
    }

    // Validate minor version format and range (0-9 only)
    const minorVersionNum = parseInt(minorVersion, 10);
    if (isNaN(minorVersionNum)) {
      notification.error({ 
        content: `Invalid minor version format: ${minorVersion}. Must be a number.`, 
        duration: 5000 
      });
      isVersionDownload.value = true;
      return;
    }

    // Validate major version format
    const majorVersionNum = parseInt(majorVersion, 10);
    if (isNaN(majorVersionNum)) {
      notification.error({ 
        content: `Invalid major version format: ${majorVersion}. Must be a number.`, 
        duration: 5000 
      });
      isVersionDownload.value = true;
      return;
    }

    // Prevent version 0.0 - only allow versions starting from 1.0
    if (majorVersionNum === 0 && minorVersionNum === 0) {
      notification.error({ 
        content: `Version 0.0 is not allowed. Versions must start from 1.0.`, 
        duration: 5000 
      });
      isVersionDownload.value = true;
      return;
    }

    // Prevent major version less than 1
    if (majorVersionNum < 1) {
      notification.error({ 
        content: `Major version must be at least 1. Version ${majorVersion}.${minorVersion} is invalid. Please start from 1.0.`, 
        duration: 5000 
      });
      isVersionDownload.value = true;
      return;
    }

    if (minorVersionNum < 0 || minorVersionNum > 9) {
      const nextMajorVersion = String(parseInt(majorVersion, 10) + 1);
      notification.error({ 
        content: `Minor version must be between 0-9. Version ${majorVersion}.${minorVersion} is invalid. Please start from ${nextMajorVersion}.0 instead.`, 
        duration: 5000 
      });
      isVersionDownload.value = true;
      return;
    }

    // Check if version already exists using checkVersionExists
    const existingVersion = await $client.dLSession.checkVersionExists.query({
      dLSessionId,
      majorVersion,
      minorVersion
    });

    if (existingVersion.exists) {
      notification.error({ 
        content: `Version ${existingVersion.version} already exists for this session`, 
        duration: 5000 
      });
      isVersionDownload.value = true;
      return;
    }

    // Check if previous minor version exists (if minorVersion > 0)
    if (minorVersionNum > 0) {
      const previousMinorVersion = String(minorVersionNum - 1);
      const previousVersionCheck = await $client.dLSession.checkVersionExists.query({
        dLSessionId,
        majorVersion,
        minorVersion: previousMinorVersion
      });
      
      if (!previousVersionCheck.exists) {
        notification.error({ 
          content: `Cannot create version ${majorVersion}.${minorVersion}. Previous version ${majorVersion}.${previousMinorVersion} does not exist. Please create ${majorVersion}.${previousMinorVersion} first.`, 
          duration: 5000 
        });
        isVersionDownload.value = true;
        return;
      }
    }

    // When creating a new major version (e.g., 2.0), check if previous major version's last minor (1.9) exists
    if (!isNaN(majorVersionNum) && majorVersionNum > 1 && minorVersionNum === 0) {
      const previousMajorVersion = String(majorVersionNum - 1);
      const lastMinorOfPreviousMajor = '9';
      const previousMajorLastMinorCheck = await $client.dLSession.checkVersionExists.query({
        dLSessionId,
        majorVersion: previousMajorVersion,
        minorVersion: lastMinorOfPreviousMajor
      });
      
      if (!previousMajorLastMinorCheck.exists) {
        notification.error({ 
          content: `Cannot create version ${majorVersion}.${minorVersion}. Previous major version ${previousMajorVersion}.${lastMinorOfPreviousMajor} does not exist. Please create ${previousMajorVersion}.${lastMinorOfPreviousMajor} first.`, 
          duration: 5000 
        });
        isVersionDownload.value = true;
        return;
      }
    }

    // Version is valid, allow generation
    isVersionDownload.value = false;
  } catch (error: unknown) {
    const errorMessage = formatErrorMessage(error)
    notification.error({ 
      content: `Error validating version: ${errorMessage}`, 
      duration: 5000,
      closable: true
    });
    isVersionDownload.value = true;
  }
}

function closeGenerateVersion() {
  isGenerateVersion.value = false;
  generateVersion!.value = {
    purposeForDownload: null,
    majorVersion: null,
    minorVersion: null,
    date: new Date()
  }
  isVersionDownload.value = true;
  activeVersionTab.value = 'generate';
}

function formatDateToTimeString(date: Date) {
  const dt = new Date(date);
  const day = String(dt.getDate()).padStart(2, '0');
  const month = String(dt.getMonth() + 1).padStart(2, '0');
  const year = String(dt.getFullYear()).slice(2);
  return `${day}${month}${year}`;
}

function onlyAllowNumber(value: string){
  return !value || /^\d+$/.test(value)
} 

const canUploadJSON = ref<boolean>(false);
const canDownloadJSON = ref<boolean>(false);
const canDownloadAsVersion = ref<boolean>(false);

// S3 Modal reactive variables
const isPushingToS3 = ref<boolean>(false); // Permission flag - controls dropdown visibility
const isPushingToS3Loading = ref<boolean>(false); // Loading state - for UI feedback
const s3ModalMode = ref<'push' | 'upload'>('push');
const isPushToS3Modal = ref<boolean>(false);
const s3Config = ref({
  folderUrl: '',
});

// S3 folder existence confirmation state
const showFolderConfirmModal = ref<boolean>(false);
const folderExists = ref<boolean>(false);
const pendingS3Upload = ref<{
  folderPath: string;
  fileName: string;
  jsonData?: any;
} | null>(null);

async function checkAbilities() {
  canUploadJSON.value = await defineAbilitiesFor(Module.JSON, Action.UploadJSON);
  canDownloadJSON.value = await defineAbilitiesFor(Module.JSON, Action.DownloadJSON);
  canDownloadAsVersion.value = await defineAbilitiesFor(Module.JSON, Action.DownloadAsVersion);
  
  // Check both upload and download permissions for S3
  const [canUploadS3, canDownloadS3] = await Promise.all([
    defineAbilitiesFor(Module.JSON, Action.UploadJSON),
    defineAbilitiesFor(Module.JSON, Action.DownloadJSON)
  ]);
  isPushingToS3.value = canUploadS3 && canDownloadS3;
}

onMounted(() => {
  checkAbilities();
});

watch(route, () => {
  checkAbilities();

});

const downloadOptions = computed(() => [
  {
    label: 'Download JSON',
    key: 'DownloadJSON',
    visible: canDownloadJSON.value
  },
  {
    label: 'Download as version',
    key: 'DownloadAsVersion',
    visible: canDownloadAsVersion.value
  },
  {
    label: 'Push to S3',
    key: 'PushToS3',
    visible: isPushingToS3.value
  }
]);

const filteredDownloadOptions = computed(() =>
  downloadOptions.value.filter((data) => data.visible)
);

function downloadSelect(key: string | number) {
  if(String(key) == 'DownloadAsVersion'){
    openGenerateVersionSession()
  } else if(String(key) == 'DownloadJSON'){
    downloadResources()
  } else if(String(key) === 'PushToS3'){
    openS3Modal('push');
  }
}

// S3 Modal functions
function openS3Modal(mode: 'push' | 'upload' = 'push') {
  s3ModalMode.value = mode;
  isPushToS3Modal.value = true;
}

function closeS3Modal() {
  isPushToS3Modal.value = false;
  s3Config.value.folderUrl = '';
}

async function handleS3Action() {
  try {
    if (!s3Config.value.folderUrl) {
      notification.error({
        content: 'Please enter S3 folder URL',
        duration: 5000,
      });
      return;
    }

    if (s3ModalMode.value === 'push') {
      isPushingToS3Loading.value = true;
      
      const folderPath = s3Config.value.folderUrl.trim();
      
      // Check if folder exists
      const folderCheckResult = await $client.dLSession.checkS3FolderExists.query({
        folderPath: folderPath,
      });
      
      folderExists.value = folderCheckResult.exists;
      
      // If folder doesn't exist, show confirmation modal
      if (!folderCheckResult.exists) {
        const fileName = `${session.value?.name || 'unnamed_session'}.json`;
        // Store pending upload data
        pendingS3Upload.value = {
          folderPath: folderPath,
          fileName: fileName,
        };
        showFolderConfirmModal.value = true;
        isPushingToS3Loading.value = false;
        return;
      }
      
      // Folder exists, proceed with upload
      await proceedWithS3Upload(folderPath);
    }
  } catch (error: any) {
    notification.error({
      content: error.message || 'Failed to push to S3',
      duration: 5000,
    });
  } finally {
    isPushingToS3Loading.value = false;
  }
}

async function proceedWithS3Upload(folderPath: string) {
  try {
    isPushingToS3Loading.value = true;
    
    // Fetch JSON data using existing download function
    const jsonString = await fetchExtractedResourcesJSON({
      sessionName: session.value?.name ?? undefined,
      dLSessionId: route.params.id as string,
      labelIds: filter.labelIds,
      patientId: filter.patientId ?? undefined,
      unLabelled: filter.unLabelled ?? undefined,
      unAnnotated: filter.unAnnotated ?? undefined,
      annotated: filter.annotated ?? undefined,
      isApproved: filter.isApproved ?? undefined,
      imageId: filter.imageId ?? undefined,
      status: filter.status ?? undefined,
      name: session.value?.name ?? undefined,
    });

    const jsonData = JSON.parse(jsonString);
    
    // Add metadata structure
    const jsonDataWithMetadata = {
      metadata: {
        sessionInfo: {
          name: session.value?.name,
          id: route.params.id,
          project: session.value?.project,
        },
        filters: {
          labelIds: filter.labelIds,
          patientId: filter.patientId,
          unLabelled: filter.unLabelled,
          unAnnotated: filter.unAnnotated,
          annotated: filter.annotated,
          isApproved: filter.isApproved,
          status: filter.status,
        },
      },
      data: jsonData,
    };

    const fileName = `${session.value?.name || 'unnamed_session'}.json`;
    const key = folderPath
      ? `${folderPath}/${fileName}`.replace(/\/+/g, '/').replace(/^\/+/, '')
      : fileName;

    // Call tRPC procedure to push to S3
    await $client.dLSession.pushJsonToS3.mutate({
      dLSessionId: route.params.id as string,
      key: key,
      jsonData: jsonDataWithMetadata,
    });

    notification.success({
      content: 'Successfully uploaded to S3',
      duration: 5000,
    });
    
    closeS3Modal();
  } catch (error: any) {
    notification.error({
      content: error.message || 'Failed to push to S3',
      duration: 5000,
    });
    throw error;
  } finally {
    isPushingToS3Loading.value = false;
  }
}

async function handleFolderConfirmUpload() {
  if (!pendingS3Upload.value) {
    showFolderConfirmModal.value = false;
    return;
  }
  
  try {
    showFolderConfirmModal.value = false;
    await proceedWithS3Upload(pendingS3Upload.value.folderPath);
    pendingS3Upload.value = null;
  } catch (error: any) {
    // Error already handled in proceedWithS3Upload
    pendingS3Upload.value = null;
  }
}

function handleFolderConfirmCancel() {
  showFolderConfirmModal.value = false;
  pendingS3Upload.value = null;
  isPushingToS3Loading.value = false;
}

const refreshDataGrid = async()=>{
  // Check if activeResource exists before accessing its id
  if (!activeResource.value) {
    return
  }
  
  const extractedResourceId = activeResource.value.id
  const oldIndex = extractedResources.value?.findIndex((d: ExtractedResourceLong) => d.id === extractedResourceId)
  
  await refreshResources()
  chosenExtractedResources.value = []
  
  // Use find instead of filter + forEach
  if (extractedResources.value && oldIndex !== undefined && oldIndex !== -1) {
    const resource = extractedResources.value[oldIndex]
    if (resource) {
      chosenExtractedResources.value = [resource]
      activeResource.value = resource
    }
  } else {
    // Fallback: find by ID if index-based lookup fails
    const resource = extractedResources.value?.find((d: ExtractedResourceLong) => d.id === extractedResourceId)
    if (resource) {
      chosenExtractedResources.value = [resource]
      activeResource.value = resource
    } else {
      activeResource.value = null
    }
  }

  if (activeResource.value) {
    await nextTick()
    dLPreviewSession.value?.refreshActiveResource()
  }
}

// Handle refresh resources event from DataView component (e.g., when labels are deleted)
async function handleRefreshResources() {
  await refreshResources()
  // Refresh filter options if freeze is active to show updated labels in dropdown
  if (filter.freeze) {
    await refreshFilterOptions()
  }
  await nextTick()
}

// Handle annotation modal close event
const handleAnnotationModalClosed = (data: { resourceData: ExtractedResourceLong, currentIndex: number, isOpen: boolean, wasAcceptRejectPerformed?: boolean }) => {
  // Update the annotation modal state
  isAnnotationModalOpen.value = data.isOpen
  
  // If accept/reject was performed, close the preview panel
  if (!data.isOpen && data.wasAcceptRejectPerformed) {
    activeResource.value = null
    return
  }
  
  // Only update the active resource when the modal is closed normally
  if (!data.isOpen && data.resourceData && extractedResources.value) {
    const resourceIndex = extractedResources.value.findIndex(resource => resource.id === data.resourceData.id)
    if (resourceIndex !== -1) {
      activeResource.value = extractedResources.value[resourceIndex]
      // Also update the chosen resources if needed
      if (chosenExtractedResources.value.length === 0) {
        chosenExtractedResources.value = [extractedResources.value[resourceIndex]]
      }
    }
  }
}

</script>

<template>
  <div v-if="session">
    <div
      v-if="labelMenu.visible && labelMenu.resources.length"
      ref="labelMenuEl"
      :style="{
        top: `${labelMenu.y}px`,
        left: `${labelMenu.x}px`,
      }"
      class="flex flex-col justify-between z-50 absolute h-[250px] w-[250px] gap-y-4 px-2 py-2 bg-neutral-800"
    >
      <!-- Search Input -->
      <div class="flex-shrink-0">
        <NInput
          v-model:value="labelMenuSearchQuery"
          placeholder="Search label"
          clearable
          size="small"
        >
          <template #prefix>
            <svg
              viewBox="0 0 1024 1024"
              fill="currentColor"
              style="width: 14px; height: 14px; color: #8c8c8c"
            >
              <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1c-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z" />
            </svg>
          </template>
        </NInput>
      </div>
      <!-- Labels List -->
      <div class="flex flex-col flex-1 overflow-auto gap-y-2">
        <div v-for="label in filteredLabels" :key="label.id" class="inline-flex items-center justify-start w-full gap-1 select-none">
          <SessionDLLabelCheckbox :status="getLabelCheckedStatus(labelMenu.resources, label.id)" @click="handleLabelStatusChange(label)" />
          <p>{{ label.name }}</p>
        </div>
      </div>
      <NButton 
        :strong="true" 
        type="primary" 
        @click="saveExtractedResourcesLabels"
      >
        APPLY
      </NButton>
    </div>
    <SessionHeader
      :session="session"
      :epicName="epicName ? epicName : 'Unknown'"
      :projectName="projectName ? projectName : 'Unknown'"
      :username="user.name"
      :stage="sessionUserRole === 'QUALITY_CONTROLLER' ? 'QUALITY CHECKER' : 'ACTIVITY'"
      :labelled="labelledCount"
      :unLabelled="unLabelledCount"
      :annotated="annotatedCount"
      :annotatedStatus="filter.unAnnotated"
      :total="totalCount"
      :annotatedLoading="annotatedCountLoading"
      :loading="labelCountLoading"
      :epicId ="epicId"
      :projectId = "projectId"
    />
    <!-- FILTER HEADER -->
    <div
      v-if="!showFileUpload || !canUploadJSON"
      class="bg-neutral-900 z-30"
    >
       <!-- <div class="flex flex-col gap-y-4 w-[50%]">
            <NButton
              :disabled="!isFileImported"
              @click="upload"
            >
              Upload Files
            </NButton>
            <div>
              <NUpload
                ref="uploadRef"
                :default-upload="false"
                :multiple="true"
                @change="handleFileChange"
              >
                <NUploadDragger>
                  <div class="flex flex-col items-center justify-center gap-y-10">
                    <Icon name="ph:upload" class="text-3xl" />
                    <p>
                      Click or drag files to this area to upload
                    </p>
                    <p class="text-sm text-neutral-400">
                      You can select multiple files
                    </p>
                  </div>
                </NUploadDragger>
              </NUpload>
            </div>
          </div> -->
      <div class="flex flex-row items-center justify-between gap-5 px-2 py-4 text-neutral-100">
            <div class="flex flex-row justify-between items-center gap-5 w-[93%]">
              <div class="w-[20%]">
                <NSelect
                  v-model:value="filter.status"
                  filterable clearable :options="(filter.freeze && filterOptions?.statuses) 
                    ? filterOptions.statuses.map((status: string) => ({
                        label: status,
                        value: status,
                      }))
                    : Object.keys(ExtractedResourceStatus).map((key) => ({
                        label: key,
                        value: key,
                      }))"
                  placeholder="Select status"
                />
              </div>
              <div class="w-[40%]">
                <NSelect
                  v-model:value="filter.labelIds"
                  filterable clearable multiple :options="dropdownLabels" label-field="name" value-field="id"
                  :max-tag-count="3" placeholder="Select label(s)"
                  :render-tag="renderLabelTags"
                  @update:value="handleSelectLabelChange"
                />
              </div>
              <div class="w-[40%]">
                <NSelect
                  v-model:value="filter.patientId"
                  :render-label="renderPatientOptions"
                  filterable clearable :options="patients" label-field="patientId" value-field="patientId"
                  :loading="loadingPatients"
                  placeholder="Select patient"
                  :consistent-menu-width="false"
                />
              </div>
              <div class="w-[40%]">
                <NInput type="text" placeholder="Search Image Id" v-model:value="filter.imageId" />
              </div>
            </div>
            <div v-if="canDownloadJSON || canDownloadAsVersion" class="flex gap-5">
              <NDropdown trigger="hover" :options="filteredDownloadOptions" @select="downloadSelect">
                <NButton>Download</NButton>
              </NDropdown>
              <!-- <NButton @click="openGenerateVersionSession()">
                Download as version
              </NButton> -->
              <NModal v-model:show="isGenerateVersion">
                <NCard class="w-[100vh]" :title="'JSON Version'" :bordered="false" role="dialog" aria-modal="true" closable @close="closeGenerateVersion()">
                  <div class="py-4">
                    <NTabs v-model:value="activeVersionTab" default-value="generate" type="line">
                      <NTabPane name="generate" tab="Generate New">
                        <NForm
                          :model="generateVersion" label-placement="left" require-mark-placement="right-hanging" size="medium"
                          label-width="auto"
                        >
                          <NFormItem label="Session name" path="sessionName">
                            <NInput v-model:value="session.name" :disabled="true" placeholder="Give the Session name" />
                          </NFormItem>
                          <NFormItem label="Purpose" path="purpose">
                            <NInput v-model:value="generateVersion.purposeForDownload" placeholder="Give the Purpose" />
                          </NFormItem>
                          <p class="mb-5 pl-10">
                            Version Number
                          </p>
                          <NFormItem label="Major version number" path="majorVersionNumber">
                            <n-input :allow-input="onlyAllowNumber" v-model:value="generateVersion.majorVersion" class="w-full" placeholder="Give the Major version number" :show-button="false" @update-value="isVersionDownload = true" />
                          </NFormItem>
                          <NFormItem label="Minor version number" path="minorVersionNumber">
                            <n-input :allow-input="onlyAllowNumber" v-model:value="generateVersion.minorVersion" class="w-full" placeholder="Give the Minor version number" :show-button="false" @update-value="isVersionDownload = true"/>
                          </NFormItem>
                          <NFormItem label="Date" path="date">
                            <n-date-picker :format="'dd/MM/yyyy'" v-model:value="generateVersion.date" class="w-full" type = "date"  :disabled="true"/>
                          </NFormItem>
                          <NFormItem v-if="!isVersionDownload" label="Generated Version" path="generatedVersion">
                            <p class="w-full">
                              {{ session.name + '_' + generateVersion.majorVersion + '.' + generateVersion.minorVersion + '_created-' + formatDateToTimeString(generateVersion.date) + '.json' }}
                            </p>
                          </NFormItem>
                        </NForm>
                      </NTabPane>
                      <NTabPane name="history" tab="Version History">
                        <div class="flex flex-col gap-4 py-4">
                          <NDataTable
                            :columns="versionHistoryColumns"
                            :data="versionHistoryData"
                            :loading="versionHistoryLoading"
                            :bordered="false"
                            size="small"
                          />
                        </div>
                      </NTabPane>
                    </NTabs>
                  </div>
                  <template v-if="activeVersionTab === 'generate'" #footer>
                    <div class="inline-flex items-center justify-end gap-2 w-full">
                      <NButton strong type="primary" @click="generateVersionForDownload()">
                        Generate version
                      </NButton>
                      <NButton strong type="primary" :disabled="isVersionDownload" @click="downloadResources(session.name + '_' + generateVersion.majorVersion + '.' + generateVersion.minorVersion + '_created-' + formatDateToTimeString(generateVersion.date), generateVersion.purposeForDownload ? generateVersion?.purposeForDownload : '')">
                        Download
                      </NButton>
                    </div>
                  </template>
                </NCard>
              </NModal>
              <!-- S3 Push Modal -->
              <NModal v-model:show="isPushToS3Modal">
                <NCard
                  class="w-[50vh]"
                  :title="s3ModalMode === 'push' ? 'Push to S3' : 'Upload from S3'"
                  :bordered="false"
                  role="dialog"
                  aria-modal="true"
                  closable
                  @close="closeS3Modal"
                >
                  <NForm
                    :model="s3Config"
                    label-placement="left"
                    require-mark-placement="right-hanging"
                    size="medium"
                    label-width="auto"
                  >
                    <NFormItem label="S3 Folder URL" path="folderUrl" required>
                      <NInput
                        v-model:value="s3Config.folderUrl"
                        placeholder="Enter S3 folder URL"
                        @keydown.enter.prevent="handleS3Action"
                      />
                    </NFormItem>
                  </NForm>
                  <template #footer>
                    <div class="inline-flex items-center justify-end gap-2 w-full">
                      <NButton 
                        strong 
                        type="primary" 
                        @click="handleS3Action"
                      >
                        {{ s3ModalMode === 'push' ? 'Push' : 'Upload' }}
                      </NButton>
                    </div>
                  </template>
                </NCard>
              </NModal>
              <!-- S3 Folder Confirmation Modal -->
              <NModal v-model:show="showFolderConfirmModal">
                <NCard
                  class="w-[600px]"
                  title="Folder Does Not Exist"
                  :bordered="false"
                  size="huge"
                  role="dialog"
                  aria-modal="true"
                  closable
                  @close="handleFolderConfirmCancel"
                >
                  <div class="whitespace-pre-line">
                    <p class="mb-4">
                      The folder <strong>{{ pendingS3Upload?.folderPath || 'specified folder' }}</strong> does not exist in S3.
                    </p>
                    <p class="font-medium">
                      Do you want to proceed with uploading? The folder will be created automatically.
                    </p>
                  </div>
                  <template #footer>
                    <div class="inline-flex items-center justify-end gap-2 w-full">
                      <NButton strong type="error" @click="handleFolderConfirmCancel">
                        Cancel
                      </NButton>
                      <NButton strong type="success" @click="handleFolderConfirmUpload" :loading="isPushingToS3Loading">
                        Yes, Upload
                      </NButton>
                    </div>
                  </template>
                </NCard>
              </NModal>
              <!-- <NButton @click="downloadResources()">
                Download resources
              </NButton> -->
            </div>
      </div>
          <!-- END FILTER HEADER -->
    </div>
    <!-- Content area -->
    <div 
      class="flex flex-col"
      style="height: calc(100vh - 72px);"
    >
      <div
        v-if="showFileUpload && canUploadJSON"
        class="flex items-center justify-center mt-10"
      >
        <!-- Upload section content -->
      </div>
      <!-- END STICKY HEADER -->
      <div
        v-else
        class="flex flex-col w-full flex-1 overflow-hidden"
      >
        <div class="flex flex-1 overflow-hidden min-h-0">
          <div class="flex flex-col basis-2/3 bg-neutral-950 min-h-0" @contextmenu="showLabelMenu">
            <div class="flex flex-row flex-wrap items-center justify-between w-full px-4 py-2 gap-x-8 flex-shrink-0">
                  <div class="inline-flex items-center gap-2">
                    <NCheckbox v-model:checked="isSelectAllChecked">
                      Select all <h5>Selected: {{ chosenExtractedResources.length }}</h5>
                      <!-- {{ chosenExtractedResources }} -->
                    </NCheckbox>
                   <div class="flex gap-2">
                      <div class="flex flex-col gap-2">
                        <!-- <NCheckbox v-model:checked="isShowStatusSelected">
                          Show status
                        </NCheckbox> -->
                        <NCheckbox v-model:checked="filter.unAnnotated">
                          Filter Unannotated
                        </NCheckbox>
                        <NCheckbox v-model:checked="filter.annotated">
                          Filter Annotated
                        </NCheckbox>
                      </div>
                      <div class="flex flex-col gap-2">
                        <NCheckbox v-model:checked="filter.unLabelled">
                          Filter Unlabelled
                        </NCheckbox>
                        <NCheckbox v-if="sessionUserRole == SessionUserRole.QUALITY_CONTROLLER" v-model:checked="filter.isApproved">
                          Awaiting Approval
                        </NCheckbox>
                      </div>
                   </div>
                  </div>
                  <div class="flex gap-2 items-center">
                    <NButton
                      v-if="!filter.freeze"
                      :strong="true"
                      :secondary="true"
                      type="info"
                      size="small"
                      @click="handleFreeze"
                    >
                      Freeze
                    </NButton>
                    <NButton
                      v-else
                      :strong="true"
                      :secondary="true"
                      type="warning"
                      size="small"
                      @click="handleUnfreeze"
                    >
                      Unfreeze
                    </NButton>
                  </div>
                  <ClientOnly>
                    <NPagination v-model:page="pagination.page" v-model:page-size="pagination.perPage" :page-slot="2" :item-count="paginationItemCount" show-quick-jumper show-size-picker :page-sizes="[50, 100, 200]">
                      <template #prefix="{ itemCount }">
                        Total: {{ displayedTotalCount }}
                      </template>
                    </NPagination>
                  </ClientOnly>
            </div>
            <div class="flex justify-center flex-1 w-full overflow-y-auto px-8 min-h-0" id="image-wrapper">
                  <div v-if="loadingResources" class="grid" style="grid-template-columns: repeat(3, 175px); gap: 12px 24px;">
                    <NSkeleton v-for="index in pagination.perPage" :key="index" :width="175" :height="175" />
                  </div>
                  <div v-else-if="searchNoResults && filter.imageId" class="flex items-center justify-center w-full h-full">
                    <div class="flex flex-col items-center justify-center gap-4" style="margin: 10% 0;">
                      <div class="relative">
                        <Icon name="ph:folder" class="text-6xl text-neutral-400" />
                        <Icon name="ph:x-circle" class="absolute -top-1 -right-1 text-2xl text-neutral-400" />
                      </div>
                      <div class="text-center">
                        <h4 class="text-neutral-300 text-xl mb-2 font-medium">No Data Available</h4>
                        <p class="text-neutral-400 text-sm">
                          <span v-if="filter.status === 'PENDING'">
                            No pending images found{{ filter.freeze ? ` on page ${pagination.page}` : '' }}.
                          </span>
                          <span v-else>
                            The image you searched for was not found{{ filter.freeze ? ` on page ${pagination.page}` : '' }}.
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div v-else-if="extractedResources && extractedResources.length > 0" class="w-full">
                    <SessionDLDataView v-model:chosen-resources="chosenExtractedResources" v-model:active-resource="activeResource" :resources="extractedResources" :label-colors="labelColors" :show-status="isShowStatusSelected" :labels="allLabels" :image-index="imageIndex" :is-annotation-modal-open="isAnnotationModalOpen" @resetImageIndex="scrollToImage" @refreshResources="handleRefreshResources" />
                  </div>
                  <div v-else class="flex items-center justify-center w-full h-full min-h-[800px]">
                    <div class="flex flex-col items-center justify-center gap-4" style="margin: 10% 0;">
                      <!-- <div class="relative">
                        <Icon name="ph:folder" class="text-6xl text-neutral-400" />
                        <Icon name="ph:x-circle" class="absolute -top-1 -right-1 text-2xl text-neutral-400" />
                      </div> -->
                      <div class="text-center">
                        <h4 class="text-neutral-300 text-xl mb-2 font-medium">No Data Available</h4>
                        <p class="text-neutral-400 text-sm">
                          <span v-if="filter.status === 'PENDING'">
                            No pending images found{{ filter.freeze ? ` on page ${pagination.page}` : '' }}.
                          </span>
                          <span v-else>
                            No images found{{ filter.freeze ? ` on page ${pagination.page}` : '' }}.
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
            </div>
          </div>
          <div class="flex flex-col basis-1/3 min-h-0 overflow-hidden">
            <div v-if="activeResource" class="w-full flex-shrink-0">
                  <div
                  v-if="sessionUserRole === 'ACTIVITY'"
                    class="inline-flex items-center justify-around w-full px-8 py-2 bg-neutral-950"
                  >
                    <NButton
                      v-if="filter.patientId"
                      :strong="true"
                      :secondary="true"
                      type="primary"
                      size="small"
                      @click="sendPatientForQC"
                    >
                      Send Patient ID for QC
                    </NButton>
                    <NButton
                      v-if="chosenExtractedResources.length !== 0 && !chosenExtractedResources.some((resource) => resource.status == 'IN_REVIEW') && chosenExtractedResources.filter((resource)=> resource.status == 'ACCEPTED' || (resource.approvalLevel != null && resource.isReSubmitApprover == false && resource.status == 'REJECTED')).length == 0"
                      :strong="true"
                      :secondary="true"
                      type="primary"
                      size="small"
                      @click="submitManyExtractedResources(chosenExtractedResources, 'IN_REVIEW')"
                    >
                      Send Selected for QC
                    </NButton>
                  </div>
                  <div
                  v-if="sessionUserRole === 'QUALITY_CONTROLLER'"
                    class="inline-flex items-center justify-start w-full gap-4 px-2 py-4 bg-neutral-950"
                  >
                    <NButton
                      :strong="true"
                      :secondary="true"
                      type="error"
                      size="small"
                      :disabled="
                        chosenExtractedResources.length === 0  || 
                        chosenExtractedResources.filter(l => l?.status == 'ACCEPTED').length > 0 ||
                        chosenExtractedResources.filter(l => l?.isNextApprover == false && l.isReSubmitApprover == false).length > 0 || 
                        (chosenExtractedResources.filter(l => l?.isNextApprover == true).length > 0 && chosenExtractedResources.filter(l => l?.isReSubmitApprover == true).length > 0)
                      "
                      @click="rejectManyExtractedResources(chosenExtractedResources, 'REJECTED')"
                    >
                      Reject
                    </NButton>
                    <NButton
                      :strong="true"
                      :secondary="true"
                      type="success"
                      size="small"
                      :disabled="
                        chosenExtractedResources.length === 0  || 
                        chosenExtractedResources.filter(l => l?.status == 'ACCEPTED').length > 0 ||
                        chosenExtractedResources.filter(l => l?.isNextApprover == false && l.isReSubmitApprover == false).length > 0 || 
                        (chosenExtractedResources.filter(l => l?.isNextApprover == true).length > 0 && chosenExtractedResources.filter(l => l?.isReSubmitApprover == true).length > 0)
                      "
                      @click="acceptManyExtractedResources(chosenExtractedResources, 'ACCEPTED')"
                    >
                      Accept
                    </NButton>
                  </div>
            </div>
            <!-- PREVIEW SIDE PANEL -->
            <div v-if="activeResource" class="flex flex-1 overflow-y-auto min-h-0">
                  <SessionDLPreview
                    ref="dLPreviewSession"
                    @activeChoosenImage="activeChoosenImage"
                    v-model:status="status"
                    v-model:comment="comment"
                    :resource-data="activeResource"
                    :stage="sessionUserRole"
                    :total-resource-data="extractedResources"
                    @refreshDataGrid="refreshDataGrid"
                    @annotationModalClosed="handleAnnotationModalClosed"
                    :filter="filter"
                    :label-colors="labelColors"
                    :labels="allLabels"
                  />
                  <!-- @update-comment="updateSingleComment(comment)" -->
            </div>
            <!-- END PREVIEW SIDE PANEL -->
            <div
              v-else
              class="flex items-center justify-center w-full"
            >
              <h4 class="text-neutral-100">
                Nothing is selected
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Duplicate Files Confirmation Modal -->
  <NModal
    v-model:show="showDuplicateConfirmationModal"
    :mask-closable="false"
    :close-on-esc="true"
  >
    <NCard
      class="w-[600px]"
      title="Duplicate Images Detected"
      :bordered="false"
      size="medium"
      role="dialog"
      aria-modal="true"
    >
      <div class="mb-4">
        <p class="mb-3">
          While uploading, some of the selected images already exist in this session: <strong>`{{ session?.name || 'Session' }}`</strong>.
        </p>
        
        <div v-if="duplicateInfo && duplicateInfo.filesWithDuplicates.length > 0" class="mt-4 space-y-4">
          <p class="text-sm font-semibold mb-2">Files containing duplicates:</p>
          <div v-for="fileInfo in duplicateInfo.filesWithDuplicates" :key="fileInfo.filename" class="bg-neutral-800 p-3 rounded border border-neutral-700">
            <p class="text-sm mb-1">
              <strong>Name:</strong> <code class="text-primary-400">{{ fileInfo.filename }}</code>
            </p>
            <p class="text-sm text-neutral-300">
              A total of <strong class="text-primary-400">{{ fileInfo.totalImages }} image's </strong> were found, out of which <strong class="text-primary-400">{{ fileInfo.duplicateCount }} image's </strong> are already present in this session.
            </p>
          </div>
        </div>
        
        <p v-if="duplicateInfo && duplicateInfo.totalImages === duplicateInfo.totalDuplicates" class="mt-4 text-sm text-yellow-500 font-semibold">
          All images already exist in this session. No new images to upload.
        </p>
        <p v-else class="mt-4 text-sm">
          Are you sure you want to continue and upload only the images that are not already present in this session?
        </p>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <NButton
            strong
            type="error"
            @click="handleDuplicateConfirmation(false)"
          >
            No
          </NButton>
          <NButton
            strong
            type="success"
            :disabled="duplicateInfo ? duplicateInfo.totalImages === duplicateInfo.totalDuplicates : false"
            autofocus
            @click="handleDuplicateConfirmation(true)"
          >
            Yes
          </NButton>
        </div>
      </template>
    </NCard>
  </NModal>
</template>
