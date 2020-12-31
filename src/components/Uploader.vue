<template>
  <div class="file-upload">
    <div class="file-upload-container" @click.prevent="triggerUpload" v-bind="$attrs">
      <slot v-if="fileStatus === 'loading'" name="loading">
        <button class="btn btn-primary" disabled>正在上传...</button>
      </slot>
      <slot v-else-if="fileStatus === 'success'" name="uploaded" :uploadedData="uploadedData">
        <button class="btn btn-primary">上传成功</button>
      </slot>
      <slot v-else name="default">
        <button class="btn btn-primary">点击上传</button>
      </slot>
    </div>
    <input
      type="file"
      class="file-input d-none"
      ref="fileInput"
      @change="handleFileChange"
    >
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, PropType, watch } from 'vue'
import { tcb } from '@/hooks/useTcbInit'
import { FileProps, GetTempFileURLProps } from '@/views/CreatePost.vue'

// 上传时的状态
type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
type CheckFunction = (file: File) => boolean;
export default defineComponent({
  props: {
    beforeUpload: {
      type: Function as PropType<CheckFunction>
    },
    uploaded: {
      type: Object
    }
  },
  inheritAttrs: false,
  emits: ['file-uploaded', 'file-uploaded-error'],
  setup (props, context) {
    const fileInput = ref<null | HTMLInputElement>(null)

    const fileStatus = ref<UploadStatus>(props.uploaded ? 'success' : 'ready')
    const uploadedData = ref(props.uploaded)// 作用域插槽的属性
    console.log('uploaded-通讯参数', props.uploaded)
    watch(() => props.uploaded, (newValue) => {
      console.log('watch-uploaded', uploadedData.value)
      if (newValue) {
        fileStatus.value = 'success'
        uploadedData.value = newValue
      }
    })

    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.click()
      }
    }
    const handleFileChange = (e: Event) => {
      console.log('handleFileChange-Event', e.target)
      const currentTarget = e.target as HTMLInputElement
      if (currentTarget.files) {
        // 上传前类型/大小...等检查
        if (props.beforeUpload) {
          const result = props.beforeUpload(currentTarget.files[0])
          if (!result) {
            return
          }
        }
        fileStatus.value = 'loading'
        // 云存储
        tcb
          .uploadFile({
            // 云存储的路径[文件名]--cloudPath: "dirname/filename"
            cloudPath: currentTarget.files[0].name,
            // 需要上传的文件，File 类型--filePath: document.getElementById("file").files[0]
            filePath: currentTarget.files[0] // 2020-12-28 手动修改的.d.ts中的filePath类型(string-》File;1.3.3版本),后续注意
            // 上传进度
            // onUploadProgress: function (progressEvent) {
            //   console.log(progressEvent);
            //   var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            // }
          })
          .then((res) => {
            // 返回文件 ID
            console.log('文件上传成功,返回fileID', res)
            fileStatus.value = 'success'
            // 广播[file-uploaded]事件
            context.emit('file-uploaded', res)
            // 获取上传成功后的临时链接,并赋值给uploadedData.value
            tcb
              .getTempFileURL({
                fileList: [
                  res.fileID
                ]
              })
              .then((res2) => {
                console.log('获取文件的临时地址成功', res2)
                const files = res2 as GetTempFileURLProps<FileProps>
                uploadedData.value = { data: files.fileList[0].tempFileURL }
              })
              .catch((error2) => {
                console.log('获取文件的临时地址失败', error2)
              })
          })
          .catch((error) => {
            console.log('文件上传失败', error)
            fileStatus.value = 'error'
            // 广播[file-uploaded-error]
            context.emit('file-uploaded-error', { error })
          })
          .finally(() => {
            if (fileInput.value) {
              fileInput.value.value = ''
            }
          })
        // axios.post(props.action, formData, {
        //   headers: {
        //     'Content-Type': 'multipart/form-data'
        //   }
        // }).then(resp => {
        //   fileStatus.value = 'success'
        //   uploadedData.value = resp.data
        //   context.emit('file-uploaded', resp.data)
        // }).catch((error) => {
        //   fileStatus.value = 'error'
        //   context.emit('file-uploaded-error', { error })
        // }).finally(() => {
        //   if (fileInput.value) {
        //     fileInput.value.value = ''
        //   }
        // })
      }
    }
    return {
      fileInput,
      triggerUpload,
      fileStatus,
      uploadedData,
      handleFileChange
    }
  }
})
</script>
