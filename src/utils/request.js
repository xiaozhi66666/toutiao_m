import axios from 'axios'

// 配置axios
const request = axios.create({
  baseURL: 'http://toutiao.itheima.net',
  //   延迟定时器，发起请求后如果超过规定时间就不再请求
  timeout: 3000
})

export default request
