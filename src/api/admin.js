import request from '@/utils/request'

export function adminSearch(name) {
  return request({
    url: '',
    method: 'post',
    params: { name }
  })
}
