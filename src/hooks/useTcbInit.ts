import store from '@/store'
import cloudbase from '@cloudbase/js-sdk'
import { Commit } from 'vuex'

const cloudDB = 'clouddb' // 'clouddb' 为云函数名称
// 初始化云环境
const tcb = cloudbase.init({ env: 'aiu-mycompany-1uzhz' })
const auth = tcb.auth({ persistence: 'local' }) // 使用session 会在客户端报错...y?
// 监控登陆状态
auth.onLoginStateChanged(() => {
  if (auth.hasLoginState()) {
    // 此时已经登录
    console.log('已登录', auth.hasLoginState())
  } else {
    // 此时未登录，执行您的登录流程
    auth
      .anonymousAuthProvider()
      .signIn()
      .then(() => {
        // 登录成功
        store.commit('updateUser', auth.currentUser)
      })
      .catch(() => {
        // 登录失败
      })
  }
})

// 定义data的类型,避免const { where, order, pageNum, pageSize, filter ...} = data 报错
interface DataProps {
  method: string;
  where?: {};
  order?: [];
  pageNum?: number;
  pageSize?: number;
  filter?: [];
  id?: string;
  formData?: object;
}

// /**
//  *
//  * @description 查询
//  * @date 2020-12-21
//  * @author kevin-wu
//  * @param {string}dbName 数据库名
//  * @param {object}data 传入的参数
//  * @param {string}mutationName store.mutation名
//  * @param {Commit}commit
//  * @returns {object} 返回查询结果
//  */
// const tcbGetAndCommit = async (dbName: string, data: DataProps, mutationName: string, commit: Commit) => {
//   const { where, order, pageNum, pageSize, filter } = data
//   commit('setLoading', true)
//   const res = await tcb.callFunction({
//     name: cloudDB, // 调用云函数
//     data: {
//       method: 'get',
//       dbName,
//       where: where || {},
//       order: order || ['createTime', 'desc'], // 默认按添加时间倒序
//       pageNum: pageNum || 1, // 默认第一页
//       pageSize: pageSize || 30, // 默认最多获取30条数据
//       filter: filter || [] // 过滤字段
//     }
//   })
//   console.log('GET', res)
//   commit(mutationName, res.result.data)
//   commit('setLoading', false)
//   return res
// }

// /**
//  *
//  * @description 新增
//  * @date 2020-12-21
//  * @author kevin-wu
//  * @param {string}dbName 数据库名
//  * @param {object}formData 传入的参数
//  * @param {string}mutationName store.mutation名
//  * @param {Commit}commit
//  * @returns {object}
//  */
// const tcbAddAndCommit = async (dbName: string, formData: object, mutationName: string, commit: Commit) => {
//   commit('setLoading', true)
//   const res = await tcb.callFunction({
//     name: cloudDB,
//     data: {
//       method: 'add',
//       dbName,
//       formData
//     }
//   })
//   console.log('ADD', res)
//   commit(mutationName, res.result)
//   commit('setLoading', false)
//   return res
// }

// /**
//  *
//  * @description 更新
//  * @date 2020-12-21
//  * @author kevin-wu
//  * @param {string}dbName 数据库名
//  * @param {string} id 更新的索引
//  * @param {object}formData 传入的参数
//  * @param {string}mutationName store.mutation名
//  * @param {Commit}commit
//  * @returns {object}
//  */
// const tcbUpdateAndCommit = async (dbName: string, id: string, formData: object, mutationName: string, commit: Commit) => {
//   commit('setLoading', true)
//   const res = await tcb.callFunction({
//     name: cloudDB,
//     data: {
//       method: 'update',
//       dbName,
//       id,
//       formData
//     }
//   })
//   console.log('UPDATE', res)
//   commit(mutationName, res.result)
//   commit('setLoading', false)
//   return res
// }

// /**
//  *
//  * @description 删除
//  * @date 2020-12-21
//  * @author kevin-wu
//  * @param {string}dbName 数据库名
//  * @param {string} id 更新的索引
//  * @param {string}mutationName store.mutation名
//  * @param {Commit}commit
//  * @returns {object}
//  */
// const tcbRemoveAndCommit = async (dbName: string, id: string, mutationName: string, commit: Commit) => {
//   commit('setLoading', true)
//   const res = await tcb.callFunction({
//     name: cloudDB,
//     data: {
//       method: 'delete',
//       dbName,
//       id
//     }
//   })
//   console.log('REMOVE', res)
//   commit(mutationName, res.result)
//   commit('setLoading', false)
//   return res
// }
/**
 * @description 重构查/增/改/删.
 * @param dbName 目标数据库名
 * @param data 配置项(-必需的参数):查[method:'get']/增[method:'add'-formData]/改[method:'update'-id,formData]/删[method:'delete'-id]
 * @param mutationName 所要调用的mutationName(此函数为async,必须在store.actions中调用)
 * @param commit store.context.commit
 * @param extraData? 需要传输更多的数据时添加
 * @returns [get:data/field/pageNum/pageSize/total]
 */
const asyncAndCommit = async (dbName: string, data: DataProps,
  mutationName: string, commit: Commit, extraData?: any) => {
  const { method, where, order, pageNum, pageSize, filter, id, formData } = data
  commit('setLoading', true)
  const { result } = await tcb.callFunction({
    name: cloudDB,
    data: {
      method,
      dbName,
      id: id || '', // 索引[]
      where: where || {}, // 查询条件
      order: order || ['createTime', 'desc'], // 默认按添加时间倒序
      pageNum: pageNum || 1, // 默认第一页
      pageSize: pageSize || 30, // 默认最多获取30条数据
      filter: filter || [], // 过滤字段
      formData: formData || {} // 增/改 时的数据
    }
  })
  if (result.data) {
    if (extraData) {
      commit(mutationName, { result, extraData })
      console.log(`[DB:${dbName}]-[method:${method}]-[mutation:${mutationName}]->`, result)
    } else {
      commit(mutationName, result)
      console.log(`[DB:${dbName}]-[method:${method}]-[mutation:${mutationName}]->`, result)
    }
  }
  commit('setLoading', false)
  return result
}

export { asyncAndCommit, tcb, auth }
