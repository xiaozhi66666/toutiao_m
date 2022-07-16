<template>
  <div>

    <router-view></router-view>
    <van-tabbar class="nav-foot" route>
      <van-tabbar-item to="/ ">
          <span class="toutiao toutiao-shouye" slot="icon"></span>
          <p>首页</p>
      </van-tabbar-item>
          <van-tabbar-item to="/video">
          <span class="toutiao toutiao-shipin" slot="icon"></span>
          <p>视频</p>
      </van-tabbar-item>
           <van-tabbar-item to="/qa">
          <span class="toutiao toutiao-wenda" slot="icon"></span>
          <p>问答</p>
      </van-tabbar-item>
          <van-tabbar-item to="/profile">
          <span class="toutiao toutiao-wode" slot="icon"></span>
          <p>{{$store.state.user.token ? "我的" : "未登录"}}</p>
      </van-tabbar-item>
    </van-tabbar>
    </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style scoped lang="less">
/deep/.nav-foot{
    .van-tabbar-item{
      .van-tabbar-item__icon{
          .toutiao{
         font-size: .53333rem;
          }
      }
      .van-tabbar-item__text{
        height: 50px;
        p{
          margin-top:3px;
          margin-bottom: 0;
        }
      }

    }
}
</style>
