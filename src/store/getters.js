const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,

  menus: state => state.permission.menus, // src/layout/components/Sidebar/index.vue 中会获取这个给D:\我的文档\桌面\tutor\tutor_UI\vue-admin-template-permission-control\src\layout\components\Sidebar\SidebarItem.vue生成菜单
  routes: state => state.permission.routes,

  rawPermissions: state => state.user.rawPermissions, //后台返回的permission列表还没转换成树形结构
  rawRoutes: state => state.user.rawRoutes //后台返回的permission列表还没转换成树形结构
}
export default getters
