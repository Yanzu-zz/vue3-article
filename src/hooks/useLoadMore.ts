import { useStore } from 'vuex'
import { ref, computed, ComputedRef } from 'vue'

interface LoadParams {
  currentpage: number
  pageSize: number
}

const useLoadMore = (
  actionName: string,
  total: ComputedRef<number>,
  params: LoadParams = { currentpage: 2, pageSize: 5 }
) => {
  const store = useStore()
  // 当前页面是会动态变化的，所以不能用常量类型
  const currentPage = ref(params.currentpage)
  const requestParams = computed(() => ({
    currentPage: currentPage.value,
    pageSize: params.pageSize
  }))

  const loadMorePage = () => {
    store.dispatch(actionName, requestParams.value).then(() => {
      currentPage.value++
    })
  }

  // 是否到了最后一页
  const isLastPage = computed(() => {
    return Math.ceil(total.value / params.pageSize) < currentPage.value
  })

  return {
    loadMorePage,
    isLastPage,
    currentPage
  }
}

export default useLoadMore
