<template>
    <div>
       <van-cell-group >
        <van-cell title="搜索历史" class="search-histroy-del">
          <!-- 删除图标 -->
          <div v-if="!isShowDel"> <span slot="default"><van-icon name="delete-o" @click="isShowDel=!isShowDel" /></span></div>
          <!-- 删除编辑文字 -->
          <div v-if="isShowDel"> <span slot="default" @click="delAll">全部删除</span>
          <span slot="default"  @click="isShowDel=false">完成</span></div>
        </van-cell>
      </van-cell-group>
       <van-cell-group v-for="item,index in searchHistroyList" :key="index">
        <van-cell :title="item" @click="changeIsShow(item)">
          <span slot="default"><van-icon name="close" v-show="isShowDel" @click="delCurrent(index)"/></span>
        </van-cell>
      </van-cell-group>
    </div>
</template>

<script>
// 引入从本地存取值的方法
import stroage from '@/utils/stroage'
export default {
  name: 'ToutiaoMSearchHistory',
  props: {
    keyword: {
      type: String, // 关键词
      required: true
    }
  },
  data () {
    return {
      isShowDel: false, // 控制是否展示删除图标等
      searchHistroyList: stroage.get('SEARCH_HISTROY') || [] // 从本地取出搜索历史列表
    }
  },
  computed: {
  },

  mounted () {

  },

  methods: {
    // 删除全部
    delAll () {
      // 搜索历史列表设置为空
      this.searchHistroyList = []
      // 清空本地
      stroage.remove('SEARCH_HISTROY')
    },
    // 删除当前项历史记录
    delCurrent (index) {
      // 删除指定索引位置的元素
      this.searchHistroyList.splice(index, 1)
      // 将最新的搜索历史列表赋值到本地
      stroage.set('SEARCH_HISTROY', this.searchHistroyList)
    },
    changeIsShow (searchResult) {
      // 添加判断，如果在编辑删除状态就不要让其触发跳转功能
      if (this.isShowDel) {
        return
      }
      this.$emit('changeIsShow', searchResult)
    }
  }
}
</script>

<style lang="less" scoped>
.search-histroy-del{
    :deep(.van-cell__value){
      span{
        padding:0 5px;
      }
    }
}

</style>
