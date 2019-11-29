import Vue from 'vue'
import store from '@/store/index'
import VueRouter from 'vue-router'

// 路由
const Login = resolve => require(['@/views/login'], resolve)
const None = resolve => require(['@/views/none'], resolve)
const Layout = resolve => require(['@/views/layout/layout'], resolve)

// 临时路由
const My1 = resolve => require(['@/views/my/my1'], resolve)
const My2 = resolve => require(['@/views/my/my2'], resolve)
const Data1 = resolve => require(['@/views/data/data1'], resolve)
const Data2 = resolve => require(['@/views/data/data2'], resolve)

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/my',
    meta: { title: '我的账户' },
    component: Layout,
    children: [
      {
        path: '/my/my1',
        meta: {
          title: '设置账号',
          requiresAuth: true,
        },
        component: Data1,
      },
      {
        path: '/my/my2',
        meta: {
          title: '我的资产',
          requiresAuth: true,
        },
        component: Data2,
      },
    ],
  },
  {
    path: '/data',
    meta: { title: '基础数据' },
    component: Layout,
    children: [
      {
        path: '/data/data1',
        meta: {
          title: '基础数据',
          requiresAuth: true,
        },
        component: My1,
      },
      {
        path: '/data/data2',
        meta: {
          title: '数据来源',
          requiresAuth: true,
        },
        component: My2,
      },
    ],
  },
  {
    path: '*',
    name: '404',
    component: None,
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})
// 路由拦截
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (store.state.user_token) {
      next()
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      })
    }
  } else {
    next()
  }
})
export default router
