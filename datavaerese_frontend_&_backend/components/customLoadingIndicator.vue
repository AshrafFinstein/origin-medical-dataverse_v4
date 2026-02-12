
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { isLoaderVisible } from '../types/Loader';

const isApiLoaderVisibles = computed(() => isLoaderVisible());
const router = useRouter();
const isPageLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    isPageLoading.value = false;
  }, 100);

  router.beforeEach((to, from, next) => {
    isPageLoading.value = true;
    next();
  });

  router.afterEach(async () => {
    await nextTick();
    setTimeout(() => {
      isPageLoading.value = false;
    }, 100);
  });
})

</script>

<template>
  <div v-if="isPageLoading || isApiLoaderVisibles" class="custom-loading-indicator backdrop-blur-[2px]">
    <div class="spinner"></div>
  </div>
</template>


<style scoped>
.custom-loading-indicator {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
