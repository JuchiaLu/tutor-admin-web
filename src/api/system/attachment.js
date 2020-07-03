import request from '@/utils/request'


// 获取列表 包含 分页 条件查询 排序
export function page(listQuery) {
  return request({
    url: '/system/back/attachments/page',
    method: 'get',
    params: listQuery
  })
}

export function deleteById(id) {
  return request({
    url: '/system/back/attachments/'+id,
    method: 'delete',
  })
}


export function patch(data) {
  return request({
    url: '/system/back/attachments',
    method: 'patch',
    data: data
  })
}

export function save(data) {
  return request({
    url: '/system/back/attachments',
    method: 'post',
    data: data
  })
}

export function upload(fileobj){
  let param = new FormData();
  // 上传文件对象 名称file与后台控制器参数要一致
  param.append('file',fileobj.file);
  return request({
    method: 'post',
    // 上传地址
    url: '/system/back/attachments/upload',
    // 定义上传头
    headers: {'Content-Type':'multipart/form-data'},
    data: param
  });
}
