<template>
  <div class="create-post-page">
    <h5>新建文章</h5>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题：</label>
        <validate-input
          :rules="titleRules"
          v-model="titleVal"
          placeholder="请输入文章标题"
          type="text"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">文章详情：</label>
        <validate-input
          :rules="contentRules"
          v-model="contentVal"
          tag="textarea"
          type="text"
          placeholder="请输入文章详情"
          rows="8"
        />
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large" type="submit">
          发表文章
        </button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { GlobalDataProps, PostProps } from '../store'
import cloudbase from '@cloudbase/js-sdk'

export default defineComponent({
  name: 'Create',
  components: {
    ValidateForm,
    ValidateInput
  },
  setup () {
    const router = useRouter()
    const store = useStore<GlobalDataProps>()
    const titleVal = ref('')
    const titleRules: RulesProp = [
      { type: 'required', message: '文章标题不能为空' }
    ]
    const contentVal = ref('')
    const contentRules: RulesProp = [
      { type: 'required', message: '文章详情不能为空' }
    ]

    const app = cloudbase.init({
      env: 'aiu-mycompany-1uzhz'
    })
    const auth = app.auth({
      persistence: 'local'
    })
    const db = app.database()

    const onFormSubmit = (result: boolean) => {
      console.log('result', result)
      if (result) {
        const { column, userId } = store.state.user
        if (column) {
          const newPost: PostProps = {
            // postId: new Date().getTime().toString(),
            // _id: '测试_id', [2020-12-3,经测试,会将 云数据库中的 _id 字段覆盖掉]
            title: titleVal.value,
            content: contentVal.value,
            column,
            createdAt: new Date().toLocaleString(),
            author: userId
          }
          auth.anonymousAuthProvider().signIn()
            .then(() => {
              db.collection('posts')
                .add(newPost)
                .then(() => { console.log('数据插入成功') })
                .catch(err => { console.log(err) })
              store.commit('createPost', newPost)
              // 创建好文章后,自动跳转到详情页
              router.push({ name: 'column', params: { id: column } })
            })
            .catch(err => { console.log(err) })
        }
      }
    }
    return {
      titleVal,
      titleRules,
      contentVal,
      contentRules,
      onFormSubmit
    }
  }
})
</script>

<style>

</style>
