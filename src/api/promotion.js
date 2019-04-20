import request from '@/utils/request'

export function fetchPromotions(query) {
  return request({
    url: '/promotion/getpromotions',
    method: 'post',
    params: query
  })
}
export function createPromotion(data) {
  return request({
    url: '/promotion/addpromotion',
    method: 'post',
    data
  })
}
export function updatePromotion(data) {
  return request({
    url: '/promotion/updatepromotion',
    method: 'post',
    data
  })
}

export function createCodeImage(data) { // 创建二维码
  return request({
    url: '/promotion/getcodeimage',
    method: 'post',
    data
  })
}
export function getPromotionEffect(data) {
  return request({
    url: '/promotion/getpromotioneffect',
    method: 'post',
    data
  })
}
