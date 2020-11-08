<template>
  <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
    <router-link to="/" class="navbar-brand">者也专栏</router-link>

    <!-- 未登录，显示两个按钮 -->
    <ul v-if="!user.isLogin" class="list-inline mb-0">
      <li class="list-inline-item">
        <router-link to="/login" class="btn btn-outline-light my-2"
          >登录</router-link
        >
      </li>
      <li class="list-inline-item">
        <router-link to="/login" class="btn btn-outline-light my-2"
          >注册</router-link
        >
      </li>
    </ul>

    <!-- 已登录，显示个人信息相关的 -->
    <ul v-else class="list-inline mb-0">
      <li class="list-inline-item">
        <dropdown :title="`你好 ${user.name}`">
          <dropdown-item>
            <router-link to="/create" class="dropdown-item"
              >新建文章</router-link
            >
          </dropdown-item>
          <dropdown-item>
            <router-link to="/" class="dropdown-item">编辑文章</router-link>
          </dropdown-item>
          <dropdown-item>
            <router-link to="/" class="dropdown-item">退出登录</router-link>
          </dropdown-item>
        </dropdown>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import Dropdown from './Dropdown.vue'
import DropdownItem from './DropdownItem.vue'

export interface UserProps {
  isLogin: boolean
  name?: string
  id?: number
}

export default defineComponent({
  name: 'GlobalHeader',
  components: {
    Dropdown,
    DropdownItem
  },
  setup() {
    const store = useStore()
    const user = computed(() => store.state.user)

    return {
      user
    }
  }
})
</script>

<style>
</style>
