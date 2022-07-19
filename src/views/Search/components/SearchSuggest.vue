<template>
    <div>
        <van-cell icon="search" v-for="item,index in highlighSuggest" :key="index">
          <span slot="title" v-html="item"></span>
        </van-cell>
    </div>
</template>

<script>
// 引入获取联想建议（自动补全）API
import { getSearchsuggestionApi } from '@/api'
export default {
  name: 'ToutiaoMSearchSuggest',
  props: {
    keyword: {
      type: String, //
      required: true
    }
  },
  data () {
    return {
      searchList: []
    }
  },
  computed: {
    // 高亮建议关键词
    highlighSuggest () {
      // 生成一个正则对象
      const reg = new RegExp(this.keyword, 'ig')
      return this.searchList.map((str) => str.replace(reg, (match) => `<span style="color:red">${match}</span>`))
    }
  },
  // 设置一个监视属性，监视父组件中传过来的keyword值的变化，如果发生变化了就立即出发发起请求的api获取最新的搜索联想建议数据
  watch: {
    keyword: {
      handler () {
        this.getSearchsuggestion()
      },
      immediate: true
    }
    // keyword: 'getSearchsuggestion',
    // immediate: true
    // keyword: 'getSearchsuggestion'  ==>  当监视属性后面跟的函数是当前组件中的methods中定义的方法是，可以直接使用该种简便写法
  },
  mounted () {

  },

  methods: {
    async getSearchsuggestion () {
      const res = await getSearchsuggestionApi(this.keyword)
      this.searchList = res.data.data.options.filter(Boolean)
      if (this.searchList.length === 0) {
        this.$toast.fail('搜索建议暂无数据！')
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
