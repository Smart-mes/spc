import Vue from 'vue'
import Vuex from 'vuex'
import $http from '@/utils/http'
import { Message } from 'element-ui'

Vue.use(Vuex)

const state = {
  userInfo: JSON.parse(localStorage.getItem('user_info')) || {},
  isCollapse: localStorage.getItem('user_collapse') === 'true',
  isRouter: false,
  menus: [],
  tags: [],
  tagsNo: 0,
  tagsTitle: '',
  tagsType: 'filter',
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

    localStorage.setItem('user_token', token)
    localStorage.setItem('user_info', JSON.stringify(userInfo))
    localStorage.setItem('user_collapse', state.isCollapse)
  },
  set_collapse (state) {
    state.isCollapse = !state.isCollapse
    localStorage.setItem('user_collapse', state.isCollapse)
  },
  add_tags (state, payload) {
    if (state.tags.length >= 30) {
      return void Message({message: '最多能查看30个我的分析！', type: 'warning'})     
    }
    state.tagsNo = ++state.tagsNo

    const tagsObj = {
      key: `${Date.parse(new Date())}${(Math.random() * 3)}`,
      visible: true,
      no: state.tagsNo,
      ...payload,
    }
    state.tags.push(tagsObj)
  },
  splice_tags (state, { firstIndex, tagsActive }) {
    state.tags.splice(firstIndex, 0, tagsActive)
  },
  del_tags (state, i) {
    state.tags.splice(i, 1)
  },
  fiter_tags (state, title) {
    state.tagsTitle = title
    const tagsTitle = state.tagsTitle

    state.tags.forEach(tagsItem => {
      const { title } = tagsItem
      tagsItem.visible = !tagsTitle ? true : tagsTitle === title
    })
  },
  swap_tags (state, { x, y }) {
    state.tags.splice(x, 1, ...state.tags.splice(y, 1, state.tags[x]))
  },
  set_state (state, payload) {
    if (payload && typeof (payload) === 'object') {
      for (var key in payload) {
        state[key] = payload[key]
      }
    }
  },
  // 退出登录
  logout (state) {
    // state.menus = []
    // state.isRouter = false
    // state.isCollapse = false
    // state.userInfo = {}
    localStorage.removeItem('user_token')
    localStorage.removeItem('user_info')
    localStorage.removeItem('user_collapse')
  },
}

const actions = {
  /**
     * 获取菜单
     */
  async queryMenus ({ commit }) {
    try {
      const {data:menusList} = await $http.get('/resource/list')
      const {data:{list:submenuList}} = await $http.get('/analysis/myAnalysis', { params: { pageSize: 300 }})
          
      menusList.forEach(menusItem=>{
        if (menusItem.path === '/analyse/myAnalyse') {
          menusItem.children=submenuList.map(({ id, name })=>{
            return {
              id,
              title: name,
              path: `/analyse/myAnalyse?id=${id}`,
            } 
        })
        }
      })

      commit('set_state', {  menus: menusList, isRouter: true })

    } catch (e) {
      commit('set_state', { isRouter: true })
    }
  },
}

const getters = {
  routes (state) {
    // 处理数据
    const menusData = state.menus
    .map(({children,...other})=>other)
    .map((item, i) => {
        return {
          component: 'layout',
          path: '',
          children: [{ ...item }],
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
        const meta = { title: title || '', keepAlive: componentPath !== '/template/template' && id !== 2 }

        path = pathNo === -1 ? path : path.substring(0, pathNo)
        v.component = () => import(`@/views${compPath}.vue`)

        if (children && children.length) 
          children = formatRoutes(children)

        return {
          name,
          path,
          component:  v.component,
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
