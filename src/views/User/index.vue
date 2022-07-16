<template>
    <div class="hm-user">
      <!-- 头部标题栏S -->
    <header>
        <van-nav-bar
        title="个人信息"
        left-arrow
        @click-left="onClickLeft"
        class="nav-head"
        />
    </header>
      <!-- 头部标题栏E -->

      <!-- 个人信息展示区S -->
      <div class="user-info">
        <van-cell-group>
        <van-cell title="头像" is-link><div slot="default">11</div></van-cell>
        <van-cell title="昵称" :value="userInfo.name" is-link/>
        <!-- <van-cell title="性别" :value="gender[userInfo.gender]" is-link/> -->
        <van-cell is-link @click="showPopup">展示弹出层</van-cell>
        <van-popup v-model="show" position="bottom" :style="{ height: '50%' }">内容</van-popup>
        <van-cell is-link @click="showPopup" title="生日" :value="userInfo.birthday"></van-cell>
        <van-popup v-model="show" position="bottom" :style="{ height: '50%' }"><van-datetime-picker
            v-model="currentDate"
            type="date"
            title="选择年月日"
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
import { getUserMaterialApi } from '@/api'
export default {
  name: 'ToutiaoMIndex',

  data () {
    return {
      userInfo: {},
      gender: { 0: '女', 1: '男' },
      show: false,
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(2021, 0, 17)
    }
  },
  created () {
    this.getUserInfo()
  },
  mounted () {

  },

  methods: {
    onClickLeft () {
      this.$router.back()
    },
    async getUserInfo () {
      try {
        const res = await getUserMaterialApi()
        console.log(res)
        this.userInfo = res.data.data
      } catch (error) {

      }
    },
    showPopup () {
      this.show = true
    }
  }
}
</script>

<style lang="less" scoped>
header{
    :deep(.van-nav-bar__content){
        background-color: #3296fa;
        .van-nav-bar__title{
            color: #fff;
        }
        .van-icon-arrow-left{
            color: #fff;
        }
    }
}
</style>
