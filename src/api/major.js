import request from '@/utils/request'

// 专业
export function fetchMajors(query) {
  return request({
    url: '/major',
    method: 'post',
    params: query
  })
}
export function createMajor(data) {
  return request({
    url: '/major/create',
    method: 'post',
    data
  })
}
export function updateMajor(data) {
  return request({
    url: '/major/update',
    method: 'post',
    data
  })
}
export function fetchMajorDetail(query) {
  return request({
    url: '/major/show',
    method: 'post',
    params: query
  })
}

// 专业分类
export function fetchMajorCats(query) {
  return request({
    url: '/major/cats',
    method: 'post',
    params: query
  })
}

export function createMajorCat(data) {
  return request({
    url: '/major/cat/create',
    method: 'post',
    data
  })
}
export function updateMajorCat(data) {
  return request({
    url: '/major/cat/update',
    method: 'post',
    data
  })
}
export function fetchMajorCatDetail(query) {
  return request({
    url: '/major/cat/show',
    method: 'post',
    params: query
  })
}
