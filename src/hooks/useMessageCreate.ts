/**
 * 使用函数调用的方式来创建一个message
 */
import { createApp } from 'vue'
import Message from '../components/Message.vue'
export type MessageType = 'success' | 'error' | 'default'

const useMessageCreate = (message: string, type: MessageType, timeout = 2000) => {
  const messageInstance = createApp(Message, {
    message,
    type
  })
  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)
  messageInstance.mount(mountNode)
  setTimeout(() => {
    messageInstance.unmount(mountNode)
    document.body.removeChild(mountNode)
  }, timeout)
}

export default useMessageCreate
