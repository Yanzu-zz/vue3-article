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
import { defineComponent, onUnmounted, ref } from 'vue'

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
    const node = document.createElement('div')

    node.id = nodeName.value
    document.body.appendChild(node)

    // 添加了的节点记得在卸载时删除掉！！！
    onUnmounted(() => {
      document.body.removeChild(node)
    })

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
