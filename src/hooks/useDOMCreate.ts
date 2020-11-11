import { onUnmounted } from 'vue'

function useDOMCreate(nodeId: string) {
  const node = document.createElement('div')

  node.id = nodeId
  document.body.appendChild(node)

  // 添加了的节点记得在卸载时删除掉！！！
  onUnmounted(() => {
    document.body.removeChild(node)
  })
}

export default useDOMCreate
