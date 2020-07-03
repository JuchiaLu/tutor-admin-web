import request from '@/utils/request'


// 获取列表 包含 分页 条件查询 排序
export function pagePermissions(listQuery) {
  return request({
    url: '/upms/back/permissions/page',
    method: 'get',
    params: listQuery
  })
}

// 获取列表 包含 分页 条件查询 排序
export function listPermissions(listQuery) {
  return request({
    url: '/upms/back/permissions',
    method: 'get',
    params: listQuery
  })
}

// 添加单个
export function savePermission(permission) {
  return request({
    url: '/upms/back/permissions',
    method: 'post',
    data: permission
  })
}

//删除单个
export function removePermissionById(id) {
  return request({
    url: '/upms/back/permissions/'+id,
    method: 'delete'
  })
}

//删除多个
export function removePermissionsByIds(ids) {
  return request({
    url: '/upms/back/permissions',
    method: 'delete',
    data:ids
  })
}

//覆盖更新单个
export function updatePermission(permission) {
  return request({
    url: '/upms/back/permissions',
    method: 'put',
    data:permission
  })
}

//部分更新单个
export function patchPermission(permission) {
  return request({
    url: '/upms/back/permissions',
    method: 'patch',
    data:permission
  })
}



// 以下开始测试

// 根据父id获取权限列表
export function listPermissionsByParentId(parentId){
  return request({
    url: '/upms/back/permissions/parentId/'+parentId,
    method: 'get'
  })
}

