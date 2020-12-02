import { createStore } from 'vuex'
import { testData, testPosts } from '../testData'

export interface GlobalDataProps {
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
}

interface UserProps {
  isLogin: boolean;
  nickName?: string;
  id?: number;
  columnId?: number;
}

export interface ColumnProps {
  id: number;
  title: string;
  avatar?: string;
  desc: string;
}

export interface PostProps {
  id: number;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
  columnId: number;
}

const store = createStore<GlobalDataProps>({
  state: {
    columns: testData,
    posts: testPosts,
    user: { isLogin: false, nickName: 'kevin', columnId: 1 }
  },
  mutations: {
    login (state) {
      state.user = { ...state.user, isLogin: true, nickName: 'kevin' }
    },
    /**
     * 创建Post, 需要带参数(将 详情 作为参数)
     * 故使用 Payload--可以向store.commit 传入额外的参数,即mutations的载荷(payload)
     * */
    createPost (state, newPost) {
      state.posts.push(newPost)
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    biggerColumnsLength (state) {
      return state.columns.filter(c => c.id > 2).length
    },
    getColumnsById: (state) => (id: number) => {
      return state.columns.find(c => c.id === id)
    },
    getPostsById: (state) => (cid: number) => {
      return state.posts.filter(post => post.columnId === cid)
    }
  }
})

export default store
