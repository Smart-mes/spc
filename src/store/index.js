import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  user_token: window.localStorage.getItem('user_token'),
}

const mutations = {
  set_token: (state, data) => {
    state.user_token = data
    window.localStorage.setItem('user_token', data)
  },
  // 退出登录
  logout: (state) => {
    window.localStorage.removeItem('user_token')
  },
}

export default new Vuex.Store({
  state: state,
  mutations: mutations,
  actions: {
  },
  modules: {
  },
})
