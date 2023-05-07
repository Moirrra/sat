import * as Cesium from 'cesium'
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjNzBjYTE0YS04YjkxLTQ5MWYtYWVlNC1jZGU4MmFmNDk5NzIiLCJpZCI6MTI1NTExLCJpYXQiOjE2Nzk3MzgzOTF9.eRbziwrHaWTSTQwRUzoZ97d6fjHiKwUgK21YKO5dMsk'
export const mixins = {
  data() {
    return {
      viewer: null,
      showList: [], // 展示轨道的卫星id
      satTleMap: null,
      clickHandler: null,
      timer: null,
    }
  },
  mounted() {
    this.initViewer()
    this.handleClickEntity()
  },
  beforeDestroy() {
    this.clearSatDetail()
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
          url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",}),
      })
      // 隐藏logo
      this.viewer._cesiumWidget._creditContainer.style.display = "none"
      if(Cesium.FeatureDetection.supportsImageRenderingPixelated()){//判断是否支持图像渲染像素化处理
        this.viewer.resolutionScale = window.devicePixelRatio
      }
      //是否开启抗锯齿
      this.viewer.scene.fxaa = true
      this.viewer.scene.postProcessStages.fxaa.enabled = true
      // 全屏显示设置
      this.viewer.fullscreenButton.viewModel.fullscreenElement = this.viewer.scene.canvas
    },
    // 清除子组件SatelliteDetail展示数据
    clearSatDetail() {
      clearInterval(this.timer)
      this.$store.commit('INIT_SAT_ON_SHOW')
    },
    // 计算实体的经度维度高度
    computeLonLatHeight(entity) {
      let curTime = this.viewer.clock.currentTime
        let timeStr = curTime.toString()
        timeStr = timeStr.replace(/T/, ' ').replace(/Z/, '').replace(/\.\d+/g, '')
        const position = entity.position.getValue(curTime)
        const cartographic = Cesium.Cartographic.fromCartesian(position)
        const lon = Cesium.Math.toDegrees(cartographic.longitude)
        const lat = Cesium.Math.toDegrees(cartographic.latitude)
        const height = cartographic.height
        // const elevation = this.viewer.scene.globe.getHeight(cartographic)
        return {
          longitude: lon,
          latitude: lat,
          height: height,
          // elevation: elevation,
          time: timeStr,
        }
    },
  },
}