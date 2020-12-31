import { onMounted, onUnmounted, ref, Ref } from 'vue'

/**
 *
 * @description 判断鼠标是否点击了 特定区域 之外
 * @param elementRef 特定区域(ref 同名的响应式对象，就可以拿到对应的 dom 节点)
 */
const useClickOutside = (elementRef: Ref<null | HTMLElement>) => {
  const isClickOutside = ref(false)
  const handler = (e: MouseEvent) => {
    if (elementRef.value) {
      if (elementRef.value.contains(e.target as HTMLElement)) {
        isClickOutside.value = false
      } else {
        isClickOutside.value = true
      }
    }
  }

  onMounted(() => {
    document.addEventListener('click', handler)
  })
  onUnmounted(() => {
    document.addEventListener('click', handler)
  })

  return isClickOutside
}

export default useClickOutside
