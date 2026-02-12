<template>
  <ul 
    ref="listElement"
    :class="listClass" 
    :data-draggable-list="listId"
  >
    <li
      v-for="(item, index) in items"
      :key="getItemKey(item, index)"
      :class="itemClass"
      :data-item-index="index"
    >
      <slot :item="item" :index="index" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import Sortable from 'sortablejs'

interface Props {
  items: any[]
  listId?: string | number
  listClass?: string
  itemClass?: string
  handle?: string
  disabled?: boolean
  animation?: number
  getItemKey?: (item: any, index: number) => string | number
}

const props = withDefaults(defineProps<Props>(), {
  listId: 'default',
  listClass: '',
  itemClass: '',
  handle: '.drag-handle',
  disabled: false,
  animation: 150,
  getItemKey: (item: any, index: number) => item.id || index,
})

const emit = defineEmits<{
  (e: 'reorder', event: { oldIndex: number; newIndex: number; item: any }): void
  (e: 'start', event: { oldIndex: number; item: any }): void
  (e: 'end', event: { oldIndex: number; newIndex: number; item: any }): void
}>()

const listElement = ref<HTMLElement | null>(null)
let sortableInstance: Sortable | null = null

/**
 * Initialize SortableJS on the list element
 */
const initSortable = async () => {
  if (props.disabled) return

  await nextTick()

  const element = listElement.value
  if (!element) {
    return
  }

  // Destroy existing instance if any
  if (sortableInstance) {
    sortableInstance.destroy()
    sortableInstance = null
  }

  try {
    sortableInstance = Sortable.create(element, {
      handle: props.handle || undefined, // Empty string means entire item is draggable
      animation: props.animation,
      forceFallback: true, // Use fallback mode (mouse events) to avoid conflicts
      fallbackTolerance: 5, // Tolerance in pixels before drag starts
      fallbackOnBody: true, // Append dragged element to body for better z-index handling
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag',
      ignore: 'input, textarea, button, select, a, .no-drag',
      preventOnFilter: false,
      onStart: (event) => {
        emit('start', {
          oldIndex: event.oldIndex,
          item: props.items[event.oldIndex],
        })

        // Prevent the global dragstart handler from interfering
        if (event.originalEvent) {
          event.originalEvent.stopPropagation()
          event.originalEvent.preventDefault()
        }
      },
      onEnd: (event) => {
        emit('end', {
          oldIndex: event.oldIndex,
          newIndex: event.newIndex,
          item: props.items[event.oldIndex],
        })

        emit('reorder', {
          oldIndex: event.oldIndex,
          newIndex: event.newIndex,
          item: props.items[event.oldIndex],
        })
      },
    })
  } catch (error) {
    // Error initializing Sortable
  }
}

/**
 * Destroy Sortable instance
 */
const destroySortable = () => {
  if (sortableInstance) {
    sortableInstance.destroy()
    sortableInstance = null
  }
}

// Watch for disabled prop changes
watch(() => props.disabled, (disabled) => {
  if (disabled) {
    destroySortable()
  } else {
    initSortable()
  }
})

// Watch for items changes and reinitialize if needed
watch(() => props.items.length, () => {
  if (!props.disabled && sortableInstance) {
    // Reinitialize to update the list
    destroySortable()
    initSortable()
  }
})

onMounted(() => {
  // Wait for DOM to be ready
  nextTick(() => {
    initSortable()
  })
})

onBeforeUnmount(() => {
  destroySortable()
})
</script>

<style scoped>
/* Drag and Drop Styles */
:deep(.sortable-ghost) {
  opacity: 0.4;
}

:deep(.sortable-chosen) {
  cursor: grabbing !important;
}

:deep(.sortable-drag) {
  opacity: 0.8;
}

:deep(.drag-handle) {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  touch-action: none;
  -webkit-touch-callout: none;
  z-index: 10;
  cursor: grab;
}

:deep(.drag-handle:active) {
  cursor: grabbing !important;
}

:deep(.drag-handle:hover) {
  opacity: 0.8;
}
</style>

