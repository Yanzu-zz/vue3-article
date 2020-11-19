/* eslint-disable */
import { createStore, Commit } from 'vuex'
import axios, { AxiosRequestConfig } from 'axios'
import { GlobalDataProps, GlobalErrorProps } from '@/types'
import { arrToObj, objToArr } from '@/helper'

// 获取数据封装函数，完成重复工作
// eslint-disable-next-line
// const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
//   const { data } = await axios.get(url)
//   commit(mutationName, data)
//   return data
// }

// post 请求
// eslint-disable-next-line
// const postAndCommit = async (url: string, mutationName: string, commit: Commit, payload: any) => {
//   const { data } = await axios.post(url, payload)
//   commit(mutationName, data)
//   return data
// }


const TOKEN_LOGIN = 'token'

const asyncAndCommit = async (
  url: string,
  mutationName: string,
  commit: Commit,
  config: AxiosRequestConfig = { method: 'get' },
  extraData?: any // 可以让 actions 给 mutaions 传递额外信息
) => {
  const { data } = await axios(url, config)
  if (extraData) {
    commit(mutationName, { data, extraData })
  } else {
    commit(mutationName, data)
    return data
  }
}

const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: {
      data: {},
      currentPage: 0,
      total: 0
    },
    posts: {
      data: {},
      loadedColumns: []
    },
    user: {
      isLogin: false
    }
  },
  mutations: {
    fetchCurrentUser(state, rawData) {
      state.user = { isLogin: true, ...rawData.data }
    },
    updateCurrentUser(state, rawData) {
      state.user = { isLogin: true, ...rawData.data }
    },
    fetchColumns(state, rawData) {
      const { data } = state.columns
      const { list, count, currentPage } = rawData.data
      state.columns = {
        data: { ...data, ...arrToObj(list) },
        total: count,
        currentPage: currentPage * 1
      }
    },
    fetchColumn(state, rawData) {
      state.columns.data[rawData.data._id] = rawData.data
    },
    fetchPosts(state, { data: rawData, extraData: columnId }) {
      // 要让新的数据和旧的数据共存，而不是覆盖
      state.posts.data = { ...state.posts.data, ...arrToObj(rawData.data.list) }
      state.posts.loadedColumns.push(columnId)
    },
    fetchPost(state, rawData) {
      state.posts.data[rawData.data._id] = rawData.data
    },
    createPost(state, newPost) {
      state.posts.data[newPost._id] = newPost
    },
    updatePost(state, { data }) {
      state.posts.data[data._id] = data
    },
    deletePost(state, { data }) {
      delete state.posts.data[data._id]
    },
    setLoading(state, status) {
      state.loading = status
    },
    setError(state, e: GlobalErrorProps) {
      state.error = e
    },
    login(state, rawData) {
      const { token } = rawData.data
      state.token = token
      localStorage.setItem(TOKEN_LOGIN, token)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    logout(state) {
      state.token = ''
      state.user = { isLogin: false }
      localStorage.removeItem(TOKEN_LOGIN)
      delete axios.defaults.headers.common.Authorization
    }
  },
  actions: {
    fetchCurrentUser({ commit }) {
      return asyncAndCommit('/api/user/current', 'fetchCurrentUser', commit)
    },
    updateCurrentUser({ commit }, { userId, payload }) {
      return asyncAndCommit(`/api/user/${userId}`, 'updateCurrentUser', commit, {
        method: 'patch',
        data: payload
      })
    },
    // 获取 Column 列表
    fetchColumns({ state, commit }, params = {}) {
      const { currentPage = 1, pageSize = 6 } = params
      if (state.columns.currentPage < currentPage) {
        return asyncAndCommit(`/api/columns?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchColumns', commit)
      }
    },
    // 根据 cid 获取指定column信息
    fetchColumn({ state, commit }, cid) {
      if (!state.columns.data[cid]) {
        return asyncAndCommit(`/api/columns/${cid}`, 'fetchColumn', commit)
      }
    },
    fetchPosts({ state, commit }, cid) {
      if (!state.posts.loadedColumns.includes(cid)) {
        return asyncAndCommit(`/api/columns/${cid}/posts`, 'fetchPosts', commit, { method: 'get' }, cid)
      }
    },
    fetchPost({ state, commit }, id) {
      const currentPost = state.posts.data[id]
      if (!currentPost || !currentPost.content) {
        return asyncAndCommit(`/api/posts/${id}`, 'fetchPost', commit)
      } else {
        return Promise.resolve({ data: currentPost })
      }
    },
    createPost({ commit }, payload) {
      return asyncAndCommit('/api/posts', 'createPost', commit, {
        method: 'post',
        data: payload
      })
    },
    updatePost({ commit }, { id, payload }) {
      return asyncAndCommit(`/api/posts/${id}`, 'updatePost', commit, {
        method: 'patch',
        data: payload
      })
    },
    deletePost({ commit }, id) {
      return asyncAndCommit(`/api/posts/${id}`, 'deletePost', commit, {
        method: 'delete'
      })
    },
    login({ commit }, payload) {
      return asyncAndCommit('/api/user/login', 'login', commit, {
        method: 'post',
        data: payload
      })
    },
    loginAndFetch({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    },
    logout({ commit }) {
      commit('logout')
    }
  },
  getters: {
    getColumns: (state) => {
      return objToArr(state.columns.data)
    },
    getColumnById: (state) => (id: string) => {
      return state.columns.data[id]
    },
    getPostsByCid: (state) => (cid: string) => {
      return objToArr(state.posts.data).filter(post => post.column === cid)
    },
    getCurrentPost: (state) => (id: string) => {
      return state.posts.data[id]
    }
  }
})

export default store
