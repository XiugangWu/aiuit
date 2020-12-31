<template>
  <div class="create-column-page">
    <h5>新建专栏</h5>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">专栏标题：</label>
        <validate-input
          :rules="titleRules"
          v-model="titleVal"
          placeholder="请输入专栏标题"
          type="text"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">专栏详情：</label>
        <validate-input
          :rules="descRules"
          v-model="descVal"
          tag="textarea"
          placeholder="请输入专栏详情"
          rows="8"
        />
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large" type="submit">
          创建专栏
        </button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import router from '../router'
import store, { ColumnProps } from '../store'
import cloudbase from '@cloudbase/js-sdk'

export default defineComponent({
  name: 'CreatColumn',
  components: {
    ValidateForm,
    ValidateInput
  },
  setup () {
    const titleVal = ref('')
    const titleRules: RulesProp = [
      { type: 'required', message: '专栏标题不能为空' }
    ]
    const descVal = ref('')
    const descRules: RulesProp = [
      { type: 'required', message: '专栏详情不能为空' }
    ]

    const app = cloudbase.init({ env: 'aiu-mycompany-1uzhz' })
    const collectionColumns = app.database().collection('columns')

    const onFormSubmit = (result: boolean) => {
      if (result) {
        // const { openid } = store.state.user
        // TODO:更新用户信息--新增column
        const newColumn: ColumnProps = {
          title: titleVal.value,
          desc: descVal.value
        }
        collectionColumns
          .add(newColumn)
          .then(() => { console.log('数据插入成功') })
          .catch(err => { console.log(err) })
        // store.commit('createPost', newPost)
        // 创建好文章后,自动跳转到详情页
        // router.push({ name: 'column', params: { id: openid } })
      }
    }
    return {
      titleVal,
      titleRules,
      descVal,
      descRules,
      onFormSubmit
    }
  }
})
</script>
