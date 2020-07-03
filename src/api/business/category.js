import request from '@/utils/request'


// 获取列表 包含 分页 条件查询 排序
export function list(listQuery) {
  return request({
    url: '/business/back/categories',
    method: 'get',
    params: listQuery
  })
}

//
export function listByParentId(parentId) {
  return request({
    url: '/business/back/categories/parentId/'+parentId,
    method: 'get',
  })
}

export function deleteById(id) {
  return request({
    url: '/business/back/categories/'+id,
    method: 'delete',
  })
}


export function patch(data) {
  return request({
    url: '/business/back/categories',
    method: 'patch',
    data: data
  })
}

export function save(data) {
  return request({
    url: '/business/back/categories',
    method: 'post',
    data: data
  })
}
