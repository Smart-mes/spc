import Vue from 'vue'
import Vuex from 'vuex'
import $http from '@/utils/http'
import { Message } from 'element-ui'

Vue.use(Vuex)

const state = {
  // token: window.localStorage.getItem('user_token') || '',
  userInfo: window.JSON.parse(window.localStorage.getItem('user_info')) || {},
  isCollapse: window.JSON.parse(window.localStorage.getItem('user-collapse')),
  isRouter: false,
  menus: [],
  tags: [],
  tagsNo: 0,
}

const mutations = {
  /**
     * 设置state的方法，例：
     * this.$store.commit('SET_STATE', {
     *     menus: menus
     * })
     * menus为需要设置的state
     * @param state
     * @param payload
     */
  set_user: (state, { token, userInfo }) => {
    state.user_info = userInfo
    state.isCollapse = false

    window.localStorage.setItem('user_token', token)
    window.localStorage.setItem('user_info', window.JSON.stringify(userInfo))
    window.localStorage.setItem('user_collapse', state.isCollapse)
  },
  set_collapse (state) {
    state.isCollapse = !state.isCollapse
    window.localStorage.setItem('user-collapse', window.JSON.stringify(state.isCollapse))
  },
  add_tags (state, payload) {
    const tagsArr = [...state.tags]

    if (tagsArr.length >= 8) {
      Message({
        message: '最多能查看8个我的分析！',
        type: 'warning',
      })
      return false
    }
    state.tagsNo = ++state.tagsNo
    const timeObj = { key: Date.parse(new Date()) + (Math.random() * 5), no: state.tagsNo }
    const tagsObj = { ...payload, ...timeObj }
    tagsArr.unshift(tagsObj)
    state.tags = tagsArr
  },
  del_tags (state, i) {
    const tagsArr = [...state.tags]
    tagsArr.splice(i, 1)
    state.tags = tagsArr
  },
  set_state (state, payload) {
    if (payload && typeof (payload) === 'object') {
      for (var key in payload) {
        state[key] = payload[key]
      }
    }
  },
  // 退出登录
  logout: (state) => {
    state.menus = []
    state.isRouter = false
    window.localStorage.removeItem('user_token')
    window.localStorage.removeItem('user_info')
    window.localStorage.removeItem('user_collapse')
  },
}

const actions = {
  /**
     * 获取菜单
     */
  queryMenus ({ commit }) {
    return $http.get('/api/resource/list').then(({ data }) => {
      return data
    }).then(res => {
      const menusData = res

      $http.get('/api/analysis/myAnalysis').then(({ data }) => {
        if (data.length) {
          const childArr = data.map(item => {
            const { id, name } = item
            return {
              id,
              title: name,
              path: `/analyse/myAnalyse?id=${id}`,
              componentPath: '/analyse/myAnalyse',
            }
          })
          menusData.forEach(menus => {
            if (menus.id === 4) {
              menus.children = childArr
            }
          })
        }
      })

      return menusData
    }).then(data => {
      commit('set_state', {
        menus: data,
        isRouter: true,
      })
    })

    // const data = [{
    //   'id': '1',
    //   'name': 'DataModel',
    //   'path': '/dataModel',
    //   'componentPath': '/model/dataModel',
    //   'title': '数据模型',
    //   'icon': 'el-icon-tickets',
    // },
    // {
    //   'id': '2',
    //   'name': 'Template',
    //   'path': '/template',
    //   'componentPath': '/template/template',
    //   'title': '分析模板',
    //   'icon': 'el-icon-tickets',
    // },
    // {
    //   'id': '3',
    //   'name': 'TemplateList',
    //   'path': '/templateList',
    //   'componentPath': '/template/templateList',
    //   'title': '模板列表',
    //   'icon': 'el-icon-tickets',
    // },
    // {
    //   'id': '4',
    //   'path': '',
    //   'componentPath': '',
    //   'title': '我的分析',
    //   'icon': 'el-icon-tickets',
    //   'children': [{
    //     'id': '41',

    //     'path': '/analyse/myAnalyse?id=41',
    //     'componentPath': '/analyse/myAnalyse',
    //     'title': '我自定义1',
    //     'icon': 'el-icon-tickets',
    //   },
    //   {
    //     'id': '42',
    //     'path': '/analyse/myAnalyse?id=42',
    //     'componentPath': '/analyse/myAnalyse',
    //     'title': '我自定义2',
    //     'icon': 'el-icon-tickets',
    //   },
    //   ],
    // },
    // ]
    // commit('set_state', {
    //   menus: data,
    //   isRouter: true,
    // })
  },
}

const getters = {
  routes (state) {
    // const menus = JSON.parse(JSON.stringify(state.menus))
    // console.log('state.menus', state.menus)
    const menus = state.menus

    // 处理数据
    const menusData = menus.map((item, i) => {
      if (item.path !== '/analyse/myAnalyse') {
        return {
          component: 'layout',
          path: '',
          children: item,
        }
      } else {
        item.component = 'layout'
        return item
      }
    })

    // return menusData
    // router数据
    const formatRoutes = (arr) => {
      return arr.map(v => {
        const pathNo = v.path.indexOf('?')
        const compPath = v.component === 'layout' ? '/layout/layout' : v.componentPath

        v.url = v.path
        v.name = v.componentPath ? v.componentPath.split('/').pop() : ''
        v.path = pathNo === -1 ? v.path : v.path.substring(0, pathNo)
        v.meta = { title: v.title ? v.title : '', keepAlive: compPath === '/analyse/myAnalyse' }
        v.component = () =>
                    import(`@/views${compPath}.vue`)

        if (v.children && v.children.length) {
          v.meta = { title: v.title ? v.title : '', keepAlive: false }
        } else {
          v.meta = { title: v.title ? v.title : '', keepAlive: compPath === '/analyse/myAnalyse' }
        }

        if (v.children && v.children.length) v.children = formatRoutes(v.children)
        return v
        // /analyse/myAnalyse
      })
    }

    return formatRoutes(menusData)
  },
}

export default new Vuex.Store({
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters,
  modules: {},
})
