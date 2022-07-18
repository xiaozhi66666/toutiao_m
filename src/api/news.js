import request from '@/utils/request'

/**
 * 获取文章新闻推荐
 * @param {Number} channelId  频道ID
 * @param {Number} timestamp  第一页数据为当前时间戳，请求新的推荐数需要用到pre_timestamp
 * @returns
 */
export const getArticleListAPI = (channelId, timestamp) => {
  return request({
    url: '/v1_0/articles',
    params: {
      channel_id: channelId,
      timestamp
    }
  })
}
