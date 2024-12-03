import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
// 创建一个新的axios实例
const service = axios.create({
  // baseURL: API.url,
  baseURL: 'http://192.168.2.250:8080/',
  // withCredentials: true,
  timeout: 5000
})
// 处理token的统一注入问题
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['X-Token'] = getToken()
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    const contentType = response.headers['content-type'] || response.headers['Content-Type']
    if (contentType.indexOf('application/vnd.ms-excel') > -1) {
      return response
    }
    if (res.status === 2005) {
      this.$router.push('/login')
    }
    return res
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
