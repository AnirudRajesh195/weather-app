import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'
import index from '../views/index'
import chart from '../views/chart'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/chart',
      name: 'chart',
      component: chart
    },
  ]
})
