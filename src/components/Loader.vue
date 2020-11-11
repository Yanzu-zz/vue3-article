<template>
  <teleport :to="`#${nodeName}`">
    <div
      class="d-flex justify-content-center align-items-center h-100 w-100 loading-container"
      :style="{ backgroundColor: background || '' }"
    >
      <div class="loading-content">
        <div class="spinner-border text-primary" role="status">
          <!-- <span class="sr-only">{{ text || 'loading' }}</span> -->
        </div>
        <p v-if="text" class="text-primary small">{{ text }}</p>
      </div>
    </div>
  </teleport>
</template>

<script>
import { defineComponent, ref } from 'vue'
import useDOMCreate from '@/hooks/useDOMCreate'

export default defineComponent({
  props: {
    text: {
      type: String
    },
    background: {
      type: String
    }
  },
  setup() {
    const nodeName = ref('back')
    useDOMCreate(nodeName.value)

    return {
      nodeName
    }
  }
})
</script>

<style>
.loading-container {
  background: rgba(255, 255, 255, 0.5);
  z-index: 100;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  text-align: center;
}
</style>
