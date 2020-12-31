import { onUnmounted } from 'vue'

/**
 *
 * @description 创建一个DOM节点
 * @param nodeId DOM节点的Id
 */
function useDOMCreate (nodeId: string) {
  const node = document.createElement('div')
  node.id = nodeId
  document.body.appendChild(node)
  onUnmounted(() => {
    document.body.removeChild(node)
  })
}

export default useDOMCreate
