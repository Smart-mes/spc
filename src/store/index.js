import Vue from 'vue'
import Vuex from 'vuex'
import $http from '@/utils/http'

Vue.use(Vuex)

const state = {
  token: window.localStorage.getItem('user_token'),
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
  set_token: (state, payload) => {
    state.user_token = payload
    window.localStorage.setItem('user_token', payload)
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
        const arr = [{
          'path': '/my',
          'meta': {
            'title': '我的账户',
          },
          'component': () =>
                                import('@/views/layout/layout.vue'),
          'children': [{
            'path': '/my/my1',
            'meta': {
              'title': '设置账号',
            },
            'component': () =>
                                        import('@/views/my/my1.vue'),
          },
          {
            'path': '/my/my2',
            'meta': {
              'title': '我的资产',
            },
            'component': () =>
                                        import('@/views/my/my2.vue'),
          },
          ],
        },
        {
          'path': '/data',
          'meta': {
            'title': '基础数据',
          },
          'component': () =>
                                import('@/views/layout/layout.vue'),
          'children': [{
            'path': '/data/data1',
            'meta': {
              'title': '设置账号',
            },
            'component': () =>
                                        import('@/views/data/data1.vue'),
          },
          {
            'path': '/data/data2',
            'meta': {
              'title': '我的资产',
            },
            'component': () =>
                                        import('@/views/data/data2.vue'),
          },
          ],
        },
        ]
        // 提交
        commit('set_state', {
          menus: arr,
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
        v.component = () => {
          const compPath = v.component === 'Layout' ? '../views/layout/layout.vue' : v.component
          return import(`../views/${compPath}.vue`)
        }

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
