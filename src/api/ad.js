import request from '@/utils/request'

export function fetchAdList(query) {
  return request({
    url: '/ad',
    method: 'post',
    params: query
  })
}
export function createAd(data) {
  return request({
    url: '/ad/create',
    method: 'post',
    data
  })
}
export function fetchAdDetail(query) {
  return request({
    url: '/ad/show',
    method: 'post',
    params: query
  })
}

export function updateAd(data) {
  return request({
    url: '/ad/update',
    method: 'post',
    data
  })
}

export function fetchAdPositions(query) {
  return request({
    url: '/ad/positions',
    method: 'post',
    params: query
  })
}
export function createAdPositions(data) {
  return request({
    url: '/ad/positions/create',
    method: 'post',
    data
  })
}
export function fetchAdPositionsDetail(query) {
  return request({
    url: '/ad/positions/show',
    method: 'post',
    params: query
  })
}
export function updateAdPositions(data) {
  return request({
    url: '/ad/positions/update',
    method: 'post',
    data
  })
}
