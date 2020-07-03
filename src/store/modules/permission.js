import { constantRoutes } from '@/router'
import store from '@/store'

// import menuMapComponent from '@/router/menuMapComponent.js'

// 测试开始
//用来添加路由的
function array2tree(source, id, parentId, children) {
  const cloneData = JSON.parse(JSON.stringify(source)) // 对源数据深度克隆
  return cloneData.filter(father => { // 循环所有项，并添加children属性
    const branchArr = cloneData.filter(child => father[id] === child[parentId]) // 返回每一项的子级数组

    if (branchArr.length > 0) {
      father[children] = branchArr // 如果有子数组，就给父级添加一个children属性，并赋值
    }

    // if (menuMapComponent[father.componentName]) {
    //   father.component = menuMapComponent[father.componentName]
    // }

    // father.meta = {title: father.title}

    // 异步加载组件
    father.component = ()=>import(`../../${father.componentPath}/index.vue`)

    return father[parentId] === '0' // 如果第一层不是parentId=0，请自行修改
  })
}

//用来添加菜单的
function array2tree2(source, id, parentId, children) {
  const cloneData = JSON.parse(JSON.stringify(source)) // 对源数据深度克隆
  return cloneData.filter(father => { // 循环所有项，并添加children属性
    const branchArr = cloneData.filter(child => father[id] === child[parentId]) // 返回每一项的子级数组

    if (branchArr.length > 0) {
      father[children] = branchArr // 如果有子数组，就给父级添加一个children属性，并赋值
    }

    father.path = father.uri
    father['meta'] = { title:father.name}

    return father[parentId] === '0' // 如果第一层不是parentId=0，请自行修改
  })
}


// 测试结束

const state = {
  routes: [], //转换过的全部路由
  menus: [] ////转换过的全部菜单
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.routes = constantRoutes.concat(routes)
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus
  }
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      const routes = array2tree(store.getters.rawRoutes, 'id', 'parentId', 'children') || []
      commit('SET_ROUTES', routes)
      resolve(routes)
    })
  },

  generateMenus({ commit }) {
    return new Promise(resolve => {
      const tempMenus = store.getters.rawPermissions.filter((permission)=>{
        return permission['type'] === 1 //1 菜单 2按钮
      })
      const menus = array2tree2(tempMenus, 'id', 'parentId', 'children') || []
      commit('SET_MENUS', menus)
      resolve(menus)
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
