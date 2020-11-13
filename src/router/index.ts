import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'
import axios from 'axios'

import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Signup from '@/views/Signup.vue'
import Column from '@/views/ColumnDetail.vue'
import CreatePost from '@/views/CreatePost.vue'
import PostDetail from '@/views/PostDetail.vue'

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
      path: '/signup',
      name: 'sugnup',
      component: Signup,
      meta: {
        redirectAlreadyLogin: true
      }
    },
    {
      path: '/create',
      name: 'create',
      component: CreatePost,
      meta: {
        requiredLogin: true
      }
    },
    {
      path: '/column/:id',
      name: 'column',
      component: Column
    },
    {
      path: '/posts/:id',
      name: 'post',
      component: PostDetail
    }
  ]
})

// 当一个导航触发的时候干一些事（比未登录进入一些页面需要跳转到登录界面）
router.beforeEach((to, form, next) => {
  const { user, token } = store.state
  const { requiredLogin, redirectAlreadyLogin } = to.meta

  // 未登录
  if (!user.isLogin) {
    // 有 token 的情况
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      store.dispatch('fetchCurrentUser')
        .then(() => {
          if (redirectAlreadyLogin) {
            next('/')
          } else {
            next()
          }
        }).catch(e => {
          console.log(e)
          store.commit('logout')
          next('login')
        })
    } else {
      // 没有 token 的情况
      // 如页面刚刷新，请求 fetchCurrentUser 还没返回数据的时候
      if (requiredLogin) {
        next('login')
      } else {
        next()
      }
    }
  } else { // 已登录
    if (redirectAlreadyLogin) {
      next('/')
    } else {
      next()
    }
  }
})

export default router
