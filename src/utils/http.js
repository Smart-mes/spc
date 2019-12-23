import axios from 'axios'
import qs from 'qs'
import { MessageBox } from 'element-ui'
import router from '@/router/index'

const instance = axios.create({
  headers: { 'Content-Type': 'application/json;charset=UTF-8' },
  timeout: 10000,
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
  const data = response.data
  const { code } = data

  if (code !== 0) {
    switch (code) {
      case 3001 || 302:
        MessageBox('请登录', {
          type: 'error',
        }).then(() => {
          router.push({ path: '/login' })
        })
        break
      case 500:
        MessageBox('网络错误', {
          type: 'error',
        })
        break
    }

    return Promise.reject(response)
  }
  return data
}
, error => {
  return Promise.reject(error)
})

export default instance
