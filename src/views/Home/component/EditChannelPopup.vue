<template>
     <van-popup v-model="isShow" position="bottom" :style="{ height: '90%' }" round closeable close-icon-position='top-left'>
     <!-- 弹出层内容S -->
    <div class="popupMain">
        <!-- 我的频道S -->
        <div class="my-channel">
        <!-- 我的频道标题区域S -->
        <div class="my-channel-title">
            <van-cell title="我的频道" >
                <van-button class="edit-btn" size="small" round @click="isEdit = !isEdit">{{isEdit ? '完成' : '编辑'}}</van-button>
            </van-cell>
        </div>
        <!-- 我的频道标题区域E -->
        <!-- 我的频道内容区域S -->
        <div class="my-channel-content">
        <van-grid :border="false" gutter="10px">
            <van-grid-item :text="item.name" v-for="(item,index) in myChannels" :key="item.id" :class="{'active-channel':item.name=='推荐'}" @click="delMychannel(item.id,index)"> <template #icon><van-icon name="close" v-show="isEdit && item.name !== '推荐' "/> </template>  </van-grid-item>
        </van-grid>
        </div>
        <!-- 我的频道内容区域E -->
        </div>
        <!-- 我的频道E -->
        <div class="recommend-channel">
            <!-- 推荐频道S -->
        <van-cell title="推荐频道"></van-cell>
        <!-- 内容区域S -->
         <van-grid :border="false" gutter="10px">
            <van-grid-item :text="item.name" icon="plus" v-for="item in recommendChannels" :key="item.id" @click="addChannel(item)"/>
        </van-grid>
        <!-- 内容区域E -->
        <!-- 推荐频道E -->
        </div>
    </div>
     <!-- 弹出层内容E -->
    </van-popup>
</template>

<script>
// 引入获取所有频道列表的API
import { getAllChannelApi } from '@/api'
export default {
  name: 'EditChannelPopup',
  props: {
    myChannels: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isShow: false,
      allChannels: [],
      isEdit: false
    }
  },
  created () {
    this.getAllChannel()
  },
  mounted () {

  },

  methods: {
    async getAllChannel () {
      const { data } = await getAllChannelApi()
      this.allChannels = data.data.channels
      // console.log(data)
    },
    // 删除父组件中传过来的数组元素，子传父
    delMychannel (id, index) {
      if (this.isEdit && id !== 0) {
        return this.$emit('delMyChannel', id)
      }
      // 处于完成状态/未编辑状态
      if (!this.isEdit) {
        // 跳转切换之前先关闭弹出层
        this.isShow = false
        // 将当前点击的索引值传递到父组件中进行切换
        this.$emit('changeChannel', index)
      }
    },
    // 添加子组件中传过来的数组元素，子传父
    addChannel (item) {
      this.$emit('addChannel', { ...item })
    }
  },
  computed: {
    // 推荐频道 = 全部频道 - 我的频道
    recommendChannels () {
      return this.allChannels.filter(item => {
        return !this.myChannels.find((el) => el.id === item.id)
        // id(res){
        //     return false
        // }else{
        //      return true
        // }
        // return !res
      })
    }
  }
}
</script>

<style lang="less" scoped>
// 高亮频道
.active-channel{
    :deep(.van-grid-item__text){
      color:green
    }
}
.popupMain{
    padding-top:100px;
    .edit-btn{
        color: #ff0000;
        padding:0 30px;
        height: 48px;
        border:0.02667rem solid #ff3c3c
    }
    // 我的频道的样式
    .my-channel-content {
    :deep(.van-grid-item__content) {
      position: relative;
      height: 86px;
        background-color: #eee;

      .van-grid-item__icon-wrapper {
        position: absolute;
        top: -20px;
        right: -20px;
        .van-icon-cross {
          position: absolute;
          top: 0;
          right: 0;
          transform: translate(20%, -35%);
          border: 0.02667rem solid #000;
          border-radius: 50%;
          text-align: center;
          line-height: 0.32rem;
        }
      }
    }
  }
    // 推荐频道的样式
  .recommend-channel {
    // 推荐频道加号样式
    :deep(.van-grid-item__content) {
      flex-direction: row;
        height: 86px;
        background-color: #eee;
      .van-grid-item__icon {
        font-size: 0.5rem;
      }

      .van-grid-item__text {
        margin-top: 0;
      }
    }
  }

}
</style>
