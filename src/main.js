import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入字体图标css
import '@/assets/toutiao-icon.css'
import '@/assets/fonts/iconfont.css'
// 引入html解构识别
import showdown from 'showdown'
import hljs from 'highlight.js'
import 'highlight.js/styles/default.css'
// 引入全局vant组件
import Vant from 'vant'
import 'vant/lib/index.css'
// 引入 包 amfe-flexible 使用其动态设置 REM 基准值（html 标签的字体大小）  1/10视口宽度
import 'amfe-flexible'

// 定义一个全局过滤器,全局可使用，按要求格式化时间
import dayjs from '@/utils/dayjs'
Vue.filter('timeFormat', (el) => {
  const time = dayjs(el).fromNow()
  return time
})

Vue.use(Vant)
Vue.use(dayjs)
Vue.use(hljs)
Vue.use(showdown)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
