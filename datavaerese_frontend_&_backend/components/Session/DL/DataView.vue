<script setup lang="ts">
import { debounce } from 'lodash-es';
import type { Label } from '@prisma/client'
import type { TimeSpentInExtractedResourceCreateInput, ExtractedResourceLong } from '~/types'
import { NButton, NCard, NModal, useNotification } from 'naive-ui'

const preventDefaultHandler = (e: any) => e.preventDefault()

onMounted(() => {
  // Prevent context menu
  window.addEventListener('contextmenu', preventDefaultHandler, { capture: true })

  // Prevent drag
  window.addEventListener('dragstart', preventDefaultHandler, { capture: true })
})

onBeforeUnmount(() => {
  // Remove event listeners
  window.removeEventListener('contextmenu', preventDefaultHandler, { capture: true })

  window.removeEventListener('dragstart', preventDefaultHandler, { capture: true })
})

const props = defineProps({
  resources: {
    type: Array as PropType<ExtractedResourceLong[]>,
    required: true,
  },
  // Images selected to send for QC or labelling
  chosenResources: {
    type: Array as PropType<ExtractedResourceLong[]>,
    required: true,
  },
  // Image shown in the sidePanel
  activeResource: {
    type: null as unknown as PropType<ExtractedResourceLong | null>,
    required: false,
    default: null,
  },
  labelColors: {
    type: Object as PropType<{ [labelId: string]: string }>,
    required: true,
  },
  showStatus: {
    type: Boolean,
    default: true,
  },
  labels: {
    type: Array as PropType<Label[]>,
    required: true,
  },
  imageIndex: {
    type: Number,
    default: 0,
  },
  // Add new prop to track annotation modal state
  isAnnotationModalOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:chosenResources', 'update:activeResource', 'updateLabels', 'resetImageIndex', 'refreshResources'])
const { chosenResources, activeResource, imageIndex } = useVModels(props, emit)

const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1920)

onMounted(() => {
  const updateWidth = () => {
    windowWidth.value = window.innerWidth
  }
  window.addEventListener('resize', updateWidth)
  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateWidth)
  })
})

const uniqueLabelCount = computed(() => {
  if (!resourcesToRemoveLabels.value || resourcesToRemoveLabels.value.length === 0) {
    return 0
  }
  const allLabelIds = new Set<string>()
  resourcesToRemoveLabels.value.forEach(resource => {
    if (resource.labelIds && resource.labelIds.length > 0) {
      resource.labelIds.forEach(labelId => allLabelIds.add(labelId))
    }
  })
  return allLabelIds.size
})

const gridStyle = computed(() => {
  const imageWidth = 175
  const gap = 24 
  let cols = 3
  if (windowWidth.value >= 1536) cols = 5 // 2xl
  else if (windowWidth.value >= 1280) cols = 4 // xl
  return {
    gridTemplateColumns: `repeat(${cols}, ${imageWidth}px)`,
    gap: `12px ${gap}px`, 
    justifyContent: 'center'
  }
})

const selectedExtractedResourceId = ref<string>('');
const startTime = ref<number>(0);
const endTime = ref<number>(0);
let isInactive = false; // Flag to track inactivity
const activityTimeout = 60000; // 1 minute of inactivity
let activityTimer: NodeJS.Timeout;
const newTimeSpent = ref<TimeSpentInExtractedResourceCreateInput>({ extractedResourceId: '', dLSessionId: '', startTime: 0})

const { $client } = useNuxtApp()
const notification = useNotification()
const route = useRoute()

// Confirmation modal for removing labels
const showRemoveLabelsConfirmationModal = ref<boolean>(false)
const resourcesToRemoveLabels = ref<ExtractedResourceLong[]>([])

// Function to handle user activity
const rawHandleUserActivity = () => {
  if (isInactive) {
    // User was inactive and is now active again
    startTime.value = Date.now()
    isInactive = false;
  }
  resetActivityTimer();
};

const handleUserActivity = debounce(rawHandleUserActivity, 300);

// Function to reset activity timer
const resetActivityTimer = () => {
  clearTimeout(activityTimer);
  activityTimer = setTimeout(() => {
    isInactive = true;
  }, activityTimeout);
};

onMounted(() => {
  // console.log('mounted');
  document.addEventListener('mousemove', handleUserActivity);
  document.addEventListener('keydown', handleUserActivity);

  resetActivityTimer();
})

onUnmounted(() => {
  clearTimeout(activityTimer);
  document.removeEventListener('mousemove', handleUserActivity);
  document.removeEventListener('keydown', handleUserActivity);
  handleUserActivity.cancel();
})

