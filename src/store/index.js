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
        commit('set_state', {
          menus: list,
          isRouter: true,
        })
      })
  },
}

const getters = {
  routes (state) {
    const menus = state.menus

    const formatRoutes = (arr) => {
      return arr.map(v => {
        v.component = v.children && v.children.length ? 'layout' : ''
        const compPath = v.component === 'layout' ? '/layout/layout' : v.path
        v.component = () => import(`@/views${compPath}.vue`)

        v.meta = { title: v.title }
        if (v.children && v.children.length) v.children = formatRoutes(v.children)
        return v
      })
    }

    return formatRoutes(menus)
  },
}

export default new Vuex.Store({
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters,
  modules: {},
})
