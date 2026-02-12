import { reactive } from 'vue';

export const loaderState = reactive({
  activeCalls: 0,
});

export function showLoader() {
  loaderState.activeCalls++;
}

export function hideLoader() {
  if (loaderState.activeCalls > 0) {
    loaderState.activeCalls--;
  }
}

export function isLoaderVisible() {
  return loaderState.activeCalls > 0;
}