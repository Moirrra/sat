// 二次封装axios
import axios from 'axios'
// import store from '@/store'

const requests = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

// 请求拦截器
requests.interceptors.request.use((config) => {
  // 单独控制接口请求时间限制
  if(config.url.indexOf("data") > -1){ 
    config.timeout= 600000;
  }
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