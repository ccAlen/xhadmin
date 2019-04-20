import request from '@/utils/request'

export function fetchDistributes(data) {
  return request({
    url: '/distribute/getdistributors',
    method: 'post',
    data
  })
}
export function createDistribute(data) {
  return request({
    url: '/distribute/adddistributor',
    method: 'post',
    data
  })
}
export function updateDistribute(data) {
  return request({
    url: '/distribute/updatedistributor',
    method: 'post',
    data
  })
}

export function fetchDistributorDetail(data) {
  return request({
    url: '/distribute/getdistributordetail',
    method: 'post',
    data
  })
}
export function setDistributeCourse(data) {
  return request({
    url: '/distribute/setdistributecourse',
    method: 'post',
    data
  })
}

export function unSetDistributeCourse(data) {
  return request({
    url: '/distribute/unsetdistributecourse',
    method: 'post',
    data
  })
}

export function updateDistributeCourse(data) {
  return request({
    url: '/distribute/updatedistributecourse',
    method: 'post',
    data
  })
}

// 绑定分销商的用户
export function getDistributorUsers(data) {
  return request({
    url: '/distribute/getdbtoruserlogs',
    method: 'post',
    data
  })
}
// 授权人数
export function countAuthorizedUser(data) {
  return request({
    url: '/distribute/countauthorizeduser',
    method: 'post',
    data
  })
}
export function getDbtorConsumeLogs(data) {
  return request({
    url: '/distribute/getdbtorconsumelogs',
    method: 'post',
    data
  })
}
// 打包下载
export function uploadQrcodepkg(data) {
  return request({
    url: '/distribute/downloadqrcode',
    method: 'post',
    data
  })
}

