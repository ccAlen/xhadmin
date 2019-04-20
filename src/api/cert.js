import request from '@/utils/request'

export function fetchCerts(data) {
  return request({
    url: '/cert',
    method: 'post',
    data
  })
}
export function createCert(data) {
  return request({
    url: '/cert/create',
    method: 'post',
    data
  })
}
export function updateCert(data) {
  return request({
    url: '/cert/update',
    method: 'post',
    data
  })
}
export function fetchCertDetail(query) {
  return request({
    url: '/cert/show',
    method: 'post',
    params: query
  })
}

export function fetchCertCats(query) {
  return request({
    url: '/cert/cats',
    method: 'post',
    params: query
  })
}

export function createCertCat(data) {
  return request({
    url: '/cert/cat/create',
    method: 'post',
    data
  })
}
export function updateCertCat(data) {
  return request({
    url: '/cert/cat/update',
    method: 'post',
    data
  })
}
export function fetchCertCatDetail(query) {
  return request({
    url: '/cert/cat/show',
    method: 'post',
    params: query
  })
}
