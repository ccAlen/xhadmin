import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/interview/getquestions',
    method: 'post',
    params: query
  })
}
export function fetchQuestion(id) {
  return request({
    url: '/interview/getquestiondetail',
    method: 'post',
    params: { id }
  })
}
export function createQuestion(data) {
  return request({
    url: '/interview/addquestion',
    method: 'post',
    data
  })
}
export function updateQuestion(data) {
  return request({
    url: '/interview/updatequestion',
    method: 'post',
    data
  })
}

export function fetchQuestionType(query) {
  return request({
    url: '/interview/getskillcats',
    method: 'post',
    params: query
  })
}
export function createQuestionType(data) {
  return request({
    url: '/interview/addskillcat',
    method: 'post',
    data
  })
}
export function updateQuestionType(data) {
  return request({
    url: '/interview/updateskillcat',
    method: 'post',
    data
  })
}
export function fetchQuestionList(query) {
  return request({
    url: '/interview/getskills',
    method: 'post',
    params: query
  })
}
export function createQuestionList(data) {
  return request({
    url: '/interview/addskill',
    method: 'post',
    data
  })
}
export function updateQuestionList(data) {
  return request({
    url: '/interview/updateskill',
    method: 'post',
    data
  })
}

export function fetchSkillsDetail(query) {
  return request({
    url: '/interview/getskilldetail',
    method: 'post',
    params: query
  })
}

