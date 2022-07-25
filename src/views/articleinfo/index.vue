<template>
    <div class="articleinfo-container">
         <!-- 头部标题栏S -->
       <header><Header title="黑马头条"></Header></header>
        <!-- 头部标题栏S -->
        <!-- 内容主体区域S -->
        <main>
            <!-- 文章标题S -->
            <div class="title"><h1>{{contentObj.title}}</h1></div>
            <!-- 文章标题E -->
            <!-- 关注区域S -->
            <div >
                <van-cell >
                <div slot="title" class="author-focus"><van-image
                width="50"
                height="50"
                :src="contentObj.aut_photo"
                round
                />
                <div class="author-name-time">
                    <span class="author">{{contentObj.aut_name}}</span>
                    <span class="time">{{contentObj.pubdate| timeFormat}}</span>
                    <span class="read-count">阅读量 <span class="count">{{contentObj.read_count}}</span></span>
                </div>
            </div>
                <span slot="default">
                    <van-button round type="primary" size="small" color="#eee" @click="followings" hairline  class="followAlready" v-if="isfollow">已关注</van-button>
                    <van-button round type="primary" size="small" color="#3296fa" @click="followings" v-else>+关注</van-button>
                </span>
                </van-cell>
            </div>
            <!-- 评论区域E -->
            <!-- 文章内容S -->
            <div class="article-contents">
                <article v-html="contentObj.content" class="markdown-body" style="text-align:left"></article>
            </div>
            <!-- 文章内容E -->
            <!-- 内容完结 -->
           <div class="finished"> <van-divider
                :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '32px 16px' }"
                dashed
                class="finish-line">
                正文结束
            </van-divider></div>
            <!-- 内容完结 -->
            <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                :immediate-check="false"
                 @load="onLoad"
                   error-text="请求失败，点击重新加载"
                 :error.sync="error"
                >
            <!-- 评论区域S -->
            <ContentItem :commentList="commentList" @change="change" @changeCommentList="changeCommentList"></ContentItem>
            <!-- 评论区域E -->
            </van-list>
        </main>
        <!-- 内容主体区域E -->
        <!-- 底部固定栏S -->
        <footer>
            <div class="footer">
                <div class="writeContent">
                    <van-popup v-model="show" position="bottom" :style="{ height: '18%' }" class="popup-content"><van-field
                        v-model="articleComment"
                        type="textarea"
                        maxlength="50"
                        placeholder="请输入评论"
                        show-word-limit
                        :autosize='false'
                        @keyup.enter="goPublish"
                        >
                    <div slot="extra" class="publishContent" @click="goPublish">发布</div>
                        </van-field></van-popup>
                    <van-button round @click="show=true">写评论</van-button>
                </div>
                <span class="toutiao toutiao-pinglun">
                    <div class="CommentNum">{{commentCount}}</div>
                </span>
                <span class="toutiao toutiao-shoucang1 active" v-if="isCollect&&isLogin" @click="toCollect"></span>
                <span class="toutiao toutiao-shoucang" v-else @click="toCollect"></span>
                <span class="toutiao toutiao-dianzan1 active" @click="toLike" v-if="isLike&&isLogin"></span>
                <span class="toutiao toutiao-dianzan" @click="toLike" v-else>
                </span>
                <span class="toutiao toutiao-fenxiang" @click="showShare=true"></span>
                <van-share-sheet
                v-model="showShare"
                title="立即分享给好友"
                :options="options"
                />
            </div>
        </footer>
        <!-- 底部固定栏E -->
    </div>

</template>

