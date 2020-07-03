import request from '@/utils/request'


// 分页
export function page(listQuery) {
  return request({
    url: '/business/back/appoints/page',
    method: 'get',
    params: listQuery
  })
}

