<template>
  <div>
    <!-- 标题导航栏S -->
    <van-nav-bar class="navbar">
      <template #title>
        <van-button round @click="$router.push('/search')">
          <van-icon name="search" />
          搜索
        </van-button>
      </template>
    </van-nav-bar>
    <!-- 标题导航栏E -->
    <!-- tabs选项卡S -->
    <van-tabs v-model="active">
    <van-tab :title="item.name" v-for="item in myChannels" :key="item.id">
      <ArtistList :id=item.id></ArtistList>
      </van-tab>
    <!-- 更多按钮 -->
    <span class="toutiao toutiao-gengduo" @click="isShowPopup"></span>
  </van-tabs>
    <!-- tabs选项卡E -->
    <!-- 弹出层S -->
<EditChannelPopup ref="popUp" :myChannels=myChannels @delMyChannel=delMyChannel @changeChannel=changeChannel @addChannel=addChannel></EditChannelPopup>
    <!-- 弹出层E -->
  </div>
</template>

<script>
// 导入获取用户的频道的方法
import { getMyChannelsApi, getLocalChannel, setLocalChannel, delMyChannelsApi, addChannelApi } from '@/api'
// 导入那文章列表组件
import ArtistList from './component/ArtistList.vue'
// 引入弹框组件
import EditChannelPopup from './component/EditChannelPopup.vue'
export default {
  components: {
    ArtistList,
    EditChannelPopup
  },
  data () {
    return {
      active: 0,
      myChannels: [],
      isShow: false
    }
  },
  created () {
    this.getMyChannels()
  },
  computed: {
    isLogin () {
      return !!this.$store.state.user.token
    }
  },
  methods: {
    async getMyChannels () {
      try {
        // const { data } = await getMyChannelsApi()
        // this.myChannels = data.data.channels
        // 未登录分2种情况
        // 1：本地有值，从本地取
        // 2：无值，发请求，拿默认值
        if (!this.isLogin) {
          const data = getLocalChannel()
          if (data) {
            this.myChannels = data
          } else {
            const { data } = await getMyChannelsApi()
            this.myChannels = data.data.channels
          }
        } else {
          const { data } = await getMyChannelsApi()
          this.myChannels = data.data.channels
        }
      } catch (error) {
        this.$toast.fail('请重新刷新获取数据！')
      }
    },
    isShowPopup () {
      this.$refs.popUp.isShow = true
    },
    // 删除我的频道
    async delMyChannel (id) {
      this.myChannels = this.myChannels.filter(item => item.id !== id)
      if (!this.isLogin) {
        setLocalChannel(this.myChannels)
      } else {
        // 已登录，发删除请求，删除数据库的频道
        try {
          const res = await delMyChannelsApi(id)
          console.log(res)
        } catch (error) {
          return this.$toast.fial('删除频道失败！')
        }
      }
      this.$toast.success('删除频道成功！')
    },
    // 切换我的频道
    changeChannel (ind) {
      this.active = ind
    },
    // 添加推荐到我的频道
    async addChannel (channel) {
      this.myChannels.push(channel)
      if (!this.isLogin) {
        setLocalChannel(this.myChannels)
      } else {
        try {
          await addChannelApi(channel.id, this.myChannels.length)
        } catch (error) {
          return this.$toast.fail('添加频道成功！')
        }
      }
      this.$toast.success('添加频道成功！')
    }

  }
}
</script>

<style scoped lang="less">
.navbar {
  background-color: #3296fa;
  color: #fff;
  .van-button {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
  }
  :deep(.van-nav-bar__title) {
    max-width: unset;
  }
  .van-button__text {
    color: #fff;
  }
  .van-icon-search {
    color: #fff;
  }
  .van-button--default {
    border: 0.02667rem solid #5babfb;
  }
}
//tabs选项卡
:deep(.van-tabs__wrap) {
  padding-right: 66px;

  .van-tabs__nav {
    padding-left: 0;
    padding-right: 0;

    /* tab标签 */
    .van-tab {
      border: 1px solid #eee;
      width: 200px;
      height: 82px;
    }

    /* tab标签下划线 */
    .van-tabs__line {
      width: 31px;
      height: 6px;
      background-color: #3296fa;
      bottom: 40px;
    }
  }
}

/* 字体图标 */
.toutiao-gengduo {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 99;
  width: 66px;
  height: 82px;
  font-size: 40px;
  line-height: 82px;
  text-align: center;
  opacity: 0.6;
  border-bottom: 1px solid #eee;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 70%;
    width: 1px;
    background-image: url('~@/assets/images/gradient-gray-line.png');
  }

}
// 头部固定的样式
.navbar {
  position: sticky;
  top: 0;
  left: 0;
}
:deep(.van-tabs__wrap) {
  position: sticky;
  top: 92px;
  left: 0;
  z-index: 99;
}
.toutiao-gengduo {
  position: fixed;
  top: 92px;
}

:deep(.van-tabs__content) {
  max-height: calc(100vh - 92px - 82px - 100px);
  overflow: auto;
}
</style>
