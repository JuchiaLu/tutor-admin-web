import request from '@/utils/request'


// 获取列表 包含 分页 条件查询 排序
export function page(listQuery) {
  return request({
    url: '/upms/back/roles/page',
    method: 'get',
    params: listQuery
  })
}

// 获取列表 包含 分页 条件查询 排序
export function list(listQuery) {
  return request({
    url: '/upms/back/roles',
    method: 'get',
    params: listQuery
  })
}

// 添加单个
export function save(role) {
  return request({
    url: '/upms/back/roles',
    method: 'post',
    data: role
  })
}

//删除单个
export function removeById(id) {
  return request({
    url: '/upms/back/roles/'+id,
    method: 'delete'
  })
}

//删除多个
export function removeByIds(ids) {
  return request({
    url: '/upms/back/roles',
    method: 'delete',
    data:ids
  })
}

//部分更新单个
export function update(role) {
  return request({
    url: '/upms/back/roles',
    method: 'put',
    data:role
  })
}

//部分更新单个
export function patch(role) {
  return request({
    url: '/upms/back/roles',
    method: 'patch',
    data:role
  })
}

//通过角色名查找角色
export function getByName(name) {
  return request({
    url: '/upms/back/roles/name/'+name,
    method: 'get'
  })
}

//通过角色id查找角色权限
export function listPermissionsByRoleId(roleId) {
  return request({
    url: '/upms/back/roles/'+roleId+'/permissions',
    method: 'get'
  })
}


//为角色添加权限
export function saveRolePermissionsByRoleId(roleId,permissionIds) {
  return request({
    url: '/upms/back/roles/'+roleId+'/permissions',
    method: 'put',
    data:permissionIds
  })
}

