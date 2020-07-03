import { login, logout, getInfo } from '@/api/upms/auth/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

import * as frontRouteApi from  '@/api/upms/front/route'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  roles: [],
  rawPermissions: [], //登录后后端返回的菜单权限
  rawRoutes: [],// 登录后返回的routes
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_RAW_PERMISSIONS: (state, permissions) => {
    state.rawPermissions = permissions
  },
  SET_RAW_ROUTES: (state, routes) => {
    state.rawRoutes = routes
  }
}

const actions = {
  // user login
  login({ commit }, form) {
    const { username, password } = form
    return new Promise((resolve, reject) => {
      login({ grant_type:'password',scope:'all',username: username.trim(), password: password }).then(response => {
        commit('SET_TOKEN', response.access_token) //保存token到vuex
        setToken(response.access_token) //保存token到Cookie
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {

        if (!response) {
          reject('Verification failed, please Login again.')
        }


        // roles must be a non-empty array
        if (!response.roles || response.roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', response.roles) //角色
        commit('SET_NAME', response.username) //用户名
        //commit('SET_AVATAR', avatar)

        commit('SET_RAW_PERMISSIONS', response.permissions)//未处理过的的权限(菜单)

        return frontRouteApi.list()
      }).then(response=>{
        commit('SET_RAW_ROUTES', response)//未处理过的路由
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

