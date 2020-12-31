import { createApp } from 'vue'
import Message from '@/components/Message.vue'
export type MessageType = 'success' | 'error' | 'default'

/**
 *
 * @description 使用函数调用的方式来创建一个message
 * @param message 展示的信息
 * @param type 消息的类型, 'success-成功' | 'error-失败' | 'default-默认'
 * @param timeout 消息展示的持续时间,默认为2000ms
 */
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