async function selectExtractedResource(resource: ExtractedResourceLong, ev?: MouseEvent) {
  if (selectedExtractedResourceId.value != '' && resource.id != selectedExtractedResourceId.value) {
    // console.log('EndandStartTimer');
    endTime.value = Date.now();
    // console.log(`Time spent on Image ${selectedExtractedResourceId.value}: ${(endTime.value - startTime.value) / 1000} seconds`);
    if ((endTime.value - startTime.value) / 1000 > 10) {
      newTimeSpent.value.extractedResourceId = selectedExtractedResourceId.value
      newTimeSpent.value.dLSessionId = route.params.id.toString()
      newTimeSpent.value.startTime = Number(startTime.value)
      await $client.timeSpent.createTimeSpentInExtractedResource.mutate(newTimeSpent.value)
    }

    selectedExtractedResourceId.value = resource.id
    startTime.value = Date.now();
  } else if (selectedExtractedResourceId.value == '') {
    // console.log('StartTimer')
    startTime.value = Date.now();
    selectedExtractedResourceId.value = resource.id
  }

  if (ev !== undefined && ev.shiftKey && activeResource.value) {
    const startIndex = Math.max(0, props.resources.indexOf(activeResource.value))
    const endIndex = Math.max(0, props.resources.indexOf(resource))
    if (chosenResources.value.includes(props.resources[startIndex]) && chosenResources.value.includes(props.resources[endIndex])) {
      for (let i = Math.min(startIndex, endIndex); i <= Math.max(startIndex, endIndex); i++)
        chosenResources.value.splice(chosenResources.value.indexOf(props.resources[i]), 1)
    }
    else {
      for (let i = Math.min(startIndex, endIndex); i <= Math.max(startIndex, endIndex); i++) {
        if (!chosenResources.value.includes(props.resources[i]))
          chosenResources.value.push(props.resources[i])
      }
    }
  }
  else {
    activeResource.value = resource
    if (chosenResources.value.includes(resource))
      chosenResources.value.splice(chosenResources.value.indexOf(resource), 1)
    else
      chosenResources.value.push(resource)
  }
}

// Debounced navigation handler for Ctrl+ArrowLeft/ArrowRight
const debouncedNavigate = debounce((index: number) => {
  activeResource.value = props.resources[index]
}, 100, { leading: true, trailing: false })

function isInputFieldElement(event: KeyboardEvent): boolean {
  const activeElement = document.activeElement as HTMLElement | null
  const target = (event.target as HTMLElement) || activeElement

  return !!(
    target &&
    (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable === true
    )
  )
}

function keyboardEvents(event: KeyboardEvent) {
  // Prevent keyboard navigation when annotation modal is open
  if (props.isAnnotationModalOpen) {
    return
  }

  if (event.key === 'Backspace') {
    if (isInputFieldElement(event)) {
      return
    }

    const resourcesWithLabels = chosenResources.value.filter(
      resource => resource.labelIds && resource.labelIds.length > 0
    )
    if (resourcesWithLabels.length > 0) {
      event.preventDefault()
      event.stopPropagation()
      resourcesToRemoveLabels.value = resourcesWithLabels
      showRemoveLabelsConfirmationModal.value = true
      return
    }
    if (activeResource.value && activeResource.value.labelIds && activeResource.value.labelIds.length > 0) {
      event.preventDefault()
      event.stopPropagation()
      resourcesToRemoveLabels.value = [activeResource.value]
      showRemoveLabelsConfirmationModal.value = true
      return
    }
    return
  }

  if (activeResource.value) {
    const currentIndex = props.resources.indexOf(activeResource.value)
    let index = currentIndex
    let shouldDebounce = false
    const isModifierPressed = event.ctrlKey || event.metaKey

    switch (event.key) {
      case 'ArrowLeft':
        if (isModifierPressed) {
          event.preventDefault()
          event.stopPropagation()
          if (currentIndex === 0)
            index = props.resources.length - 1
          else index = currentIndex - 1
          shouldDebounce = true
        }
        break
      case 'ArrowRight':
        if (isModifierPressed) {
          event.preventDefault()
          event.stopPropagation()
          index = (currentIndex + 1) % props.resources.length
          shouldDebounce = true
        }
        break
      case 'Enter':
        selectExtractedResource(props.resources[index])
        break
    }
    if (shouldDebounce) {
      debouncedNavigate(index)
    } else if (
      index >= 0 &&
      index < props.resources.length &&
      activeResource.value?.id !== props.resources[index]?.id
    ) {
      activeResource.value = props.resources[index]
    }
  }
}

onBeforeMount(() => {
  window.addEventListener('keydown', keyboardEvents)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', keyboardEvents)
})

onMounted(() => {
  const temp = document.querySelector(`#image_${imageIndex.value}`)
  if (temp)
    (temp as HTMLElement).click();
    setTimeout(() => {
      emit('resetImageIndex')
    }, 1000);
})

