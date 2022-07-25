<template>
  <div class="PopuoBody">
    <div class="userAvaterPopuo">
      <div class="img-container">
        <van-loading
          size="40px"
          vertical
          type="spinner"
          color="#1989fa"
          v-show="isShowLoding"
          >上传中...</van-loading
        >
        <img :src="photo" alt="" ref="avaterImg" />
      </div>
    </div>
    <div class="footer">
      <van-cell
        ><span slot="title" @click="cancelShow">取消</span>
        <span @click="confirm">确认</span></van-cell
      >
    </div>
  </div>
</template>

<script>
// 引入图片裁剪工具Cropper
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { setUserAvatarAPI } from '@/api'
export default {
  name: 'ToutiaoMAvaterPopup',
  props: ['photo'],
  data () {
    return {
      showImg: false, // 是否展示裁剪头像弹出框
      photoAvater: '', // 展示在弹出层的图片路径
      afterImg: '', // 裁剪完成后的图片
      myCropper: '',
      isShowLoding: false
    }
  },

  mounted () {
    const img = this.$refs.avaterImg
    this.myCropper = new Cropper(img, {
      viewMode: 2,
      dragMode: 'move',
      initialAspectRatio: 1,
      aspectRatio: 1,
      //   preview: '.before',
      guides: true,
      //   background: false,
      autoCropArea: 1
      //   zoomOnWheel: false
    })
  },

  methods: {
    confirm () {
      this.isShowLoding = true
      const fm = new FormData()
      this.myCropper.getCroppedCanvas().toBlob(async (blob) => {
        fm.append('photo', blob)
        try {
          const res = await setUserAvatarAPI(blob)
          if (res.status === 200) {
            // 关闭加载
            this.isShowLoding = false
            // 关闭弹层，将远端存放保存后的图片路径传递给父组件，展示出最新的头像图片
            this.$emit('confirm', res.data.data.photo)
            this.$toast.success('上传头像成功！')
          }
        } catch (error) {
          this.$toast.fail('上传头像失败，请稍后重试!')
        }
      })
    },
    // 取消展示弹出层
    cancelShow () {
      this.$emit('cancelShow')
    }
  }
}
</script>

<style lang="less" scoped>
:deep(.van-overlay) {
  position: relative;
  // height: 100%;
  .footer {
    position: absolute;
    bottom: 0;
  }
}
.userAvaterPopuo {
  position: relative;
  background-color: #e3e3e3;
  display: flex;
  align-items: center;
  justify-content: center;
  .van-cell {
    position: absolute;
    bottom: 0;
    color: #333;
    z-index: 99999999999;
  }
  .before {
    width: 100px;
    height: 100px;
    overflow: hidden;
    /* 这个属性可以得到想要的效果 */
  }
  .img-container {
    width: 750px;
    height: 750px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }

    :deep(.van-loading) {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 999;
    }
  }
}
</style>
