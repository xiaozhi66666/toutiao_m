<template>
    <div>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :error.sync="error"
      >
  <van-cell-group>
          <van-cell :title="item.title" v-for="item in searchResults" :key="item.art_id"/>
        </van-cell-group>
</van-list>

    </div>
</template>

<script>
import { getSearchResultApi } from '@/api'
export default {
  name: 'ToutiaoMSearchResult',
  props: {
    keyword: {
      type: String, // 关键词
      required: true
    }
  },
  data () {
    return {
      searchResults: [], // 存放搜索结果的列表
      // searchAllList: []
      loading: false,
      finished: false,
      page: 1, // 当前页码数
      limit: 20, // 一次请求获取的数量
      timer: null, // 定义定时器的常量名
      error: false // 是否加载失败，加载失败后点击错误提示可以重新触发load事件，必须使用sync修饰符

    }
  },

  mounted () {

  },
  created () {
    this.getSearchsuggestion()
  },
  methods: {
    // 获取搜索结果的列表
    async getSearchsuggestion () {
      try {
        const res = await getSearchResultApi(this.page, this.limit, this.keyword)
        this.searchResults = res.data.data.results
        if (this.searchResults.length === 0) {
          this.$toast.fail('搜索建议暂无数据！')
        }
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
        this.$toast.fail('获取数据失败，请稍后重试！')
      }
    },
    // 正处于加载期间
    onLoad () {
      try {
        this.timer = setTimeout(async () => {
          // page++
          this.page++
          const res = await getSearchResultApi(this.page, this.limit, this.keyword)
          console.log(res)
          this.searchResults.push(...res.data.data.results)
          this.loading = false
          // 如果后台返回的数据为空，那就结束loading，将finished设置为空
          if (res.data.data.results.length === 0) {
            this.finished = true
          }
        }, 1000)
      // getSearchsuggestion()
      } catch (error) {

      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
