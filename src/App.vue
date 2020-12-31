<template>
  <div class="container">
    <nav-header :user="currentUser"/>
    <loader text="拼命加载中" background="rgba(0,0,0,0.7)"  v-if="isLoading"></loader>
    <router-view />
    <footer class="text-center py-4 text-secondary bg-light mt-6">
      <small>
        <ul class="list-inline mb-0">
          <li class="list-inline-item">© 2021 爱游专栏</li>
          <li class="list-inline-item">课程</li>
          <li class="list-inline-item">文档</li>
          <li class="list-inline-item">联系</li>
          <li class="list-inline-item">更多</li>
        </ul>
      </small>
    </footer>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue'
import NavHeader from './components/NavHeader.vue'
import Loader from './components/Loader.vue'
import useMessageCreate from './hooks/useMessageCreate'
import store from './store'

export default defineComponent({
  name: 'App',
  components: {
    NavHeader,
    Loader
  },
  setup () {
    const currentUser = computed(() => store.state.user)
    const isLoading = computed(() => store.state.loading)
    const error = computed(() => store.state.error)
    watch(() => error.value.status, () => {
      const { status, message } = error.value
      if (status && message) {
        useMessageCreate(message, 'error')
      }
    })
    return {
      currentUser,
      isLoading,
      error
    }
  }
})
</script>

<style>
</style>
