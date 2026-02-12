<script setup lang="ts">
import type { User } from '@auth0/auth0-spa-js'
import type { UsersInCESessions } from '@prisma/client'
import { ExtractedResourceStatus, SessionUserRole } from '@prisma/client'
import { NButton, NCheckbox, NPagination, NSelect, NPopconfirm, NUpload, NUploadDragger, useNotification, NInput, NInputNumber, UploadInst, UploadFileInfo, UploadCustomRequestOptions, NTooltip } from 'naive-ui'
import type { StructureInput, ExtractedResourceLong, ListExtractedResourcesInCESessionInput, ListPatientsInput, TimeSpentInDLSessionCreateInput } from '~~/types'
import { defineAbilitiesFor } from '~/types/ability'
import { Module, Action } from '~/types/enum'

const { $client } = useNuxtApp()
const route = useRoute()
const router = useRouter()
const notification = useNotification()
const { downloadExtractedResourcesCESession } = useDownloader()

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
}
const filter = reactive<Filter>({
  status: null,
  labelIds: [],
  patientId: null,
  unLabelled: false,
  unAnnotated: false,
  annotated: false,
  imageId: null,
  isApproved: false
})

const user = useState<User>('user')
const sessionUserRole = ref<SessionUserRole>('ACTIVITY') // role of the user in this session

// Fetch session
const { data: session, error } = await $client.cESession.one.useQuery(route.params.id.toString())
// const labelName = session.value.project.epic.name + ' - ' + session.value.project.name 
const epicName = session?.value?.project?.epic.name;
const projectName = session?.value?.project?.name;
const epicId  = session?.value?.project?.epic.id;
const projectId = session?.value?.project?.id;
if (error.value) {
  if (error.value.data?.code === 'UNAUTHORIZED') {
    notification.create({
      title: 'Error',
      type: 'error',
      content: 'You are unauthorized to view the session',
      duration: 5000,
      closable: true,
    })
  }
  router.go(-1)
}

watch(session, () => {
  if (session.value) {
    session.value.users.forEach((sessionUser: UsersInCESessions) => {
      if (sessionUser.userId === user.value.sub) {
        sessionUserRole.value = sessionUser.userRole
        filter.status = sessionUserRole.value === SessionUserRole.QUALITY_CONTROLLER ? 'IN_REVIEW' : undefined
        // filter.isApproved = sessionUserRole.value === SessionUserRole.QUALITY_CONTROLLER ? true : false
      }
    })
  }
}, {
  immediate: true,
})

const zoomer = ref()
const status = ref<ExtractedResourceStatus>(undefined)
const imageIndex = ref<number>(0)
const pageNumber = ref<number>(1)
const inputText = ref<string>('')
const comment = ref<string>('')
const isImageInverted = ref<Boolean>(false)
  const visualization = reactive({
  brightness: 1,
  contrast: 1,
})

