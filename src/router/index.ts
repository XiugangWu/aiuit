import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import store from '../store'

const Home = () => import(/* webpackChunkName: "Home" */ '../views/Home.vue')
const Login = () => import(/* webpackChunkName: "Login" */ '../views/Login.vue')
const ColumnDetail = () => import(/* webpackChunkName: "ColumnDetail" */ '../views/ColumnDetail.vue')
const CreatePost = () => import(/* webpackChunkName: "CreatePost" */ '../views/CreatePost.vue')
const Mine = () => import(/* webpackChunkName: "Mine" */ '../views/Mine.vue')
const Signup = () => import(/* webpackChunkName: "Signup" */ '../views/Signup.vue')

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
      path: '/create',
      name: 'create',
      component: CreatePost,
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
    }
  ]
})

/**
 *  1.路由守卫,当用户没有登陆时,并且用户试图前往“不是login页面”,则强制跳转到login
 *    to.name !== 'login' && !store.state.user.isLogin
 *  2.路由元信息meta,创建不同的规则:
 *    2.1 当用户 未登陆的情况下,试图访问/create页面, 则用户强制跳到/login
 *    2.2 当登陆用户,访问登陆页面/login, 则跳转到 首页/home
 */
router.beforeEach((to, from, next) => {
  // 当用户 未登陆的情况下,试图访问/create页面, 则用户强制跳到/login
  if (to.meta.requiredLogin && !store.state.user.isLogin) {
    next({
      name: 'login'
    })
  } else if (to.meta.redirectAlreadyLogin && store.state.user.isLogin) {
    next({
      name: 'home'
    })
  } else {
    next()
  }
})

export default router
