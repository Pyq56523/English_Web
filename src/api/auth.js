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

export function updateMeApi(payload) {
  return request.put('/auth/update-me', payload)
}

export function changePasswordApi(payload) {
  return request.post('/auth/change-password', payload)
}

export function uploadAvatarApi(file) {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/auth/upload-avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}