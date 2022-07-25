<template>
  <!-- 弹出层S -->
  <!-- 头部S -->

  <!-- 头部E -->
  <van-popup
    v-model="showPopup"
    position="bottom"
    :style="{ height: '100%' }"
    duration="3s"
  >
    <div class="popup">
      <header>
        <van-nav-bar left-text="返回" left-arrow @click-left="isBack"
          ><span slot="title">{{
            aplyList.length === 0 ? '暂无回复' : aplyList.length + '条回复'
          }}</span></van-nav-bar
        >
      </header>
      <main>
        <div>
          <div class="comment up">
            <van-cell>
              <div slot="title" class="author-focus">
                <van-image
                  width="50"
                  height="50"
                  :src="contentList.aut_photo"
                  round
                />
                <div class="author-name-time">
                  <span class="author">{{ contentList.aut_name }}</span>
                </div>
              </div>
              <span slot="default" class="icon">
                <span
                  class="toutiao toutiao-dianzan1"
                  v-if="contentList.is_liking"
                  @click="
                    changeLiking(contentList.com_id, contentList.is_liking)
                  "
                ></span>
                <span
                  class="toutiao toutiao-dianzan"
                  style="margin-right: 10px"
                  v-else
                  @click="
                    changeLiking(contentList.com_id, contentList.is_liking)
                  "
                ></span
                >赞
              </span>
            </van-cell>
            <div class="comment-content-time">
              <div class="comment-content">{{ contentList.content }}</div>
              <div class="comment-time">
                {{ contentList.pubdate | timeFormat
                }}<span>
                  <van-button round
                    >回复 {{ contentList.reply_count }}</van-button
                  >
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- 全部回复 -->
        <van-cell title="全部回复" />
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          :immediate-check="false"
          error-text="请求失败，点击重新加载"
          :error.sync="error"
          v-if="aplyList.length !== 0"
        >
          <div
            class="content-all"
            v-for="(item, index) in aplyList"
            :key="index"
          >
            <div class="comment">
              <van-cell>
                <div slot="title" class="author-focus">
                  <van-image
                    width="50"
                    height="50"
                    :src="item.aut_photo"
                    round
                  />
                  <div class="author-name-time">
                    <span class="author">{{ item.aut_name }}</span>
                  </div>
                </div>
                <span slot="default" class="icon">
                  <span
                    class="toutiao toutiao-dianzan1 active"
                    @click="toLike(item.com_id, item.is_liking)"
                    v-if="item.is_liking"
                  ></span>
                  <span
                    class="toutiao toutiao-dianzan"
                    style="margin-right: 10px"
                    @click="toLike(item.com_id, item.is_liking)"
                    v-else
                  ></span
                  >赞
                </span>
              </van-cell>
              <div class="comment-content-time">
                <div class="comment-content">{{ item.content }}</div>
                <div class="comment-time">
                  {{ item.pubdate | timeFormat
                  }}<span>
                    <van-button round>回复 {{ item.reply_count }}</van-button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </van-list>
        <div class="isnot-content" v-else>期 待 你 的 评 论 ~ ~</div>
      </main>
    </div>

    <footer>
      <div class="writeContent">
        <div class="content-btn">
          <van-popup
            v-model="show"
            position="bottom"
            :style="{ height: '18%' }"
            class="popup-content"
            ><van-field
              v-model="articleComment"
              type="textarea"
              maxlength="50"
              placeholder="请输入评论"
              show-word-limit
              :autosize="false"
              @keyup.enter="goPublish"
            >
              <div slot="extra" class="publishContent" @click="goPublish">
                发布
              </div>
            </van-field></van-popup
          >
          <van-button round @click="show = true">发 表 评 论</van-button>
        </div>
      </div>
    </footer>
  </van-popup>
  <!-- 弹出层E -->
</template>

