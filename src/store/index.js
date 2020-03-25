import Vue from 'vue'
import Vuex from 'vuex'
import $http from '@/utils/http'
import { Message } from 'element-ui'

Vue.use(Vuex)

const state = {
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
    state.userInfo = userInfo
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
  async queryMenus ({ commit }) {
    try {
      const menusList = await $http.get('/api/resource/list')
      const submenuList = await $http.get('/api/analysis/myAnalysis', { params: { pageSize: 300 }})
      const menus = menusList.data
      const { data: { list }} = submenuList

      if (menus.length && list.length) {
        const childArr = list.map(item => {
          const { id, name } = item
          return {
            id,
            title: name,
            path: `/analyse/myAnalyse?id=${id}`,
            componentPath: '/analyse/myAnalyse',
          }
        })
        const menusMap = menus.map(menusItem => {
          if (menusItem.path === '/analyse/myAnalyse') {
            menusItem.children = childArr
            return menusItem
          }
          return menusItem
        })
        commit('set_state', {
          menus: menusMap,
          isRouter: true,
        })
      }
      if (menus.length && !list.length) {
        commit('set_state', {
          menus: menus,
          isRouter: true,
        })
      }
    } catch (e) {
      commit('set_state', { isRouter: true })
    }
  },
}

const getters = {
  routes (state) {
    const menus = state.menus
    // 处理数据
    const menusData = menus.map((item, i) => {
      if (item.children && item.path === '/analyse/myAnalyse') {
        item.component = 'layout'
        return item
      } else {
        return {
          component: 'layout',
          path: '',
          children: [{ ...item }],
        }
      }
    })

    // router数据
    const formatRoutes = (arr) => {
      return arr.map(v => {
        let { path, component, children } = v
        const { id, title, componentPath } = v
        // 赋值
        const pathNo = path.indexOf('?')
        const compPath = component === 'layout' ? '/layout/layout' : componentPath
        const name = componentPath ? componentPath.split('/').pop() : ''
        const meta = { title: title || '', keepAlive: compPath === '/analyse/myAnalyse' || id === 4 }

        path = pathNo === -1 ? path : path.substring(0, pathNo)
        component = v.component = () =>
                    import(`@/views${compPath}.vue`)

        if (children && children.length) children = formatRoutes(children)

        return {
          name,
          path,
          component,
          meta,
          children,
        }
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
