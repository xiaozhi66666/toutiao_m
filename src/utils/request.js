import axios from 'axios'
// 引入store以便获取token
import store from '@/store'
// 配置axios
const request = axios.create({
  baseURL: 'http://toutiao.itheima.net',
  //   延迟定时器，发起请求后如果超过规定时间就不再请求
  timeout: 120 * 1000
})

// 请求拦截器
request.interceptors.request.use(
  // 想在发送请求前做些什么
  // config   ==== 本次请求的配置
  // 必须返回出去
  (config) => {
    // console.log(config)
    // 在这里进行判断，如果用户登录了就给其请求头添加一个Authorization字段 ， 值为用户登录的token
    const token = store.state.user.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (errpr) => {
    return Promise.reject(errpr)
  }
)

export default request
