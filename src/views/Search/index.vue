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
          @clear="clear"
        > </van-search>

        <!-- 建议/历史/结果 -->
        <!-- <SearchHistory></SearchHistory>
        <SearchResult></SearchResult>
        <SearchSuggest></SearchSuggest> -->
        <!-- 动态组件 -->
        <component :is="componentNmae" :keyword="keyWord" @changeIsShow = "changeIsShow"></component>
</form>
    </div>
</template>

<script>
// 引入建议/历史/结果组件
import SearchHistory from './components/SearchHistory.vue'
import SearchResult from './components/SearchResult.vue'
import SearchSuggest from './components/SearchSuggest.vue'
// 引入从本地存取值的方法
import stroage from '@/utils/stroage'
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
    },
    SearchHistorylist () {
      return stroage.get('SEARCH_HISTROY') || []
    }
  },

  methods: {
    // 搜索事件
    onSearch () {
      this.isShowResult = true
      // console.log(this.keyWord) // 拿到了当前点击的值
      // 添加判断，如果数组中包含了当前点击的搜索结果就不要再添加了，可以删除掉原来的元素，将这个新重复的元素添加到数组头部
      if (this.SearchHistorylist.indexOf(this.keyWord) === -1) {
        this.SearchHistorylist.unshift(this.keyWord)
        // 将拿到的值存入本地
        stroage.set('SEARCH_HISTROY', this.SearchHistorylist)
      } else {
        const index = this.SearchHistorylist.findIndex(item => item === this.keyWord)
        this.SearchHistorylist.splice(index, 1)
        this.SearchHistorylist.unshift(this.keyWord)
        stroage.set('SEARCH_HISTROY', this.SearchHistorylist)
      }
    },
    // 取消返回上一页
    onCancel () {
      this.$router.go(-1)
    },
    // 获得焦点事件
    showSearchSuggest () {
      this.isShowResult = false
    },
    // 子传父自定义事件
    changeIsShow (componentName) {
      // 将关键词改为子组件传过来的词
      this.keyWord = componentName
      // 触发search事件，直接显示搜索结果
      this.onSearch()
    }
    //
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
