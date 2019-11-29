import Vue from 'vue'
import Vuex from 'vuex'
import $http from '@/utils/http'

Vue.use(Vuex)

const state = {
  token: window.localStorage.getItem('user_token'),
  isRouter: false,
  menu: [],
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
  set_token: (state, payload) => {
    state.user_token = payload
    window.localStorage.setItem('user_token', payload)
  },
  set_state (state, payload) {
    if (payload && typeof payload === 'object') {
      payload.forEach((v, k) => {
        state[k] = v
      })
    }
  },
  // 退出登录
  logout: (state) => {
    state.menus = []
    state.isRouter = false
    window.localStorage.removeItem('user_token')
  },
}

const actions = {
  /**
     * 获取菜单
     */
  queryMenus ({ commit }) {
    return $http
      .get('/admin/menu')
      .then(({ data = [] }) => {
        commit('SET_STATE', {
          menus: data,
          isRouter: true,
        })
      })
  },
}

export default new Vuex.Store({
  state: state,
  mutations: mutations,
  actions: actions,
  modules: {
  },
})
