import request from './request'

export function loginApi(payload) {
  return request.post('/auth/login', payload)
}

export function registerApi(payload) {
  return request.post('/auth/register', payload)
}

export function refreshApi(token) {
  return request.post('/auth/refresh', { token })
}

export function meApi() {
  return request.get('/auth/me')
}