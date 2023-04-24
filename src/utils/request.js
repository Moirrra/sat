// 二次封装axios
import axios from 'axios'
// import store from '@/store'

const requests = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

// 请求拦截器
requests.interceptors.request.use((config) => {
  // // 请求头添加字段userTempId存储uuid_token
  // if (store.state.detail.uuid_token) {
  //     config.headers.userTempId = store.state.detail.uuid_token;
  // }
  // // 需要携带token给服务器
  // if (store.state.user.token) {
  //     config.headers.token = store.state.user.token;
  // }
  // // config：配置对象，有header请求头
  return config;
});

// 响应拦截器
requests.interceptors.response.use(
  (res) => {
      // 响应成功
      return res.data
  },
  (error) => {
      // 响应失败
      console.log('res.error')
      return Promise.reject(new Error('failure'))
  }
)

export default requests