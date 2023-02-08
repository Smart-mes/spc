import Vue from 'vue'
import http from '@/utils/http'
import headTitle from '@/components/headTitle'
import btnTool from '@/components/btnTool'

import contextmenu from '@/directives/contextmenu'

Vue.directive('contextmenu', contextmenu)
Vue.component('headTitle', headTitle)
Vue.component('btnTool', btnTool)

Vue.prototype.$http = http
