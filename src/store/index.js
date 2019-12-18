import Vue from 'vue'
import Vuex from 'vuex'
import $http from '@/utils/http'

Vue.use(Vuex)

const state = {

  token: window.localStorage.getItem('user_token') || '',
  userInfo: window.JSON.parse(window.localStorage.getItem('user_info')) || {},
  isCollapse: window.JSON.parse(window.localStorage.getItem('user-collapse')),
  isRouter: false,
  menus: [],
  tags: [],
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
    window.localStorage.setItem('user-collapse', state.isCollapse)
  },
  set_collapse (state) {
    state.isCollapse = !state.isCollapse
    window.localStorage.setItem('user-collapse', window.JSON.stringify(state.isCollapse))
  },
  set_tags (state, payload) {
    const arr = [...state.tags]
    const isRepeat = arr.includes(payload)
    console.log(isRepeat)
    !isRepeat && arr.push(payload)
    state.tags = arr
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
          'name': 'DataModel',
          'path': '/dataModel',
          'componentPath': '/model/dataModel',
          'title': '数据模型',
          'icon': 'el-icon-tickets',
        },
        {
          'id': '2',
          'name': 'Template',
          'path': '/template',
          'componentPath': '/template/template',
          'title': '分析模板',
          'icon': 'el-icon-tickets',
        },
        {
          'id': '3',
          'name': 'TemplateList',
          'path': '/templateList',
          'componentPath': '/template/templateList',
          'title': '模板列表',
          'icon': 'el-icon-tickets',
        },
        {
          'id': ' 4',
          'path': '',
          'title': '我的分析',
          'icon': 'el-icon-tickets',
          'children': [{
            'id': '41',
            'name': 'MyAnalyse',
            'path': '/analyse/myAnalyse?id=41',
            'componentPath': '/analyse/myAnalyse',
            'title': '我自定义1',
            'icon': 'el-icon-tickets',
          },
          {
            'id': '42',
            'name': 'MyAnalyse',
            'path': '/analyse/myAnalyse?id=42',
            'componentPath': '/analyse/myAnalyse',
            'title': '我自定义2',
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
        const num = v.path.indexOf('?')
        const compPath = v.component === 'layout' ? '/layout/layout' : v.componentPath
        v.url = v.path
        v.path = num === -1 ? v.path : v.path.substring(0, num)
        v.component = v.children && v.children.length ? 'layout' : ''
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
