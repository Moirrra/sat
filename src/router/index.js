import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Home = () => import('@/components/home.vue')
const OrbitView = () => import('@/views/orbitView/index.vue')
const NetworkView = () => import('@/views/networkView/index.vue')
const passView = () => import('@/views/passView/index.vue')
const LinkView = () => import('@/views/linkView/index.vue')
const Collection = () => import('@/views/collection/index.vue')
const CollectionInfo = () => import('@/views/collection/collectionInfo.vue')
const CollectionEdit = () => import('@/views/collection/collectionEdit.vue')
const Satellite = () => import('@/views/satellite/index.vue')
const SatelliteInfo = () => import('@/views/satellite/satelliteInfo.vue')
const SatelliteEdit = () => import('@/views/satellite/satelliteEdit.vue')
const Setting = () => import('@/views/setting/index.vue')


const routes = [
  {
    path: '/',
    component: Home,
    redirect:'/orbit-view',
    children: [
      // orbitView
      {
        path: 'orbit-view',
        name: '卫星轨道',
        component: OrbitView,
      },
      // networkView
      {
        path: 'network-view',
        name: '星座组网',
        component: NetworkView,
      },
      // passView
      {
        path: 'pass-view',
        name: '卫星过境',
        component: passView,
      },
      // collectionView
      {
        path: 'collection',
        name: 'Collections',
        component: Collection,
      },
      {
        path: 'collection-info/:id',
        name: 'Collection详情',
        component: CollectionInfo,
      },
      {
        path: 'edit-collection/:id',
        name: '编辑Collection',
        component: CollectionEdit,
      },
      {
        path: 'create-collection',
        name: '创建Collection',
        component: CollectionEdit,
      },
      {
        path: 'satellite',
        name: 'Satellites',
        component: Satellite,
      },
      {
        path: 'satellite-info/:id',
        name: '卫星详情',
        component: SatelliteInfo,
      },
      {
        path: 'add-satellite',
        name: '添加卫星',
        component: SatelliteEdit,
      },
      {
        path: 'edit-satellite/:id',
        name: '编辑卫星',
        component: SatelliteEdit,
      },
      {
        path: 'link-view',
        name: '星间链路',
        component: LinkView,
      },
      {
        path: 'setting',
        name: '设置',
        component: Setting
      }
    ]
  },
]

export default new Router({
  routes
})