<script>
// 引入头部标题栏组件
import Header from '@/components/Header'
// 评论组件
import ContentItem from './components/ContentItem.vue'
import '../../../node_modules/github-markdown-css/github-markdown.css'
// 引入获取新闻详情/评论或评论回复/点赞/收藏/评论的API
import { getNewsInfoAPI, getCommentsAplyAPI, followingsAPI, cancelFollowingsAPI, toLikeAPI, cancelLikeAPI, toCollectArticalAPI, cancelCollectArticalAPI, setCommentsAPI } from '@/api'
// 引入存取本地值的方法
import stroage from '@/utils/stroage'
export default {
  name: 'ToutiaoMIndex',
  components: { Header, ContentItem },
  data () {
    return {
      contentObj: {}, // 存放获取到的内容
      commentList: [], // 评论相关数据
      show: false, // 控制弹出层显示/隐藏
      articleComment: '', // 文章评论
      commentCount: '', // 文章评论数量
      isfollow: '', // 是否已关注，false未关注true已关注
      isCollect: '', // 是否已收藏，false未收藏true已收藏
      isLike: '', // 是否已点赞，false未点赞true已点赞
      showShare: false, // 是否展示分享面板
      page: 1, // 当前评论页码
      limit: 10, // 一次请求获取的评论数
      loading: false,
      offset: '',
      finished: false,
      options: [ // 分享面板
        [
          { name: '微信', icon: 'wechat' },
          { name: '朋友圈', icon: 'wechat-moments' },
          { name: '微博', icon: 'weibo' },
          { name: 'QQ', icon: 'qq' }
        ],
        [
          { name: '复制链接', icon: 'link' },
          { name: '分享海报', icon: 'poster' },
          { name: '二维码', icon: 'qrcode' },
          { name: '小程序码', icon: 'weapp-qrcode' }
        ]
      ],
      newObj: {},
      error: false

    }
  },

  mounted () {

  },
  computed: {
    // 定义文章id为计算属性
    artId () {
      const id = this.$route.params.id
      //   添加判断，如果当用户刷新时params.id会被清空，所以会传一个undefind过来，导致数据丢失，所以这里判断传过来的是否为空，空则表示用户刷新了直接return本地存储的值，否则直接获取新的id进行覆盖即可
      if (id) {
        stroage.set('ART_ID', id)
        return stroage.get('ART_ID').toString()
      } else {
        return stroage.get('ART_ID').toString()
      }
    },
    // 当前文章作者id
    authId () {
      return this.contentObj.aut_id
    },
    // 用户是否登录
    isLogin () {
      return this.$store.state.user.token
    }
  },
  created () {
    this.getNewsInfo()
  },

  methods: {
    // 获取新闻详情/评论详情
    async getNewsInfo () {
      try {
        const res = await getNewsInfoAPI(this.artId)
        this.contentObj = res.data.data
        this.isfollow = this.contentObj.is_followed
        this.isCollect = this.contentObj.is_collected
        if (this.contentObj.attitude === 1) {
          this.isLike = true
        }
        const { data } = await getCommentsAplyAPI('a', this.artId, this.offset, this.limit)
        // 获取第一次请求的最后一个评论的id
        this.offset = data.data.last_id || ''
        this.commentList = data.data.results
        this.commentCount = data.data.total_count
      } catch (error) {
        this.error = true
        this.$toast.fail('获取数据失败，请稍后重试！')
      }
    },
    // 触发加载事件
    async onLoad () {
      if (this.offset) {
        const { data } = await getCommentsAplyAPI('a', this.artId, this.offset, this.limit)
        // 加载状态结束
        this.commentList.push(...data.data.results)
        // 获取第一次请求的最后一个评论的id
        this.offset = data.data.last_id
        this.loading = false
      }
      this.finished = true
    },
    // 关注
    async followings () {
      if (!this.isLogin) {
        return this.$toast.fail('您未登录，请先登录后再进行关注！')
      }
      // 切换关注状态
      this.isfollow = !this.isfollow
      // 关注(未关注状态)
      if (this.isfollow) {
        try {
          const res = await followingsAPI(this.authId)
          if (res.data.message === 'OK') {
            this.$toast.success('关注用户成功')
          }
        } catch (error) {
          if (error.response.status === 401) {
            this.$toast.fail('您未登录，请先登录后再进行关注！')
          } else {
            this.$toast.fail('服务器开了点小差，请稍后重试！')
          }
        }
      } else {
        // 取消关注(已关注状态)
        try {
          const res = await cancelFollowingsAPI(this.authId)
          if (res.status === 204) {
            this.$toast.success('取消关注用户成功')
          }
        } catch (error) {
          if (error.response.status === 401) {
            this.$toast.fail('您未登录，请先登录后再进行关注！')
          } else {
            this.$toast.fail('服务器开了点小差，请稍后重试！')
          }
        }
      }
    },
    // 收藏
    async toCollect () {
      if (!this.isLogin) {
        return this.$toast.fail('您未登录，请先登录后再进行关注！')
      }
      this.isCollect = !this.isCollect
      if (this.isCollect) {
        try {
          const res = await toCollectArticalAPI(this.artId)
          if (res.data.message === 'OK') {
            this.$toast.success('收藏文章成功！')
          }
        } catch (error) {
          if (error.response.status === 401) {
            this.$toast.fail('您未登录，请先登录后再进行关注！')
          } else {
            this.$toast.fail('服务器开了点小差，请稍后重试！')
          }
        }
      } else {
        try {
          const res = await cancelCollectArticalAPI(this.artId)
          if (res.status === 204) {
            this.$toast.success('取消收藏成功')
          }
        } catch (error) {
          if (error.response.status === 401) {
            this.$toast.fail('您未登录，请先登录后再进行关注！')
          } else {
            this.$toast.fail('服务器开了点小差，请稍后重试！')
          }
        }
      }
    },
    // 点赞
    async toLike () {
      this.isLike = !this.isLike
      if (this.isLike) {
        try {
          const res = await toLikeAPI(this.artId)
          if (res.data.message === 'OK') {
            this.$toast.success('点赞成功！')
          }
        } catch (error) {
          if (error.response.status === 401) {
            this.$toast.fail('您未登录，请先登录后再进行关注！')
          } else {
            this.$toast.fail('服务器开了点小差，请稍后重试！')
          }
        }
      } else {
        try {
          const res = await cancelLikeAPI(this.artId)
          if (res.status === 204) {
            this.$toast.success('取消点赞成功')
          }
        } catch (error) {
          if (error.response.status === 401) {
            this.isLike = false
            this.$toast.fail('您未登录，请先登录后再进行关注！')
          } else {
            this.$toast.fail('服务器开了点小差，请稍后重试！')
          }
        }
      }
    },
    // 发布评论
    async goPublish () {
      if (this.articleComment.trim().length === 0) {
        return this.$toast.fail('请输入有效内容后再进行发布！')
      }
      try {
        const res = await setCommentsAPI(this.artId, this.articleComment)
        this.newObj = res.data.data.new_obj
        this.commentList.unshift(this.newObj)
        if (res.data.message === 'OK') {
          this.articleComment = ''
          this.show = false
          //   this.getNewsInfo()
          return this.$toast.success('评论发布成功！')
        }
      } catch (error) {
        if (error.response.status === 401) {
          this.$toast.fail('您未登录，请先登录后再进行评论！')
        } else {
          this.$toast.fail('服务器开了点小差，请稍后重试！')
        }
      }
    },
    // 子组件中触发刷新数组内容变化
    async change () {
      try {
        const { data } = await getCommentsAplyAPI('a', this.artId, this.offset, this.limit)
        this.commentList = data.data.results
      } catch (error) {
        this.$toast.fail('服务器开了点小差，请稍后重试！')
      }
    },
    async changeCommentList () {
      try {
        const { data } = await getCommentsAplyAPI('a', this.artId, this.offset, this.limit)
        this.commentList = data.data.results
      } catch (error) {
        this.$toast.fail('服务器开了点小差，请稍后重试！')
      }
    }
  }
}
</script>

