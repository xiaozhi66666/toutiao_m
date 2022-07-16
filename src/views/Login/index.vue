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
            <van-form @submit="onSubmit" class="form" ref="form">
            <van-field
                v-model="mobile"
                name="mobile"
                placeholder="请输入手机号"
                :rules="mobilesRules"
            >
            <!-- 使用slot插槽的时候用<template #插槽名>需要显示的内容</template>进行包裹 -->
            <template #label><span class="toutiao toutiao-shouji"></span> </template>
            </van-field>
            <van-field
                v-model="code"
                type="text"
                name="code"
                placeholder="请输入验证码"

            >
            <template #label>
                <span class="toutiao toutiao-yanzhengma"></span>
            </template>
            <template #right-icon>
                <!-- 倒计时组件 -->
                <van-count-down :time="60*1000" v-if="isCutDownShow" @finish="isCutDownShow=false" format="ss"/>
                 <van-button size="mini" round class="yzm-btn" v-else  @click.prevent="sendcodeFn">获取验证码</van-button>
            </template>
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
import { loginApi, sendCodeApi } from '@/api/user'
// 先引入定义好的校验规则
import { mobilesRules, codeRules } from './rules'
export default {
  name: 'Login',

  data () {
    return {
      mobile: '',
      code: '',
      mobilesRules,
      codeRules,
      isCutDownShow: false

    }
  },

  mounted () {

  },

  methods: {
    onClickLeft () {
      this.$router.back()
    },
    async onSubmit () {
      this.$toast.loading({
        message: '正在登录中...', // 登录中的 提示语句
        forbidClick: true // loading时禁止点击页面
      })
      try {
        const res = await loginApi(this.mobile, this.code)
        // console.log(res)
        // 向vuex中添加用户token
        this.$store.commit('setUser', res.data.data)
        // 跳转到profile
        this.$router.push('/profile')
        this.$toast.success('登录成功')
      } catch (error) {
        const stu = error.response.status
        console.log(error)
        let msg = '登录错误，请刷新~'
        if (stu === 400) {
          msg = error.response.data.message
          this.$toast.fail(msg)
        }
        this.$toast.fail('登录失败')
        // switch (stu) {
        //   // 400的错误
        //   case 400:this.$toast.fail(error.response.data.message)
        //     break
        //     // 507服务端的错误
        //   case 507:this.$toast.fail('登录错误，请刷新重试！')
        //     break
        //     // 其他错误，兜底，防止后端返回状态码不对的提示
        //   default:this.$toast.fail('登录错误，请刷新重试！')
        //     break
        // }
        // this.$toast.fail('登录失败')
      }
    },
    async sendcodeFn () {
      try {
      // 1:验证手机号
        await this.$refs.form.validate('mobile')
        // 2：发起获取验证码的请求
        await sendCodeApi(this.mobile)

        // 3：手机号格式正确显示倒计时
        this.isCutDownShow = true
      } catch (error) {
        // 1：表单校验失败，捕捉不到error.response
        if (!error.response) {
          this.$toast.fail('请填写有效手机号再进行发送验证码')
        } else {
          // 验证码导致的失败
        //   获取错误状态的status
          const stu = error.response.status
          // 根据返回的错误状态码来显示不同的后台返回的error.response.data.message
          if (stu === 404 || stu === 429) {
            this.$toast.fail(error.response.data.message)
          }
        }
      }
    },
    increate () {
    // 通过$store.state.commit('设置值的方法名','需要传的参数')

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
