import request from '@/utils/request'

export function fetchCoupons(query) {
  return request({
    url: '/coupon/getcoupons',
    method: 'post',
    params: query
  })
}
export function addCoupon(data) {
  return request({
    url: '/coupon/addcoupon',
    method: 'post',
    data
  })
}
export function fetchCouponDetail(query) {
  return request({
    url: '/coupon/getcoupondetail',
    method: 'post',
    params: query
  })
}
export function updateCoupon(data) {
  return request({
    url: '/coupon/updatecoupon',
    method: 'post',
    data
  })
}
export function couponHeldusers(query) {
  return request({
    url: '/coupon/getcouponheldusers', // 优惠卷持有列表
    method: 'post',
    params: query
  })
}
