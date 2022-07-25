<template>
    <div>
       <!-- 评论区域S -->
            <div v-if="commentList.length!==0">
                <div class="comment" v-for="item,index in commentList" :key="index" >
                <van-cell >
                <div slot="title" class="author-focus"><van-image
                width="50"
                height="50"
                :src="item.aut_photo"
                round
                />
                <div class="author-name-time">
                    <span class="author">{{item.aut_name}}</span>
                </div>
            </div>
                <span slot="default" class="icon" >
                <span class="toutiao toutiao-dianzan1" @click="toLike(item.com_id,item.is_liking)" v-if="item.is_liking"></span>
                <span class="toutiao toutiao-dianzan" style="margin-right:10px" @click="toLike(item.com_id,item.is_liking)" v-else></span>赞
                </span>
                </van-cell>
                <div class="comment-content-time">
                    <div class="comment-content">{{item.content}}</div>
                <div  class="comment-time">{{item.pubdate | timeFormat}}<span>
                    <van-button round @click="aply(item.com_id)">回复 {{item.reply_count}}</van-button>
                    </span>
                </div>
            </div>
            </div>
            </div>
            <div v-else class="noContent">
                <p>期待你的评论~~</p>
            </div>
            <Popup @closePopup="showPopup=false" :showPopup="showPopup" :contentList="currentObj" :idAply="id" :aplyList="aplyList" @change="change" @getComments=getComments></Popup>
            <!-- 评论区域E -->
            <!-- <Popup  @changeIsShow='showPopup=false' :showPopup=showPopup></Popup> -->
    </div>
</template>

<script>
import Popup from '../components/Popup.vue'
import stroage from '@/utils/stroage'
// 引入获取评论回复/点赞的API
import { getCommentsAplyAPI, setCommentLikeAPI, delCommentLikeAPI } from '@/api'
export default {
  components: { Popup },
  name: 'ToutiaoMContent',
  props: {
    commentList: {
      type: Array
    //   required: true
    },
    showList: {
      type: Array

    }
  },
  data () {
    return {
      showPopup: false,
      currentObj: {},
      id: '',
      aplyList: [],
      isLike: true, // 是否已点赞，false未点赞true已点赞
      limit: 10
    }
  },

  mounted () {

  },
  computed: {
    artId () {
      return stroage.get('ART_ID')
    }
  },

  methods: {
    // 回复评论
    async aply (id) {
      // 展开弹出层
      this.id = id
      this.showPopup = true
      // 显示弹出框

      //  保存对应id的对象
      const obj = this.commentList.find(item => item.com_id === id)
      this.currentObj = obj
      //   调用获取评论回复的接口
      this.setComments()
      //   this.currentObj.push(obj)
      //   console.log(this.currentObj)
      //   定义一个数组传输到遮罩层组件中
    },
    // 获取评论回复的评论
    async setComments () {
      try {
        const res = await getCommentsAplyAPI('c', this.id, this.offset, this.limit)
        this.aplyList = res.data.data.results
        this.offset = res.data.last_id
      } catch (error) {

      }
    },
    // 获取文章回复的评论
    async getComments (id) {
      try {
        const res = await getCommentsAplyAPI('a', this.artId, this.offset, this.limit)
        const aplyList = res.data.data.results
        this.offset = res.data.last_id
        //  保存对应id的对象
        const obj = aplyList.find(item => item.com_id === id)
        this.currentObj = obj
        this.$emit('changeCommentList')
      } catch (error) {

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
          if (res.status === 204) {
            this.$emit('change')
            return this.$toast.success('取消点赞成功！')
          }
        } catch (error) {
          if (error.response.status === 401) {
            this.$toast.fail('您未登录，请先登录后再进行取消点赞！')
          } else {
            this.$toast.fail('服务器开了点小差，请稍后重试！')
          }
        }
      } else { // 没被点赞
        // 去点赞
        try {
          const res = await setCommentLikeAPI(id)
          if (res.status === 201) {
            this.$emit('change')
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
    change () {
      //  保存对应id的对象
    //   this.setComments()
      this.aply(this.id)
    //   const obj = this.commentList.find(item => item.com_id === id)
    //   this.currentObj = obj
    }

  }
}
</script>

<style lang="less" scoped>

    .aplyContent{
        background-color: #fff!important;
        :deep(.van-icon){
            color: #1989fa!important;
        }
        span{
            color:#323233;
            font-size: 32px;
        }
            }
    .author-focus{
        display:flex;
        align-items:center;
        .author-name-time{
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
        .van-cell{
            padding-bottom: 0;
        }
        span.icon{
            font-size: 30px;
            color:#333;
            .toutiao-dianzan1{
                padding-right: 20px;
            }
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

</style>
