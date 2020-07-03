import request from '@/utils/request'


// 获取列表 包含 分页 条件查询 排序
export function list(listQuery) {
  return request({
    url: '/business/back/areas',
    method: 'get',
    params: listQuery
  })
}

//
export function listByParentId(parentId) {
  return request({
    url: '/business/back/areas/parentId/'+parentId,
    method: 'get',
  })
}

export function deleteById(id) {
  return request({
    url: '/business/back/areas/'+id,
    method: 'delete',
  })
}


export function patch(data) {
  return request({
    url: '/business/back/areas',
    method: 'patch',
    data: data
  })
}

export function save(data) {
  return request({
    url: '/business/back/areas',
    method: 'post',
    data: data
  })
}
