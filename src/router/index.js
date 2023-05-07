import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Home = () => import('@/components/home.vue')
const orbitView = () => import('@/components/orbitView/index.vue')
const networkView = () => import('@/components/networkView/index.vue')
const collectionView = () => import('@/components/collectionView/index.vue')
const collectionInfo = () => import('@/components/collectionView/collectionInfo.vue')
const collectionEdit = () => import('@/components/collectionView/collectionEdit.vue')
const satelliteView = () => import('@/components/satelliteView/index.vue')
const satelliteInfo = () => import('@/components/satelliteView/satelliteInfo.vue')
const satelliteEdit = () => import('@/components/satelliteView/satelliteEdit.vue')
const coverageView = () => import('@/components/coverageView/index.vue')
const linkView = () => import('@/components/linkView/index.vue')
const settingView = () => import('@/components/settingView/index.vue')

const routes = [
  {
    path: '/',
    component: Home,
    redirect:'/orbit',
    children: [
      // orbitView
      {
        path: 'orbit',
        name: '卫星轨道',
        component: orbitView,
      },
      // networkView
      {
        path: 'network',
        name: '星座组网',
        component: networkView,
      },
      // collectionView
      {
        path: 'collection',
        name: 'Collections',
        component: collectionView,
      },
      {
        path: 'collection_info/:id',
        name: 'Collection详情',
        component: collectionInfo,
      },
      {
        path: 'edit_collection/:id',
        name: '编辑Collection',
        component: collectionEdit,
      },
      {
        path: 'create_collection',
        name: '创建Collection',
        component: collectionEdit,
      },
      // satelliteView
      {
        path: 'satellite',
        name: 'Satellites',
        component: satelliteView,
      },
      {
        path: 'satellite_info/:id',
        name: '卫星详情',
        component: satelliteInfo,
      },
      {
        path: 'add_satellite',
        name: '添加卫星',
        component: satelliteEdit,
      },
      {
        path: 'edit_satellite/:id',
        name: '编辑卫星',
        component: satelliteEdit,
      },
      // coverageView
      {
        path: 'coverage',
        name: '卫星覆盖区域',
        component: coverageView,
      },
      // linkView
      {
        path: 'link',
        name: '星间链路',
        component: linkView,
      },
      {
        path: 'setting',
        name: '设置',
        component: settingView
      }
    ]
  },
]

export default new Router({
  routes
})