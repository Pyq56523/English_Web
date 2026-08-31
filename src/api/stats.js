import request from './request'

export function getDashboardStats() {
  return request.get('/stats/dashboard')
}

export function getHeatmap() {
  return request.get('/stats/heatmap')
}

export function getStreak() {
  return request.get('/stats/streak')
}