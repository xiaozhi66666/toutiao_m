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

/**
 *获取新闻详情
 * @param {String|Number} id
 * @returns Promise
 */
export const getNewsInfoAPI = (id) => request({
  url: `/v1_0/articles/${id}`
})

/**
 *收藏文章
 * @param {String} id 收藏的文章id
 * @returns  Promise
 */
export const toCollectArticalAPI = (id) => request({
  url: '/v1_0/article/collections',
  method: 'POST',
  data: {
    target: id
  }
})

/**
 *取消收藏文章
 * @param {String|Number} id 取消收藏文章的id
 * @returns Promise
 */
export const cancelCollectArticalAPI = (id) => request({
  url: `/v1_0/article/collections/${id}`,
  method: 'DELETE'
})

/**
 *对文章点赞
 * @param {String} id 点赞的文章id
 * @returns  Promise
 */
export const toLikeAPI = (id) => request({
  url: '/v1_0/article/likings',
  method: 'POST',
  data: {
    target: id
  }
})

/**
 *取消对文章点赞
 * @param {String|Number} id
 * @returns Promise
 */
export const cancelLikeAPI = (id) => request({
  url: `/v1_0/article/likings/${id}`,
  method: 'DELETE'
})
