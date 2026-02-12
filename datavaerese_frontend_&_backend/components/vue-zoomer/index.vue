<!-- eslint-disable @typescript-eslint/no-use-before-define -->
<!-- vue-zoomer: https://github.com/jarvisniu/vue-zoomer -->
<script setup lang="ts">
import TapDetector from './TapDetector'

const props = defineProps({
  minScale: { type: Number, default: 1 },
  maxScale: { type: Number, default: 5 },
  zoomed: { type: Boolean, default: false },
  resetTrigger: { type: Number, default: 1e5 },
  aspectRatio: { type: Number, default: 1 },
  backgroundColor: { type: String, default: 'transparent' },
  pivot: { type: String, default: 'cursor' }, // other options: image-center
  zoomingElastic: { type: Boolean, default: true },
  limitTranslation: { type: Boolean, default: true },
  doubleClickToZoom: { type: Boolean, default: true },
  mouseWheelToZoom: { type: Boolean, default: true },
})

const emit = defineEmits(['update:zoomed', 'swipe'])

const root = ref<HTMLDivElement>()

const containerWidth = ref(1)
const containerHeight = ref(1)
const containerLeft = ref(0)
const containerTop = ref(0)

const translateX = ref(0)
const animTranslateX = ref(0)
const translateY = ref(0)
const animTranslateY = ref(0)
const scale = ref(1)
const animScale = ref(1)
// Mouse states
const lastFullWheelTime = ref(0)
const lastWheelTime = ref(0)
const lastWheelDirection = ref('y')
const isPointerDown = ref(false)
const pointerPosX = ref(-1)
const pointerPosY = ref(-1)
const twoFingerInitDist = ref(0)
const panLocked = ref(true)
// Others
const raf = ref<number | null>(null)
const tapDetector = ref<TapDetector | null>(null)
const isCtrlKeyPressed = ref(false)

const wrapperStyle = computed(() => {
  const translateX = containerWidth.value * animTranslateX.value
  const translateY = containerHeight.value * animTranslateY.value
  return {
    transform: [
          `translate(${translateX}px, ${translateY}px)`,
          `scale(${animScale.value})`,
    ].join(' '),
  }
})

onKeyStroke('Control', () => {
  isCtrlKeyPressed.value = true
}, { eventName: 'keydown' })

onKeyStroke('Control', () => {
  isCtrlKeyPressed.value = false
}, { eventName: 'keyup' })

// API ---------------------------------------------------------------------
function reset() {
  scale.value = 1
  panLocked.value = true
  translateX.value = 0
  translateY.value = 0
}
function zoomIn(scale = 2) {
  tryToScale(scale)
  onInteractionEnd()
}
function zoomOut(scale = 0.5) {
  tryToScale(scale)
  onInteractionEnd()
}
defineExpose({
  reset,
  zoomIn,
  zoomOut,
})
// Main Logic --------------------------------------------------------------
// scale
// Zoom the image with the point at the pointer(mouse or pinch center) pinned.
// Simplify: This can be regard as vector pointer to old-image-center scaling.
function tryToScale(scaleDelta: number) {
  let newScale = scale.value * scaleDelta
  if (props.zoomingElastic) {
    // damping
    if (newScale < props.minScale || newScale > props.maxScale) {
      let log = Math.log2(scaleDelta)
      log *= 0.2
      scaleDelta = 2 ** log
      newScale = scale.value * scaleDelta
    }
  }
  else {
    if (newScale < props.minScale)
      newScale = props.minScale
    else if (newScale > props.maxScale)
      newScale = props.maxScale
  }
  scaleDelta = newScale / scale.value
  scale.value = newScale
  if (props.pivot !== 'image-center') {
    const normMousePosX = (pointerPosX.value - containerLeft.value) / containerWidth.value
    const normMousePosY = (pointerPosY.value - containerTop.value) / containerHeight.value
    translateX.value = (0.5 + translateX.value - normMousePosX) * scaleDelta + normMousePosX - 0.5
    translateY.value = (0.5 + translateY.value - normMousePosY) * scaleDelta + normMousePosY - 0.5
  }
}
function setPointerPosCenter() {
  pointerPosX.value = containerLeft.value + containerWidth.value / 2
  pointerPosY.value = containerTop.value + containerHeight.value / 2
}
// pan
function onPointerMove(newMousePosX: number, newMousePosY: number) {
  if (isPointerDown.value) {
    const pixelDeltaX = newMousePosX - pointerPosX.value
    const pixelDeltaY = newMousePosY - pointerPosY.value
    // console.log('pixelDeltaX, pixelDeltaY', pixelDeltaX, pixelDeltaY)
    if (!panLocked.value) {
      translateX.value += pixelDeltaX / containerWidth.value
      translateY.value += pixelDeltaY / containerHeight.value
    }
  }
  pointerPosX.value = newMousePosX
  pointerPosY.value = newMousePosY
}

