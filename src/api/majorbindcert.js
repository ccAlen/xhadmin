import request from '@/utils/request'

export function fetchBinds(query) {
  return request({
    url: '/assistant/major/certs',
    method: 'post',
    params: query
  })
}
export function bindCertsUpdate(data) {
  return request({
    url: '/assistant/major/bind_certs_update',
    method: 'post',
    data
  })
}
export function updateMajor(data) {
  return request({
    url: '/assistant/major/bind_certs_update',
    method: 'post',
    data
  })
}
export function fetchBindDetail(query) {
  return request({
    url: '/assistant/major/show',
    method: 'post',
    params: query
  })
}
