/**
 *  输入: 一个DOM节点
 *  输出: 判断,点击的位置 是否 为 此节点
 *  注: Ref,为类型
 */
import { onMounted, onUnmounted, ref, Ref } from 'vue'

const useClickOutside = (elementRef: Ref<null | HTMLElement>) => {
  const isClickOutside = ref(false)
  const handle = (e: MouseEvent) => {
    if (elementRef.value) {
      if (elementRef.value.contains(e.target as HTMLElement)) {
        isClickOutside.value = false
      } else {
        isClickOutside.value = true
      }
    }
  }

  onMounted(() => {
    document.addEventListener('click', handle)
  })
  onUnmounted(() => {
    document.addEventListener('click', handle)
  })

  return isClickOutside
}

export default useClickOutside
