import request from '@/utils/request'

/**
 * 获取用户的频道
 * @returns Promise
 */
export const getMyChannelsApi = () => {
  return request({
    url: '/v1_0/user/channels'
  })
}

/**
 * 获取所有频道列表
 * @returns Promise
 */
export const getAllChannelApi = () => {
  return request({
    url: '/v1_0/channels'
  })
}
