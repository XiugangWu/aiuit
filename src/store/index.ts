import { arrToObj, objToArr } from '@/hooks/utils'
import { createStore } from 'vuex'
import { auth, asyncAndCommit } from '@/hooks/useTcbInit'

export interface GlobalDataProps {
  loading: boolean;
  user: UserProps;
  columns: { list: ListProps<ColumnProps>; currentPage: number; total: number };
  posts: { data: ListProps<PostProps>; loadedColumns: string[] };
  error: GlobalErrorProps;
}

export interface GlobalErrorProps {
  status: boolean;
  message?: string;
}

interface ListProps<P> {
  [id: string]: P;
}

interface LocationProps {
  city?: string;
  country?: string;
  province?: string;
}

export interface UserProps {
  _id?: string;
  _openid?: string;
  // column?: string[]; // 是需要的么?不需要,column不是user,类似自然人与法人的关系
  mailActivated?: boolean; // 邮箱是否已激活
  avatarUrl?: string;
  customUserId?: string;
  email?: string;
  gender?: string;
  hasPassword?: boolean;
  location?: LocationProps;
  loginType?: string;
  nickName?: string;
  openid?: string;
  qqMiniOpenId?: string;
  uid?: string;
  unionId?: string;
  wxOpenId?: string;
  wxPublicId?: string;
  createTime?: Date; // 创建时间,由添加到数据库时,自动添加
  updateTime?: Date; // 创建时间,由添加到数据库时,自动添加
  description?: string; // 用户的描述
  avatar?: ImageProps;
}

export interface ImageProps {
  _id?: string; // 自动生成"_id"
  url?: string;
  fitUrl?: string;
  createTime?: Date;
  updateTime?: Date;
  fileID?: string; // 文件 ID form 云存储getTempFileURL回调
  tempFileURL?: string; // 临时文件网络链接
}

export interface ColumnProps {
  _id?: string;
  _openid?: string;
  title: string;
  avatar?: ImageProps;
  desc: string;
  // author?: UserProps; // 没有作者,相当于自然人和法人的关系
  createTime?: Date;
  updateTime?: Date;
}

export interface PostProps {
  _id?: string;
  _openid?: string; // 匿名登陆状态下会没有, 非匿名下 同uer._id?
  title: string;
  excerpt?: string; // 摘要
  content: string;
  image?: ImageProps | string;
  createTime?: Date;
  updateTime?: Date;
  column?: string; // 属于哪个column
  author?: string; // 作者--网页情况下,_openid 有可能不存在
  isHTML?: boolean;
}

