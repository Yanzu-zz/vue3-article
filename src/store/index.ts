import { createStore, Commit } from 'vuex'
import axios from 'axios'
import { GlobalDataProps, GlobalErrorProps } from '@/types'

// 获取数据封装函数，完成重复工作
// eslint-disable-next-line
const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
  const { data } = await axios.get(url)
  commit(mutationName, data)
  return data
}

// post 请求
// eslint-disable-next-line
const postAndCommit = async (url: string, mutationName: string, commit: Commit, payload: any) => {
  const { data } = await axios.post(url, payload)
  commit(mutationName, data)
  return data
}

const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: [],
    posts: [],
    post: {
      _id: '',
      title: '',
      createdAt: '',
      column: ''
    },
    user: {
      isLogin: false
    }
  },
  mutations: {
    // login(state) {
    //   state.user = {
    //     ...state.user,
    //     isLogin: true,
    //     name: 'ryann',
    //     column: '1'
    //   }
    // },
    fetchColumns(state, rawData) {
      state.columns = rawData.data.list
    },
    fetchColumn(state, rawData) {
      state.columns = [rawData.data]
    },
    fetchPosts(state, rawData) {
      state.posts = rawData.data.list
    },
    fetchPost(state, rawData) {
      state.post = rawData.data
    },
    setLoading(state, status) {
      state.loading = status
    },
    setError(state, e: GlobalErrorProps) {
      state.error = e
    },
    fetchCurrentUser(state, rawData) {
      state.user = { isLogin: true, ...rawData.data }
    },
    createPost(state, newPost) {
      state.posts.push(newPost)
    },
    login(state, rawData) {
      const { token } = rawData.data
      state.token = token
      localStorage.setItem('token', token)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    logout(state) {
      state.token = ''
      localStorage.remove('token')
      delete axios.defaults.headers.commom.Authorization
    }
  },
  actions: {
    // 获取 Column 列表
    fetchColumns({ commit }) {
      return getAndCommit('/api/columns', 'fetchColumns', commit)
    },
    // 根据 cid 获取指定column信息
    fetchColumn({ commit }, cid) {
      return getAndCommit(`/api/columns/${cid}`, 'fetchColumn', commit)
    },
    fetchPosts({ commit }, cid) {
      return getAndCommit(`/api/columns/${cid}/posts`, 'fetchPosts', commit)
    },
    fetchPost({ commit }, id) {
      return getAndCommit(`/api/posts/${id}`, 'fetchPost', commit)
    },
    fetchCurrentUser({ commit }) {
      return getAndCommit('/api/user/current', 'fetchCurrentUser', commit)
    },
    login({ commit }, payload) {
      return postAndCommit('/api/user/login', 'login', commit, payload)
    },
    createPost({ commit }, payload) {
      return postAndCommit('/api/posts', 'createPost', commit, payload)
    },
    loginAndFetch({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    }
  },
  getters: {
    getColumnById: (state) => (id: string) => {
      return state.columns.find(c => c._id === id)
    },
    getPostsByCid: (state) => (cid: string) => {
      return state.posts.filter(post => post.column === cid)
    },
    getCurrentPost: (state) => (id: string) => {
      return state.post
    }
  }
})

export default store
