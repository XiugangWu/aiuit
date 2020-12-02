<template>
  <div class="column-detail-page w-75 mx-auto">
    <div class="column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column">
      <div class="col-3 text-center">
        <img :src="column.avatar" :alt="column.title" class="rounded-circle border w-100">
      </div>
      <div class="col-9">
        <h4>{{column.title}}</h4>
        <p class="text-muted">{{column.desc}}</p>
      </div>
    </div>
    <post-list :list="post"></post-list>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import PostList from '../components/PostList.vue'

export default defineComponent({
  name: 'ColumnDetail',
  components: {
    PostList
  },
  setup () {
    const route = useRoute()
    const store = useStore()
    const currentId = +route.params.id // + 类型转换
    // 将testData,testPosts,一一链接起来
    // const column = testData.find(c => c.id === currentId)
    // const list = testPosts.filter(post => post.columnId === currentId)
    // column和post改写为从store中取值
    // const column = computed(() => store.state.columns.find(c => c.id === currentId))
    // const list = computed(() => store.state.posts.filter(post => post.columnId === currentId))
    // 将 上句 改写为用getter取值
    const column = computed(() => store.getters.getColumnsById(currentId))
    const post = computed(() => store.getters.getPostsById(currentId))
    return {
      column,
      post
    }
  }
})
</script>

<style>

</style>
