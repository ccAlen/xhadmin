import request from '@/utils/request'

export function fetchMessages(query) {
  return request({
    url: '/message/getmessages',
    method: 'post',
    params: query
  })
}
