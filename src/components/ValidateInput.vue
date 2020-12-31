<template>
  <div class="validate-input-container pb-3">
    <input
      v-if="tag !== 'textarea'"
      v-bind="$attrs"
      class="form-control"
      :class="{'is-invalid': inputRef.error}"
      @blur="validateInput"
      v-model="inputRef.val"
    >
    <textarea
      v-else
      v-bind="$attrs"
      class="form-control"
      :class="{'is-invalid': inputRef.error}"
      @blur="validateInput"
      v-model="inputRef.val"
    >
    </textarea>
    <span v-if="inputRef.error" class="invalid-feedback">{{inputRef.message}}</span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, reactive } from 'vue'
import { emitter } from './ValidateForm.vue'

const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
// const passwordReg = /^(?!.*\s)(?!^[\u4e00-\u9fa5]+$)(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{8,16}$/ // 密码长度为8-16位，数字、字母、字符至少包含两种
const passwordReg = /^[a-zA-Z0-9_\-#@~=*(){}[\]:.,<>+]{8,16}$/ // 8-16位字符, 且字符只能是大小写英文字母、数字、以及 _-#@(){}<>[]:.,<>+#~ 中的字符

interface RuleProp {
  type: 'required' | 'email' | 'password' | 'custom';
  message: string;
  validator?: () => boolean;
}

export type RulesProp = RuleProp[]
// 新建不同的input类型
export type TagType = 'input' | 'textarea'
export default defineComponent({
  name: 'ValidateInput',
  props: {
    rules: Array as PropType<RulesProp>,
    /**
     * 自定义组件支持 v-model
     * 1.在props中自定义一个 modelValue 属性
     * 2.在更新值时,发送一个事件 ctx.emit('update:modelValue', targetValue)
     * 3.注: vue3中支持多个v-model
     */
    modelValue: String,
    tag: {
      type: String as PropType<TagType>,
      default: 'input'
    }
  },
  /**
   * 希望validate-input 支持 原生input的属性如type,placeholder 等.
   * 即: https://cn.vuejs.org/v2/guide/components-props.html#非-Prop-的-Attribute
   * 方案: 在validate-input,直接使用 placeholder 等,class会被加到根节点上,
   *  1. 首先,不希望组件的根元素继承 attribute,可以在组件中设置
   *  2. 在组件的<input 中 添加 v-bind="$attrs">
   */
  inheritAttrs: false,

  setup (props, ctx) {
    const inputRef = reactive({
      // val: props.modelValue || '',
      // Using-v-model-on-Components
      // 参考:https://vuejs.org/v2/guide/components.html#Using-v-model-on-Components
      val: computed({
        get: () => props.modelValue || '',
        set: val => {
          ctx.emit('update:modelValue', val)
        }
      }),
      error: false,
      message: ''
    })
    // [2020-12-29]进一步改造,将模版中的v-value和v-input删除,替换为v-modal
    // v-model的改造--步骤2--绑定一个键盘输入,并发送事件
    // const updateValue = (e: KeyboardEvent) => {
    //   const targetValue = (e.target as HTMLInputElement).value
    //   inputRef.val = targetValue
    //   // 发送事件
    //   ctx.emit('update:modelValue', targetValue)
    // }
    const validateInput = () => {
      if (props.rules) {
        const allPassed = props.rules.every(rule => {
          let passed = true
          inputRef.message = rule.message
          switch (rule.type) {
            case 'required':
              passed = (inputRef.val.trim() !== '')// trim() 去掉两端的空格
              break
            case 'email':
              passed = emailReg.test(inputRef.val)
              break
            case 'password':
              passed = passwordReg.test(inputRef.val)
              break
            case 'custom':
              passed = rule.validator ? rule.validator() : true
              break
            default:
              break
          }
          return passed
        })
        inputRef.error = !allPassed
        return allPassed
      }
      return true
    }
    onMounted(() => {
      emitter.emit('form-item-created', validateInput)
    })
    return {
      inputRef,
      validateInput
      // updateValue
    }
  }
})
</script>

<style>

</style>
