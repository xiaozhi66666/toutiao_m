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
