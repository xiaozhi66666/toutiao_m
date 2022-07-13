// 导入request
import request from '@/utils/request'

/**
 * 登录请求
 * @param {mobile} mobile 手机号
 * @param {code} code   验证码
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
// export const loginApi = (mobile, code) => request({
//   method: 'POST',
//   url: '/v1_0/authorizations',
//   data: {
//     mobile,
//     code
//   }
// })
