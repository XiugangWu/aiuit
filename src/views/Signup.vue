<template>
  <div class="signup-page mx-auto p-3 w-330">
    <h5 class="my-4 text-center">注册爱游账户</h5>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input
          :rules="emailRules" v-model="formData.email"
          placeholder="请输入邮箱地址"
          type="text"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">昵称</label>
        <validate-input
          :rules="nameRules" v-model="formData.nickName"
          placeholder="请输入昵称"
          type="text"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <validate-input
          type="password"
          placeholder="请输入密码"
          :rules="passwordRules"
          v-model="formData.password"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">重复密码</label>
        <validate-input
          type="password"
          placeholder="请再次密码"
          :rules="repeatPasswordRules"
          v-model="formData.repeatPassword"
        />
      </div>
      <template #submit>
        <button type="submit" class="btn btn-primary btn-block btn-large">注册新用户</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import router from '../router'
import store from '../store'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import useMessageCreate from '../hooks/useMessageCreate'
import { auth, tcb } from '../hooks/useTcbInit'

export default defineComponent({
  name: 'Signup',
  components: {
    ValidateInput,
    ValidateForm
  },
  setup () {
    const formData = reactive({
      email: '',
      nickName: '',
      password: '',
      repeatPassword: ''
    })
    const emailRules: RulesProp = [
      { type: 'required', message: '电子邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱格式' }
    ]
    const nameRules: RulesProp = [
      { type: 'required', message: '昵称不能为空' }
    ]
    const passwordRules: RulesProp = [
      { type: 'required', message: '密码不能为空' },
      { type: 'password', message: '密码长度为8-16位，数字、字母、字符至少包含两种' }
    ]
    const repeatPasswordRules: RulesProp = [
      { type: 'required', message: '重复密码不能为空' },
      { type: 'password', message: '密码长度为8-16位，数字、字母、字符至少包含两种' },
      {
        type: 'custom',
        validator: () => {
          return formData.password === formData.repeatPassword
        },
        message: '密码不相同'
      }
    ]
    const onFormSubmit = async (result: boolean) => {
      if (result) {
        const payload = {
          email: formData.email,
          password: formData.password,
          nickName: formData.nickName,
          mailActivated: false
        }
        // 注册时,1.直接使用tcb的“邮箱注册”功能https://docs.cloudbase.net/authentication/email-login.html#kai-tong-you-xiang-deng-lu
        // 2.记录用户注册的邮箱,并标记“邮箱是否已激活”字段mailActivated为false
        auth
          .signUpWithEmailAndPassword(payload.email, payload.password)
          .then(() => {
            // 发送验证邮件成功;1.记录用户的注册行为2.store.state更新
            tcb
              .callFunction({
                name: 'clouddb',
                data: {
                  method: 'add',
                  dbName: 'userInfo',
                  formData: payload
                }
              })
              .then(res => {
                console.log('SignUp-addDB-res', res)
              })
              .catch(err => {
                console.log('SignUp-addDB-err', err)
              })
            // 操作反馈
            useMessageCreate('注册成功 请到邮箱去验证', 'success')
            setTimeout(() => {
              router.push({ name: 'login' })
            }, 1000)
          })
          .catch(err => {
            console.log('SignUp-err:', err) // JSON.parse(err)
          })
      }
    }

    return {
      emailRules,
      nameRules,
      passwordRules,
      repeatPasswordRules,
      onFormSubmit,
      formData
    }
  }
})
</script>

<style>
.w-330 {
  max-width: 330px;
}
</style>
