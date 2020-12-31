<template>
  <div class="mine-page">
    <!-- 按钮列表 -->
    <div class="btn-group" role="group" aria-label="Basic mixed styles example">
      <button type="button" class="btn btn-outline-primary my-2" @click.prevent="getList">查询</button>
      <button type="button" class="btn btn-outline-primary my-2" @click.prevent="addItem">增加</button>
      <button type="button" class="btn btn-outline-primary my-2" @click.prevent="updateItem">修改</button>
      <button type="button" class="btn btn-outline-primary my-2" @click.prevent="deleteItem">删除</button>
    </div>
    <!-- 输入列表 -->
    <div class="input-group mb-3">
      <span class="input-group-text" id="name">name</span>
      <input type="text" class="form-control" v-model="formData.name">
    </div>
    <div class="input-group mb-3">
      <span class="input-group-text" id="age">age</span>
      <input type="text" class="form-control" v-model="formData.age">
    </div>
    <div class="input-group mb-3">
      <span class="input-group-text" id="id">id</span>
      <input type="text" class="form-control" v-model="idVal">
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
// import { tcbGetAndCommit, tcbAddAndCommit, tcbUpdateAndCommit, tcbRemoveAndCommit } from '../hooks/useTcbDB'

interface DataProps {
  _id: string;
  name: string;
  age: number;
  createTime: string;
  updateTime: string;
}

export default defineComponent({
  name: 'Mine',
  setup () {
    // const formData = reactive({
    //   name: '',
    //   age: 0
    // })
    // const idVal = ref('')
    // // 查询
    // const getList = async () => {
    //   // 参数可为空
    //   const options = {
    //     // order: ['age', 'asc'],
    //     // where: {
    //     // name: 'laoda',
    //     // },
    //     // pageNum: 2,
    //     // pageSize: 3,
    //     // filter: ['_id', 'age'],
    //   }
    //   // test为数据库表名,必须传参
    //   const res = await tcbGetAndCommit('test', options, { commit })
    //   console.log(res)
    //   return res.data
    // }
    // // 新增
    // const addItem = async () => {
    //   const res = await tcbAddAndCommit('test', formData, { commit })
    //   console.log(res)
    //   await getList()
    // }
    // // 更新
    // const updateItem = async () => {
    //   const res = await tcbUpdateAndCommit('test', idVal.value, formData, { commit })
    //   console.log(res)
    //   await getList()
    // }
    // // 删除
    // const deleteItem = async (id: string) => {
    //   const res = await tcbRemoveAndCommit('test', idVal.value, { commit })
    //   console.log(res)
    //   await getList()
    // }

    // return {
    //   idVal,
    //   formData,
    //   getList,
    //   addItem,
    //   updateItem,
    //   deleteItem
    // }
  }
})
</script>

<style>

</style>
