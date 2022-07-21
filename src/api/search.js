import request from '@/utils/request'

/**
 * 获取联想建议（自动补全）
 * @param {String} q 搜索关键词
 * @returns Promise
 */
export const getSearchsuggestionApi = (q) => {
  return request({
    url: '/v1_0/suggestion',
    params: {
      q
    }
  })
}

/**
 *获取完整搜索结果
 * @param {Number} page  页码
 * @param {Number} perPage  //一次请求返回的数量
 * @param {String} q  关键词
 * @returns
 */
export const getSearchResultApi = (page, perPage, q) => {
  return request({
    url: '/v1_0/search',
    params: {
      page,
      per_page: perPage,
      q
    }
  })
}
