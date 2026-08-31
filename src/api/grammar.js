import request from './request'

export function getGrammarLessons(params = {}) {
  return request.get('/grammar', { params })
}

export function getGrammarLesson(id) {
  return request.get(`/grammar/${id}`)
}