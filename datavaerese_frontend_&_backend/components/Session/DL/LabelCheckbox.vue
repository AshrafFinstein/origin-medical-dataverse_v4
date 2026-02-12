<script setup lang="ts">
defineProps({
  status: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <Icon v-if="status === 2" class="flex-none text-2xl text-confirm-500 hover:text-confirm-300 cursor-pointer" name="ph:check-square" />
  <Icon v-else-if="status === 1" class="flex-none text-2xl text-primary-500 hover:text-primary-300 cursor-pointer" name="ph:minus-square" />
  <Icon v-else-if="status === 0" class="flex-none text-2xl text-neutral-500 hover:text-neutral-300 cursor-pointer" name="ph:square" />
</template>
