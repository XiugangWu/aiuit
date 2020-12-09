import { Commit, createStore } from 'vuex'
import cloudbase from '@cloudbase/js-sdk'

export interface GlobalDataProps {
  loading: boolean;
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
  error: GlobalErrorProps;
}

export interface GlobalErrorProps {
  status: boolean;
  message?: string;
}

interface UserProps {
  userId?: string;// 区别与其他,这个userId可能用于表示未登陆的userId
  nickName?: string;
  column?: string;
  isLogin: boolean;
}

interface ImageProps {
  _id?: string; // 小程序会自动生成"_id"
  url?: string;
  createdAt?: string;
}

export interface ColumnProps {
  _id?: string;
  title: string;
  avatar?: ImageProps;
  desc: string;
}

export interface PostProps {
  _id?: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: ImageProps;
  createdAt: string;
  column: string;
  author?: string | UserProps;
}

const app = cloudbase.init({
  env: 'aiu-mycompany-1uzhz'
})
const auth = app.auth({
  persistence: 'local'
})
const db = app.database()
// 匿名登陆
const anonymous = auth.anonymousAuthProvider().signIn()

const store = createStore<GlobalDataProps>({
  state: {
    loading: false,
    columns: [],
    posts: [],
    user: { isLogin: false },
    error: { status: false, message: 'Error Test' }
  },
  mutations: {
    /**
     * @param 设置Loading的值
     */
    setLoading (state, status) {
      state.loading = status
    },
    login (state) {
      state.user = { ...state.user, isLogin: true, nickName: 'kevin' }
    },
    /**
     * @param loginState --回调函数,用于监听用户登陆状态改变
     */
    isLoginState (state) {
      auth.onLoginStateChanged((loginState: any) => {
        if (loginState) {
          state.user.isLogin = true
        } else {
          state.user.isLogin = false
        }
      })
    },
    /**
     * @param 获取用户资料并更新
     */
    userInfoUpdate (state) {
      const userInfo = auth.currentUser
      if (userInfo) {
        state.user.isLogin = true
        state.user.userId = userInfo.uid
        state.user.nickName = userInfo.nickName
      }
    },
    /**
     * 创建Post, 需要带参数(将 详情 作为参数)
     * 故使用 Payload--可以向store.commit 传入额外的参数,即mutations的载荷(payload)
     * */
    createPost (state, newPost) {
      state.posts.push(newPost)
    },
    fetchColumns (state, rawData) {
      state.columns = rawData
    },
    fetchColumn (state, rawData) {
      state.columns = rawData
    },
    fetchPosts (state, rawData) {
      state.posts = rawData
    },
    /**
     * @param 改变error的值
     */
    setError (state, err: GlobalErrorProps) {
      state.error = err
    }
  },
  actions: {
    async fetchColumns ({ commit }) {
      commit('setLoading', true)
      await anonymous.then(() => {
        // token
        console.log('匿名登陆成功')
      }).catch(err => { console.log(err) })
      await db.collection('columns')
        .get()
        .then(res => {
          commit('fetchColumns', res.data)
        }).catch(err => { console.log(err) })
      commit('setLoading', false)
    },
    async fetchColumn ({ commit }, cid) {
      commit('setLoading', true)
      await anonymous.then(() => {
        // token
        console.log('匿名登陆成功')
      }).catch(err => { console.log(err) })
      await db.collection('columns')
        .where({ _id: cid })
        .get()
        .then(res => {
          commit('fetchColumn', res.data)
        }).catch(err => { console.log(err) })
      commit('setLoading', false)
    },
    async fetchPosts ({ commit }, cid) {
      commit('setLoading', true)
      await anonymous.then(() => {
        // token
        console.log('匿名登陆成功')
      }).catch(err => { console.log(err) })
      await db.collection('posts')
        .where({ column: cid })
        .get()
        .then(res => {
          commit('fetchPosts', res.data)
        }).catch(err => { console.log(err) })
      commit('setLoading', false)
    }
  },
  modules: {
  },
  getters: {
    // biggerColumnsLength (state) {
    //   return state.columns.filter(c => c._id > 2).length
    // }, [测试用, 删除 2020-12-2]
    getColumnsById: (state) => (id: string) => {
      return state.columns.find(c => c._id === id)
    },
    getPostsById: (state) => (cid: string) => {
      // console.log('cid', cid)
      return state.posts.filter(post => post.column === cid)
    }
  }
})

export default store
