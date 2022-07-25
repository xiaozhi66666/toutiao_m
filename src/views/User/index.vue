<template>
  <div class="hm-user">
    <!-- 头部标题栏S -->
    <header>
      <van-nav-bar
        title="个人信息"
        left-arrow
        @click-left="toBackMy"
        class="nav-head"
      />
    </header>
    <!-- 头部标题栏E -->

    <!-- 个人信息展示区S -->
    <div class="user-info">
      <van-cell-group>
        <input
          type="file"
          hidden
          multiple
          ref="uploadFile"
          accept=".jpg,.png"
        />
        <van-cell title="头像" is-link @click="updateUserAvatar">
          <van-image width="30" height="30" :src="userInfo.photo" round />
        </van-cell>
        <!-- 弹出层 -->
        <van-popup v-model="show" v-if="show">
          <Avatar
            :photo="photo"
            @cancelShow="cancelShow"
            @confirm="confirm"
          ></Avatar>
        </van-popup>

        <van-cell
          title="昵称"
          :value="userInfo.name"
          is-link
          @click="isShowEditPopup = true"
        />
        <van-popup
          v-model="isShowEditPopup"
          position="bottom"
          :style="{ height: '100%' }"
        >
          <!-- 标题 -->
          <van-nav-bar
            title="标题"
            left-text="取消"
            right-text="保存"
            @click-left="toBackEditInfo"
            @click-right="onConfirmUpdate"
          />
          <!-- 文本输入框 -->
          <van-field
            v-model="updateNickName"
            rows="2"
            autosize
            label="输入新昵称："
            type="textarea"
            maxlength="8"
            placeholder="输入新昵称~~"
            show-word-limit
          />
        </van-popup>
        <van-cell
          is-link
          @click="showSex = true"
          title="性别"
          :value="sex"
        ></van-cell>
        <van-popup
          v-model="showSex"
          position="bottom"
          :style="{ height: '50%' }"
        >
          <van-picker
            title="性别"
            show-toolbar
            :columns="columns"
            @confirm="onConfirmEditSex"
            @cancel="showSex = false"
            :default-index="sexIndex"
          />
        </van-popup>
        <van-cell
          is-link
          @click="showBirthday = true"
          title="生日"
          :value="userInfo.birthday"
        ></van-cell>
        <van-popup
          v-model="showBirthday"
          position="bottom"
          :style="{ height: '50%' }"
          ><van-datetime-picker
            v-model="currentDate"
            type="date"
            title="选择年月日"
            @cancel="showBirthday = false"
            @confirm="onChangeshowBirthday"
            :min-date="minDate"
            :max-date="maxDate"
          />
        </van-popup>
        <!-- <van-cell title="生日"  is-link/> -->
      </van-cell-group>
    </div>
    <!-- 个人信息展示区E -->
  </div>
</template>

<script>
import Avatar from './components/AvaterPopup.vue'