// Function to remove labels from the selected resources
async function removeLabelsFromResource() {
  if (!resourcesToRemoveLabels.value || resourcesToRemoveLabels.value.length === 0) {
    showRemoveLabelsConfirmationModal.value = false
    return
  }

  try {
    // Get the route to access dLSessionId
    const route = useRoute()
    
    // Remove all labels by setting labelIds to empty array for all selected resources
    await $client.dLSession.updateManyExtractedResources.mutate({
      dLSessionId: route.params.id != null ? route.params.id.toString() : '',
      extractedResources: resourcesToRemoveLabels.value.map(resource => ({
        id: resource.id,
        status: resource.status,
        labelIds: [], // Empty array removes all labels
      })),
    })

    const resourceCount = resourcesToRemoveLabels.value.length
    resourcesToRemoveLabels.value.forEach(resourceToUpdate => {
      const chosenIndex = chosenResources.value.findIndex(r => r.id === resourceToUpdate.id)
      if (chosenIndex !== -1) {
        chosenResources.value[chosenIndex] = {
          ...chosenResources.value[chosenIndex],
          labelIds: []
        }
      }
      if (activeResource.value && activeResource.value.id === resourceToUpdate.id) {
        activeResource.value = {
          ...activeResource.value,
          labelIds: []
        }
      }
    })

    notification.success({ 
      content: `Labels removed successfully from ${resourceCount} image${resourceCount > 1 ? 's' : ''}`, 
      duration: 3000 
    })

    // Emit updateLabels event to notify parent for each resource
    resourcesToRemoveLabels.value.forEach(resource => {
      emit('updateLabels', {
        resourceId: resource.id,
        labelIds: []
      })
    })

    await new Promise(resolve => setTimeout(resolve, 100))

    // Emit refresh event to update the resources list from server
    emit('refreshResources')
  }
  catch (error: any) {
    notification.error({ 
      content: error.message || 'Error in removing labels', 
      duration: 5000 
    })
  }
  finally {
    showRemoveLabelsConfirmationModal.value = false
    resourcesToRemoveLabels.value = []
  }
}
</script>

<template>
  <div class="grid h-full" :style="gridStyle">
    <div v-for="(resource, index) in resources" :key="resource.id" class="flex flex-col items-center">
      <div
        :id="`image_${index+1}`"
        class="border-4 h-[175px] w-[175px] bg-black border-neutral-500 relative cursor-pointer select-none flex flex-row justify-center items-center"
        :class="chosenResources.map(chosenResource => chosenResource.id).includes(resource.id) ? 'border-primary-600' : ''"
        @click="(ev) => selectExtractedResource(resource, ev)"
      >
        <h5
          v-if="showStatus" class="absolute top-0 left-0" :class="[
            resource.status === 'PENDING' ? 'text-neutral-500' : '',
            resource.status === 'IN_REVIEW' ? 'text-yellow-500' : '',
            resource.status === 'ACCEPTED' ? 'text-confirm-500' : '',
            resource.status === 'REJECTED' ? 'text-error-500' : '',
          ]"
        >
          {{ resource.status }} {{ resource.status === 'IN_REVIEW' ? 'L' + String(resource.approvalLevel) : '' }} {{ resource.status === 'REJECTED' ? 'L' + String(resource.approvalLevel+1) : '' }}
        </h5>
        <div
          v-if="activeResource?.id === resource.id"
          class="absolute top-0 left-0 flex flex-row items-center justify-center w-full h-full bg-opacity-50 bg-neutral-800"
        >
          <Icon name="ph:eye" class="text-3xl text-primary-600" />
        </div>
        <img loading="lazy" alt="" :src="resource.thumbnailPath ? resource.thumbnailPath : resource.fullPath" class="w-full h-full object-contain">
      </div>
      <div class="product-name flex flex-row justify-start gap-1 flex-wrap w-[175px]">
        <p
          v-for="labelId in resource.labelIds" :key="labelId"
          class="p-1 font-semibold text-black rounded-b-md"
          :style="`background: ${labelColors[labelId] ? labelColors[labelId] : 'rgb(115 115 115)'}`"
        >
          {{ labels.find(label => label.id === labelId)?.abbreviation }}
        </p>
      </div>
    </div>
  </div>

  <!-- Remove Labels Confirmation Modal -->
  <NModal
    v-model:show="showRemoveLabelsConfirmationModal"
    :mask-closable="false"
    :close-on-esc="true"
  >
    <NCard
      class="w-[500px]"
      title="Remove Labels"
      :bordered="false"
      size="medium"
      role="dialog"
      aria-modal="true"
    >
      <div class="mb-5">
        <p v-if="resourcesToRemoveLabels.length > 0">
          Are you sure you want to remove the {{ resourcesToRemoveLabels.length }} selected {{ resourcesToRemoveLabels.length === 1 ? 'image' : 'image`s' }} from those {{ uniqueLabelCount }} {{ uniqueLabelCount === 1 ? 'label' : 'label`s' }} ?
        </p>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <NButton
            strong
            type="error"
            @click="showRemoveLabelsConfirmationModal = false"
          >
            No
          </NButton>
          <NButton
            strong
            type="success"
            autofocus
            @click="removeLabelsFromResource"
          >
            Yes
          </NButton>
        </div>
      </template>
    </NCard>
  </NModal>
</template>
