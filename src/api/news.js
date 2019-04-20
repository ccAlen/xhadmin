import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/news',
    method: 'post',
    params: query
  })
}
export function fetchNews(id) {
  return request({
    url: '/news/getnewsdetail',
    method: 'post',
    params: { id }
  })
}
export function createNews(data) {
  return request({
    url: '/news/addnews',
    method: 'post',
    data
  })
}
export function updateNews(data) {
  return request({
    url: '/news/updatenews',
    method: 'post',
    data
  })
}
export function fetchCat(query) {
  return request({
    url: '/news/types',
    method: 'post',
    params: query
  })
}
export function createCat(data) {
  return request({
    url: '/news/addnewstype',
    method: 'post',
    data
  })
}
export function updateCat(data) {
  return request({
    url: '/news/updatenewstype',
    method: 'post',
    data
  })
}
