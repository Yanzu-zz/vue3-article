import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import axios from 'axios'

// axios.defaults.baseURL = '/api'
axios.interceptors.request.use(config => {
  config.params = {
    ...config.params // 在请求时自己添加的参数保留
    // icode: 'C6A6C4086133360B' // 校验码，如果没有或者过期了就获取不了数据了
  }
  return config
})
// axios.get('/api/columns').then(res => {
//   console.log(res)
// })

const app = createApp(App)
app.use(router)
app.use(store)

app.mount('#app')
