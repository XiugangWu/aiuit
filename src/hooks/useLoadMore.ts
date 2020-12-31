import store from '@/store'
import { computed, ComputedRef, ref } from 'vue'

interface LoadParams {
  currentPage: number;
  pageSize: number;
}

/**
 * @description 是否需要“加载更多”.返回1.loadMorePage,让用户在他想要的逻辑中加载 2.isLastPage:是否是最后一页 3.currentPage: 当前页
 * @param actionName
 * @param total 总数
 * @param params 加载的参数:[currentPage]当前页;[pageSize]页面大小
 */
const useLoadMore = (actionName: string, total: ComputedRef<number>,
  params: LoadParams = { currentPage: 2, pageSize: 5 }) => {
  const currentPage = ref(params.currentPage)
  const requestParams = computed(() => ({
    currentPage: currentPage.value,
    pageSize: params.pageSize
  }))
  const loadMorePage = () => {
    store.dispatch(actionName, requestParams.value).then(() => {
      currentPage.value++
    })
  }
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
