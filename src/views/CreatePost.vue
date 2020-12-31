<template>
  <div class="create-post-page">
    <h4>{{isEditMode ? '编辑文章' : '新建文章'}}</h4>
    <uploader
      :beforeUpload="uploadCheck"
      @file-uploaded="handleFileUploaded"
      :uploaded="uploadedData"
      class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
    >
      <h2>请点击上传图片,支持JPG或PNG格式</h2>
      <template #loading>
        <div class="d-flex">
          <div class="spinner-border text-secondary" role="status">
            <span class="sr-only"></span>
          </div>
          <h2>正在上传中...请稍候</h2>
        </div>
      </template>
      <template #uploaded="dataProps"> <!--让插槽内容可以访问子组件数据:[作用域插槽]https://vue3js.cn/docs/zh/guide/component-slots.html#作用域插槽-->
        <div class="uploaded-area">
          <img :src="dataProps.uploadedData.data">
          <h3>点击重新上传</h3>
        </div>
      </template>
    </uploader>
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
          placeholder="请输入文章详情"
          rows="8"
        />
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large" type="submit">
          {{isEditMode ? '更新文章' : '发表文章'}}
        </button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import ValidateInput, { RulesProp } from '@/components/ValidateInput.vue'
import ValidateForm from '@/components/ValidateForm.vue'
import Uploader from '@/components/Uploader.vue'
import router from '@/router'
import store, { PostProps } from '@/store'
import { auth, tcb } from '@/hooks/useTcbInit'
import useUploaderCheck from '@/hooks/useUploaderCheck'
import useMessageCreate from '@/hooks/useMessageCreate'
import { useRoute } from 'vue-router'

export interface GetTempFileURLProps<P = {}> {
  requestId: string;
  fileList: [P];
}
export interface FileProps {
  code: string;
  download_url: string;
  fileID: string;
  fileid: string;
  mime_type: string;
  tempFileURL: string;
}

export default defineComponent({
  name: 'Create',
  components: {
    ValidateForm,
    ValidateInput,
    Uploader
  },
  setup () {
    const uploadedData = ref()

    // 标题ref和相应的验证规则
    const titleVal = ref('')
    const titleRules: RulesProp = [
      { type: 'required', message: '文章标题不能为空' }
    ]

    // 内容ref和相应的验证规则
    const contentVal = ref('')
    const contentRules: RulesProp = [
      { type: 'required', message: '文章详情不能为空' }
    ]

    // 上传前的检查
    const uploadCheck = (file: File) => {
      const result = useUploaderCheck(file, { format: ['image/jpeg', 'image/png'], size: 2 })
      const { passed, error } = result
      if (error === 'format') {
        useMessageCreate('上传图片只能是 JPG/PNG 格式!', 'error')
      }
      if (error === 'size') {
        useMessageCreate('上传图片大小不能超过 2Mb', 'error')
      }
      return passed
    }

    // 接收 图片上传成功后的回调(fileId)
    let imageId = ''
    const handleFileUploaded = (rawData: { fileID: string }) => {
      console.log('handleFileUploaded-rawData:', rawData)
      if (rawData.fileID) {
        imageId = rawData.fileID
      }
    }

    // 如果createPost是带参数的,那么这时应该是[编辑]模式
    const route = useRoute()
    const isEditMode = !!route.query.id
    console.log('isEditMode', isEditMode)
    onMounted(() => {
      if (isEditMode) {
        store.dispatch('fetchPost', route.query.id).then((rawData) => {
          console.log('rawData***', rawData)
          const currentPost = rawData.data
          if (currentPost.image) {
            console.log('currentPost.image', currentPost.image)
            tcb
              .getTempFileURL({
                fileList: [
                  currentPost.image
                ]
              })
              .then(res => {
                console.log('获取文件的临时地址成功', res)
                const files = res as GetTempFileURLProps<FileProps>
                uploadedData.value = { data: files.fileList[0].tempFileURL }
                console.log(uploadedData.value)
              })
              .catch(err => {
                console.log('获取文件的临时地址失败', err)
              })
          }
          titleVal.value = currentPost.title // 不会实时更新,可在ValidateInput.vue使用watch方法,但有重复..可以参考https://vuejs.org/v2/guide/components.html#Using-v-model-on-Components
          contentVal.value = currentPost.content || ''
        })
      }
    })

    // 提交
    const onFormSubmit = (result: boolean) => {
      if (result && auth.currentUser && auth.currentUser.loginType !== 'ANONYMOUS') {
        const { uid } = auth.currentUser
        const newPost: PostProps = {
          // postId: new Date().getTime().toString(),
          // _id: '测试_id', [2020-12-3,经测试,会将 云数据库中的 _id 字段覆盖掉]
          // TODO post属于那个column
          column: '9f2a34705fdb2529000cd17a002f0154', // 可以没有专栏,后期通过 post的语义分析(AI?BD?),来分配专栏
          title: titleVal.value,
          content: contentVal.value,
          author: uid // 不需要author,登陆状态下, tcb会自动在openid中记录post创建者id
        }
        if (imageId) {
          newPost.image = imageId
        }
        // 根据isEditMode的不同,调用不同的store.actions
        const actionName = isEditMode ? 'updatePost' : 'createPost'
        const sendData = isEditMode ? {
          id: route.query.id,
          formData: newPost
        } : newPost
        // 提交 commit -》异步,所以用store.dispatch
        store.dispatch(actionName, sendData).then(() => {
          useMessageCreate('发表文章成功,2s后跳转到文章', 'success')
          setTimeout(() => {
            router.push(`/column/${newPost.column}`)
          }, 2000)
        })
      } else {
        // 还在匿名登陆状态,不能创建post
        console.log('未登陆')
      }
    }
    return {
      isEditMode,
      uploadedData,
      titleVal,
      titleRules,
      contentVal,
      contentRules,
      onFormSubmit,
      uploadCheck,
      handleFileUploaded
    }
  }
})
</script>

<style>
.create-post-page .file-upload-container {
  height: 200px;
  /* 悬浮显示“可点击鼠标样式” */
  cursor: pointer;
  overflow: hidden;
}
.create-post-page .file-upload-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.uploaded-area {
  position: relative;
}
.uploaded-area:hover h3 {
  display: block;
}
.uploaded-area h3 {
  display: none;
  position: absolute;
  color: #999;
  text-align: center;
  width: 100%;
  top: 50%;
}
</style>
