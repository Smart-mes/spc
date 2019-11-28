import Vue from 'vue'
import store from '@/store/index'
import VueRouter from 'vue-router'

// 路由
const Login = resolve => require(['@/views/Login'], resolve)
const none = resolve => require(['@/views/404'], resolve)

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/Login',
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login,
  },
  {
    path: '*',
    name: '404',
    component: none,
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