// limit the scale between max and min and the translate within the viewport
function getMarginDirection() {
  const containerRatio = containerWidth.value / containerHeight.value
  return containerRatio > props.aspectRatio ? 'x' : 'y'
}
function calcTranslateLimit() {
  if (getMarginDirection() === 'y') {
    const imageToContainerRatio = containerWidth.value / props.aspectRatio / containerHeight.value
    let translateLimitY = (scale.value * imageToContainerRatio - 1) / 2
    if (translateLimitY < 0)
      translateLimitY = 0
    return {
      x: (scale.value - 1) / 2,
      y: translateLimitY,
    }
  }
  else {
    const imageToContainerRatio = containerHeight.value * props.aspectRatio / containerWidth.value
    let translateLimitX = (scale.value * imageToContainerRatio - 1) / 2
    if (translateLimitX < 0)
      translateLimitX = 0
    return {
      x: translateLimitX,
      y: (scale.value - 1) / 2,
    }
  }
}
function limit() {
  // scale
  if (scale.value < props.minScale)
    scale.value = props.minScale
  // FIXME this sometimes will not reset when pinching in
  // tryToScale(props.minScale / scale.value)
  else if (scale.value > props.maxScale)
    tryToScale(props.maxScale / scale.value)

  // translate
  if (props.limitTranslation) {
    const translateLimit = calcTranslateLimit()
    if (Math.abs(translateX.value) > translateLimit.x)
      translateX.value *= translateLimit.x / Math.abs(translateX.value)

    if (Math.abs(translateY.value) > translateLimit.y)
      translateY.value *= translateLimit.y / Math.abs(translateY.value)
  }
}
const onInteractionEnd = useDebounceFn(() => {
  limit()
  panLocked.value = scale.value === 1
  emit('update:zoomed', !panLocked.value)
}, 100)
function onDoubleTap(ev: MouseEvent) {
  if (scale.value === 1) {
    if (ev.clientX > 0) {
      pointerPosX.value = ev.clientX
      pointerPosY.value = ev.clientY
    }
    tryToScale(Math.min(3, props.maxScale))
  }
  else {
    reset()
  }
  onInteractionEnd()
}
// reactive
function onWindowResize() {
  const styles = window.getComputedStyle(root.value!)
  containerWidth.value = Number.parseFloat(styles.width)
  containerHeight.value = Number.parseFloat(styles.height)
  setPointerPosCenter()
  limit()
}
function refreshContainerPos() {
  const rect = root.value!.getBoundingClientRect()
  containerLeft.value = rect.left
  containerTop.value = rect.top
}
function gainOn(from: number, to: number) {
  const delta = (to - from) * 0.3
  // console.log('gainOn', from, to, from + delta)
  if (Math.abs(delta) > 1e-5)
    return from + delta
  else
    return to
}
function loop() {
  animScale.value = gainOn(animScale.value, scale.value)
  animTranslateX.value = gainOn(animTranslateX.value, translateX.value)
  animTranslateY.value = gainOn(animTranslateY.value, translateY.value)
  raf.value = window.requestAnimationFrame(loop)
  // console.log('loop', raf.value)
}

