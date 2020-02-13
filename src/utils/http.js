import axios from 'axios'
import qs from 'qs'
import { MessageBox } from 'element-ui'
// import router from '@/router/index'

const instance = axios.create({
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
  const data = response.data
  const { code, message } = data

  if (code !== 0) {
    switch (code) {
      case 3001 || 302:
        MessageBox('请登录', {
          type: 'error',
        }).then(() => {
          window.location.href = '/login'
        })
        break
      case 500:
        MessageBox('网络错误', {
          type: 'error',
        })
        break
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
      MessageBox('请登录', {
        type: 'error',
      }).then(() => {
        window.location.href = '/login'
      })
      break
    case 500:
      MessageBox('网络错误', {
        type: 'error',
      })
      break
  }
  return Promise.reject(error)
})

export default instance
