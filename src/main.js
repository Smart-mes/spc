import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import './registerServiceWorker'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import ExFormV2 from 'ex-form-v2'
// echarts
import $echarts from 'echarts'
import $moment from 'moment'
import VueParticles from 'vue-particles'

import '@/plugins/custom'

Vue.use(ElementUI, { size: 'mini' })
Vue.use(VueParticles)
Vue.use(ExFormV2)

Object.defineProperty(Vue.prototype, '$echarts', { value: $echarts })
Object.defineProperty(Vue.prototype, '$moment', { value: $moment })
Vue.config.productionTip = false

export default new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
