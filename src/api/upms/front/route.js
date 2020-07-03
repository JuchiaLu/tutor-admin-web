import request from '@/utils/request'

export function list(listQuery) {
  return request({
    url: '/upms/routes',
    method: 'get',
    params: listQuery
  })
}

