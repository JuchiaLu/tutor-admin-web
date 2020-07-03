import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login','/auth-redirect','/auth','/authredirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 有token,访问登录页,直接跳转到首页
      next({ path: '/' })
      NProgress.done()
    } else {

      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) { //登录过,且获取过用户信息(路由和权限)
        next() //放行
      }{
        //尝试用token获取用户权限和路由
        try {
          // 登录获取用户信息
          await store.dispatch('user/getInfo')

          // 生成路由
          const accessRoutes = await store.dispatch('permission/generateRoutes')

          //生成菜单
          const accessMenus = await store.dispatch('permission/generateMenus')

          // 动态添加路由
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) { //用token获取不到用户权限(菜单)和路由
          // 情况token
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`) //跳到登录页面
          NProgress.done()
        }
      }
    }
  } else {
     // 没有Token
    if (whiteList.indexOf(to.path) !== -1) {
      //白名单,放行
      next()
    } else {
      //跳到登录页
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }

  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
