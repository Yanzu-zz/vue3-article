import { createStore, Commit } from 'vuex'
import axios from 'axios'

export interface UserProps {
  isLogin: boolean
  nickName?: string
  _id?: string
  column?: string
  email?: string
}

interface ImageProps {
  _id?: string
  url?: string
  createdAt?: string
}

export interface ColumnProps {
  _id: string
  title: string
  avatar?: ImageProps
  description: string
}

export interface PostProps {
  _id: string
  title: string
  excerpt?: string
  content?: string
  image?: ImageProps
  createdAt: string
  column: string
}

export interface GlobalDataProps {
  token: string
  loading: boolean
  columns: ColumnProps[]
  posts: PostProps[]
  user: UserProps
}

// 获取数据封装函数，完成重复工作
// eslint-disable-next-line
const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
  const { data } = await axios.get(url)
  commit(mutationName, data)
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
    token: '',
    loading: false,
    columns: [],
    posts: [],
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
    createPost(state, newPost) {
      state.posts.push(newPost)
    },
    fetchColumns(state, rawData) {
      state.columns = rawData.data.list
    },
    fetchColumn(state, rawData) {
      state.columns = [rawData.data]
    },
    fetchPosts(state, rawData) {
      state.posts = rawData.data.list
    },
    setLoading(state, status) {
      state.loading = status
    },
    fetchCurrentUser(state, rawData) {
      state.user = { isLogin: true, ...rawData }
    },
    login(state, rawData) {
      const { token } = rawData.data
      state.token = token
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    }
  },
  actions: {
    // 获取 Column 列表
    fetchColumns({ commit }) {
      getAndCommit('/api/columns', 'fetchColumns', commit)
    },
    // 根据 cid 获取指定column信息
    fetchColumn({ commit }, cid) {
      getAndCommit(`/api/columns/${cid}`, 'fetchColumn', commit)
    },
    fetchPosts({ commit }, cid) {
      getAndCommit(`/api/columns/${cid}/posts`, 'fetchPosts', commit)
    },
    fetchCurrentUser({ commit }) {
      getAndCommit('/api/user/current', 'fetchCurrentUser', commit)
    },
    login({ commit }, payload) {
      return postAndCommit('/api/user/login', 'login', commit, payload)
    },
    loginAndFetch({ dispatch }, loginData) { // 登录时要 登录+获取登录的用户信息 两个action
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
    }
  }
})

export default store
