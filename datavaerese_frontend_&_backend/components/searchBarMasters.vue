<script>
// Import the NInput component from your UI library
// Assuming you're using Naive UI based on your original code
import { NInput } from 'naive-ui';

export default {
  name: "SearchComponent",
  components: {
    NInput
  },
  props: {
    // The search function to call when button is clicked
    onSearch: {
      type: Function,
      required: true
    },
    // Value for v-model binding
    modelValue: {
      type: String,
      default: ""
    },
    // Placeholder text
    placeholder: {
      type: String,
      default: "Search"
    }
  },
  data() {
    return {
      searchQuery: this.modelValue
    }
  },
  watch: {
    // Update component when modelValue changes
    modelValue(newVal) {
      this.searchQuery = newVal;
    },
    // Emit update event when searchQuery changes
    searchQuery(newVal) {
      this.$emit("update:modelValue", newVal);
    }
  },
  methods: {
    handleSearch() {
      // Call the provided search function with the current query
      this.onSearch(this.searchQuery);
    },
    handleKeyDown(event) {
      // Trigger search when Enter key is pressed
      if (event.key === "Enter") {
        this.handleSearch();
      }
    },
    handleClear() {
      // Clear the search query
      this.searchQuery = "";
      // Trigger search with empty query
      this.handleSearch();
    }
  }
}
</script>

<template>
  <NInput 
    :placeholder="placeholder" 
    v-model:value="searchQuery"
    @keydown="handleKeyDown">
    <template #suffix>
      <div class="flex items-center gap-1">
        <svg 
          v-if="searchQuery" 
          @click="handleClear" 
          class="flex-none cursor-pointer hover:opacity-70" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1024 1024" 
          width="18" 
          height="18" 
          fill="currentColor">
          <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3.1-3.6-7.6-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3.1 3.6 7.6 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
        </svg>
        <svg 
          @click="handleSearch" 
          class="flex-none cursor-pointer hover:opacity-70" 
          xmlns="http://www.w3.org/2000/svg" 
          xmlns:xlink="http://www.w3.org/1999/xlink" 
          viewBox="0 0 1024 1024" 
          width="24" 
          height="24" 
          fill="currentColor">
          <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1c-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"></path>
        </svg>
      </div>
    </template>
  </NInput>
</template>