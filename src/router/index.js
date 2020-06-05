import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: () => import('@/views/index')
  },{
  path: '/setting',
    name: 'Setting',
    component: () => import('@/views/setting')
  },{
    path: '/readme',
    name: 'Readme',
    component: () => import('@/views/readme')
  },{
    path: '/statistics',
    name: 'Statistics',
    component: () => import('@/views/statistics')
  },{
    path: '/settingDetails',
    name: 'SettingDetails',
    component: () => import('@/views/settingDetails')
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router
