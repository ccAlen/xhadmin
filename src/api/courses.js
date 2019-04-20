import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/course/getcourses',
    method: 'post',
    params: query
  })
}
export function fetchCourses(id) {
  return request({
    url: '/course/getcoursedetail',
    method: 'post',
    params: { id }
  })
}
export function createCourses(data) {
  return request({
    url: '/course/addcourse',
    method: 'post',
    data
  })
}
export function updateCourses(data) {
  return request({
    url: '/course/updatecourse',
    method: 'post',
    data
  })
}
export function fetchCat(query) {
  return request({
    url: '/course/getcoursecats',
    method: 'post',
    params: query
  })
}
export function createCat(data) {
  return request({
    url: '/course/addcoursecategory',
    method: 'post',
    data
  })
}
export function updateCat(data) {
  return request({
    url: '/course/updatecoursecategory',
    method: 'post',
    data
  })
}
// 课程小节列表
export function fetchClasses(query) {
  return request({
    url: '/course/getclasses',
    method: 'post',
    params: query
  })
}
export function createClasses(data) {
  return request({
    url: '/course/addcourseclass',
    method: 'post',
    data
  })
}
export function updateClasses(data) {
  return request({
    url: '/course/updatecourseclass',
    method: 'post',
    data
  })
}
export function fetchClassesDetail(id) {
  return request({
    url: '/course/getclassdetail',
    method: 'post',
    params: { id }
  })
}
export function fetchPlayenableUrl(id) {
  return request({
    url: '/course/getplayenableurl',
    method: 'post',
    params: { id }
  })
}
