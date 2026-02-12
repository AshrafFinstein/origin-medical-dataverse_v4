<script setup lang="ts">
/**
 * FormError Component
 * 
 * A reusable component for displaying form validation error messages.
 * Designed to prevent modal height growth by maintaining a fixed height.
 * 
 * @component
 * @example
 * <FormError :error="nameError" :touched="nameTouched" />
 */

interface Props {
  /**
   * The error message to display
   */
  error?: string
  /**
   * Whether the field has been touched/interacted with
   */
  touched?: boolean
  /**
   * Custom label width offset for alignment (default: 100px)
   * This should match the label-width of the parent NFormItem
   */
  labelOffset?: string
  /**
   * Additional CSS classes
   */
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  error: '',
  touched: false,
  labelOffset: '100px',
  class: '',
})

const showError = computed(() => props.touched && !!props.error)
</script>

<template>
  <div
    :class="[
      'form-error-container',
      props.class
    ]"
    :style="{
      paddingLeft: labelOffset,
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
    }"
  >
    <Transition name="error-fade">
      <span
        v-if="showError"
        class="text-red-500 text-xs"
        style="line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
      >
        {{ error }}
      </span>
    </Transition>
  </div>
</template>

<style scoped>
.form-error-container {
  transition: all 0.2s ease-in-out;
}

.error-fade-enter-active,
.error-fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.error-fade-enter-from,
.error-fade-leave-to {
  opacity: 0;
}
</style>
