<script setup lang="ts">
import { DateTime } from 'luxon'
import type { PropType, Ref } from 'vue'
import type { ExtractedResourceStatus } from '@prisma/client'
import type { CESessionWithUsers } from '~~/types/CESession'
import type { CEExtractedResourceLong } from '~~/types/ExtractedResource'

const props = defineProps({
  session: {
    type: Object as PropType<CESessionWithUsers>,
    required: true,
  },
})

const client = useClient()
const zoomer = ref()

const { createToast } = useToast()

const imageContainerEl = ref<HTMLDivElement | null>(null)
const imageEl = ref<HTMLImageElement | null>(null)

const currentExtractedResource: Ref<CEExtractedResourceLong | null> = ref(null)
const currentExtractedResourceIndex: Ref<number | null> = ref(null)
const extractedResourcesCount: Ref<number> = ref(0)

const { visibleMeasurements, activeMeasurement, clearMeasurements }
  = useAnnotation()

const visualConf = reactive({
  brightness: 1,
  contrast: 1,
})

const fetchExtractedResourceParams: {
  isFinished?: boolean
  index?: number
} = reactive({
  isFinished: false,
})

async function fetchExtractedResource({
  isFinished = fetchExtractedResourceParams.isFinished,
  index = fetchExtractedResourceParams.index,
}) {
  // await client.query('cESession.getExtractedResource', {
  //   cESessionId: props.session.id,
  //   isFinished,
  //   index,
  // }).then((response) => {
  //   const data = response.data
  //   extractedResourcesCount.value = response.metadata.totalCount
  //   if (data) {
  //     currentExtractedResourceIndex.value = data.index
  //     if (data === null) {
  //       data.result = {
  //         startAt: DateTime.now().toJSDate(),
  //         finishAt: DateTime.now().toJSDate(),
  //         sections: (props.session.resultTemplate as any).sections,
  //       }
  //     }
  //   }
  //   currentExtractedResource.value = data
  // }).catch((error) => {
  //   createToast(error ?? error.response.data.message, 'error')
  // })
  currentExtractedResource.value = {
    id: 'placeholder',
    createdAt: new Date(),
    updatedAt: new Date(),
    fullPath: '/test0.png',
    metadata: {
      pixelResolution: 0.1,
      width: 1604,
      height: 852,
      type: 'image/png',
    },
    index: 0,
    status: 'PENDING',
    rawResourceId: 'placeholder',
    result: {
      startAt: DateTime.now().toJSDate(),
      finishAt: DateTime.now().toJSDate(),
      sections: (props.session.resultTemplate as any).sections,
    },
  }
}

async function updateExtractedResource({
  status,
}: {
  status: ExtractedResourceStatus
}) {
  if (currentExtractedResource.value === null)
    return

  if (currentExtractedResource.value.result)
    currentExtractedResource.value.result.finishAt = DateTime.now().toJSDate()

  // await client.mutation('cESession.updateExtractedResource', {
  //   status,
  //   result: currentExtractedResource.value.result,
  // }).then(() => {
  //   clearMeasurements()
  //   createToast('Data saved', 'success')
  // }).catch((error) => {
  //   createToast(error.response.data.message, 'error')
  // })
  currentExtractedResource.value.status = status
  clearMeasurements()
  createToast('Data saved', 'success')
}

await fetchExtractedResource({})

function backward() {
  if (currentExtractedResourceIndex.value === null)
    return

  if (currentExtractedResourceIndex.value === 0)
    return

  currentExtractedResourceIndex.value--
}

function forward() {
  if (currentExtractedResourceIndex.value === null)
    return

  if (currentExtractedResourceIndex.value === extractedResourcesCount.value - 1)
    return

  currentExtractedResourceIndex.value++
}

function setImageContainerHeight() {
  if (imageContainerEl.value && imageEl.value) {
    imageContainerEl.value.style.height
      = `${Number.parseInt(window.getComputedStyle(imageEl.value).height)}px`
  }
}

