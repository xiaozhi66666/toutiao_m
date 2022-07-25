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
      mobile,
      code
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

/**
 *编辑用户个人资料
 * @param {string} name 昵称
 * @param {string} gender 性别，0-男，1-女
 * @param {string} birthday 生日，格式'2018-12-20'
 * @param {string} intro 个人介绍
 * @returns Promise
 */
export const setUserInfoAPI = (name, gender, birthday, intro) =>
  request({
    url: '/v1_0/user/profile',
    method: 'PATCH',
    data: {
      name,
      gender,
      birthday,
      intro
    }
  })
/**
 *编辑用户照片资料（头像、身份证照片）
 * @param {String} photo  头像文件
 * @returns Promise
 */
export const setUserAvatarAPI = (photo) =>
  request({
    url: '/v1_0/user/photo',
    method: 'PATCH',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: {
      photo
    }
  })

/**
 *关注用户
 * @param {String} id //关注对象用户的id
 * @returns Promise
 */
export const followingsAPI = (id) =>
  request({
    url: '/v1_0/user/followings',
    method: 'POST',
    data: {
      target: id
    }
  })

/**
 *关注用户
 * @param {String} id //需要取消关注对象用户的id
 * @returns Promise
 */
export const cancelFollowingsAPI = (id) =>
  request({
    url: `/v1_0/user/followings/${id}`,
    method: 'DELETE'
  })
