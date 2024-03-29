import axios from 'axios'
import qs from 'qs'
import { MessageBox, Message } from 'element-ui'

import config from '@/utils/config'
// import router from '@/router/index'
// const url = 'http://120.78.70.56:8099'
// console.log('config', config)

const instance = axios.create({
  baseURL: config.baseURL,
  headers: { 'Content-Type': 'application/json;charset=UTF-8' },
  timeout: 30000,
  withCredentials: true,
  paramsSerializer (params) {
    return qs.stringify(params, { arrayFormat: 'repeat' })
  },
})

// 添加请求拦截器
instance.interceptors.request.use(config => {
  if (window.localStorage.getItem('user_token')) {
    config.headers['Authorization'] = window.localStorage.getItem('user_token')
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(response => {
  const { data } = response
  const { code, message } = data

  if (code !== 0) {
    switch (code) {
      case 3001 || 302:
        MessageBox('请登录', { type: 'error' }).then(() => { window.location.href = '/' })
        break
      case 500:
        Message({ message: '网络错误', type: 'error' })
        break
      case 400:
        Message({ message, type: 'error' })
        break
      case 9999:
        Message({ message: message || '错误', type: 'error' })
        break
      default:
    }

    return Promise.reject(message)
  }
  return data
}
, error => {
  const res = error.response
  const status = res.status

  switch (status) {
    case 401 || 402:
      MessageBox('请登录', { type: 'error' }).then(() => { window.location.href = '/' })
      break
    case 500:
      Message({ message: '网络错误', type: 'error' })
      break
    default:
  }
  return Promise.reject(error)
})

export default instance
