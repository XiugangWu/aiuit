<template>
  <div class="signup-page mx-auto p-3 w-330">
    <h5 class="my-4 text-center">注册者也账户</h5>
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
    <div>
      <h1></h1>
      <button>测试云函数</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'
import store from '../store'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import useMessageCreate from '../hooks/useMessageCreate'
import cloudbase from '@cloudbase/js-sdk/app'

const app = cloudbase.init({
  env: 'aiu-mycompany-1uzhz'
})
const db = app.database()

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
    const router = useRouter()
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
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const payload = {
          email: formData.email,
          password: formData.password,
          nickName: formData.nickName
        }
        app.auth({ persistence: 'local' })
          .signUpWithEmailAndPassword(payload.email, payload.password)
          .then(res => {
            // 发送验证邮件成功
            db.collection('userInfo')
              .add(payload)
              .then(() => { console.log('数据插入成功') })
              .catch(err => { console.log(err) })
            store.commit('userInfoUpdate', payload)
            // 提示成功,并跳转到登陆页
            useMessageCreate('注册成功 正在跳转登录页面', 'success')
            setTimeout(() => {
              router.push('/login')
            }, 2000)
          })
          .catch(err => { console.log(err) })
        // axios.post('/users/', payload).then(data => {
        //   createMessage('注册成功 正在跳转登录页面', 'success')
        //   setTimeout(() => {
        //     router.push('/login')
        //   }, 2000)
        // }).catch(e => {
        //   console.log(e)
        // })
      }
    }
    app
      .callFunction({
        // 云函数名称
        name: 'login',
        // 传给云函数的参数
        data: {
          a: 1
        }
      })
      .then(res => { console.log(res.result) })
      .catch(err => { console.log(err) })
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
