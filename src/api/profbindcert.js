import request from '@/utils/request'

export function fetchBinds(query) {
  return request({
    url: '/assistant/prof/certs',
    method: 'post',
    params: query
  })
}
export function bindCertsUpdate(data) {
  return request({
    url: '/assistant/prof/bind_certs_update',
    method: 'post',
    data
  })
}
export function updateprof(data) {
  return request({
    url: '/assistant/prof/bind_certs_update',
    method: 'post',
    data
  })
}
export function fetchBindDetail(query) {
  return request({
    url: '/assistant/prof/show',
    method: 'post',
    params: query
  })
}
