import request from '@/utils/request'

// 查询新闻列表
export function listNotice(query) {
  return request({
    url: '/api/news/open/queryByPage',
    method: 'post',
    data: query
  })
}

// 查询新闻详细
export function getNotice(id) {
  return request({
    url: `/api/news/open/${id}`,
    method: 'get'
  })
}

// 新增新闻
export function addNotice(data) {
  return request({
    url: '/api/news',
    method: 'post',
    data: data
  })
}

// 修改新闻列表
export function updateNotice(data) {
  return request({
    url: '/api/news',
    method: 'put',
    data: data
  })
}

// 删除新闻列表
export function delNotice(ids) {
  return request({
    url: `/api/news`,
    method: 'delete',
    data:ids
  })
}