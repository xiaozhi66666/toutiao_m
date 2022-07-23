import request from '@/utils/request'

/**
 *
 * @param {a/c} type 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
 * @param {Number} source 源id，文章id或评论id
 * @param {Number} offset 非必须获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
 * @param {Number} limit 非必须获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量

 * @returns Promise
 */
export const getCommentsAplyAPI = (type, source, offset, limit) => request({
  url: '/v1_0/comments',
  params: {
    type,
    source,
    offset,
    limit
  }
})

/**
 *对文章或者评论进行评论
 * @param {String} target 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
 * @param {String} content 评论内容
 * @param {String} artId 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
 * @returns
 */
export const setCommentsAPI = (target, content, artId) => request({
  url: '/v1_0/comments',
  method: 'POST',
  data: {
    target,
    content,
    art_id: artId
  }
})

/**
 *
 * @param {String} id  点赞的评论id
 * @returns Promise
 */
export const setCommentLikeAPI = (id) => request({
  url: '/v1_0/comment/likings',
  method: 'POST',
  data: {
    target: id
  }
})

/**
 *
 * @param {String} id  取消点赞的评论id
 * @returns Promise
 */
export const delCommentLikeAPI = (id) => request({
  url: `/v1_0/comment/likings/${id}`,
  method: 'DELETE'
})
