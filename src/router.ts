import { createRouter, createWebHistory } from 'vue-router'
import store from './store'

import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Column from './views/ColumnDetail.vue'
import CreatePost from './views/CreatePost.vue'

const routerHistory = createWebHistory()
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        redirectAlreadyLogin: true
      }
    },
    {
      path: '/column/:id',
      name: 'column',
      component: Column
    },
    {
      path: '/create',
      name: 'create',
      component: CreatePost,
      meta: {
        requiredLogin: true
      }
    }
  ]
})

// 当一个导航触发的时候干一些事（比未登录进入一些页面需要跳转到登录界面）
router.beforeEach((to, form, next) => {
  const userIsLogin = store.state.user.isLogin
  if (to.meta.requiredLogin && !userIsLogin) { // 未登录进入发布文章界面
    next({ name: 'login' })
  } else if (to.meta.redirectAlreadyLogin && userIsLogin) { // 已登录进入 登录 界面
    next('/')
  } else {
    next()
  }
})

export default router
