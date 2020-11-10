import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import axios from 'axios'

// 可以在 axios 提供的拦截器里设置全局 请求状态
axios.interceptors.request.use(config => {
  store.commit('setLoading', true)

  return config
})

axios.interceptors.response.use(config => {
  store.commit('setLoading', false)

  return config
})

const app = createApp(App)
app.use(router)
app.use(store)

app.mount('#app')
