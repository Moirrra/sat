import * as Cesium from 'cesium'
import _ from "lodash"
// import tles2czml from '@/utils/tles2czml.js'
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjNzBjYTE0YS04YjkxLTQ5MWYtYWVlNC1jZGU4MmFmNDk5NzIiLCJpZCI6MTI1NTExLCJpYXQiOjE2Nzk3MzgzOTF9.eRbziwrHaWTSTQwRUzoZ97d6fjHiKwUgK21YKO5dMsk'
export const mixins = {
  data() {
    return {
      viewer: null,
      czmlPromise: null,
      clickHandler: null,
      onTickCallbackPosition: null, // 侦听获取卫星位置的事件回调
      // 当前卫星位置
      satPosition: {
        longitude: '',
        latitude: '',
        height: '',
      },
    }
  },
  mounted() {
    this.initViewer()
    this.handleClickEntity()
  },
  beforeDestroy() {
    this.clearSatDetail()
    this.removeClickEntity()
  },
  methods: {
    // 初始化viewer
    initViewer() {
      this.viewer = new Cesium.Viewer('cesiumContainer', {
        shouldAnimate: true,
        geocoder: false,
        baseLayerPicker: false,
        infoBox: false,
        fullscreenButton: true,
        useDefaultRenderLoop: true,
        // 调用高德地图api，使用默认的bingmaps会报错：get net::ERR_CONNECTION_RESET错误
        imageryProvider: new Cesium.UrlTemplateImageryProvider({
          url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
        }),
      })
      // 相机高度
      this.viewer.scene.screenSpaceCameraController.minimumZoomDistance = 1000000
      // 隐藏logo
      this.viewer._cesiumWidget._creditContainer.style.display = "none"
      if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {//判断是否支持图像渲染像素化处理
        this.viewer.resolutionScale = window.devicePixelRatio
      }
      //是否开启抗锯齿
      this.viewer.scene.fxaa = true
      this.viewer.scene.postProcessStages.fxaa.enabled = true
      // 全屏显示设置
      this.viewer.fullscreenButton.viewModel.fullscreenElement = this.viewer.scene.canvas
    },
    // 清除卫星位置数据
    clearSatDetail() {
      this.satPosition = {
        longitude: '',
        latitude: '',
        height: '',
      },
      this.$store.commit('INIT_SAT_ON_SHOW')
      if (this.onTickCallbackPosition) {
        this.viewer.clock.onTick.removeEventListener(this.onTickCallbackPosition)
      }
    },
    removeClickEntity() {
      if (this.clickHandler) {
        this.clickHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
      }
    },
    // 点击卫星实体的回调
    handleClickEntity() {
      const _this = this
      this.clickHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
      this.clickHandler.setInputAction((event) => {
        let pick = _this.viewer.scene.pick(event.position)
        if (Cesium.defined(pick)) {
          console.log(pick.id.id) // entity.id
          _this.$store.dispatch('getSatById', pick.id.id)
          // _this.$refs.satDetail.getSatInfoById(pick.id.id)
          // _this.$emit('getSatInfoById', pick.id.id)
          // 获取当前实体经纬度高度
          _this.getEntityInfo(pick.id)
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },
    // 获取卫星实体
    getEntity(id) {
      this.czmlPromise.then((czml) => {
        console.log(czml.entities)
        const entity = czml.entities.getById(id.toString())
        // this.$emit('getSatInfoById', entity.id)
        // this.$refs.satDetail.getSatInfoById(entity.id)
        this.$store.dispatch('getSatById', entity.id)
        // 选中实体
        this.viewer._selectedEntity = entity
        // 获取当前实体经纬度高度
        this.getEntityInfo(entity)
      }).catch((error) => {
        console.log(error)
      });
    },
    // 获取实体经纬度高度
    getEntityInfo(entity) {
      this.clearSatDetail()
      if (!entity) return
      // 实时获取实体经纬度高度
      this.onTickCallbackPosition = this.viewer.clock.onTick.addEventListener((clock) => {
        this.computeLonLatHeight(entity, clock)
      })
    },
    // 计算实体的经度维度高度
    computeLonLatHeight: _.throttle(function(entity, clock){
      let curTime = clock.currentTime
      const position = entity.position.getValue(curTime)
      const cartographic = Cesium.Cartographic.fromCartesian(position)
      const lon = Cesium.Math.toDegrees(cartographic.longitude)
      const lat = Cesium.Math.toDegrees(cartographic.latitude)
      const height = cartographic.height
      // const elevation = this.viewer.scene.globe.getHeight(cartographic)
      this.satPosition = {
        longitude: lon.toFixed(2) + '°',
        latitude: lat.toFixed(2) + '°',
        height: (height/1000).toFixed(2) + ' km',
      }
    }, 1000),
  },
}