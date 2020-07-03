import request from '@/utils/request'


// 获取列表 包含 分页 条件查询 排序
export function listByDictTypeId(dictTypeId) {
  return request({
    url: '/business/back/dicts/dictTypeId/'+dictTypeId,
    method: 'get',
  })
}

// 添加
export function save(data) {
  return request({
    url: '/business/back/dicts',
    method: 'post',
    data: data
  })
}


export function patch(data) {
  return request({
    url: '/business/back/dicts',
    method: 'patch',
    data: data
  })
}
