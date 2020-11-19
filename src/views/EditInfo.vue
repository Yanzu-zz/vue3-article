<template>
  <div class="edit-info">
    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li
        v-for="(item, index) in tabData.tabList"
        :key="index"
        class="nav-item"
        role="presentation"
        @click="changeTab(index)"
      >
        <a
          class="nav-link"
          :class="{ active: tabData.activedIndex === index }"
          data-toggle="tab"
          role="tab"
          aria-controls="home"
          aria-selected="true"
          >{{ item.text }}</a
        >
      </li>
    </ul>

    <div v-if="tabData.activedIndex === 0" class="edit-user-info">
      <h4>编辑个人资料</h4>

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
          <validate-input
            :rules="userNameRules"
            v-model="userNameVal"
            placeholder="请输入需要修改的用户名"
            type="text"
          />
        </div>
        <div class="mb-3">
          <validate-input
            rows="10"
            tag="textarea"
            placeholder="请输入用户简介"
            v-model="descriptionVal"
          />
        </div>
        <template #submit>
          <button class="btn btn-primary btn-large">提交修改</button>
        </template></validate-form
      >
    </div>

    <div v-if="tabData.activedIndex === 1" class="edit-post-info">
      <h1>12312</h1>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { GlobalDataProps, ResponseType, ImageProps } from '@/types'
import { beforeUploadCheck } from '@/helper'
import ValidateForm from '../components/ValidateForm.vue'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import Uploader from '../components/Uploader.vue'
import createMessage from '@/components/createMessage'

export default defineComponent({
  name: 'EditInfo',
  components: {
    ValidateInput,
    ValidateForm,
    Uploader
  },
  setup() {
    const uploadedData = ref()
    const store = useStore<GlobalDataProps>()
    const router = useRouter()
    const user = computed(() => store.state.user)
    let imageId = ''

    const tabData = reactive({
      tabList: [
        {
          text: '更新个人资料'
        },
        {
          text: '更新专栏资料'
        }
      ],
      activedIndex: 0
    })

    const changeTab = (index) => {
      tabData.activedIndex = index
    }

    const userNameVal = ref(user.value.nickName)
    const userNameRules: RulesProp = [
      { type: 'required', message: '用户名不能为空' }
    ]
    const descriptionVal = ref(user.value.description)

    const handleFileUploaded = (rawData: ResponseType<ImageProps>) => {
      if (rawData.data._id) {
        imageId = rawData.data._id
      }
    }

    // 点击发布文章按钮时
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const payload = {
          nickName: userNameVal.value,
          description: descriptionVal.value,
          avatar: imageId
        }

        store
          .dispatch('updateCurrentUser', { userId: user.value._id, payload })
          .then(() => {
            createMessage('更新信息成功，2秒后跳转到首页', 'success', 2000)
            setTimeout(() => {
              router.push('/')
            }, 2000)
          })
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
      userNameVal,
      userNameRules,
      descriptionVal,
      onFormSubmit,
      uploadCheck,
      handleFileUploaded,
      uploadedData,
      tabData,
      changeTab
    }
  }
})
</script>

<style>
.edit-info .nav {
  margin-bottom: 30px;
}

.edit-info .nav .nav-item {
  cursor: pointer;
}

.edit-info .file-upload-container {
  height: 200px;
  margin-bottom: 30px;
  cursor: pointer;
  overflow: hidden;
}

.edit-info .file-upload-container img {
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
