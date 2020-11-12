<template>
  <div class="file-upload">
    <div
      class="file-upload-container"
      @click.prevent="triggerUpload"
      v-bind="$attrs"
    >
      <slot v-if="fileStatus === 'loading'" name="loading">
        <button class="btn btn-primary" disabled>正在上传...</button>
      </slot>
      <!-- scoped slot 给父组件传递上传好的图片的值 -->
      <slot
        v-else-if="fileStatus === 'success'"
        name="uploaded"
        :uploadedData="uploadedData"
      >
        <button class="btn btn-primary">上传成功</button>
      </slot>
      <slot v-else name="default">
        <button class="btn btn-primary">点击上传</button>
      </slot>
    </div>
    <input
      type="file"
      class="file-input d-none"
      ref="fileInput"
      @change="handleFileChange"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import axios from 'axios'

type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
type CheckFunction = (file: File) => boolean

export default defineComponent({
  props: {
    action: {
      type: String,
      required: true
    },
    beforeUpload: {
      type: Function as PropType<CheckFunction>
    }
  },
  inheritAttrs: false,
  emits: ['file-uploaded', 'file-uploaded-error'],
  setup(props, context) {
    const fileInput = ref<null | HTMLInputElement>(null)
    const fileStatus = ref<UploadStatus>('ready')
    const uploadedData = ref()
    const triggerUpload = () => {
      if (fileInput.value) {
        // 触发 文件input组件点击事件
        fileInput.value.click()
      }
    }

    const handleFileChange = (e: Event) => {
      const currentTarget = e.target as HTMLInputElement
      if (currentTarget.files) {
        const files = Array.from(currentTarget.files)

        // 上传前检查
        if (props.beforeUpload) {
          const result = props.beforeUpload(files[0])
          // 检查不通过不执行下方逻辑
          if (!result) {
            return
          }
        }

        fileStatus.value = 'loading'
        const formData = new FormData()
        formData.append('file', files[0]) // 只能上传一个文件c

        axios
          .post(props.action, formData, {
            headers: {
              'Content-type': 'multipart/form-data'
            }
          })
          .then((res) => {
            fileStatus.value = 'success'
            uploadedData.value = res.data
            context.emit('file-uploaded', res.data)
          })
          .catch((err) => {
            fileStatus.value = 'error'
            context.emit('file-uploaded-error', { err })
          })
          .finally(() => {
            if (fileInput.value) {
              // 清空文件上传的数据
              fileInput.value.value = ''
            }
          })
      }
    }

    return {
      fileInput,
      fileStatus,
      triggerUpload,
      handleFileChange,
      uploadedData
    }
  }
})
</script>

<style>
</style>
