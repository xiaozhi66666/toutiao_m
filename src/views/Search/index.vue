<template>
    <div>
        <!-- Search -->
        <form action="/">
        <van-search
          v-model="keyWord"
          show-action
          placeholder="请输入搜索关键词"
          @search="onSearch"
          @cancel="onCancel"
          background="#3296fa"
          class="search"
          @focus="showSearchSuggest"
        />

        <!-- 建议/历史/结果 -->
        <!-- <SearchHistory></SearchHistory>
        <SearchResult></SearchResult>
        <SearchSuggest></SearchSuggest> -->
        <!-- 动态组件 -->
        <component :is="componentNmae" :keyword="keyWord"></component>
</form>
    </div>
</template>

<script>
// 引入建议/历史/结果组件
import SearchHistory from './components/SearchHistory.vue'
import SearchResult from './components/SearchResult.vue'
import SearchSuggest from './components/SearchSuggest.vue'

export default {
  name: 'ToutiaoMIndex',
  components: { SearchHistory, SearchResult, SearchSuggest },
  data () {
    return {
      keyWord: '',
      isShowResult: false
    }
  },

  mounted () {

  },
  computed: {
    componentNmae () {
      // 如果为空，显示历史
      if (this.keyWord.trim().length === 0) {
        return 'SearchHistory'
      }
      // 如果按了回车，显示结果
      if (this.isShowResult) {
        return 'SearchResult'
      }
      // 如果不属于上面，显示建议
      return 'SearchSuggest'
    }
  },

  methods: {
    // 搜索事件
    onSearch () {
      this.isShowResult = true
      console.log(111)
    },
    // 取消返回上一页
    onCancel () {
      this.$router.go(-1)
    },
    // 获得焦点事件
    showSearchSuggest () {
      this.isShowResult = false
    }
  }
}
</script>

<style lang="less" scoped>
.search{
  [role="button"]{
    color: #fff
  }
}

</style>
