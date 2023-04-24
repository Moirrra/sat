import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Home = () => import('@/components/home.vue')
const orbitView = () => import('@/components/orbitView/index.vue')
const collectionView = () => import('@/components/collectionView/index.vue')
const collectionInfo = () => import('@/components/collectionView/collectionInfo.vue')
const collectionEdit = () => import('@/components/collectionView/collectionEdit.vue')
const satelliteView = () => import('@/components/satelliteView/index.vue')
const satelliteEdit = () => import('@/components/satelliteView/satelliteEdit.vue')

const routes = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: 'orbit',
        name: '卫星轨道',
        component: orbitView,
      },
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
      {
        path: 'satellite',
        name: 'Satellites',
        component: satelliteView,
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
    ]
  },
]

export default new Router({
  routes
})