import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import $http from '@/utils/http'
// echarts
import $echarts from 'echarts'
import $moment from 'moment'
import VueParticles from 'vue-particles'

// 自定义公共的组件
import headTitle from '@/components/headTitle'
import btnTool from '@/components/btnTool'

Vue.use(ElementUI, { size: 'mini' })
Vue.use(VueParticles)

Vue.component('headTitle', headTitle)
Vue.component('btnTool', btnTool)

Object.defineProperty(Vue.prototype, '$http', { value: $http })
Object.defineProperty(Vue.prototype, '$echarts', { value: $echarts })
Object.defineProperty(Vue.prototype, '$moment', { value: $moment })
Vue.config.productionTip = false

export default new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
