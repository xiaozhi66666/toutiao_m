<template>
  <div class="my">
    <!-- 头部S -->
    <header>
      <!-- 登录的盒子 -->
      <div class="user-info banner" v-if="isLogin">
        <!-- 占位 -->
        <van-row></van-row>
        <!-- 展示用户信息 -->
        <van-row class="row2">
        <van-col span="12">
        <van-row  type="flex" align='center' justify='space-around'>
            <!-- 头像 -->
        <van-image
        round
        width="1.75rem"
        height="1.75rem"
        :src="this.userInfo.photo"
      />
      <!-- 手机号 -->
      <span class="mobile">{{userInfo.name}}</span>
      </van-row>
      </van-col>
          <van-col span="11" type="flex" align="end" justify="center">
            <van-row><van-button size="mini" round class="yzm-btn" to="/user">编辑资料</van-button></van-row>
          </van-col>
        </van-row>
        <van-row >
        <van-grid class="grid" :border="false">
          <van-grid-item  text="头条"><template #icon>{{userInfo.art_count}}</template></van-grid-item>
          <van-grid-item  text="粉丝"><template #icon>{{userInfo.fans_count}}</template></van-grid-item>
          <van-grid-item  text="关注"><template #icon>{{userInfo.follow_count}}</template></van-grid-item>
          <van-grid-item  text="获赞"><template #icon>{{userInfo.like_count}}</template></van-grid-item>
        </van-grid>
        </van-row>

      </div>
      <!-- 未登录的盒子 -->
      <div class="login-register banner" v-else>
        <div class="login-avntar">
          <div class="warp" @click="goLogin">
            <img src="~@/assets/images/mobile.png" alt="">
            <span>登录 / 注册</span>
          </div>
        </div>
      </div>
    </header>
    <!-- 头部E -->
    <!-- 主体区域S -->
    <main>
      <!-- 历史/搜索 -->
      <van-grid :column-num="2" class="grid" clickable>
        <van-grid-item text="收藏" ><template #icon>  <span class="toutiao toutiao-shoucang"></span>  </template></van-grid-item>
        <van-grid-item text="历史" ><template #icon>  <span class="toutiao toutiao-lishi"></span>  </template></van-grid-item>
      </van-grid>
      <!-- 消息通知/小智同学 -->
              <van-cell-group>
          <van-cell title="消息通知" is-link />
          <van-cell title="小智同学" is-link />
        </van-cell-group>

    </main>
    <!-- 主体区域E -->
    <!-- 退出按钮S -->
    <van-button  v-if="isLogin" block class="login-exit" @click="loginExit">退出</van-button>
    <!-- 退出按钮E -->
  </div>
</template>

<script>
// 导入获取用户个人信息的请求方法
import { getUserInfoApi } from '@/api'
export default {
  data () {
    return {
      userInfo: {}
    }
  },
  computed: { isLogin () { return !!this.$store.state.user.token } },
  created () {
    this.getUserInfo()
  },
  methods: {
    loginExit () { // 退出登录
      this.$dialog.confirm({
        title: '黑马头条',
        message: '是否确认退出该账号？'
      })
        .then(() => {
          // on confirm
          this.$store.commit('setUser', {})
        })
        .catch(() => {
          // on cancel
        })
      // 将vuex中的user重置为空对象
    },
    goLogin () {
      this.$router.push('/login')
    },
    async getUserInfo () {
      if (this.isLogin) {
        try {
          const res = await getUserInfoApi()
          console.log(res)
          // const {data:data} = res.data.data
          this.userInfo = res.data.data
          console.log(this.userInfo)
        } catch (error) {
          this.$toast.fail('请重新登录！')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.my{
  background-color: #f5f7f9;
  height:calc(100vh - 100px)
}
.banner{
  width: 100%;
  height: 400px;
  background: url('../../assets/images/banner.png') no-repeat center / cover
}

.user-info{
  display: flex;
  flex-direction: column;
  .van-col{
    display: flex;
    flex-direction: column;
    justify-content: space-around
  }
  >.van-row{  //在这里添加一个子代选择器，为了防止以后写在里面的van-row会被这里设置的
    flex:1
  }
  .row-2{
    .van-col{
      height: 100%;
    }
  }

  .mobile{
    font-size: 0.4rem;
    color: #fff;
  }
  .yzm-btn{
        padding: 0 15px;
        background-color: #eee;
        color: #666
    }
    .van-col{
      height: 100%;
    }
    .grid {
    :deep(.van-grid-item__content) {
      background-color: unset;
    }
  }
  .van-grid-item {
    color: #fff;
    font-size: 26px;
    :deep(.van-grid-item__text) {
      color: #fff;
    }
  }
}
// 主推区域
// 主体区域
main {
  .grid {
    color: #646566;
    // 字体图标
    .toutiao {
      font-size: 0.6rem;

      &.toutiao-lishi {
        color: #ffb31d;
      }
      &.toutiao-shoucang {
        color: #ed5253;
      }
    }
  }
}
  .login-exit{
      .van-button__content{
        color: red;
      }
  }
  .login-register{
    display: flex;
    justify-content: center;
    align-items: center;
    .warp{
      display: flex;
      flex-direction: column;
      align-items: center;
      img{
        width: 120px;
        margin-bottom: 20px;
      }
      span{
        font-size: 28px;
        color:#fff;
      }
    }
  }

</style>
