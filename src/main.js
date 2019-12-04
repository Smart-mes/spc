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

Vue.use(ElementUI, { size: 'small' })
Object.defineProperty(Vue.prototype, '$http', { value: $http })
Object.defineProperty(Vue.prototype, '$echarts', { value: $echarts })
Vue.config.productionTip = false

export default new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
