<template>
    <div @click="toContent(articleInfo.art_id)">
      <!-- 无图片 -->
      <van-cell :title="articleInfo.title" :label="articleDesc" v-if="articleInfo.cover.type===0"/>
      <!-- 1张图片 -->
      <van-cell :title="articleInfo.title" :label="articleDesc" v-if="articleInfo.cover.type===1">
        <van-image
        width="3rem"
        height="2rem"
        :src="articleInfo.cover.images[0]"
        />
      </van-cell>
      <!-- 3张图片 -->
      <van-cell :title="articleInfo.title" :label="articleDesc" v-if="articleInfo.cover.type===3"> <template #label>
        <van-image
        width="3rem"
        height="2rem"
        :src="item"
        v-for="item,index in articleInfo.cover.images"
        :key="index"
        />
        <span>{{articleDesc}}</span>
        </template>
      </van-cell>
    </div>
</template>

<script>
// 从utils中引入已经配置好了的时间格式化包dayjs
import dayjs from '@/utils/dayjs'

export default {
  name: 'ToutiaoMArtistListItem',
  props: {
    articleInfo: {
      type: Object,
      require: true
    }
  },
  computed: {
    articleDesc () {
      const art = this.articleInfo
      // 按照要求使用时间格式化工具格式化时间之后再进行输出
      const time = dayjs(art.pubdate).fromNow()
      return `${art.aut_name} ${art.comm_count}评论 ${time}`
    }
  },
  data () {
    return {

    }
  },

  mounted () {
  },

  methods: {
    toContent (id) {
      // 获取到当前点击到的文章的art_id值，保存，发起请求获取文章详情数据
      this.$router.push({
        name: 'articleinfo',
        params: {
          id
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.van-image{
  padding: 0 1px;
}

</style>
