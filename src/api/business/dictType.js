import request from '@/utils/request'


// 获取列表 包含 分页 条件查询 排序
export function page(listQuery) {
  return request({
    url: '/business/back/dictTypes/page',
    method: 'get',
    params: listQuery
  })
}

// 添加
export function save(data) {
  return request({
    url: '/business/back/dictTypes',
    method: 'post',
    data: data
  })
}

export function patch(data) {
  return request({
    url: '/business/back/dictTypes',
    method: 'patch',
    data: data
  })
}
