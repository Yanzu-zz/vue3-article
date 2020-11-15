import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import axios from 'axios'

// 可以在 axios 提供的拦截器里设置全局 请求状态
axios.interceptors.request.use(config => {
  // 请求时设置全局 loading 状态
  store.commit('setLoading', true)
  store.commit('setError', { status: false, message: '' })

  return config
})

axios.interceptors.response.use(config => {
  // 解除 loading 状态
  store.commit('setLoading', false)

  return config
}, e => {
  const { error } = e.response.data
  store.commit('setError', { status: true, message: error })
  store.commit('setLoading', false)

  return Promise.reject(error)
})

const app = createApp(App)
app.use(router)
app.use(store)

app.mount('#app')
