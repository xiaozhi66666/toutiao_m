import request from '@/utils/request'
import stroage from '@/utils/stroage'

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

/**
 *删除指定用户频道
 * @param {String||Number} id  删除指定频道的id
 * @returns Promise
 */
export const delMyChannelsApi = (id) => {
  return request({
    url: `/v1_0/user/channels/${id}`,
    method: 'DELETE'
  })
}

/**
 * 添加频道
 * @param {Number} id 添加指定频道的id
 * @param Number seq 添加指定频道的位置(下标)
 * @returns Promise
 */
export const addChannelApi = (id, seq) => {
  return request({
    url: '/v1_0/user/channels',
    method: 'PATCH',
    data: {
      channels: [{ id, seq }]
    }
  })
}

// 封装2个方法从本地存储或者取出保存的文章数据
const TOUTIAO_CHANNEL = 'TOUTIAO_CHANNEL'
// 取值
export const getLocalChannel = () => {
  return stroage.get(TOUTIAO_CHANNEL)
}
// 存值
export const setLocalChannel = (channel) => {
  stroage.set(TOUTIAO_CHANNEL, channel)
}
