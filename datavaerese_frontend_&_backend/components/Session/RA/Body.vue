<script setup lang="ts">
import type { PropType } from 'vue'
import type { Template as RATemplate } from '~/types/RASession'

const props = defineProps({
  examination: {
    type: Object,
    required: true,
  },
  result: {
    type: Object as PropType<RATemplate>,
    required: true,
  },
})

const emit = defineEmits(['update:result'])
const result = useVModel(props, 'result', emit)
const activeDataIndex = ref<number>(0)
const pdf = computed(() => props.examination.PDF)
const video = ref<HTMLVideoElement>()
const player = ref<HTMLDivElement>()
const loop = ref(false)
const src = computed(() => props.examination.data[activeDataIndex.value].path)
const controls = useMediaControls(video, { src })
const { isFullscreen, toggle } = useFullscreen(player)
const isPlaybackSpeedMenuActive = ref(false)
const playbackSpeedButton = ref<HTMLDivElement>()
const playbackSpeedOptions = reactive([1, 2, 4, 8, 16])
const isCommentBoxActive = ref(false)
const commentBoxButton = ref<HTMLDivElement>()
onClickOutside(playbackSpeedButton, () => {
  isPlaybackSpeedMenuActive.value = false
})
const videoVisualization = reactive({
  brightness: 1,
  contrast: 1,
})
const endBuffer = computed(() =>
  controls.buffered.value.length > 0
    ? controls.buffered.value[controls.buffered.value.length - 1][1]
    : 0,
)
function formatDuration(seconds: number) {
  return new Date(1000 * seconds).toISOString().substr(14, 5)
}
</script>

