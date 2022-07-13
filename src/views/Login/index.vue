<template>
    <div>
        <!-- nav标题导航栏 -->
            <van-nav-bar
                title="登录"
                @click-left="onClickLeft"
                class="navbar"
            >
            <template #left>
                <van-icon name="cross" />
            </template>
            </van-nav-bar>
        <!-- /nav标题导航栏 -->
        <!-- 手机/验证码 -->
            <van-form @submit="onSubmit" class="form">
            <van-field
                v-model="mobile"
                name="mobile"
                placeholder="请输入手机号"
                :rules="[{ required: true, message: '请输入手机号' }]"
            >
            <!-- 使用slot插槽的时候用<template #插槽名>需要显示的内容</template>进行包裹 -->
            <template #label><span class="toutiao toutiao-shouji"></span> </template>
            </van-field>
            <van-field
                v-model="code"
                type="password"
                name="code"
                placeholder="请输入验证码"
                :rules="[{ required: true, message: '请输入验证码' }]"
            >
            <template #label>
                <span class="toutiao toutiao-yanzhengma"></span>
            </template>
            <template #right-icon> <van-button size="mini" round class="yzm-btn">获取验证码</van-button></template>
            </van-field>
            <!-- 登录按钮 -->
            <div style="margin: 16px;">
                <van-button  block type="info" native-type="submit">提交</van-button>
            </div>
             <!--/ 登录按钮 -->
            </van-form>
        <!-- /手机/验证码 -->
    </div>
</template>

<script>
// 引入登录请求方法
import { loginApi } from '@/api/user'
export default {
  name: 'Login',

  data () {
    return {
      mobile: '',
      code: ''
    }
  },

  mounted () {

  },

  methods: {
    onClickLeft () {
    },
    async onSubmit () {
      try {
        const res = await loginApi(this.mobile, this.code)
        console.log(res)
      } catch (error) {

      }
    }
  }
}
</script>

<style lang="less" scoped>
// nav标题导航含样式
.navbar {
    background-color:#3296fa;
    // :deep(需要进行样式穿透的类名)
    .van-nav-bar__title{
        color: #fff
    }
    .van-icon{
        color: #fff
    }
}

// 表单样式
/deep/.form{
    .van-cell__value{
        flex:20;
    }
    .van-field__label{
        flex:1
    }
    .toutiao{
        font-size: 37px;
    }
    .btn-login-wrap{
        background:#6db4fb;
    }
    .yzm-btn{
        padding: 0 15px;
        background-color: #eee;
        color: #666
    }
}

</style>
