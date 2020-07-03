import request from '@/utils/request'


// 获取列表 包含 分页 条件查询 排序
export function pageRoutes(listQuery) {
  return request({
    url: '/upms/routes/page',
    method: 'get',
    params: listQuery
  })
}

export function listRoutes(listQuery) {
  return request({
    url: '/upms/back/routes',
    method: 'get',
    params: listQuery
  })
}

// 添加单个
export function saveRoute(route) {
  return request({
    url: '/upms/back/routes',
    method: 'post',
    data: route
  })
}

//删除单个
export function removeRouteById(id) {
  return request({
    url: '/upms/back/routes/'+id,
    method: 'delete'
  })
}

//删除多个
export function removeRoutesByIds(ids) {
  return request({
    url: '/upms/back/routes',
    method: 'delete',
    data:ids
  })
}

//覆盖更新单个
export function updateRoute(route) {
  return request({
    url: '/upms/back/routes',
    method: 'put',
    data:route
  })
}

//部分更新单个
export function patchRoute(route) {
  return request({
    url: '/upms/back/routes',
    method: 'patch',
    data:route
  })
}

// 以下开始测试

// 根据父id获取路由列表
export function listRoutesByParentId(parentId){
  return request({
    url: '/upms/back/routes/parentId/'+parentId,
    method: 'get'
  })
}

