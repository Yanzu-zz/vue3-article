<template>
  <div class="container-lg">
    <global-header :user="currentUser"></global-header>
    <loader v-if="isLoading"></loader>

    <!-- 路由变化展示的页面 -->
    <router-view></router-view>

    <footer class="text-center py-4 text-secondary bg-light mt-6">
      <small>
        <ul class="list-inline mb-0">
          <li class="list-inline-item">© 2020 者也专栏</li>
          <li class="list-inline-item">课程</li>
          <li class="list-inline-item">文档</li>
          <li class="list-inline-item">联系</li>
          <li class="list-inline-item">更多</li>
        </ul>
      </small>
    </footer>
  </div>
</template>

<script lang="ts">
import 'bootstrap/dist/css/bootstrap.min.css' // bootstrap yyds
import { computed, defineComponent, watch } from 'vue'
import { useStore } from 'vuex'
import GlobalHeader from './components/GlobalHeader.vue'
import { GlobalDataProps } from './types/index'
import Loader from './components/Loader.vue'
import createMessage from './components/createMessage'

export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
    Loader
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const currentUser = computed(() => store.state.user)
    const isLoading = computed(() => store.state.loading)
    const error = computed(() => store.state.error)

    // 监听全局错误信息
    watch(
      () => error.value.status,
      () => {
        const { status, message } = error.value
        if (status && message) {
          createMessage(message, 'error')
        }
      }
    )

    return {
      currentUser,
      isLoading,
      error
    }
  }
})
</script>
