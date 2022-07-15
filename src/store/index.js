import Vue from 'vue'
import Vuex from 'vuex'
// 导入封装好的存入本地的类
// import stroage from '@/utils/stroage'
import { getToken, setToken } from '@/utils'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    // 定义要保存的变量
    // 这里保留一个 || {}  因为在后面使用的时候是 user.token 来进行取出使用的，但是如果第一次进入的时候没有登录不存在user,就会是null.token，那么就会报错，所以兜底给一个空对象，避免后期使用报错
    user: getToken() || {}
  },
  mutations: {
    // 定义修改该变量的方法
    setUser (state, payload) {
      state.user = payload
      // 存入本地存储
      setToken(state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
