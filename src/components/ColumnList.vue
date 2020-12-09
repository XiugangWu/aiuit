<template>
  <div class="row">
    <div v-for="column in columnList" :key="column._id" class="col-6 mb-4">
      <div class="card h-100 shawow-sm">
        <div class="card-body text-center">
            <img
              :src="column.avatar.url || column.avatar"
              class="rounded-circle border border-light w-25 my-3"
              :alt="column.title"
            />
            <h5 class="card-title">{{ column.title }}</h5>
            <p class="card-text text-left">{{ column.desc }}</p>
            <!-- <router-link :to="{name: 'column', params: {id: column.id}}" class="btn btn-outline-primary">进入专栏</router-link> -->
            <!-- 用模版字符串的形式,来重写路由 -->
            <router-link :to="`/column/${column._id}`" class="btn btn-outline-primary">进入专栏</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { ColumnProps } from '../store'

export default defineComponent({
  name: 'ColumnList',
  props: {
    list: {
      type: Array as PropType<ColumnProps[]>,
      required: true
    }
  },
  setup (props) {
    // console.log('props:', props)
    const columnList = computed(() => {
      return props.list.map(column => {
        if (!column.avatar) {
          column.avatar = {
            url: require('@/assets/column.jpg')
          }
        }
        // console.log('column', column)
        return column
      })
    })

    return {
      columnList
    }
  }
})
</script>
