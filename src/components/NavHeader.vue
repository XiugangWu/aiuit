<template>
  <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
    <router-link class="navbar-brand" to="/">
      <img src="../assets/logo.png" class="rounded w-25 my-1">
      <span>南京爱游</span>
    </router-link>
    <ul v-if="user.loginType === 'ANONYMOUS'" class="list-inline mb-0">
      <li class="list-inline-item">
        <button @click.prevent="signOut" class="btn btn-outline-light my-2">
          注销
        </button>
      </li>
      <li class="list-inline-item">
        <router-link to="/login" class="btn btn-outline-light my-2">
          登陆
        </router-link>
      </li>
      <li class="list-inline-item">
        <router-link to="/signup" class="btn btn-outline-light my-2">
          注册
          </router-link>
      </li>
    </ul>
    <ul v-else class="list-inline mb-0 d-flex">
      <li class="list-inline-item">
        <dropdown :title="`您好 ${user.nickName}`">
          <dropdown-item>
            <router-link to="/createPost" class="dropdown-item">
              新建文章
            </router-link>
          </dropdown-item>
          <dropdown-item>
            <router-link to="/createColumn" class="dropdown-item">
              新建专栏
            </router-link>
          </dropdown-item>
          <dropdown-item disabled>
            <a href="#" class="dropdown-item">编辑资料</a>
          </dropdown-item>
          <dropdown-item>
            <a @click.prevent="signOut" class="dropdown-item">退出登陆</a>
          </dropdown-item>
        </dropdown>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Dropdown from './Dropdown.vue'
import DropdownItem from './DropdownItem.vue'
import store, { UserProps } from '../store'
import { auth } from '../hooks/useTcbInit'
import router from '../router'
import useMessageCreate from '../hooks/useMessageCreate'

export default defineComponent({
  name: 'NavHeader',
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  components: {
    Dropdown,
    DropdownItem
  },
  setup () {
    const signOut = async () => {
      await auth
        .signOut()
        .then(() => {
          // 登出成功, 更新store.user
          const user = {}
          store.dispatch('updateUser', user)
          useMessageCreate('注销成功 2秒后跳转首页', 'success') // 操作成功反馈
          setTimeout(() => { // 自动跳转至首页
            router.push('/')
          }, 1000)
        })
        .catch()
    }
    return {
      signOut
    }
  }
})
</script>
