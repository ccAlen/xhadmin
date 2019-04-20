import request from '@/utils/request'

export function fetchLecturerList(query) {
  return request({
    url: '/lecturer/getlecturers',
    method: 'post',
    params: query
  })
}

export function createLecturer(data) {
  return request({
    url: '/lecturer/addlecturer',
    method: 'post',
    data
  })
}
export function addLecturer(data) {
  return request({
    url: '/lecturer/updatelecturer',
    method: 'post',
    data
  })
}

export function fetchLecturerDetail(query) {
  return request({
    url: '/lecturer/getlecturerdetail',
    method: 'post',
    params: query
  })
}
