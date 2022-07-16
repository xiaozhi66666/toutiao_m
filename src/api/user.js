// 导入request
import request from '@/utils/request'
// 导入store
// import store from '@/store'
/**
 * 登录请求
 * @param {String} mobile 手机号
 * @param {Number} code   验证码
 * @returns Promise对象
 */
// 导出基于根请求配置好的登录获取数据请求
export const loginApi = (mobile, code) => {
  return request({
    method: 'POST',
    url: '/v1_0/authorizations',
    data: {
      mobile, code
    }
  })
}

/**
 *  发送短信验证码
 * @param {Number} mobile
 * @returns Promise
 */
export const sendCodeApi = (mobile) => {
  return request({
    method: 'GET',
    url: `/v1_0/sms/codes/${mobile}`
  })
}

/**
 * 获取用户自己信息
 * @returns Promise
 */
export const getUserInfoApi = () => {
  return request({
    url: '/v1_0/user'
    // 在请求中设置请求头
    // headers: {
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}

/**
 *获取用户个人资料
 * @returns Promise
 */
export const getUserMaterialApi = () => {
  return request({
    url: '/v1_0/user/profile'
    // 在请求中设置请求头
    // headers: {
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}
