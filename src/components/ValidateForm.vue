<template>
  <form class="validate-form-container">
    <slot></slot>
    <div class="submit-area" @click.prevent="submitForm">
      <slot name="submit">
        <button type="submit" class="btn btn-primary">提交</button>
      </slot>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
// 视频P56-58: 事件监听器, 实现父子组件通讯. 由于 $on 已废弃, 就使用第三方的库:mitt
import mitt from 'mitt'

// 定义一个类型
type ValidateFunc = () => boolean

// 实例化 mitt
export const emitter = mitt()

export default defineComponent({
  name: 'ValidateForm',
  // 自定义事件
  emits: ['form-submit'],
  setup (props, context) {
    // 定义一组函数, 执行后,可以显示错误的信息,并且返回input是否通过
    let funcArr: ValidateFunc[] = []
    const submitForm = () => {
      // 循环执行数组 得到最后的验证结果
      // const result = funcArr.every(func => func())
      // 用 every 会提前结束循环,所以改用map
      const result = funcArr.map(func => func()).every(result => result)
      context.emit('form-submit', result)
    }
    // 将监听得到的验证函数都存到一个数组中;传递的参数有可能为空（也就是没传的时候是undefined类型）
    const callback = (func: ValidateFunc | any) => {
      funcArr.push(func)
    }
    // 添加监听
    emitter.on('form-item-created', callback)
    onUnmounted(() => {
      // 删除监听
      emitter.off('form-item-created', callback)
      funcArr = []
    })
    return {
      submitForm
    }
  }
})
</script>

<style>

</style>