<style lang="less" scoped>
*{
    margin:0;
    margin:0;
}
// 头部样式
    .articleinfo-container{
        padding-bottom:100px;
        :deep(.van-hairline--bottom){
            position: fixed;
            width: 100%;
            background-color: #3296fa;
             .van-nav-bar__left{
              color:#fff;
                 .van-icon{
                    color:#fff;
                }
           }
    }
        :deep(.van-nav-bar__title) {
        color:#fff;
        }
}
// 主体样式
// 作者头像/名
main{
    padding-top:92px;
    .title{
        h1{
            padding:50px 32px;
           font-size: .6rem;
        }
    }
    .author-focus{
        display:flex;
        align-items:center;
        .author-name-time{
          width: 200px;
            position: relative;
            padding-left: 20px;
            display:flex;
            flex-direction: column;
            .read-count{
                position:absolute;
                right: 0px;
                top: 60px;
                color: #d0beb7;
                font-size: 12px;
                .count{
                    color: #3296fa
                }
            }
            span.author{
                font-size: 26px;
                padding-top: 12px;
                white-space: nowrap;
                overflow: hidden;
                 text-overflow: ellipsis;
                -o-text-overflow:ellipsis;
                color: #406599!important;
            }
             span.time{
                font-size: 24px;
                color:#b7b7b7;
            }
        }
    }
        :deep(.van-button){
            width: 170px;
            height: 60px;
        }
        .followAlready{
            color: #333!important;
        }
        // 文章内容区域
        .article-contents{
            padding:55px 32px;
            font-size: 30px;
        }
        .author-focus{
            align-items: flex-start;
        }
    // 评论
    .comment{
        span.icon{
            font-size: 30px;
            color:#333;
        }
        .comment-content-time{
            padding: 0 155px;
            .comment-content{
                font-size: 32px;

            }
            .comment-time{
                display:flex;
                align-items: center;
                font-size: 24px;
                margin-top: 32px;
                span{
                    white-space: nowrap;
                    font-size: 24px;
                    :deep(.van-button--normal){
                        width: 135px;
                        height: 48px;
                        background-color: #e6e6e6;
                        margin-left: 24px;
                    }
                }
            }
        }
    }
    .noContent{
        font-size: 28px;
        color:#969799;
        text-align: center;
    }
}
// 底部固定栏
footer{
    position:fixed;
    bottom:0;
    width: 100%;
    height: 88px;
    background-color: #fff;
    .footer{
        display:flex;
        justify-content:space-around;
        align-items:center;
        border-top: 1px solid #bbbcbd;
        .writeContent{
            .popup-content{
                display:flex;
                align-items: center;
                justify-content: center;
                .van-cell{
                    padding-right: 0px;
                    :deep(.van-field__body){
                        height: 140px;
                    }
                }
               :deep( .van-field__value){
                    background-color: lavender;
                }
                .publishContent{
                    display:flex;
                    align-items: center;
                    justify-content: center;
                    padding:0 30px;
                    color:#6ba3d8;
                }
            }
            .van-button {
                width: 282px;
                height: 46px;
                span{
                    font-size: .4rem;
                    line-height: .61333rem;
                    color: #a7a7a7;
                    display:inline-block;
                    padding-top: 20px;

                }
            }
        }
            span.toutiao {
                position: relative;
                font-size: 40px;
                height: 100%;
                line-height:100%;
                padding-top: 25px;

            .CommentNum{
                position:absolute;
                height: 25px;
                width: 40px;
                font-size: 12px;
                text-align: center;
                line-height:25px;
                border-radius:40%;
                top: 8px;
                right: -20px;
                color: #fff;
                background-color: #e22829;
            }
            }
        .active{
            color: red;
        }
        :deep(.van-share-sheet__options){
            justify-content:space-around;
        }
    }
}
</style>
