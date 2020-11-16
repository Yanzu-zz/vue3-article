<template>
  <div class="post-detail-page">
    <modal
      title="删除文章"
      :visible="modalIsVisible"
      @modal-on-close="isRevealModal"
      @modal-on-confirm="hideAndDelete"
    >
      <p>确定要删除这篇文章吗？</p>
    </modal>

    <article class="w-75 mx-auto mb-5 pb-3" v-if="currentPost">
      <img
        :src="currentImageUrl"
        alt="currentPost.title"
        class="rounded-lg img-fluid my-4"
        v-if="currentImageUrl"
      />
      <h2 class="mb-4">{{ currentPost.title }}</h2>
      <div
        class="user-profile-component border-top border-bottom py-3 mb-5 align-items-center row g-0"
      >
        <div class="col">
          <user-profile
            :user="currentPost.author"
            v-if="typeof currentPost.author === 'object'"
          ></user-profile>
        </div>
        <span class="text-muted col text-right font-italic"
          >发表于：{{ currentPost.createdAt }}</span
        >
      </div>

      <!-- 需要解析的 html -->
      <div v-html="currentHTML"></div>

      <!-- 文章操作按钮（删除、修改，需要权限） -->
      <div v-if="showEditArea" class="btn-group mt-5">
        <router-link
          type="button"
          class="btn btn-success"
          :to="{ name: 'create', query: { id: currentPost._id } }"
          >编辑</router-link
        >
        <button
          type="button"
          class="btn btn-danger"
          @click.prevent="isRevealModal(true)"
        >
          删除
        </button>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, ref } from 'vue'
import MarkdownIt from 'markdown-it'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import {
  GlobalDataProps,
  PostProps,
  ImageProps,
  UserProps,
  ResponseType
} from '@/types'
import UserProfile from '../components/UserProfile.vue'
import Modal from '@/components/Modal.vue'
import createMessage from '@/components/createMessage'
// import createMessage from '../components/createMessage'

export default defineComponent({
  name: 'post-detail',
  components: {
    UserProfile,
    Modal
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const route = useRoute()
    const router = useRouter()
    const modalIsVisible = ref(false)
    const currentId = route.params.id
    const md = new MarkdownIt()

    onMounted(() => {
      store.dispatch('fetchPost', currentId)
    })

    // 当前点进来查看的 post 信息
    const currentPost = computed<PostProps>(() =>
      store.getters.getCurrentPost(currentId)
    )

    // markdown-it 需要解析的 html
    const currentHTML = computed(() => {
      const { content, isHTML } = currentPost.value
      if (currentPost.value && content) {
        return isHTML ? content : md.render(content)
      }
    })

    // 是否展示文章操作按钮（当作者点进来时）
    const showEditArea = computed(() => {
      const { isLogin, _id } = store.state.user
      // 是这篇文章的作者的话就展示
      if (currentPost.value && currentPost.value.author && isLogin) {
        const postAuthor = currentPost.value.author as UserProps
        return postAuthor._id === _id
      } else {
        return false
      }
    })

    // 文章大图
    const currentImageUrl = computed(() => {
      if (currentPost.value && currentPost.value.image) {
        const { image } = currentPost.value
        return (image as ImageProps).url + '?x-oss-process=image/resize,w_850'
      } else {
        return null
      }
    })

    const isRevealModal = (isReveal = false) => {
      modalIsVisible.value = isReveal
    }

    const hideAndDelete = () => {
      isRevealModal()
      store
        .dispatch('deletePost', currentId)
        .then((rawData: ResponseType<PostProps>) => {
          console.log(rawData)
          createMessage('删除成功，2秒之后跳转到专栏首页', 'success', 2000)
          setTimeout(() => {
            router.push({
              name: 'column'
              // params: { id: rawData.data.column }
            })
          }, 2000)
        })
    }

    return {
      currentPost,
      currentImageUrl,
      currentHTML,
      showEditArea,
      modalIsVisible,
      isRevealModal,
      hideAndDelete
    }
  }
})
</script>
