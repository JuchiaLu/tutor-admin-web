
// 用户token
const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

// 用户信息
const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin',
    permissions:[
      {
        "id": "10",
        "createTime": "2019-10-31T19:55:18",
        "icon": "icon",
        "name": "其他管理",
        "order": "1",
        "parentId": "0",
        "value": "test",
        "status": 0,
        "type": 1,
        "updateTime": "2019-11-01T22:34:44",
        "uri": "目录没有url1"
      }, {
        "id": "7",
        "createTime": "2019-10-31T19:55:18",
        "icon": "icon",
        "name": "系统组织管理",
        "order": "1",
        "parentId": "0",
        "value": "test",
        "status": 0,
        "type": 1,
        "updateTime": "2019-11-01T22:34:49",
        "uri": "目录没有url2"
      }, {
        "id": "8",
        "createTime": "2019-10-31T19:55:18",
        "icon": "icon",
        "name": "系统管理",
        "order": "1",
        "parentId": "7",
        "value": "test",
        "status": 1,
        "type": 1,
        "updateTime": "2019-11-02T22:34:40",
        "uri": "/test1"
      }, {
        "id": "9",
        "createTime": "2019-10-31T19:55:18",
        "icon": "icon",
        "name": "组织管理",
        "order": "1",
        "parentId": "7",
        "value": "test",
        "status": 1,
        "type": 1,
        "updateTime": "2019-11-02T22:34:35",
        "uri": "/test2"
      }, {
        "id": "1",
        "createTime": "2019-10-31T19:55:18",
        "icon": "icon",
        "name": "用户角色管理",
        "order": "1",
        "parentId": "0",
        "value": "test",
        "status": 0,
        "type": 1,
        "updateTime": "2019-11-01T22:44:15",
        "uri": "目录没有url,也可为空,前端判断为空,就知道这个是目录1"
      }, {
        "id": "2",
        "createTime": "2019-10-31T19:55:18",
        "icon": "icon",
        "name": "用户管理test",
        "order": "1",
        "parentId": "1",
        "value": "test",
        "status": 1,
        "type": 1,
        "updateTime": "2019-11-02T15:14:31",
        "uri": "/usertest"
      },


      {
        "id": "99",
        "createTime": "2019-10-31T19:55:18",
        "icon": "icon",
        "name": "用户管理1",
        "order": "1",
        "parentId": "2",
        "value": "test",
        "status": 1,
        "type": 1,
        "updateTime": "2019-11-02T15:14:31",
        "uri": "/user"
      },
      {
        "id": "100",
        "createTime": "2019-10-31T19:55:18",
        "icon": "icon",
        "name": "用户管理2",
        "order": "1",
        "parentId": "2",
        "value": "test",
        "status": 1,
        "type": 1,
        "updateTime": "2019-11-02T15:14:31",
        "uri": "http://baidu.com"
      },


      {
        "id": "3",
        "createTime": "2019-10-31T19:55:18",
        "icon": "icon",
        "name": "角色管理",
        "order": "1",
        "parentId": "1",
        "value": "test",
        "status": 1,
        "type": 1,
        "updateTime": "2019-11-01T22:37:20",
        "uri": "/role"
      }, {
        "id": "4",
        "createTime": "2019-10-31T19:55:18",
        "icon": "icon",
        "name": "菜单路由管理",
        "order": "1",
        "parentId": "0",
        "value": "test",
        "status": 1,
        "type": 1,
        "updateTime": "2019-11-01T22:44:55",
        "uri": "目录没有url3"
      }, {
        "id": "5",
        "createTime": "2019-10-31T19:55:18",
        "icon": "icon",
        "name": "菜单管理",
        "order": "1",
        "parentId": "4",
        "value": "test",
        "status": 1,
        "type": 1,
        "updateTime": "2019-11-01T22:45:14",
        "uri": "/menu"
      }, {
        "id": "6",
        "createTime": "2019-10-31T19:55:18",
        "icon": "icon",
        "name": "路由管理",
        "order": "1",
        "parentId": "4",
        "value": "test",
        "status": 1,
        "type": 1,
        "updateTime": "2019-11-01T22:45:22",
        "uri": "/route"
      }, {
        "id": "13",
        "createTime": "2019-10-31T19:55:18",
        "icon": "icon",
        "name": "会话管理",
        "order": "1",
        "parentId": "10",
        "value": "test",
        "status": 1,
        "type": 1,
        "updateTime": "2019-11-02T22:33:54",
        "uri": "/test3"
      }, {
        "id": "14",
        "createTime": "2019-10-31T19:55:18",
        "icon": "icon",
        "name": "日志管理",
        "order": "1",
        "parentId": "10",
        "value": "test",
        "status": 1,
        "type": 1,
        "updateTime": "2019-11-02T22:34:05",
        "uri": "/test4"
      }, {
        "id": "15",
        "createTime": "2019-10-31T19:55:18",
        "icon": "icon",
        "name": "仪表盘",
        "order": "1",
        "parentId": "0",
        "value": "test",
        "status": 1,
        "type": 1,
        "updateTime": "2019-11-02T22:35:12",
        "uri": "/dashboard"
      }, {
        "id": "1190277280537714689",
        "createTime": "2019-11-01T22:39:52",
        "icon": null,
        "name": "查询用户",
        "order": "1",
        "parentId": "2",
        "value": null,
        "status": 1,
        "type": 2,
        "updateTime": "2019-11-02T15:14:47",
        "uri": "也没有必要有url, 前端直接发送请求即可4"
      }, {
        "id": "1190277568464101377",
        "createTime": "2019-11-01T22:41:01",
        "icon": null,
        "name": "新增用户",
        "order": "1",
        "parentId": "2",
        "value": null,
        "status": 1,
        "type": 2,
        "updateTime": "2019-11-02T15:14:49",
        "uri": "也没有必要有url, 前端直接发送请求即可5"
      }, {
        "id": "1190277675733426177",
        "createTime": "2019-11-01T22:41:26",
        "icon": null,
        "name": "删除用户",
        "order": "1",
        "parentId": "2",
        "value": null,
        "status": 1,
        "type": 2,
        "updateTime": "2019-11-02T15:14:51",
        "uri": "也没有必要有url, 前端直接发送请求即可6"
      }, {
        "id": "1190277734042640386",
        "createTime": "2019-11-01T22:41:40",
        "icon": null,
        "name": "更新用户",
        "order": "1",
        "parentId": "2",
        "value": null,
        "status": 1,
        "type": 2,
        "updateTime": "2019-11-02T15:14:54",
        "uri": "也没有必要有url, 前端直接发送请求即可7"
      }
    ],
    routes:[
      {
        id: '1',
        parentId: '0',
        path: '/1',
        componentPath: 'layout',
        name: '用户角色管理',
        title: '用户角色管理',
        order:'',
        status:'',
        createTime:'',
        updateTime:'',
      },
      {
        id: '2',
        parentId: '1',
        path: '/user',
        name: '用户管理',
        componentPath: 'views/user',
        title: '用户管理',
        order:'',
        status:'',
        createTime:'',
        updateTime:'',
      },
      {
        id: '3',
        parentId: '1',
        path: '/role',
        name: '角色管理',
        componentPath: 'views/role',
        title: '角色管理',
        order:'',
        status:'',
        createTime:'',
        updateTime:'',

      },
      {
        id: '4',
        parentId: '0',
        path: '/2',
        name: '菜单路由管理',
        componentPath: 'layout',
        title: '菜单路由管理',
        order:'',
        status:'',
        createTime:'',
        updateTime:'',

      },
      {
        id: '5',
        parentId: '4',
        path: '/menu',
        name: '菜单管理',
        componentPath: 'views/permission',
        title: '菜单管理',
        order:'',
        status:'',
        createTime:'',
        updateTime:'',

      },
      {
        id: '6',
        parentId: '4',
        path: '/route',
        name: '路由管理',
        componentPath: 'views/route',
        title: '路由管理',
        order:'',
        status:'',
        createTime:'',
        updateTime:'',
      },
    ],
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor',
    permission: []
  }
}

export default [
  // user login 用户登录
  {
    url: '/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error 用户不存在
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info 获取用户信息
  {
    url: '/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error 用户信息不存在
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },


  // user logout 用户退出
  {
    url: '/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
