import request from '@/utils/request'

export function fetchActivity(query) {
  return request({
    url: '/share/getshares',
    method: 'post',
    params: query
  })
}

export function createActivity(data) {
  return request({
    url: '/share/addshare',
    method: 'post',
    data
  })
}

export function updateActivity(data) {
  return request({
    url: '/share/updateshare',
    method: 'post',
    data
  })
}

export function fetchActivityDetail(query) {
  return request({
    url: '/share/getsharedetail',
    method: 'post',
    params: query
  })
}
