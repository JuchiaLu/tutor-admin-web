import request from '@/utils/request'


// 获取列表 包含 分页 条件查询 排序
export function page(listQuery) {
  return request({
    url: '/system/back/advertisements2/page',
    method: 'get',
    params: listQuery
  })
}

export function deleteById(id) {
  return request({
    url: '/system/back/advertisements2/'+id,
    method: 'delete',
  })
}


export function patch(data) {
  return request({
    url: '/system/back/advertisements2',
    method: 'patch',
    data: data
  })
}

export function save(data) {
  return request({
    url: '/system/back/advertisements2',
    method: 'post',
    data: data
  })
}