<script>
import {
  setCommentsAPI,
  getCommentsAplyAPI,
  setCommentLikeAPI,
  delCommentLikeAPI
} from '@/api'
import stroage from '@/utils/stroage'
export default {
  name: 'ToutiaoMPopup',
  props: {
    showPopup: {
      // 从外部接收的是否展示弹出层的值
      type: Boolean
    },
    contentList: {
      // 接收的回复对象数据
      type: Object
    },
    idAply: {
      // 接收到的当前回复id
      type: String
    },
    aplyList: {
      type: Array // 接收到的评论回复
    }
  },
  data () {
    return {
      articleComment: '', // 文章评论
      show: false, // 展示弹出层
      limit: 1, // 一次获取评论的回复的数量
      // aplyList: [], // 存放回复
      loading: false, // 加载状态
      finished: false, // 是否结束加载
      offset: '', // 加载开始的id
      error: false
    }
  },
  created () {},
  computed: {
    // 本篇文章的ID
    artId () {
      return stroage.get('ART_ID')
    }
  },

  mounted () {},

  methods: {
    // 返回/关闭弹出层
    isBack () {
      this.$emit('closePopup')
    },

    // 发布评论
    async goPublish () {
      if (this.articleComment.trim().length === 0) {
        this.articleComment = ''
        return this.$toast.fail('请输入有效内容后再进行发布！')
      }
      try {
        const res = await setCommentsAPI(
          this.idAply,
          this.articleComment,
          this.artId
        )
        this.newObj = res.data.data.new_obj
        this.aplyList.unshift(this.newObj)

        if (res.data.message === 'OK') {
          this.articleComment = ''
          this.show = false
          //   this.getNewsInfo()
          return this.$toast.success('评论发布成功！')
        }
      } catch (error) {
        this.error = true
        if (error.response.status === 401) {
          this.$toast.fail('您未登录，请先登录后再进行关注！')
        } else {
          this.$toast.fail('服务器开了点小差，请稍后重试！')
        }
      }
    },
    // 触发加载
    async onLoad () {
      if (this.offset) {
        try {
          const res = await getCommentsAplyAPI(
            'c',
            this.idAply,
            this.offset,
            this.limit
          )
          this.aplyList.unshift(...res.results)
          this.offset = res.data.last_id
          this.loading = false
        } catch (error) {
          this.error = true
        }
        this.finished = true
      } else {
        this.finished = true
      }
    },
    // 点赞评论
    async toLike (id, isLike) {
      //   this.isLike = !this.isLike
      // 已被点赞
      if (isLike) {
        // 取消点赞
        try {
          const res = await delCommentLikeAPI(id)
          console.log(res)
          if (res.status === 204) {
            this.$emit('change', id)
            return this.$toast.success('取消点赞成功！')
          }
        } catch (error) {
          if (error.response.status === 401) {
            this.$toast.fail('您未登录，请先登录后再进行取消点赞！')
          } else {
            this.$toast.fail('服务器开了点小差，请稍后重试！')
          }
        }
      } else {
        // 没被点赞
        // 去点赞
        try {
          const res = await setCommentLikeAPI(id)
          if (res.status === 201) {
            this.$emit('change', id)
            return this.$toast.success('点赞成功！')
          }
        } catch (error) {
          if (error.response.status === 401) {
            this.$toast.fail('您未登录，请先登录后再进行点赞！')
          } else {
            this.$toast.fail('服务器开了点小差，请稍后重试！')
          }
        }
      }
    },
    // 点赞评论
    async changeLiking (id, isLike) {
      // 已被点赞
      if (isLike) {
        // 取消点赞
        try {
          const res = await delCommentLikeAPI(id)
          console.log(res)
          if (res.status === 204) {
            this.$emit('getComments', id)
            return this.$toast.success('取消点赞成功！')
          }
        } catch (error) {
          if (error.response.status === 401) {
            this.$toast.fail('您未登录，请先登录后再进行取消点赞！')
          } else {
            this.$toast.fail('服务器开了点小差，请稍后重试！')
          }
        }
      } else {
        // 没被点赞
        // 去点赞
        try {
          const res = await setCommentLikeAPI(id)
          if (res.status === 201) {
            this.$emit('getComments', id)
            return this.$toast.success('点赞成功！')
          }
        } catch (error) {
          if (error.response.status === 401) {
            this.$toast.fail('您未登录，请先登录后再进行点赞！')
          } else {
            this.$toast.fail('服务器开了点小差，请稍后重试！')
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.popup {
  padding-bottom: 60px;
  // 头部
  header {
    :deep(.van-nav-bar__content) {
      position: fixed;
      width: 100%;
      top: 0;
      background-color: #fff;
      .van-nav-bar__left {
        .van-icon {
          color: #1989fa !important;
        }
      }
      .van-nav-bar__title {
        color: #333;
      }
    }
  }
  // 主体
  main {
    margin-top: 100px;
    margin-bottom: 60px;

    .content-all {
      padding: 20px 30px;
    }
    .isnot-content {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 30px 0;
      font-size: 32px;
    }
    .aplyContent {
      background-color: #fff !important;
      :deep(.van-icon) {
        color: #1989fa !important;
      }
      span {
        color: #323233;
        font-size: 32px;
      }
    }
    .author-focus {
      display: flex;
      align-items: center;
      .author-name-time {
        position: relative;
        padding-left: 20px;
        display: flex;
        flex-direction: column;
        .read-count {
          position: absolute;
          right: 0px;
          top: 60px;
          color: #d0beb7;
          font-size: 12px;
          .count {
            color: #3296fa;
          }
        }
        span.author {
          font-size: 26px;
          padding-top: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          -o-text-overflow: ellipsis;
          color: #406599 !important;
        }
        span.time {
          font-size: 24px;
          color: #b7b7b7;
        }
      }
    }
    :deep(.van-button) {
      width: 170px;
      height: 60px;
    }
    .followAlready {
      color: #333 !important;
    }
    // 文章内容区域
    .article-contents {
      padding: 55px 32px;
      font-size: 30px;
    }
    .author-focus {
      align-items: flex-start;
    }
    // 评论
    .up {
      padding: 0 28px;
    }
    .comment {
      .van-cell {
        padding-bottom: 0;
      }
      span.icon {
        font-size: 30px;
        color: #333;
        .toutiao-dianzan1 {
          padding-right: 20px;
        }
      }
      .comment-content-time {
        padding: 0 155px;

        .comment-content {
          font-size: 32px;
        }
        .comment-time {
          display: flex;
          align-items: center;
          font-size: 24px;
          margin-top: 32px;
          span {
            white-space: nowrap;
            font-size: 24px;
            :deep(.van-button--normal) {
              width: 135px;
              height: 48px;
              background-color: #e6e6e6;
              margin-left: 24px;
            }
          }
        }
      }
    }
    .noContent {
      font-size: 28px;
      color: #969799;
      text-align: center;
    }
  }
}
// 底部固定栏
footer {
  .writeContent {
    .popup-content {
      display: flex;
      align-items: center;
      justify-content: center;
      .van-cell {
        padding-right: 0px;
        :deep(.van-field__body) {
          height: 140px;
        }
      }
      :deep(.van-field__value) {
        background-color: lavender;
      }
      .publishContent {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 30px;
        color: #6ba3d8;
      }
    }
    .content-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      color: red;
      position: fixed;
      bottom: 0;
      background-color: cornflowerblue;
      width: 100%;
      height: 102px;
      .van-button {
        width: 640px;
        height: 80px;
        font-size: 32px;
        background-color: #fff;
      }
    }
  }
}
</style>
