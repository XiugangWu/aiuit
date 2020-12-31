<template>
  <div class="post-detail-page">
    <modal title="删除文章" :visible="modalIsVisible"
      @modal-on-close="modalIsVisible = false"
      @modal-on-confirm="hideAndDelete"
    >
      <p>确定要删除这篇文章吗？</p>
    </modal>
    <article class="w-75 mx-auto mb-5 pb-3" v-if="currentPost">
      <!-- <img :src="currentImageUrl" alt="currentPost.title" class="rounded-lg img-fluid my-4" v-if="currentImageUrl"> -->
      <h2 class="mb-4">{{currentPost.title}}</h2>
      <div class="user-profile-component border-top border-bottom py-3 mb-5 align-items-center row g-0">
        <div class="col">
          <user-profile :user="currentPost.author" v-if="typeof currentPost.author === 'object'"></user-profile>
        </div>
        <span class="text-muted col text-right font-italic">发表于：{{currentPost.createdAt}}</span>
      </div>
      <div v-html="currentHTML"></div> <!--https://vue3js.cn/docs/api/directives.html#v-html-->
      <div v-if="showEditArea" class="btn-group mt-5">
        <router-link
          type="button"
          class="btn btn-success"
          :to="{name: 'createPost', query: { id: currentPost._id}}"
        >
          编辑
        </router-link>
        <button type="button" class="btn btn-danger" @click.prevent="modalIsVisible = true">删除</button>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import MarkdownIt from 'markdown-it'
import UserProfile from '@/components/UserProfile.vue'
import Modal from '@/components/Modal.vue'
import { useRoute } from 'vue-router'
import router from '@/router'
import store, { PostProps, UserProps } from '@/store'
import { FileProps, GetTempFileURLProps } from './CreatePost.vue'
import useMessageCreate from '@/hooks/useMessageCreate'

export default defineComponent({
  name: 'PostDetail',
  components: {
    UserProfile,
    Modal
  },
  setup () {
    // 通过route 拿到 currentId
    const route = useRoute()
    const currentId = route.params.id
    console.log('currentId', currentId)

    // 控制modal是否出现
    const modalIsVisible = ref(false)

    const md = new MarkdownIt()

    onMounted(() => {
      store.dispatch('fetchPost', currentId)
    })

    const currentPost = computed<PostProps>(() => store.getters.getCurrentPost(currentId))
    const currentHTML = computed(() => {
      const { content, isHTML } = currentPost.value
      if (currentPost.value && content) {
        return isHTML ? content : md.render(content)
      }
    })

    // 是否显示编辑区域
    const showEditArea = computed(() => {
      const { loginType, _id } = store.state.user
      if (currentPost.value && currentPost.value.author && loginType !== 'ANONYMOUS') {
        const postAuthor = currentPost.value.author as UserProps
        return postAuthor._id === _id
      } else {
        return false
      }
    })

    // 删除
    const hideAndDelete = () => {
      modalIsVisible.value = false
      store.dispatch('deletePost', currentId).then((rawData: GetTempFileURLProps<FileProps>) => {
        useMessageCreate('删除成功，2秒后跳转到专栏首页', 'success', 2000)
        setTimeout(() => {
          router.push('/')
        }, 2000)
      })
      // TODO:删除的文章同意在添加到一个“已删除文章集合”中
    }

    return {
      currentPost,
      // currentImageUrl,
      currentHTML,
      showEditArea,
      modalIsVisible,
      hideAndDelete
    }
  }
})
</script>

<style scoped>

</style>
