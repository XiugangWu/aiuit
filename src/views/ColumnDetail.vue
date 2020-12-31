<template>
  <div class="column-detail-page w-75 mx-auto">
    <div class="column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column">
      <div class="col-3 text-center">
        <img :src="column.avatar && column.avatar.fitUrl" :alt="column.title" class="rounded-circle border w-100">
      </div>
      <div class="col-9">
        <h4>{{column.title}}</h4>
        <p class="text-muted">{{column.desc}}</p>
      </div>
    </div>
    <post-list :list="posts"></post-list>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import store, { ColumnProps } from '@/store'
import PostList from '@/components/PostList.vue'
import { useAddAvatar } from '@/hooks/useAddAvatar'

export default defineComponent({
  name: 'ColumnDetail',
  components: {
    PostList
  },
  setup () {
    const route = useRoute()
    const currentId = route.params.id
    console.log('currentId', currentId)

    onMounted(() => {
      store.dispatch('fetchColumn', currentId)
      store.dispatch('fetchPosts', currentId)
    })

    // const column = computed(() => store.getters.getColumnById(currentId) as ColumnProps)
    const column = computed(() => {
      const selectColumn = store.getters.getColumnById(currentId) as ColumnProps | undefined
      if (selectColumn) {
        useAddAvatar(selectColumn, 50)
      }
      return selectColumn
    })
    const posts = computed(() => store.getters.getPostsById(currentId))

    return {
      column,
      posts
    }
  }
})
</script>

<style>

</style>