const pagination = reactive({
  page: 1,
  perPage: 1,
})
const currentPageValue = ref(pagination.page)
const totalCount = ref(0)
const completedCount = ref(0)
const pendingCount = ref(0)
const inReviewCount = ref(0)
const pendingCompletedLoading = ref(false)
const listExtractedResourcesInput = computed(() => {
  const input: ListExtractedResourcesInCESessionInput = {
    limit: pagination.perPage,
    offset: (pagination.page - 1) * pagination.perPage,
    filter: {
      cESessionId: route.params.id.toString(),
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
  if (filter.patientId)
    input.filter.patientId = filter.patientId
  if (filter.status)
    input.filter.status = filter.status
  if (filter.labelIds.length)
    input.filter.labelIds = filter.labelIds
  if(input.filter.unLabelled)
    input.filter!.labelIds = []
  return input
})

const {
  data: extractedResources,
  refresh: refreshResources,
  pending: loadingResources,
} = await $client.cESession.listExtractedResources.useQuery(listExtractedResourcesInput, {
  transform: (response) => {
    inputText.value = response.data[0].comment
    return response.data
  },
  server: false,
})

await $client.cESession.listExtractedResourcesTotalCount.useQuery(listExtractedResourcesInput, {
  transform: (response) => {
    totalCount.value = response.totalCount
  },
  server: false,
})

await $client.cESession.listExtractedResourcesStatusCount.useQuery(listExtractedResourcesInput, {
  transform: (response) => {
    pendingCount.value = response.PENDING
    inReviewCount.value = response.IN_REVIEW + response.REJECTED
    completedCount.value = response.ACCEPTED
    pendingCompletedLoading.value = true
  },
  server: false,
})

// Resources upload
async function uploadToLinkExtractedResources({
  file,
  onProgress,
  onFinish,
  onError,
}: UploadCustomRequestOptions) {
  const reader = new FileReader()
  if (reader && file.file !== null) {
    reader.onload = async (event) => {
      if (event.target?.result) {
        const result = JSON.parse(event.target.result as string)
        await $client.cESession.linkExtractedResources.mutate({
          cESessionId: route.params.id.toString(),
          extractedResources: result.extractedResources.map((item) => { return { id: item.id } }),
        }).then((response) => {
          notification.success({ content: `Linked ${response.count} resources` })
          onFinish()
        }).catch((error) => {
          notification.error({
            content: error.message,
          })
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
const showFileUpload = computed(
  () => filter.status === 'PENDING'
  && !filter.labelIds.length
  && !filter.patientId
  && !filter.imageId
  && !extractedResources.value?.length,
)
const isFileImported = ref(false)
function handleFileChange(data: { file: UploadFileInfo }) {
  if (data.file)
    isFileImported.value = true
}
function upload() {
  uploadRef.value?.submit()
}

const selectedImage = ref(null);
const flipCount = ref(0);
async function  rotateImage(type: string) {
  const image = selectedImage.value;
  const currentRotation = (image.dataset.rotation || 0) % 360;
  const newRotation = currentRotation + 90;
  if (type !== 'main') {
    const isRotated = newRotation === 90 || newRotation === 270;
    image.style.aspectRatio = isRotated ? '1' : 'auto';
    image.style.width = isRotated ? '55%' : '70%';
  }
 
  image.style.transform = `rotate(${newRotation}deg)`;
  image.dataset.rotation = newRotation;
}

async function flipImage(type: string) {
  const image = selectedImage.value;
  const currentScaleX = (image.dataset.flipX || 1);
  const newScaleX = currentScaleX === 1 ? -1 : 1;
  if (type !== 'main') {
    image.style.width = '70%'
  }
  image.style.transform = `scaleX(${newScaleX})`;
  image.dataset.flipX = newScaleX;
  flipCount.value++;
 
  if (flipCount.value >= 2) {
    flipCount.value = 0;
    image.dataset.flipX = ''
  }
}

async function previousImage() {
  if (pagination.page != 1)
    pagination.page -= 1
}

async function nextImage() {
  if (pagination.page != totalCount.value)
    pagination.page += 1
}

async function copyExtractedResourcesId(resourceId: string) {
  try {
    await navigator.clipboard.writeText(resourceId);
    notification.success({ content: `ID Copied to Clipboard`, duration: 1000 });
  } catch (err) {
    notification.error({ content: `Unable to copy to clipboard`, duration: 1000 });
  }
}

const listStructureInput = computed(() => {
  const input: StructureInput = {
    filter: {
      cESessionId: route.params.id.toString(),
      extractedResourcesId: extractedResources.value ? extractedResources.value![0].id : ''
    },
  }
  return input
})

const fetchStructures = ref()
const fetchedStructures = ref<Boolean>(false)

async function getStructures()  {
  fetchStructures.value = await $client.cESession.structureData.useQuery(listStructureInput, {
    server: false,
  })
  fetchedStructures.value = true
}

await getStructures();

watch(extractedResources, async () => {
  await getStructures();
})

function handleFocus() {
  currentPageValue.value = pagination.page
}

function handlePageUpdate() {
  if (pagination.page === null || pagination.page < 1) {
    pagination.page = currentPageValue.value
  } else {
    currentPageValue.value = pagination.page
  }
}

// Handle Comment
function debounce(fn: Function, delay: number) {
  let timer: ReturnType<typeof setTimeout>
  return function () {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn()
    }, delay)
  }
}
async function handleComment() {
  await $client.cESession.updateComment.mutate({
    extractedResourcesId: extractedResources.value![0].id,
    cESessionId: route.params.id.toString(),
    comment: inputText.value,
  })
  notification.success({ content: `Comment Updated Successfully`, duration: 2000 })
}
const handleInput = debounce(handleComment, 1000)

// WHEN SENDING FOR QC
async function submitManyExtractedResources(selectedResources: Array<ExtractedResourceLong>, selectedStatus: ExtractedResourceStatus) {
  const extractedResources: { id: string; status: ExtractedResourceStatus; isFinalApproval:boolean; isReSubmit:boolean }[] = []
  selectedResources.forEach((resource) => {
    extractedResources.push({ 
      id: resource.id, 
      status: selectedStatus, 
      isFinalApproval : resource.isFinalApproval, 
      isReSubmit: ((selectedStatus === "ACCEPTED" || selectedStatus === "IN_REVIEW") && (resource.status === "REJECTED")) ? true : false })
  })
  try {
    await $client.cESession.submitManyExtractedResources.mutate({
      cESessionId: route.params.id != null ? route.params.id.toString() : '',
      extractedResources,
    })
    notification.success({ content: `Successfully sent Image for QC`, duration: 2000 })
  } catch(error: any) {
    notification.error({ content: `Error in sending Image for QC`, duration: 2000 })
  }
  await refreshResources()
}

// WHEN SENDING FOR REJECT
async function rejectManyExtractedResources(selectedResources: Array<ExtractedResourceLong>, selectedStatus: ExtractedResourceStatus) {
  const extractedResources: { id: string; status: ExtractedResourceStatus; isFinalApproval:boolean; isReSubmit:boolean }[] = []
  selectedResources.forEach((resource) => {
    extractedResources.push({ id: resource.id, status: selectedStatus, isFinalApproval : resource.isFinalApproval, isReSubmit: ((selectedStatus === "ACCEPTED" || selectedStatus === "IN_REVIEW") && (resource.status === "REJECTED")) ? true : false })
  })
  try {
    await $client.cESession.rejectManyExtractedResources.mutate({
      cESessionId: route.params.id != null ? route.params.id.toString() : '',
      extractedResources,
    })
    notification.success({ content: `Successfully rejected Image`, duration: 2000 })
  } catch(error: any) {
    notification.error({ content: `Error in rejecting Image`, duration: 2000 })
  }
  await refreshResources()
}

// WHEN SENDING FOR ACCEPT
async function acceptManyExtractedResources(selectedResources: Array<ExtractedResourceLong>, selectedStatus: ExtractedResourceStatus) {
  const extractedResources: { id: string; status: ExtractedResourceStatus; isFinalApproval:boolean; isReSubmit:boolean }[] = []
  selectedResources.forEach((resource) => {
    extractedResources.push({ id: resource.id, status: selectedStatus, isFinalApproval : resource.isFinalApproval, isReSubmit: ((selectedStatus === "ACCEPTED" || selectedStatus === "IN_REVIEW") && (resource.status === "REJECTED")) ? true : false })
  })
  try {
    await $client.cESession.acceptManyExtractedResources.mutate({
      cESessionId: route.params.id != null ? route.params.id.toString() : '',
      extractedResources,
    })
    notification.success({ content: `Successfully accepted Image`, duration: 2000 })
  } catch(error: any) {
    notification.error({ content: `Error in accepting Image`, duration: 2000 })
  }
  await refreshResources()
}

async function saveStructures() {
  const selectedStructures = ref<String[]>([])
  fetchStructures.value.data!.forEach((e) => {
    e.structureGroups.StructureInStructureGroup.forEach((f) => {
      if (f.selected == true) {
        selectedStructures.value.push(f.id)
      }
    })
  })
  await $client.cESession.saveStructures.mutate({
    cESessionId: route.params.id != null ? route.params.id.toString() : '',
    extractedResourcesId: extractedResources.value![0].id,
    structures: selectedStructures.value
  })
  notification.success({ content: 'Successfully Saved Structures', duration: 2000 })
  await refreshResources()
}

// Resources download
async function downloadResources() {
  await downloadExtractedResourcesCESession({
    sessionName: session.value?.name ?? undefined,
    cESessionId: route.params.id as string,
    status: filter.status ?? undefined,
  })
}

const canUploadJSON = ref<boolean>(false);
const canDownloadJSON = ref<boolean>(false);

async function checkAbilities() {
  canUploadJSON.value = await defineAbilitiesFor(Module.JSON, Action.UploadJSON);
  canDownloadJSON.value = await defineAbilitiesFor(Module.JSON, Action.DownloadJSON);
}

onMounted(() => {
  checkAbilities();
});

watch(route, () => {
  checkAbilities();
});

</script>

<template>
  <div>
    <ClientOnly>
      <SessionHeader
        v-if="session"
        :session="session"
        :epicName="epicName ? epicName : 'Unknown'"
        :projectName="projectName ? projectName : 'Unknown'"
        :epicId ="epicId"
        :projectId = "projectId"
        :username="user.name"
        :stage="sessionUserRole === 'QUALITY_CONTROLLER' ? 'QUALITY CHECKER' : 'ACTIVITY'"
        sessionType='CE'
        :pending="pendingCount"
        :completed="completedCount"
        :inReview="inReviewCount"
        :pendingCompletedLoading="pendingCompletedLoading"
      />
      <div
        v-if="showFileUpload && canUploadJSON"
        class="flex items-center justify-center mt-10"
        style="border: unset;"
      >
        <div class="flex flex-col gap-y-4 w-[50%]">
          <NButton
            :disabled="!isFileImported"
            @click="upload"
          >
            Upload File
          </NButton>
          <div>
            <NUpload
              ref="uploadRef"
              :default-upload="false"
              :multiple="false"
              :custom-request="uploadToLinkExtractedResources"
              @change="handleFileChange"
            >
              <NUploadDragger>
                <div class="flex flex-col items-center justify-center gap-y-10">
                  <Icon name="ph:upload" class="text-3xl" />
                  <p>
                    Click or drag a file to this area
                  </p>
                </div>
              </NUploadDragger>
            </NUpload>
          </div>
        </div>
      </div>
      <div
        v-else
        style="border: unset;"
      >
        <!-- FILTER HEADER -->
        <div class="flex flex-row items-center justify-between gap-5 px-2 text-neutral-100">
          <div class="flex flex-row justify-between items-center gap-5 w-full">
            <NSelect
              v-model:value="filter.status"
              filterable clearable :options="Object.keys(ExtractedResourceStatus).map((key) => ({
                label: key,
                value: key,
              }))"
              placeholder="Select status"
              class="w-[150px]"
            />
            <div v-if="extractedResources && extractedResources!.length" class="flex w-full items-center justify-center gap-5">
              Go to:
              <NInputNumber :min="1" :max="totalCount" v-model:value="pagination.page" :show-button="false" class="w-[50px]" @update:value="handlePageUpdate" @focus="handleFocus" />
              <button class='min-w-[120px] flex items-center justify-center no-wrap h-[40px] py-[10px] px-[5px] rounded-[8px] bg-[#3A3D40] shadow-[#00000025]' @click="previousImage">
                <h3 class="text-[13px] text-[#FFFFFF] font-400">Previous Image</h3>
              </button>
              <button class='min-w-[120px] flex items-center justify-center no-wrap h-[40px] py-[10px] px-[5px] rounded-[8px] bg-[#3A3D40] shadow-[#00000025]' @click="nextImage">
                <h3 class="text-[13px] text-[#FFFFFF] font-400">Next Image</h3>
              </button>
              <p>
                Image Number:
                <span>{{ pagination.page }}</span>
                /
                <span>{{ totalCount }}</span>
              </p>
            </div>
          </div>
          <div v-if="canDownloadJSON">
            <NButton @click="downloadResources()">
              Download resources
            </NButton>
          </div>
        </div>
        <!-- END FILTER HEADER -->

      </div>
      <div v-if="extractedResources && extractedResources!.length" class="flex flex-col w-full h-[calc(100vh-50px)]">
        <div class="flex w-full h-full">
          <div class="w-[70%] h-full p-[10px]">
            <div class="h-[calc(100%-100px)]">
              <vue-zoomer ref="zoomer" class="h-full">
                <img
                  ref="selectedImage"
                  :src="extractedResources![0].fullPath"
                  class="object-contain w-full h-full bg-black border border-black"
                  :style="{
                    filter: `brightness(${visualization.brightness}) contrast(${visualization.contrast}) ${isImageInverted ? 'grayscale(100%) invert(100%)' : ''}`,
                    aspectRatio: `1`
                  }"
                >
              </vue-zoomer>
            </div>
            <div class="flex flex-row items-center justify-start w-full gap-2 mb-4">
              <div class="flex w-[55%]">
                <h5
                  :class="[
                    extractedResources![0].status === 'PENDING' ? 'text-neutral-100' : '',
                    extractedResources![0].status === 'IN_REVIEW' ? 'text-warning-100' : '',
                    extractedResources![0].status === 'ACCEPTED' ? 'text-confirm-100' : '',
                    extractedResources![0].status === 'REJECTED' ? 'text-error-100' : '',
                  ]"
                  class="p-2 flex items-center"
                >
                  {{ extractedResources![0].status }} {{ extractedResources![0].approvalLevel ? 'L' + String(extractedResources![0].approvalLevel) : ''}}
                </h5>
                <span class="p-2 text-sm italic break-all">
                  {{ extractedResources![0].id }}
                  <Icon name="ph:copy" class="text-2xl ml-[5px] outline-[0px] cursor-pointer text-neutral-500 hover:text-neutral-200"
                    @click="copyExtractedResourcesId(extractedResources![0].id)"
                  />
                </span>
              </div>
              <div class="w-[20%] flex flex-col justify-center px-[5px] gap-2">
                <div class="flex flex-row items-center justify-center px-4 mt-1 gap-x-5">
                  <NCheckbox v-model:checked="isImageInverted">
                    Invert Color
                  </NCheckbox>
                </div>
                <div class="flex flex-row justify-center px-4 mt-1 gap-2">
                  <NTooltip trigger="hover">
                    <template #trigger>
                      <Icon name="ph:magnifying-glass-plus" class="text-2xl cursor-pointer text-neutral-500 hover:text-neutral-300 outline-0" @click="zoomer?.zoomIn()" />
                    </template>
                    Zoom in
                  </NTooltip>
                  <NTooltip trigger="hover">
                    <template #trigger>
                      <Icon name="ph:magnifying-glass-minus" class="text-2xl cursor-pointer text-neutral-500 hover:text-neutral-300 outline-0" @click="zoomer?.zoomOut()" />
                    </template>
                    Zoom out
                  </NTooltip>
                  <NTooltip trigger="hover">
                    <template #trigger>
                      <Icon name="ph:arrow-clockwise" class="text-2xl cursor-pointer text-neutral-500 hover:text-neutral-300 outline-0" @click="zoomer?.reset()" />
                    </template>
                    Reset zoom
                  </NTooltip>
                  <NTooltip trigger="hover">
                    <template #trigger>
                      <Icon name="ph:arrows-clockwise" class="text-2xl cursor-pointer text-neutral-500 hover:text-neutral-300 outline-0" @click="rotateImage('main')" />
                    </template>
                    Rotate clockwise
                  </NTooltip>
                  <NTooltip trigger="hover">
                    <template #trigger>
                      <svg style="width:24px;height:24px" class="cursor-pointer text-neutral-500 hover:text-neutral-300 outline-0" viewBox="0 0 24 24"  @click="flipImage('main')">
                        <path d="M15 21h2v-2h-2v2zm4-12h2V7h-2v2zM3 5v14c0 1.1.9 2 2 2h4v-2H5V5h4V3H5c-1.1 0-2 .9-2 2zm16-2v2h2c0-1.1-.9-2-2-2zm-8 20h2V1h-2v22zm8-6h2v-2h-2v2zM15 5h2V3h-2v2zm4 8h2v-2h-2v2zm0 8c1.1 0 2-.9 2-2h-2v2z"
                        fill="currentColor"></path>
                      </svg>
                    </template>
                    Flip
                  </NTooltip>
                </div>
              </div>
              <div class="w-[25%] flex flex-col items-center justify-center gap-4 px-2">
                <div class="inline-flex items-center justify-start w-full gap-2">
                  <Icon name="ph:sun-bold" class="flex-none text-xl text-neutral-500" />
                  <p>
                    {{ visualization.brightness }}
                  </p>
                  <input
                    v-model="visualization.brightness" type="range" class="w-full cursor-pointer" :max="2" step="0.01"
                    min="0"
                  >
                  <Icon
                    name="ph:arrow-clockwise-bold" class="flex-none text-xl cursor-pointer text-neutral-500"
                    @click="visualization.brightness = 1"
                  />
                </div>
                <div class="inline-flex items-center justify-start w-full gap-2">
                  <Icon name="ph:circle-half-tilt-bold" class="flex-none text-xl text-neutral-500" />
                  <p class="flex-none">
                    {{ visualization.contrast }}
                  </p>
                  <input
                    v-model="visualization.contrast" type="range" class="w-full cursor-pointer" :max="2" step="0.01"
                    min="0"
                  >
                  <Icon
                    name="ph:arrow-clockwise-bold" class="flex-none text-xl cursor-pointer text-neutral-500"
                    @click="visualization.contrast = 1"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="w-[30%] h-full p-[10px]">
            <ul v-if="fetchedStructures" class="overflow-y-scroll w-full h-[calc(100%-200px)]">
              <li v-for="(item, index) in fetchStructures.data" :key="index" class="mb-5" >
                <div class="w-full mb-2 text-[20px] flex items-center gap-3">
                  {{ item.structureGroups.name }}
                </div>
                <ul>
                  <li v-for="(val, index) in item.structureGroups.StructureInStructureGroup" :key="index" class="flex mb-2 items-center justify-between cursor-pointer">
                    <NCheckbox class="flex flex-row items-center justify-center" v-model:checked="val.selected">
                      {{ val.name }}
                    </NCheckbox>
                  </li>
                </ul>
              </li>
            </ul>
            <div class="flex items-center justify-center gap-5 py-2">
              <NButton 
                v-if="extractedResources![0].status != 'ACCEPTED'"
                strong 
                type="success" 
                @click="saveStructures()"
              >
                Save
              </NButton>
              <NButton 
                strong 
                v-if="sessionUserRole !== 'QUALITY_CONTROLLER' && extractedResources![0].status != 'ACCEPTED' && (extractedResources![0].status === 'PENDING' || extractedResources![0].status === 'REJECTED')"
                @click="submitManyExtractedResources(extractedResources, 'IN_REVIEW')"
              >
                Send for QC
              </NButton>
              <div
                  v-if="extractedResources![0].status != 'ACCEPTED' && sessionUserRole === 'QUALITY_CONTROLLER'"
                  class="inline-flex items-center justify-start gap-4 px-2 py-4"
                >
                  <NButton
                    :strong="true"
                    :secondary="true"
                    type="error"
                    size="small"
                    :disabled="extractedResources.length === 0  || extractedResources.filter(l => l?.isNextApprover == false && (l.isReSubmitApprover == true || l.isReSubmitApprover == false)).length > 0"
                    @click="rejectManyExtractedResources(extractedResources, 'REJECTED')"
                  >
                    Reject
                  </NButton>
                  <NButton
                    :strong="true"
                    :secondary="true"
                    type="success"
                    size="small"
                    :disabled="
                      extractedResources.length === 0  || 
                      extractedResources.filter(l => l?.isNextApprover == false && l.isReSubmitApprover == false).length > 0 || 
                      (extractedResources.filter(l => l?.isNextApprover == true).length > 0 && extractedResources.filter(l => l?.isReSubmitApprover == true).length > 0)
                    "
                    @click="acceptManyExtractedResources(extractedResources, 'ACCEPTED')"
                  >
                    Accept
                  </NButton>
                </div>
            </div>
            <div class="flex flex-col p-2">
              <NInput
                v-model:value="inputText"
                type="textarea"
                placeholder="Comment"
                class="text-[15px]"
                @update:value="handleInput"
              />
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>