<template>
  <div class="grid grid-cols-12">
    <div class="col-span-7 pl-16 pr-3 outline-none">
      <ul class="flex flex-row flex-wrap justify-start gap-4 py-4" data-testid="ra-video-list">
        <li
          v-for="(item, index) in examination.data"
          :key="index"

          class="p-2 bg-neutral-700 w-auto flex flex-col items-center rounded-lg cursor-pointer"
          :class="activeDataIndex === index"
          @click="activeDataIndex = index"
          :data-testid="`ra-video-thumbnail-${index}`"
        >
          <div class="relative">
            <img :src="item.thumbnail" class="object-cover h-[90px] w-[90px]">
            <Icon
              name="ph:video-camera"
              class="absolute bottom-1 right-1 text-[1.25em] text-neutral-100"
            />
          </div>
        </li>
      </ul>
      <div ref="player">
        <div class="relative">
          <video
            ref="video"
            data-testid="ra-video-player"
            :loop="loop"
            :style="{
              filter: `brightness(${videoVisualization.brightness}) contrast(${videoVisualization.contrast}`,
            }"
            @click="controls.playing.value = !controls.playing.value"
          />
          <div
            v-if="controls.waiting.value"
            class="absolute inset-0 grid place-items-center pointer-events-none bg-black bg-opacity-20"
          >
            <Spinner />
          </div>
        </div>
        <Scrubber
          v-model="controls.currentTime.value"
          :max="controls.duration.value"
          :secondary="endBuffer"
          :highlights="[]"
        >
          <template #default="{ position, pendingValue }">
            <div
              class="absolute transform -translate-x-1/2 bg-black rounded px-2 bottom-0 mb-4 py-1 text-xs text-white"
              :style="{ left: position }"
            >
              {{ formatDuration(pendingValue) }}
            </div>
          </template>
        </Scrubber>
        <div class="mt-[7.85px] grid grid-cols-12">
          <div
            class="col-span-12 lg:col-span-4 flex flex-row items-center gap-4 items-center justify-start"
          >
            <Icon
              v-if="!controls.playing.value"
              name="ph:play"
              class="flex-none text-[1.25em] text-neutral-300 cursor-pointer hover:text-neutral-100"
              @click="controls.playing.value = true"
              data-testid="ra-play-button"
            />
            <Icon
              v-else
              name="ph:pause"
              class="flex-none text-[1.25em] text-neutral-300 cursor-pointer hover:text-neutral-100"
              @click="controls.playing.value = false"
              data-testid="ra-pause-button"
            />
            <Icon
              name="ph:repeat"
              class="flex-none text-[1.25em] cursor-pointer" :class="[
                loop
                  ? 'text-primary-300 hover:text-primary-100'
                  : 'text-neutral-300 hover:text-neutral-100',
              ]"
              @click="loop = !loop"
              data-testid="ra-loop-toggle"
            />
            <div ref="playbackSpeedButton" class="relative">
              <a
                @click="isPlaybackSpeedMenuActive = !isPlaybackSpeedMenuActive"
                data-testid="ra-playback-speed-button"
              >
                <Icon
                  name="ph:gauge"
                  class="text-[1.25em] cursor-pointer" :class="[
                    isPlaybackSpeedMenuActive
                      ? 'text-primary-300 hover:text-primary-100'
                      : 'text-neutral-300 hover:text-neutral-100',
                  ]"
                />
              </a>
              <div
                v-if="isPlaybackSpeedMenuActive"
                class="absolute z-40 left-[calc(100%+5.76px)] bottom-0 p-2 rounded-lg bg-neutral-700 shadow-md w-auto h-auto text-xs leading-7"
              >
                <div
                  v-for="value in playbackSpeedOptions"
                  :key="value"
                  class="text-[1.25em] cursor-pointer" :class="[
                    value === controls.rate.value
                      ? 'text-primary-300 hover:text-primary-100'
                      : 'text-neutral-300 hover:text-neutral-100',
                  ]"
                  @click="
                    () => {
                      controls.rate.value = value;
                      isPlaybackSpeedMenuActive = false;
                    }
                  "
                >
                  <button>{{ value }}</button>
                </div>
              </div>
            </div>
          </div>

          <div
            class="col-span-12 lg:col-span-4 flex flex-row flex-1 space-x-4 justify-center items-center"
          >
            <div
              class="flex flex-col leading-[18px] text-center text-neutral-100"
            >
              <span>
                {{ formatDuration(controls.currentTime.value) }} /
                {{ formatDuration(controls.duration.value) }}
              </span>
            </div>
          </div>
          <div
            class="col-span-12 lg:col-span-4 flex flex-row justify-end items-center gap-4"
          >
            <div class="w-[138px]">
              <div class="inline-flex justify-start items-center gap-2">
                <Icon name="ph:sun" class="flex-none text-[1.25em] text-neutral-500" />
                <input
                  v-model="videoVisualization.brightness"
                  type="range"
                  class="cursor-pointer w-full"
                  step="0.01"
                  min="0"
                  max="2"
                >
              </div>

              <div class="inline-flex justify-start items-center gap-2">
                <Icon
                  name="ph:circle-half-tilt"
                  class="flex-none text-[1.25em] text-neutral-500"
                />
                <input
                  v-model="videoVisualization.contrast"
                  type="range"
                  class="cursor-pointer w-full"
                  step="0.01"
                  min="0"
                  max="2"
                >
              </div>
            </div>
            <Icon
              name="ph:corners-out"
              class="flex-none text-[1.25em] cursor-pointer" :class="[
                isFullscreen
                  ? 'text-primary-300 hover:text-primary-100'
                  : 'text-neutral-300 hover:text-neutral-100',
              ]"
              @click="toggle"
              data-testid="ra-fullscreen-button"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="col-span-5 shadow-md">
      <div class="h-[calc(100%-80px)]">
        <iframe :src="pdf" height="100%" width="100%" />
      </div>

      <div class="px-4 py-4 bg-neutral-700">
        <div class="relative">
          <a
            ref="commentBoxButton"
            class="btn cursor-pointer" :class="[
              isCommentBoxActive ? 'btn-primary' : 'btn-secondary',
            ]"
            @click="isCommentBoxActive = !isCommentBoxActive"
            data-testid="ra-comment-toggle-button"
          >
            <Icon name="ph:chat-dots" class="text-[1.25em]" />Internal Comments
          </a>
          <div
            v-if="isCommentBoxActive"
            class="absolute z-40 bottom-[calc(100%)] bg-neutral-700 w-full p-2 rounded-lg"
          >
            <textarea
              v-model="result.comment"
              type="textarea"
              rows="5"
              class="w-full h-full bg-neutral-800 p-2 text-neutral-100"
              data-testid="ra-comment-textarea"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
