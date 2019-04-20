import request from '@/utils/request'

export function fetchOrderCourses(data) {
  return request({
    url: '/consume/getconsumes',
    method: 'post',
    data
  })
}

export function fetchOrderDetail(query) {
  return request({
    url: '/consume/getconsumedetail',
    method: 'post',
    params: query
  })
}