const store = createStore<GlobalDataProps>({
  state: {
    loading: false,
    columns: { list: {}, currentPage: 0, total: 0 },
    posts: { data: {}, loadedColumns: [] },
    user: { ...auth.currentUser },
    error: { status: false, message: 'Error Test' }
  },
  mutations: {
    /**
     *
     * @description 登陆后user数据更新
     * @param state
     * @param rawData
     */
    login (state, rawData) {
      state.user = { ...state.user, ...rawData[0] }
      console.log('login->state.user', state.user)
    },
    /**
     *
     * @description 更新用户数据
     * @param state store.state
     * @param rawData 接受到的数据
     */
    updateUser (state, rawData) {
      state.user = { ...state.user, ...rawData }
      console.log('updateUser', state.user)
    },
    /**
     *
     * @description mutation-修改state.columns:获取Columns的列表(所有columns的集合),展示在首页
     * @param state state.columns
     * @param rawData 接受到的数据
     */
    fetchColumns (state, rawData) {
      const { list } = state.columns
      const { data, total, pageNum } = rawData
      state.columns = {
        list: { ...list, ...arrToObj(data) },
        total,
        currentPage: pageNum * 1 // 防止 pageNum 的类型为string
      }
      console.log('mutation-fetchColumns-state.columns', state.columns)
    },
    /**
     *
     * @description mutation-修改state.columns:根据id获取单条的column,展示在columnDetail页面
     * @param state state.columns
     * @param rawData 接受到的数据
     */
    fetchColumn (state, rawData) {
      // state.columns[rawData.data._id] = rawData.data
      state.columns.list = arrToObj(rawData.data)
      console.log('mutation-fetchColumn-state.columns', state.columns)
    },
    /**
     *
     * @description mutation-创建Post, 需要带参数(将 详情 作为参数)
     * @param state state.posts
     * @param newPost Payload--可以向store.commit 传入额外的参数,即mutations的载荷(payload)
     */
    createPost (state, newPost) {
      state.posts.data[newPost._id] = newPost
      console.log('mutation-createPost-state.posts.data', state.posts.data)
    },
    /**
     * @description mutation-获取文章
     * @param state
     * @param rawData
     */
    fetchPost (state, rawData) {
      state.posts.data[rawData.data._id] = rawData.data
      console.log('mutation-fetchPost-state.posts.data', state.posts.data)
    },
    /**
     * @description mutation-更新文章
     * @param state
     * @param rawData
     */
    updatePost (state, rawData) {
      state.posts.data[rawData.data._id] = rawData.data
      console.log('mutation-updatePost-state.posts.data', state.posts.data)
    },
    /**
     * @description mutation-修改state.posts
     * @param state state.posts
     * @param rawData 接受到的数据
     */
    fetchPosts (state, { result: rawData, extraData: columnId }) {
      state.posts.data = { ...state.posts.data, ...arrToObj(rawData.data) }
      state.posts.loadedColumns.push(columnId)
      console.log('mutation-fetchPosts-state.posts.data', state.posts.data)
    },
    /**
     * @description mutation-删除state.posts
     */
    deletePost (state, rawData) {
      delete state.posts.data[rawData.data._id]
      console.log('mutation-deletePost-state.posts.data', state.posts.data)
    },
    /**
     * @description mutation-设置loading状态
     * @param state store.state
     * @param status 状态
     */
    setLoading (state, status) {
      state.loading = status
    },
    /**
     * @description mutation-改变error的值
     * @param state store.state
     * @param err 错误信息
     */
    setError (state, err: GlobalErrorProps) {
      state.error = err
    }
  },
  actions: {
    /**
     * @description actions-邮箱登陆 <https://docs.cloudbase.net/authentication/email-login.html>
     * @param commit
     * @param user 用户信息
     */
    loginWithEmailAndPassword ({ commit }, emailAndPassword) {
      const options = {
        method: 'get',
        where: {
          email: emailAndPassword.email,
          password: emailAndPassword.password
        }
      }
      return asyncAndCommit('userInfo', options, 'login', commit)
    },
    /**
     * @description actions-创建新用户
     * @param commit
     * @param user
     */
    createUser ({ commit }, user) {
      const options = {
        method: 'add',
        formData: user
      }
      return asyncAndCommit('userInfo', options, 'updateUser', commit)
    },
    /**
     * @description actions-获取所有的columns
     * @param commit store.commit
     */
    fetchColumns ({ state, commit }, params) {
      const { currentPage = 1, pageSize = 6 } = params
      // if (!state.columns.isloaded) {
      if (state.columns.currentPage < currentPage) {
        // commit('setLoading', true)
        const options = { // 方法必填;其余查询参数可为空
          method: 'get',
          // order: ['age', 'asc'],
          // where: {
          // name: 'laoda',
          // },
          pageNum: currentPage,
          pageSize: pageSize
          // filter: ['_id', 'age']
        }
        return asyncAndCommit('columns', options, 'fetchColumns', commit)
        // const { data } = await db.collection('columns').get()
        // commit('fetchColumn', data)
        // commit('setLoading', false)
      }
    },
    /**
     * @description actions-根据id获取单个的column
     * @param commit
     * @param cid column的_id
     */
    fetchColumn ({ state, commit }, cid) {
      if (!state.columns.list[cid]) {
        const options = {
          method: 'get',
          where: {
            _id: cid
          }
        }
        return asyncAndCommit('columns', options, 'fetchColumn', commit)
      }
    },
    /**
     * @description actions-创建新的post
     * @param commit ctx.commit
     * @param payload 传入的值
     */
    createPost ({ commit }, payload) {
      const options = {
        method: 'add',
        formData: payload
      }
      return asyncAndCommit('posts', options, 'createPost', commit)
    },
    /**
     * @description actions-创建post
     * @param { state, commit } store
     * @param id
     */
    fetchPost ({ state, commit }, id) {
      console.log('id-->', id)
      const options = {
        method: 'get',
        where: {
          _id: id
        }
      }
      const currentPost = state.posts.data[id]
      if (!currentPost || !currentPost.content) {
        return asyncAndCommit('posts', options, 'fetchPost', commit)
      } else {
        return Promise.resolve({ data: currentPost })
      }
    },
    /**
     * @description actions-更新post
     * @param id 要更新的post的id
     * @param payload 更新的数据
     */
    updatePost ({ commit }, { id, formData }) {
      const options = {
        method: 'update',
        id,
        formData
      }
      return asyncAndCommit('posts', options, 'updatePost', commit)
      /**
       *  requestId: "7db82ad9-4a47-11eb-b019-5254004a0d1c"
          result:
            requestId: "924e9d98a3774-176b17ed40d_f"
            updated: 1
        TODO:以上是cloudbase返回的update结果,不包含post的内容,需要修改
       */
    },

    /**
     * @description actions-根据column_id(即post的column字段值),查找所有属于这个专栏的post
     * @param commit
     * @param cid post的column字段值
     */
    fetchPosts ({ state, commit }, cid) {
      if (!state.posts.loadedColumns.includes(cid)) {
        const options = {
          method: 'get',
          where: {
            column: cid
          }
        }
        return asyncAndCommit('posts', options, 'fetchPosts', commit, cid)
      }
    },

    /**
     * @description actions-删除post
     */
    deletePost ({ commit }, id) {
      const options = {
        method: 'delete',
        id
      }
      return asyncAndCommit('posts', options, 'deletePost', commit)
    }
  },
  modules: {
  },
  getters: {
    /**
     * @description 将'get'返回的data,从object-》array
     * @param state
     */
    getColumns: (state) => {
      console.log('getter-getColumns-state.columns', state.columns)
      return objToArr(state.columns.list)
    },
    /**
     * @description 通过id查找Column
     * @param state state.columns
     */
    getColumnById: (state) => (id: string) => {
      console.log('getter-getColumnById-state.columns', state.columns)
      return state.columns.list[id]
    },
    /**
     *
     * @description 通过column_id查找Posts(可能多个)
     * @param state state.posts
     */
    getPostsById: (state) => (cid: string) => {
      console.log('getter-getPostsById-state.posts.data', state.posts.data)
      return objToArr(state.posts.data).filter(post => post.column === cid)
    },
    getCurrentPost: (state) => (id: string) => {
      console.log('getter-getCurrentPost-state.posts.data', state.posts.data)
      return state.posts.data[id]
    }
  }
})

export default store
