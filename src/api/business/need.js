import request from '@/utils/request'


// 获取列表 包含 分页 条件查询 排序
export function page(listQuery) {
  return request({
    url: '/business/back/needs/page',
    method: 'get',
    params: listQuery
  })
}

// 审核老师
export function audit(id,data) {
  return request({
    url: '/business/back/needs/'+id +'/audit',
    method: 'patch',
    data: data
  })
}
