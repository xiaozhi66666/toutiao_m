<template>

        <!-- 头部标题栏S -->
        <div class="header">
            <van-nav-bar
            :title="title"
            :left-arrow="zjt"
            @click-left="onClickLeft"
            @jump="onClickLeft"
        />
        </div>
        <!-- 头部标题栏E -->

</template>

<script>
export default {
  name: 'HaokeRoomHeader',
  props: {
    title: {
      type: String,
      default: '标题'
    },
    zjt: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {

    }
  },

  mounted () {

  },

  methods: {
    // 子组件内再触发vant绑定的左箭头的点击事件，跳转回去
    onClickLeft () {
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.header{
        .van-nav-bar__content{
            background-color:#21b97a;
            position:fixed;
            width: 100%;
          .van-nav-bar__left{
              color:#fff;
                 .van-icon{
                    color:#fff;
                }
           }
           .van-nav-bar__title {
            color:#fff;
           }
        }
    }

</style>
