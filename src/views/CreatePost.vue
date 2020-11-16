<template>
  <div class="create-post-page">
    <h4>{{ isEditMode ? '编辑文章' : '新建文章' }}</h4>

    <uploader
      action="/api/upload"
      class="d-flex align-items-center justify-content-center bg-light text-secondary"
      :beforeUpload="uploadCheck"
      :uploaded="uploadedData"
      @file-uploaded="handleFileUploaded"
    >
      <h2>点击上传头图</h2>
      <template #loading>
        <div class="d-flex">
          <div class="spinner-border text-secondary" role="status"></div>
          <h2>&nbsp;正在上传</h2>
        </div>
      </template>

      <template #uploaded="dataProps">
        <img :src="dataProps.uploadedData.data.url" /> </template
    ></uploader>

    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题：</label>
        <validate-input
          :rules="titleRules"
          v-model="titleVal"
          placeholder="请输入文章标题"
          type="text"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">文章详情：</label>
        <validate-input
          rows="10"
          tag="textarea"
          placeholder="请输入文章详情"
          :rules="contentRules"
          v-model="contentVal"
        />
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large">
          {{ isEditMode ? '更新文章' : '发表文章' }}
        </button>
      </template></validate-form
    >
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { GlobalDataProps, PostProps, ResponseType, ImageProps } from '@/types'
import { beforeUploadCheck } from '@/helper'
import ValidateForm from '../components/ValidateForm.vue'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import Uploader from '../components/Uploader.vue'
import createMessage from '@/components/createMessage'

export default defineComponent({
  name: 'CreatePost',
  components: {
    ValidateInput,
    ValidateForm,
    Uploader
  },
  setup() {
    const uploadedData = ref()
    const store = useStore<GlobalDataProps>()
    const route = useRoute()
    const router = useRouter()
    const isEditMode = !!route.query.id
    let imageId = ''
    const titleVal = ref('')
    const titleRules: RulesProp = [
      { type: 'required', message: '文章标题不能为空' }
    ]
    const contentVal = ref('')
    const contentRules: RulesProp = [
      { type: 'required', message: '文章详情不能为空' }
    ]

    onMounted(() => {
      if (isEditMode) {
        store
          .dispatch('fetchPost', route.query.id)
          .then((rawData: ResponseType<PostProps>) => {
            const currentPost = rawData.data
            if (currentPost.image) {
              uploadedData.value = { data: currentPost.image }
            }
            titleVal.value = currentPost.title + ''
            contentVal.value = currentPost.content || ''
          })
      }
    })

    const handleFileUploaded = (rawData: ResponseType<ImageProps>) => {
      if (rawData.data._id) {
        imageId = rawData.data._id
      }
    }

    // 点击发布文章按钮时
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const { column, _id } = store.state.user
        if (column) {
          // 上传需要传的参数
          const newPost: PostProps = {
            _id: _id + '',
            title: titleVal.value,
            content: contentVal.value,
            column,
            author: _id,
            createdAt: new Date().toLocaleString()
          }

          if (imageId) {
            newPost.image = imageId
          }

          let actionName = 'createPost'
          let sendData
          if (isEditMode) {
            sendData = {
              id: route.query.id,
              payload: newPost
            }
            actionName = 'updatePost'
          } else {
            sendData = newPost
          }
          store.dispatch(actionName, sendData).then(() => {
            createMessage('发表成功，2秒后跳转到文章', 'success', 2000)
            setTimeout(() => {
              router.push({ name: 'column', params: { id: column } })
            }, 2000)
          })
        }
      }
    }

    // 上传前的 check
    const uploadCheck = (file: File) => {
      const result = beforeUploadCheck(file, {
        format: ['image/jpeg', 'image/png'],
        size: 1
      })
      const { passed, error } = result

      // 不要用 switch，因为可能会同时触发多个错误
      if (error === 'format') {
        createMessage('上传图片只能是 JPG/PNG 格式！', 'error')
      }
      if (error === 'size') {
        createMessage('上传图片大小不能超过 1Mb！', 'error')
      }

      return passed
    }

    return {
      titleVal,
      titleRules,
      contentVal,
      contentRules,
      onFormSubmit,
      uploadCheck,
      handleFileUploaded,
      uploadedData,
      isEditMode
    }
  }
})
</script>

<style>
.create-post-page .file-upload-container {
  height: 200px;
  cursor: pointer;
  overflow: hidden;
}

.create-post-page .file-upload-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.uploaded-area {
  position: relative;
}

.uploaded-area:hover h3 {
  display: block;
}

.uploaded-area h3 {
  display: none;
  position: absolute;
  color: #999;
  text-align: center;
  width: 100%;
  top: 50%;
}
</style>
