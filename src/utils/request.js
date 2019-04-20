import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken, setToken, getExpired, setExpired } from '@/utils/auth'
import { refurbishToken } from '@/api/login'

window.isRefurbished = false // 加锁，是否有重新刷token
function checkRefurbish() {
  if (window.isRefurbished === true) {
    setTimeout(function() {
      checkRefurbish()
    }, 500)
  } else {
    var overplus = getExpired() - Date.parse(new Date()) / 1000
    // console.log(overplus)
    if (overplus < 3500 && overplus > 0) { // 剩下5分钟刷新token
      window.isRefurbished = true
      checkRefurbish()
      setTimeout(function() {
        refurbishToken().then(response => {
          setToken(response.data.token)
          var expired_at = new Date(response.data.expired_at)
          var expired = Date.parse(expired_at) / 1000
          setExpired(expired)
          window.isRefurbished = false
          // console.log(1)
        })
      }, 1000)
    }
  }
}
// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    checkRefurbish()
    config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    // console.log(config)
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data
    const status = response.status
    if (status !== 200 && status !== 201 && status !== 204) {
      if (status === 402) {
        res.message = res.message ? res.message : '操作失败'
        Message({
          message: res.message,
          type: 'error',
          duration: 5 * 1000
        })
      }
      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bugbmqa
          })
        })
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error.message)// for debug
    // console.log(error.response.data.message)
    if (error.response.status === 401 && window.location.href.indexOf('/login') === -1) {
      MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload()// 为了重新实例化vue-router对象 避免bugbmqa
        })
      })
    } else if (error.response.status + ''.indexOf('40') >= 0) {
      Message({
        message: error.response.data.message,
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
