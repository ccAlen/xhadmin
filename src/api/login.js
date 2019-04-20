import request from '@/utils/request'

export function login(email, password) {
  return request({
    url: '/authorizations',
    method: 'post',
    data: {
      email,
      password
    }
  })
}
export function refurbishToken() {
  return request({
    url: '/authorizations/current',
    method: 'post'
  })
}
export function getInfo() {
  return request({
    url: '/authorizations/detail',
    method: 'post'
  })
}

export function logout() {
  return request({
    url: '/authorizations/logout',
    method: 'post'
  })
}
