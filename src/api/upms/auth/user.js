import request from '@/utils/request'
import loginRequest from '@/utils/loginRequest'
const qs = require('qs');


// 登录
export function login(data) {
  return loginRequest({
    url: '/auth/oauth/token',
    method: 'post',
    headers: {
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    data:qs.stringify(data)
  })
}

// 退出登录
export function logout() {
  return new Promise((resolve, reject) => {
      resolve()
  })
  // return request({
  //   url: 'http://tutor-admin-web:9528/mock/user/logout',
  //   method: 'post'
  // })
}


// 获取用户信息
export function getInfo() {
  return request({
    url: '/upms/auth/users/userInfo',
    method: 'get'
  })
}

// 修改密码
export function changePassword(data) {
  return request({
    url: '/upms/auth/users/password',
    method: 'patch',
    data:data
  })
}

//-------------------------------------------------------------------------------------

// 获取列表 包含 分页 条件查询 排序
export function pageUsers(listQuery) {
  return request({
    url: '/upms/back/users/page',
    method: 'get',
    params: listQuery
  })
}

export function listUsers(listQuery) {
  return request({
    url: '/upms/back/users',
    method: 'get',
    params: listQuery
  })
}

// 添加单个
export function saveUser(user) {
  return request({
    url: '/upms/back/users',
    method: 'post',
    data: user
  })
}

//删除单个
export function removeUserById(id) {
  return request({
    url: '/upms/back/users/'+id,
    method: 'delete'
  })
}

//删除多个
export function removeUsersByIds(ids) {
  return request({
    url: '/upms/back/users',
    method: 'delete',
    data:ids
  })
}

//覆盖更新单个
export function updateUser(user) {
  return request({
    url: '/upms/back/users',
    method: 'put',
    data:user
  })
}

//部分更新单个
export function patchUser(user) {
  return request({
    url: '/upms/back/users',
    method: 'patch',
    data:user
  })
}

//通过用户名查找用户
export function getUserByUsername(username) {
  return request({
    url: '/upms/back/users/username/'+username,
    method: 'get'
  })
}

//通过用户名查找用户
export function checkUsername(username) {
  return request({
    url: '/upms/back/users/existed/'+username,
    method: 'get'
  })
}
//通过用户id查找用户角色
export function listRolesByUserId(userId) {
  return request({
    url: '/upms/back/users/'+userId+'/roles',
    method: 'get'
  })
}

//为用户添加角色
export function saveUserRolesByUserId(userId,roleIds) {
  return request({
    url: '/upms/back/users/'+userId+'/roles',
    method: 'put',
    data:roleIds
  })
}





