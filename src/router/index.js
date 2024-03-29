import Vue from 'vue'
import $store from '@/store/index'
import VueRouter from 'vue-router'
// 引入nprogress
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(VueRouter)
NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })

// 路由
const routes = [{
  path: '/',
  redirect: '/login',
},
{
  name: 'login',
  path: '/login',
  component: () =>
    import('@/views/login'),
},
{
  name: '',
  path: '',
  component: () =>
      import('@/views/layout/layout'),
  children: [
    {
      name: '404',
      path: '/404',
      component: () =>
          import('@/views/404'),
    },
  ],
},

]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
})
// 解决路由跳转不刷新的BUG
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return routerPush.call(this, location).catch(error => error)
}

// 路由拦截
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const { path } = to
  const isLogin = /\/login/.test(path)
  const isQrCode = /\/qrCode/.test(path)

  if (isLogin || isQrCode) {
    next()
  } else {
    if (!$store.state.isRouter) {
      await $store.dispatch('queryMenus')
      const { routes } = $store.getters

      if (routes && routes.length) {
        routes.push({ path: '*', redirect: '/404' })
        router.addRoutes(routes)
      }
      next({ ...to, replace: true })
    }
    next()
  }
})

router.afterEach(() => {
  NProgress.done()
})
export default router