// Mouse Events ------------------------------------------------------------
// Mouse wheel scroll,  TrackPad pinch or TrackPad scroll
function onMouseWheelDo(wheelDelta: number) {
  // Value basis: One mouse wheel (wheelDelta=+-120) means 1.25/0.8 scale.
  const scaleDelta = 1.25 ** (wheelDelta / 120)
  tryToScale(scaleDelta)
  onInteractionEnd()
}
function onMouseWheel(ev: any) {
  if (isCtrlKeyPressed.value) {
    if (!props.mouseWheelToZoom)
      return
    // prevent is used to stop the page scroll elastic effects
    ev.preventDefault()
    if (ev.detail)
      ev.wheelDelta = ev.detail * -10
    const currTime = Date.now()
    if (Math.abs(ev.wheelDelta) === 120) {
      // Throttle the TouchPad pinch on Mac, or it will be too sensitive
      if (currTime - lastFullWheelTime.value > 50) {
        onMouseWheelDo(ev.wheelDelta)
        lastFullWheelTime.value = currTime
      }
    }
    else {
      if (currTime - lastWheelTime.value > 50 && typeof ev.deltaX === 'number') {
        lastWheelDirection.value = (ev.detail === 0 && Math.abs(ev.deltaX) > Math.abs(ev.deltaY)) ? 'x' : 'y'
        if (lastWheelDirection.value === 'x')
          emit('swipe', ev.deltaX > 0 ? 'left' : 'right')
      }
      if (lastWheelDirection.value === 'y')
        onMouseWheelDo(ev.wheelDelta)
    }
    lastWheelTime.value = currTime
  }
}
function onMouseDown(ev: MouseEvent) {
  if (isCtrlKeyPressed.value) {
    refreshContainerPos()
    isPointerDown.value = true
    // Open the context menu then click other place will skip the mousemove events.
    // This will cause the pointerPosX/Y NOT sync, then we will need to fix it on mousedown event.
    pointerPosX.value = ev.clientX
    pointerPosY.value = ev.clientY
    // console.log('onMouseDown', ev)
  }
}
function onMouseUp(ev: MouseEvent) {
  if (isCtrlKeyPressed.value) {
    isPointerDown.value = false
    onInteractionEnd()
  }
}
function onMouseMove(ev: MouseEvent) {
  if (isCtrlKeyPressed.value)
    onPointerMove(ev.clientX, ev.clientY)
  // console.log('onMouseMove client, offset', ev.clientX, ev.clientY)
}
// Touch Events ------------------------------------------------------------
function onTouchStart(ev: TouchEvent) {
  if (isCtrlKeyPressed.value) {
    if (ev.touches.length === 1) {
      refreshContainerPos()
      pointerPosX.value = ev.touches[0].clientX
      pointerPosY.value = ev.touches[0].clientY
      isPointerDown.value = true
    }
    else if (ev.touches.length === 2) {
      isPointerDown.value = true
      // pos
      pointerPosX.value = (ev.touches[0].clientX + ev.touches[1].clientX) / 2
      pointerPosY.value = (ev.touches[0].clientY + ev.touches[1].clientY) / 2
      // dist
      const distX = ev.touches[0].clientX - ev.touches[1].clientX
      const distY = ev.touches[0].clientY - ev.touches[1].clientY
      twoFingerInitDist.value = Math.sqrt(distX * distX + distY * distY)
    }
    // console.log('onTouchStart', ev.touches)
  }
}
function onTouchEnd(ev: TouchEvent) {
  if (isCtrlKeyPressed.value) {
    if (ev.touches.length === 0) {
      isPointerDown.value = false
      // Near 1 to set 1
      if (Math.abs(scale.value - 1) < 0.1)
        scale.value = 1
      onInteractionEnd()
    }
    else if (ev.touches.length === 1) {
      pointerPosX.value = ev.touches[0].clientX
      pointerPosY.value = ev.touches[0].clientY
    }
    // console.log('onTouchEnd', ev.touches.length)
  }
}
function onTouchMove(ev: TouchEvent) {
  if (isCtrlKeyPressed.value) {
    if (ev.touches.length === 1) {
      onPointerMove(ev.touches[0].clientX, ev.touches[0].clientY)
    }
    else if (ev.touches.length === 2) {
      // pos
      const newMousePosX = (ev.touches[0].clientX + ev.touches[1].clientX) / 2
      const newMousePosY = (ev.touches[0].clientY + ev.touches[1].clientY) / 2
      onPointerMove(newMousePosX, newMousePosY)
      pointerPosX.value = newMousePosX
      pointerPosY.value = newMousePosY
      // dist
      const distX = ev.touches[0].clientX - ev.touches[1].clientX
      const distY = ev.touches[0].clientY - ev.touches[1].clientY
      const newTwoFingerDist = Math.sqrt(distX * distX + distY * distY)
      tryToScale(newTwoFingerDist / twoFingerInitDist.value)
      twoFingerInitDist.value = newTwoFingerDist
    }
    // console.log('onTouchMove', pointerPosX.value, pointerPosY.value)
  }
}

onMounted(() => {
  tapDetector.value = new TapDetector()
  tapDetector.value.attach(root.value)
  if (props.doubleClickToZoom)
    tapDetector.value.onDoubleTap(onDoubleTap)

  // console.log('container size: ', containerWidth.value, containerHeight.value)
  window.addEventListener('resize', onWindowResize)
  onWindowResize()
  refreshContainerPos()
  loop()
})

onBeforeUnmount(() => {
  tapDetector.value!.detach(root.value)
  window.removeEventListener('resize', onWindowResize)
  window.cancelAnimationFrame(raf.value!)
  // console.log('destroy')
})

watch(scale, () => {
  if (scale.value !== 1) {
    emit('update:zoomed', true)
    panLocked.value = false
  }
})

watch(() => props.resetTrigger, () => {
  reset()
})
</script>

<template>
  <div
    ref="root"
    class="vue-zoomer"
    :style="{ backgroundColor }"
    @mousewheel="onMouseWheel"
    @DOMMouseScroll="onMouseWheel"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
    @mousemove="onMouseMove"
    @mouseout="setPointerPosCenter"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
    @touchmove="onTouchMove"
  >
    <div class="zoomer" :style="wrapperStyle">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.vue-zoomer {
  overflow: hidden;
}
.zoomer {
  transform-origin: 50% 50%;
  width: 100%;
  height: 100%;
}
.zoomer > img {
  /* remove the 4px gap below the image */
  vertical-align: top;
  user-drag: none;
  -webkit-user-drag: none;
  -moz-user-drag: none;
}
</style>