import { getUserMaterialApi, setUserInfoAPI } from '@/api'
import dayjs from 'dayjs'
export default {
  name: 'ToutiaoEdit',
  components: { Avatar },

  data () {
    return {
      userInfo: {}, // 获取到的用户信息
      gender: { 0: '男', 1: '女' },
      showSex: false, // 性别展示弹出层
      showBirthday: false, // 生日展示弹出层
      minDate: new Date(1900, 0, 1), // 生日选择最小
      maxDate: new Date(2022, 10, 1), // 生日选择最大
      currentDate: '', // 当前默认选中生日
      columns: ['男', '女'],
      isShowEditPopup: false, // 展示填写昵称的弹出层
      updateNickName: '', // 用户输入的昵称
      data: '',
      indexOfSex: '',
      photo: '', // 保存当前确认选择的性别的索引值
      show: false
    }
  },
  created () {
    this.getUserInfo()
  },
  mounted () {
    // 在DOM元素更新完成之后，文件上传之后会触发自身的cahange事件，监听文件上传框的change事件，利用事件对象e.target捕捉到上传完成的文件
    this.$refs.uploadFile.addEventListener('change', (e) => {
      // 其捕捉到的事件对象e中的e.target中会携带一盒files伪数组数据，在其原型对象的原型对象Blob上存放着该文件的base64格式的文件数据
      console.log(e)
      // 定义一个常量接收e.target.files伪数组中的文件对象，因为这里只上传一个文件，所以直接[0]接收即可
      // 第一种方法，URL.createObjectURL() 静态方法会创建一个 DOMString，其中包含一个表示参数中给出的对象的 URL。这个 URL 的生命周期和创建它的窗口中的 document 绑定。这个新的 URL 对象表示指定的 File 对象或 Blob 对象。
      const file = e.target.files[0]
      // file = URL.createObjectURL(file) // 将file对象转换成图片可识别的url
      const fr = new FileReader()
      fr.readAsDataURL(file)

      fr.onload = (e) => {
        this.photo = e.target.result
        this.show = true
      }
    })
  },
  computed: {
    sex () {
      return this.gender[this.sexIndex]
    },
    sexIndex () {
      return this.userInfo.gender
    },
    // photo () {
    //   return this.userInfo.photo
    // },
    isLogin () {
      return this.$store.state.user.token
    }
  },
  // watch: {
  //   photoAvater: {
  //     handler (newVal) {
  //       if (newVal) {
  //         this.$nextTick(() => {
  //           const img = this.$refs.avaterImg
  //           this.myCropper = new Cropper(img, {})
  //         })
  //       } else {
  //         this.myCropper = null
  //       }
  //     },
  //     immediate: true
  //   }
  // },

  methods: {
    // 编辑个人信息页面左箭头,返回我的页面
    toBackMy () {
      this.$router.back()
    },
    // 获取用户的信息
    async getUserInfo () {
      if (!this.isLogin) {
        return this.$toast.fail('请重新登录后再进行编辑')
      }
      try {
        const res = await getUserMaterialApi()
        this.userInfo = res.data.data
        // 将获取到的生日赋值给默认生日绑定的变量
        this.currentDate = new Date(this.userInfo.birthday)
      } catch (error) {
        this.$toast.fail('服务器开了点小差，请稍后重试！')
      }
    },
    // 编辑昵称页面返回到个人信息编辑页面
    toBackEditInfo () {
      // 关闭弹出层
      this.isShowEditPopup = false
    },
    // 保存用户更新后的昵称
    onConfirmUpdate () {
      if (this.updateNickName.trim().length === 0) {
        this.isShowEditPopup = true
        return this.$toast.fail('请输入0~8位的有效昵称！')
      }
      // 将得到的更新后的昵称赋值给
      this.userInfo.name = this.updateNickName
      // 关闭弹出层
      this.isShowEditPopup = false
      // 发起编辑用户信息的请求
      this.setUserInfo()
    },
    // 确认编辑性别
    onConfirmEditSex (value, index) {
      // 第一步：首先关闭弹层
      this.showSex = false
      this.userInfo.gender = index
      // 发起编辑用户信息的请求
      this.setUserInfo()
      // this.indexOfSex = index
    },
    // 确认生日
    onChangeshowBirthday () {
      // 第一步： 首先我们在这里得到的currentDate是时间毫秒戳，那如果需要传递给组件绑定的currentTime时需要先将其会转换成对应的YYYY-MM-DD格式再进行赋值
      const currentTime = dayjs(this.currentDate).format('YYYY-MM-DD')
      // 第二步；赋值给时间展示组件绑定的 v-model值
      this.userInfo.birthday = currentTime
      // 发起编辑用户信息的请求
      this.setUserInfo()
      // 再关闭弹层
      this.showBirthday = false
    },
    // 发送更新用户信息的请求
    async setUserInfo () {
      try {
        const res = await setUserInfoAPI(
          this.updateNickName,
          this.userInfo.gender,
          this.userInfo.birthday
        )
        if (res.status === 200) {
          return this.$toast.success('修改用户信息成功！')
        }
      } catch (error) {
        return this.$toast.fail('修改用户信息失败！请稍后重试')
      }
    },
    // 点击更换头像
    updateUserAvatar () {
      // 获取事先隐藏好的文件上传框，触发其点击事件
      this.$refs.uploadFile.click()
    },
    // 子传父，取消展示弹出层
    cancelShow () {
      this.show = false
    },
    confirm (photo) {
      // 修改小头像
      this.userInfo.photo = photo
      // 关闭弹出层
      this.show = false
    }
  }
}
</script>

<style lang="less" scoped>
header {
  :deep(.van-nav-bar__content) {
    background-color: #3296fa;
    .van-nav-bar__title {
      color: #fff;
    }
    .van-icon-arrow-left {
      color: #fff;
    }
  }
}
</style>
