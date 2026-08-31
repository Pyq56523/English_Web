import request from './request'

export function getPhrases(params = {}) {
  return request.get('/phrases', { params })
}

export function getPhrase(id) {
  return request.get(`/phrases/${id}`)
}