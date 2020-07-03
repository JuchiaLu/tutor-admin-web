import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service2 = axios.create({
  // withCredentials: true, // send cookies when cross-domain requests
  baseURL: '/api',
  timeout: 5000 // request timeout
})

// request interceptor
service2.interceptors.request.use(
  config => {

    config.headers['Authorization'] = 'Basic d2ViLWFkbWluOndlYi1hZG1pbg=='

    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service2.interceptors.response.use(

  response => {
    const res = response.data
    return res
  },
  error => {
    console.log(error.response) // for debug
    if(error.response.data.message){
      Message({
        message: error.response.data.message,
        type: 'warning',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service2
