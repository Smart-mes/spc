import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import $http from '@/utils/http'

Vue.use(ElementUI, { size: 'small', zIndex: 3000 })
Object.defineProperty(Vue.prototype, '$http', { value: $http })
Vue.config.productionTip = false

export default new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

