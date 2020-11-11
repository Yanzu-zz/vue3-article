import { createApp } from 'vue'
import Message from './Message.vue'

export type MessageType = 'success' | 'error' | 'default'

// 用函数的形式创建一个组件，这样调用信息提示体验就会有质的提升
function createMessage(message: string, type: MessageType, timeout = 2000) {
  // 用 createApp 可以方便快速地创建一个组件实例
  const messageInstance = createApp(Message, {
    message,
    type
  })

  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)
  // 挂载
  messageInstance.mount(mountNode)
  setTimeout(() => {
    messageInstance.unmount(mountNode)
    document.body.removeChild(mountNode)
  }, timeout)
}

export default createMessage
