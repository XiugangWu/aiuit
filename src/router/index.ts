import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

const Home = () => import(/* webpackChunkName: "Home" */ '../views/Home.vue')
const Login = () => import(/* webpackChunkName: "Login" */ '../views/Login.vue')
const ColumnDetail = () => import(/* webpackChunkName: "ColumnDetail" */ '../views/ColumnDetail.vue')
const CreatePost = () => import(/* webpackChunkName: "CreatePost" */ '../views/CreatePost.vue')
const CreateColumn = () => import(/* webpackChunkName: "CreateColumn" */ '../views/CreateColumn.vue')
const Mine = () => import(/* webpackChunkName: "Mine" */ '../views/Mine.vue')
const Signup = () => import(/* webpackChunkName: "Signup" */ '../views/Signup.vue')
const PostDetail = () => import(/* webpackChunkName: "PostDetail" */ '../views/PostDetail.vue')

const routerHistory = createWebHistory()
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { redirectAlreadyLogin: true }
    },
    {
      path: '/column/:id',
      name: 'column',
      component: ColumnDetail
    },
    {
      path: '/createPost',
      name: 'createPost',
      component: CreatePost,
      meta: { requiredLogin: true }
    },
    {
      path: '/createColumn',
      name: 'createColumn',
      component: CreateColumn,
      meta: { requiredLogin: true }
    },
    {
      path: '/mine',
      name: 'mine',
      component: Mine
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },
    {
      path: '/post/:id',
      name: 'post',
      component: PostDetail
    }
  ]
})

/**
 *
 * @desc 腾讯云环境,用户的登陆状态分 未登陆(已处理成匿名登陆), 匿名登陆 和 其他(邮箱登陆/微信登陆等).
 *       匿名登陆:可访问 !requiredLogin 的内容; 需要登陆的页面,强制跳转到login页面
 *       其他: 即已登陆,此时再访问 登陆界面,则触发 redirectAlreadyLogin 跳转到首页
 * @param to
 * @param from
 * @param next
 */
router.beforeEach((to, from, next) => {
  const { user } = store.state
  const { requiredLogin, redirectAlreadyLogin } = to.meta
  if (user.loginType === 'ANONYMOUS') {
    if (requiredLogin) {
      next('login')
    } else {
      next()
    }
  } else {
    if (redirectAlreadyLogin) {
      next('/')
    } else {
      next()
    }
  }
  // next()
})

export default router
