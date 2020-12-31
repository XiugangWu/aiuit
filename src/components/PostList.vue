<template>
  <div class="post-list">
    <article v-for="post in postList" :key="post._id" class="card mb-3 shadow-sm">
      <div class="card-body">
        <h4><router-link :to="`/post/${post._id}/`">{{post.title}}</router-link></h4>
        <div class="row my-3 align-items-center">
          <div v-if="post.image" class="col-4">
            <!-- <img :src="post.image.fitUrl" :alt="post.title" class="rounded-lg w-100"> -->
            <img :src="post.image && post.image.url" :alt="post.title" class="rounded-lg w-100">
          </div>
          <!-- <p :class="{'col-8': post.image}" class="text-muted">{{post.excerpt}}</p> -->
          <p :class="{'col-8': post.image}" class="text-muted">{{post.excerpt}}</p>
        </div>
        <span class="text-muted">{{post.createdAt}}</span>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { generateFitUrl } from '@/hooks/useAddAvatar'
import { PostProps, ImageProps } from '@/store'

export default defineComponent({
  name: 'PostList',
  props: {
    list: {
      type: Array as PropType<PostProps[]>,
      required: true
    }
  },
  setup (props) {
    const postList = computed(() => {
      return props.list.map(post => {
        generateFitUrl(post.image as ImageProps, 50, 'imageMogr2/rradius')
        return post
      })
    })
    return {
      postList
    }
  }
})
</script>

<style scoped>
.post-list h4 a {
  text-decoration: none;
  color:#1a1a1a;
}
.post-list h4 a:hover {
  color:#0d6efd;
}
</style>
