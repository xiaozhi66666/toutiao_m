<template>
  <div>
    <van-pull-refresh
      v-model="refreshing"
      @refresh="loadNextPage"
      success-text="刷新成功！"
    >
      <van-list
        @load="loadNextPage"
        offset="0"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
      >
        <ArtistListItem
          v-for="item in articles"
          :key="item.art_id"
          :articleInfo="item"
        ></ArtistListItem
      ></van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
// 引入获取文章新闻推荐/评论的接口
import { getArticleListAPI, getCommentsAplyAPI } from '@/api'
// 引入文章信息展示模版组件
import ArtistListItem from '../component/ArtistListItem.vue'
export default {
  name: 'ToutiaoMArtistList',
  components: { ArtistListItem },
  props: {
    id: { type: [String, Number], require: true }
  },
  data () {
    return {
      articles: [], // 文章数据
      pre_timestamp: '', // 前一页的时间戳
      loading: false, // 控制加载状态是否结束
      finished: false, // 是否已加载完成，加载完成后不再触发load事件
      error: false, //
      refreshing: false // 是否处于下拉刷新状态
    }
  },

  mounted () {},
  created () {
    this.getArticleList()
  },
  methods: {
    async getArticleList () {
      try {
        const { data } = await getArticleListAPI(this.id, +new Date())
        this.articles = data.data.results
        this.pre_timestamp = data.data.pre_timestamp
        const res = await getCommentsAplyAPI('a', this.id)
        console.log(res)
      } catch (error) {
        // 返回状态码
        // 507 数据库错误
        // 400 请求参数错误
        // 200 OK
        const stu = error.response.status
        // console.log(error);
        if (stu === 400) {
          throw new Error(error.response.data.message)
        } else {
          this.$toast.fail('刷新重试')
        }
      }
    },
    // 加载时触发的事件
    async loadNextPage () {
      try {
        const { data } = await getArticleListAPI(this.id, this.pre_timestamp)
        // console.log(data) //= =>在返回空数据之前的时间戳为null pre_timestamp: null
        // 将获取到的下一页的数据push到保存文章数据的数组中，注意在这里获取到的是下一页数据的新数组，必须先运用展开运算符先解构出每一项的值再进行push
        if (!data.data.pre_timestamp) {
          // 这里需要通过后端返回的时间戳进行判断，如果返回的数据中的时间戳为null，则说明在此次请求数据返回之后就就没有数据再返回了，所以在此次请求之后将finished属性设置为true,阻止再发起loading事件
          this.finished = true
        }
        // 新增判断，根据是否处于下拉刷新的状态下refreshing=true/false，如果正处于刷新状态就添加到数组的头部，否则就为上拉加载状态添加到尾部
        if (this.refreshing) {
          this.articles.unshift(...data.data.results)
        } else {
          this.articles.push(...data.data.results)
        }
        // push完之后需要进行时间戳的更新
        this.pre_timestamp = data.data.pre_timestamp
        // 请求完成之后将loading重新 设置为false
        // this.loading = false
        // console.log(this.articles)
        // console.log(data)
      } catch (error) {
        this.error = true
        // 返回状态码
        // 507 数据库错误
        // 400 请求参数错误
        // 200 OK
        const stu = error.response.status
        if (stu === 400) {
          throw new Error('请求参数错误')
        } else {
          this.$toast.fail('刷新重试')
        }
      } finally {
        // finally表示无论在try/catch中是否执行都不会去影响finally中的语句的执行(公共语句可以放在这里)
        this.loading = false
        // 将下拉刷新状态手动设置为false
        this.refreshing = false
      }
    },
    // 点击文章项跳转到对应文章页面
    toContent (id) {
      this.$router.push({
        name: 'articleinfo',
        params: {
          art_id: id
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
