import request from '@/utils/request'

export function fetchProfs(query) {
  return request({
    url: '/prof',
    method: 'post',
    params: query
  })
}
export function createProf(data) {
  return request({
    url: '/prof/create',
    method: 'post',
    data
  })
}
export function updateProf(data) {
  return request({
    url: '/prof/update',
    method: 'post',
    data
  })
}
export function fetchProfDetail(query) {
  return request({
    url: '/prof/show',
    method: 'post',
    params: query
  })
}

export function fetchProfCats(query) {
  return request({
    url: '/prof/cats',
    method: 'post',
    params: query
  })
}

export function createProfCat(data) {
  return request({
    url: '/prof/cat/create',
    method: 'post',
    data
  })
}
export function updateProfCat(data) {
  return request({
    url: '/prof/cat/update',
    method: 'post',
    data
  })
}
export function fetchProfCatDetail(query) {
  return request({
    url: '/prof/cat/show',
    method: 'post',
    params: query
  })
}
