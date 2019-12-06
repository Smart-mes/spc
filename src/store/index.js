import Vue from 'vue'
import Vuex from 'vuex'
import $http from '@/utils/http'

Vue.use(Vuex)

const state = {

  token: window.localStorage.getItem('user_token') || '',
  userInfo: window.JSON.parse(window.localStorage.getItem('user_info')) || {},
  isCollapse: window.JSON.parse(window.localStorage.getItem('user_collapse')) || false,
  isRouter: false,
  menus: [],
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
    state.user_token = token
    state.user_info = userInfo
    state.isCollapse = false

    window.localStorage.setItem('user_token', state.user_token)
    window.localStorage.setItem('user_info', window.JSON.stringify(state.user_info))
    window.localStorage.setItem('user-collapse', window.JSON.stringify(state.isCollapse))
  },
  set_collapse (state) {
    state.isCollapse = !state.isCollapse
    window.localStorage.setItem('user-collapse', window.JSON.stringify(state.isCollapse))
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
    return $http
      .get('http://rap2api.taobao.org/app/mock/238393/meauList')
      .then(({ list }) => {
        // 提交
        const data = [{
          'id': '1',
          'path': '/custom',
          'url': '/custom',
          'componentPath': '/custom/custom',
          'title': '我自定义',
          'icon': 'el-icon-tickets',
        },
        {
          'id': ' 2',
          'path': '',
          'url': '',
          'title': '我的分析',
          'icon': 'el-icon-tickets',
          'children': [{
            'id': '21',
            'path': '/analyse/myAnalyse',
            'url': '/analyse/myAnalyse?id=21',
            'componentPath': '/analyse/analyse',
            'title': '我自定义',
            'icon': 'el-icon-tickets',
          },
          {
            'id': '22',
            'path': '/analyse/myAnalyse',
            'url': '/analyse/myAnalyse?id=22',
            'componentPath': '/analyse/analyse',
            'title': '我自定义',
            'icon': 'el-icon-tickets',
          },
          ],
        },
        ]
        commit('set_state', {
          menus: data,
          isRouter: true,
        })
      })
  },
}

const getters = {
  routes (state) {
    const menus = state.menus
    // 处理数据
    const menusData = menus.map((item) => {
      if (!item.children) {
        return {
          component: 'layout',
          path: '',
          children: [item],
        }
      } else {
        item.component = 'layout'
        return item
      }
    })
    // router数据
    const formatRoutes = (arr) => {
      return arr.map(v => {
        v.component = v.children && v.children.length ? 'layout' : ''
        const compPath = v.component === 'layout' ? '/layout/layout' : v.componentPath
        v.component = () =>
                    import(`@/views${compPath}.vue`)
        v.meta = { title: v.title }
        if (v.children && v.children.length) v.children = formatRoutes(v.children)
        return v
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
