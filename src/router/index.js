import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '@/views/Login'
Vue.use(VueRouter)
// 路由的懒加载   ==>  如果在路由中直接引入对应组件，会在app.js打包时一次性加载全部的组件
// 所以在这里可以使用路由的懒加载技术，即在配置对应组件时候 ，直接使用 () => { return import(@/views/对应组件)    }
// 懒加载的优点在于可以在用户访问哪个页面时就去加载哪个组件的数据，相比之下比一次性加载全部组件会极大提高第一次打开页面的速度
const routes = [
  {
    path: '/login',
    component: () => import('@/views/Login')
    // component:Login
  }, {
    path: '/',
    component: () => import('@/views/Layout'),
    redirect: '/ ',
    children: [
      {
        path: '/ ',
        component: () => import('@/views/Home')
      },
      {
        path: '/profile',
        component: () => import('@/views/My')
      },
      {
        path: '/video',
        component: () => import('@/views/Video')
      },
      {
        path: '/qa',
        component: () => import('@/views/Qa')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