function operate(e: KeyboardEvent) {
  switch (e.code) {
    case 'ArrowLeft':
    case 'KeyA':
      backward()
      break
    case 'ArrowRight':
    case 'KeyD':
      forward()
      break
  }
}

watch(
  () => imageEl.value,
  () => {
    if (imageEl.value) {
      setImageContainerHeight()
      new ResizeObserver(setImageContainerHeight).observe(imageEl.value)
    }
  },
)

watch(
  () => currentExtractedResourceIndex.value,
  (newIndex, oldIndex) => {
    if (newIndex !== null && oldIndex !== null && newIndex !== oldIndex) {
      let index: number = newIndex

      if (newIndex < 0 || newIndex >= extractedResourcesCount.value)
        index = oldIndex

      delete fetchExtractedResourceParams.isFinished
      fetchExtractedResourceParams.index = index
      clearMeasurements()
      fetchExtractedResource({})
    }
  },
)
</script>

<template>
  <div
    v-if="
      currentExtractedResource
        && currentExtractedResource.result !== null
        && typeof currentExtractedResource.result === 'object'
        && !Array.isArray(currentExtractedResource.result)
    "
  >
    <div class="grid grid-cols-2 px-12">
      <div class="justify-self-start">
        <p class="break-all">
          Path: <span class="text-neutral-500">{{ currentExtractedResource.id }}</span>
        </p>
        <p>
          Status: <span
            :class="[
              {
                'text-neutral-500':
                  currentExtractedResource.status === 'PENDING',
              },
              {
                'text-primary-500':
                  currentExtractedResource.status === 'IN_REVIEW',
              },
              {
                'text-error-500': currentExtractedResource.status === 'REJECTED',
              },
              {
                'text-confirm-500':
                  currentExtractedResource.status === 'ACCEPTED',
              },
            ]"
          >
            {{ currentExtractedResource.status }}
          </span>
        </p>

        <a
          :href="(currentExtractedResource.metadata as any)?.videoLink"
          target="_blank"
          class="text-primary-500 text-sm cursor-pointer hover:text-primary-300"
        >Link to video</a>
        <div class="flex flex-row gap-2 items-center">
          <p>Index: </p>
          <button
            class="i-ph-caret-circle-left flex-none text-2xl text-neutral-500 hover:text-neutral-300 cursor-pointer"
            :class="[
              { 'cursor-default': currentExtractedResourceIndex === 0 },
              {
                'hover:text-neutral-500': currentExtractedResourceIndex === 0,
              },
            ]"
            @click="
              currentExtractedResourceIndex != null && currentExtractedResourceIndex > 0
                ? currentExtractedResourceIndex--
                : null
            "
          />
          <input
            id="dataIndex"
            type="number"
            :value="currentExtractedResource.index + 1"
            class="appearance-none bg-neutral-700 p-1 w-[3em] outline-none focus:bg-neutral-500"
            @change="(event: any) => currentExtractedResourceIndex = event.target.value - 1"
          >
          <label for="dataIndex">of {{ extractedResourcesCount }}</label>
          <button
            class="i-ph-caret-circle-right flex-none text-2xl text-neutral-500 hover:text-neutral-300 cursor-pointer"
            :class="[
              { 'cursor-default': currentExtractedResourceIndex === extractedResourcesCount - 1 },
              {
                'hover:text-neutral-500':
                  currentExtractedResourceIndex === extractedResourcesCount - 1,
              },
            ]"
            @click="
              currentExtractedResourceIndex != null && currentExtractedResourceIndex < extractedResourcesCount - 1
                ? currentExtractedResourceIndex++
                : null
            "
          />
        </div>
      </div>
      <div class="justify-self-end items-center flex flex-row gap-4 mt-4">
        <button
          class="btn btn-primary bg-error-700 hover:bg-error-500"
          @click="updateExtractedResource({
            status: 'REJECTED',
          })"
        >
          Reject
          <div class="i-ph-x text-xl" />
        </button>
        <button
          class="btn btn-primary bg-confirm-700 hover:bg-confirm-500"
          @click="updateExtractedResource({
            status: 'ACCEPTED',
          })"
        >
          Accept
          <div class="i-ph-check text-xl" />
        </button>
        <button
          class="btn btn-primary"
          @click="updateExtractedResource({
            status: 'IN_REVIEW',
          })"
        >
          Send to QC
          <div class="i-ph-share text-xl" />
        </button>
        <button
          class="btn btn-primary"
        >
          Download session data
          <div class="i-ph-download text-xl" />
        </button>
      </div>
    </div>
    <div class="grid grid-cols-5 gap-x-4 py-4">
      <div
        class="col-span-3 outline-none"
        :tabindex="0"
        autofocus
        @keydown="operate"
      >
        <VueZoomer ref="zoomer" :zooming-elastic="false" :double-click-to-zoom="false" class="w-full h-auto">
          <div class="mt-2">
            <div ref="imageContainerEl" class="relative w-full">
              <img
                ref="imageEl"
                class="object-contain w-full h-auto"
                :src="`${currentExtractedResource.fullPath}`"
                :style="{
                  filter: `brightness(${visualConf.brightness}) contrast(${visualConf.contrast}`,
                }"
              >
              <SessionCEAnnotation
                v-if="imageEl"
                v-model:activeMeasurement="activeMeasurement"
                v-model:visibleMeasurements="visibleMeasurements"
                class="z-30 top-0 left-0 absolute w-full h-full"
                :image-metadata="currentExtractedResource.metadata as any"
                :image-element="imageEl"
              />
            </div>
          </div>
        </VueZoomer>
        <div class="flex flex-row gap-5 m-2 justify-center items-center">
          <button class="i-ph-plus text-neutral-500 hover:text-neutral-300 text-6 cursor-pointer" @click="zoomer?.zoomIn()" />
          <button class="i-ph-minus text-neutral-500 hover:text-neutral-300 text-6 cursor-pointer" @click="zoomer?.zoomOut()" />
          <button class="i-ph-arrow-clockwise text-neutral-500 hover:text-neutral-300 text-6 cursor-pointer" @click="zoomer?.reset()" />
        </div>
        <div class="mt-2 grid grid-cols-2">
          <div class="w-full px-4 inline-flex justify-start items-center gap-2">
            <button class="i-ph-sun text-[1.25em] text-neutral-500" />
            <p class="flex-none w-[2em]">
              {{ visualConf.brightness }}
            </p>
            <input
              v-model="visualConf.brightness"
              type="range"
              class="cursor-pointer w-full"
              :max="2"
              step="0.01"
              min="0"
            >
            <button class="i-ph-arrow-clockwise text-neutral-500 hover:text-neutral-300 text-6 cursor-pointer" @click="visualConf.brightness = 1" />
          </div>
          <div class="w-full px-4 inline-flex justify-start items-center gap-2">
            <button class="i-ph-circle-half-tilt text-[1.25em] text-neutral-500" />
            <p class="flex-none w-[2em]">
              {{ visualConf.contrast }}
            </p>
            <input
              v-model="visualConf.contrast"
              type="range"
              class="cursor-pointer w-full"
              :max="2"
              step="0.01"
              min="0"
            >
            <button class="i-ph-arrow-clockwise text-neutral-500 hover:text-neutral-300 text-6 cursor-pointer" @click="visualConf.contrast = 1" />
          </div>
        </div>
      </div>
      <div class="col-span-2">
        <SessionCEEditForm
          v-model:visibleMeasurements="visibleMeasurements"
          v-model:activeMeasurement="activeMeasurement"
          v-model:comment="(currentExtractedResource.metadata as any).comment"
          :result="currentExtractedResource.result"
        />
      </div>
    </div>
  </div>
</template>
