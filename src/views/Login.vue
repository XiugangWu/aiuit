<template>
  <div class="login-page mx-auto p-3 w-330">
    <h5 class="my-4 text-center">登录到者也</h5>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input
          :rules="emailRules" v-model="emailAndPassword.email"
          placeholder="请输入邮箱地址"
          type="text"
          ref="inputRef"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <validate-input
          type="password"
          placeholder="请输入密码"
          :rules="passwordRules"
          v-model="emailAndPassword.password"
        />
      </div>
      <!-- #submit  是 v-slot:submit的缩写 -->
      <template #submit>
        <button type="submit" class="btn btn-primary btn-block btn-large">登录</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import useMessageCreate from '../hooks/useMessageCreate'
import router from '../router'
import store from '../store'
import { auth, tcb } from '../hooks/useTcbInit'

export default defineComponent({
  name: 'Login',
  components: {
    ValidateInput,
    ValidateForm
  },
  setup () {
    const emailAndPassword = reactive({
      email: '',
      password: ''
    })
    const emailRules: RulesProp = [
      { type: 'required', message: '电子邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱格式' }
    ]

    const passwordRules: RulesProp = [
      { type: 'required', message: '密码不能为空' }
    ]

    const onFormSubmit = async (result: boolean) => {
      if (result) {
        // 客户端验证通过后,首先在腾讯云登陆,随后再去数据库中查询并更新用户数据
        await auth
          .signInWithEmailAndPassword(emailAndPassword.email, emailAndPassword.password)
          .then(() => {
            store.commit('updateUser', auth.currentUser)
            useMessageCreate('登录成功...1秒后跳转首页', 'success') // 操作成功反馈
            setTimeout(() => { // 自动跳转至首页
              router.push('/')
            }, 1000)
            // 查询数据库是否有该玩家数据,如果有则返回;如果没有(一般情况下不会出现,防止意外),则记录下来(以便做用户分析)
            tcb
              .callFunction({
                name: 'clouddb', // 调用云函数
                data: {
                  method: 'get',
                  dbName: 'userInfo',
                  where: {
                    email: emailAndPassword.email,
                    password: emailAndPassword.password
                  }
                }
              })
              .then(res => {
                console.log(res.result)
                if (res.result.total === 0) {
                  // 未查询数据,则在数据库中新增 1606509309@qq.com
                  // console.log('数据库中未查询到,此时auth.currentUser:::', auth.currentUser)
                  if (auth.currentUser) {
                    const userInfo = {
                      email: auth.currentUser.email,
                      password: emailAndPassword.password,
                      loginType: auth.currentUser.loginType,
                      uid: auth.currentUser.loginType
                    }
                    store.dispatch('createUser', userInfo)
                  }
                } else {
                  // 查询到数据, 则更新用户数据
                  tcb
                    .callFunction({
                      name: 'clouddb',
                      data: {
                        method: 'update',
                        dbName: 'userInfo',
                        id: res.result.data[0]._id,
                        formData: { test: true }
                      }
                    })
                }
              })
          })
          .catch(() => {
            useMessageCreate('邮箱或密码不正确', 'error') // 操作失败反馈
          })
      }
    }
    return {
      emailAndPassword,
      emailRules,
      passwordRules,
      onFormSubmit
    }
  }
})
</script>
