<template>
  <div id="view-wrap">
    <div class="content-left">
      <div class="cesium-view">
        <div id="cesiumContainer"></div>
      </div>
      <div class="sat-list-session">
        <SatelliteSelect @createOrbits="createOrbits"></SatelliteSelect>
      </div>
    </div>
    <div class="content-right">
      <div class="sat-info-session">
        <SatelliteInfo ref="satInfo"></SatelliteInfo>
      </div>
    </div>
  </div>
</template>

<script>
import * as Cesium from 'cesium'
import SatelliteSelect from './satelliteSelect.vue'
import SatelliteInfo from './satelliteInfo.vue'
import { mapState } from 'vuex'
import tles2czml from '@/utils/tles2czml.js'
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjNzBjYTE0YS04YjkxLTQ5MWYtYWVlNC1jZGU4MmFmNDk5NzIiLCJpZCI6MTI1NTExLCJpYXQiOjE2Nzk3MzgzOTF9.eRbziwrHaWTSTQwRUzoZ97d6fjHiKwUgK21YKO5dMsk'

export default {
  name: "OrbitView",
  components: { SatelliteSelect, SatelliteInfo },
  data() {
    return {
      viewer: null,
      showList: [], // 展示轨道的卫星id
      satTleMap: null,
      clickHandler: null,
      timer: null,
      czmlPromise: null,
    };
  },
  computed: {
    ...mapState({
      satList: state => state.satList,
    }),
  },
  mounted() {
    this.initViewer()
    this.getData()
    this.handleClickEntity()
    this.$bus.$on('createOrbits', this.createOrbits)
    this.$bus.$on('getEntity', this.getEntity)
  },
  beforeDestroy() {
    this.$bus.$off('createOrbits')
    this.$bus.$off('getEntity')
  },
  methods: {
    // 初始化viewer
    initViewer() {
      // let _this = this
      this.viewer = new Cesium.Viewer('cesiumContainer', {
        shouldAnimate: true,
        geocoder: false,
        baseLayerPicker: false,
        infoBox: false,
        fullscreenButton: false,
        useDefaultRenderLoop: true,
      })
      // 隐藏logo
      this.viewer._cesiumWidget._creditContainer.style.display = "none"
    },
    // 向服务请请求获取默认卫星轨道数据
    getData() {
      this.$store.dispatch('getAllSats')
    },
    // 生成轨道数据
    createOrbits(list = [965, 1002, 34839]) {
      this.viewer.dataSources.removeAll(true)
      let tleList = []
      for (let i = 0; i < list.length; i++) {
        tleList.push({
          id: list[i].satellite_id,
          name: list[i].name,
          tle1: list[i].tle1,
          tle2: list[i].tle2,
        })
      }
      let startTime = new Date()
      let endTime = new Date()
      endTime = endTime.setDate(endTime.getDate() + 1)
      endTime = new Date(endTime)

      console.log(startTime, endTime)
      console.log(tleList)
      const czml = tles2czml(startTime, endTime, tleList)
      this.viewer.dataSources.add(
        this.czmlPromise = Cesium.CzmlDataSource.load(czml)
      )

      console.log(this.viewer.dataSources)
    },
    // 点击实体
    handleClickEntity() {
      const _this = this
      _this.clickHandler = new Cesium.ScreenSpaceEventHandler(_this.viewer.scene.canvas)
      _this.clickHandler.setInputAction(function (event) {
        let pick = _this.viewer.scene.pick(event.position)
        if (Cesium.defined(pick)) {
          console.log(pick.id.id) // entity.id
          _this.$bus.$emit('getSatInfoById', pick.id.id)
          // 获取当前实体经纬度高度
          clearInterval(_this.timer)
          _this.getEntityInfo(pick.id)
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },
    getEntity(id) {
      // console.log('getEntity:', id)
      this.czmlPromise.then((czml) => {
        console.log(czml.entities)
        const entity = czml.entities.getById(id.toString())
        this.$bus.$emit('getSatInfoById', entity.id)
        // 选中实体
        this.viewer._selectedEntity = entity
        // 获取当前实体经纬度高度
        clearInterval(this.timer)
        this.getEntityInfo(entity)
      }).catch((error) => {
        console.log(error)
      });
    },
    // 获取实体经纬度高度
    getEntityInfo(entity) {
      // const _this = this
      if (!entity) 
        return
      this.timer = setInterval(()=>{
        let curTime = this.viewer.clock.currentTime
        let timeStr = curTime.toString()
        timeStr = timeStr.replace(/T/, ' ').replace(/Z/, '').replace(/\.\d+/g, '')
        const position = entity.position.getValue(curTime)
        const cartographic = Cesium.Cartographic.fromCartesian(position)
        const lon = Cesium.Math.toDegrees(cartographic.longitude)
        const lat = Cesium.Math.toDegrees(cartographic.latitude)
        const height = cartographic.height
        // const elevation = this.viewer.scene.globe.getHeight(cartographic)
        const lonLatHeight = {
          longitude: lon,
          latitude: lat,
          height: height,
          // elevation: elevation,
          time: timeStr,
        }
        this.$bus.$emit('updateInfo', lonLatHeight)
      }, 1000)
    },
  },
}
</script>

<style scoped>
#view-wrap {
  display: flex;
  width: 100%;
  height: 100%;
  padding-left: 20px;
  /* background-color: #f2f2f7; */
  background-color: #fff;
}

.content-left {
  display: flex;
  flex-direction: column;
  min-width: 730px;
  max-width: 730px;
}

/* Cesium */
.cesium-view {
  border: 1px solid #dee2e6;
  margin: 10px 5px;
  padding: 10px;
  background-color: #fff;
}

#cesiumContainer {
  min-width: 700px;
  height: 400px;
}

/* 卫星列表 */
.sat-list-session {
  border: 1px solid #dee2e6;
  margin: 5px;
  background-color: #fff;
}

.select-list {
  padding: 5px;
  margin: 10px;
}

.select {
  width: 500px;
  margin-right: 20px;
}

.btn-show {
  width: 100px;
}

.content-right {
  width: 350px;
  height: 100%;
}

/* 卫星信息展示 */
.sat-info-session {
  border: 1px solid #dee2e6;
  margin: 10px 5px;
  background-color: #fff;
}
</style>