<template>
  <div id="view-wrap">
    <div class="content-left">
      <div class="cesium-view">
        <div id="cesiumContainer"></div>
      </div>
      <div class="sat-list-session">
        <CollectionSelect @createOrbits="createOrbits" @getEntity="getEntity"></CollectionSelect>
      </div>
    </div>
    <div class="content-right">
      <div class="gs-info-session">
        <GroundStationDetail @updatePasses="updatePasses"></GroundStationDetail>
      </div>
      <div class="sat-info-session">
        <SatelliteDetail :position="satPosition"></SatelliteDetail>
      </div>
      <div class="pass-info-session">
        <PassDetail :passList="passList"></PassDetail>
      </div>
    </div>
  </div>
</template>

<script>
import * as Cesium from 'cesium'
import { mixins } from "@/mixin/cesiumOrbit"
import CollectionSelect from './collectionSelect.vue'
import SatelliteDetail from '@/components/satelliteDetail.vue'
import PassDetail from './passDetail.vue'
import GroundStationDetail from './groundStationDetail.vue'
import _ from "lodash"
import tles2czml from '@/utils/tles2czml.js'
import { computePasses, processPasses } from '@/utils/pass.js'
import { mapState } from 'vuex'
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjNzBjYTE0YS04YjkxLTQ5MWYtYWVlNC1jZGU4MmFmNDk5NzIiLCJpZCI6MTI1NTExLCJpYXQiOjE2Nzk3MzgzOTF9.eRbziwrHaWTSTQwRUzoZ97d6fjHiKwUgK21YKO5dMsk'

export default {
  name: "PassView",
  mixins: [mixins],
  components: { CollectionSelect, SatelliteDetail, PassDetail, GroundStationDetail },
  data() {
    return {
      passList: [], // 过境信息
      onTickCallbackPasses: null, // 侦听获取卫星位置的事件回调
      tle: null, // 当前卫星轨道信息
    }
  },
  computed: {
    ...mapState({
      groundStation: state => state.groundStation,
    }),
  },
  beforeDestroy() {
    this.$bus.$emit('clearPasses')
  },
  methods: {
    // 清除Passes数据
    clearPasses() {
      this.passList = []
      if (this.onTickCallbackPasses) {
        this.viewer.clock.onTick.removeEventListener(this.onTickCallbackPasses)
      }
    },
    // 生成轨道数据
    createOrbits(list) {
      console.log('createOrbits')
      this.viewer.dataSources.removeAll(true)
      this.clearSatDetail()
      this.clearPasses()
      // 创建地面站
      this.createGroundStation()

      let tleList = []
      for (let i = 0; i < list.length; i++) {
        tleList.push({
          id: list[i].id,
          name: list[i].name,
          tle1: list[i].tle1,
          tle2: list[i].tle2,
        })
      }
      let startTime = new Date()
      let endTime = new Date()
      endTime = endTime.setDate(endTime.getDate() + 1)
      endTime = new Date(endTime)

      const czml = tles2czml(startTime, endTime, tleList)
      this.viewer.dataSources.add(
        this.czmlPromise = Cesium.CzmlDataSource.load(czml)
      )
    },
    // 点击卫星实体的回调
    handleClickEntity() {
      const _this = this
      this.clickHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
      this.clickHandler.setInputAction((event) => {
        let pick = _this.viewer.scene.pick(event.position)
        if (Cesium.defined(pick)) {
          console.log(pick.id.id) // entity.id
          if (pick.id.id == 'groundStation') return
          _this.$bus.$emit('getSatInfoById', pick.id.id)
          // 获取当前实体经纬度高度
          _this.getEntityInfo(pick.id)
          // 获取过境信息
          _this.getPassInfo(pick.id.id)
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },
    // 获取卫星实体
    getEntity(id) {
      this.czmlPromise.then((czml) => {
        console.log(czml.entities)
        const entity = czml.entities.getById(id.toString())
        if (entity.id == 'groundStation') return
        this.$bus.$emit('getSatInfoById', entity.id)
        // 选中实体
        this.viewer._selectedEntity = entity
        // 获取当前实体经纬度高度
        this.getEntityInfo(entity)
        // 获取过境信息
        this.getPassInfo(entity.id)
      }).catch((error) => {
        console.log(error)
      });
    },
    // 获取过境信息
    async getPassInfo(id) {
      this.clearPasses()
      let result = await this.$API.sat.reqSatById(id)
      if (result.status == 0) {
        this.tle = result.data
      } else {
        this.$message({
          type: 'danger',
          message: '获取卫星信息失败！'
        })
        this.passList = []
        this.tle = null
      }
      // 实时获取过境信息
      if (this.tle) {
        this.onTickCallbackPasses = this.viewer.clock.onTick.addEventListener((clock) => {
          this.getPasses(clock)
        })
      }
    },
    // 计算过境信息
    getPasses: _.throttle(function(clock) {
      // console.log('getPasses')
      const time = clock.currentTime
      let startDate = new Date(clock.startTime.toString())
      let endDate = new Date(clock.startTime.toString())
      endDate = endDate.setDate(startDate.getDate() + 1)
      endDate = new Date(endDate)
      const passes = computePasses(this.tle, this.groundStation, startDate, endDate)
      this.passList = processPasses(passes, time)
    }, 1000),
    // 创建地面站
    createGroundStation() {
      this.removeGroundStation()
      let lng = this.groundStation.longitude
      let lat = this.groundStation.latitude
      let height = this.groundStation.height
      this.viewer.entities.add({
        id: 'groundStation',
        position: Cesium.Cartesian3.fromDegrees(lng, lat, height),
        point: {
          color: Cesium.Color.WHITE,    //点位颜色
          pixelSize: 8,                //像素点大小
          show: true,
        },
        label: {
          text: '地面站',
          font: "20pt Helvetica",//字体样式
          scale: 0.5,
          fillColor: Cesium.Color.WHITE,        //字体颜色
          showBackground: false,                //是否显示背景颜色
          verticalOrigin: Cesium.VerticalOrigin.CENTER, //垂直位置
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT, //水平位置
          pixelOffset: new Cesium.Cartesian2(10, 0)            //偏移
        }
      })
    },
    // 清除地面站
    removeGroundStation() {
      this.viewer.entities.removeById('groundStation')
    },
    updatePasses(id) {
      this.removeGroundStation()
      this.createGroundStation()
      this.getPassInfo(id)
    },
  },
}
</script>

<style scoped>
#view-wrap {
  display: flex;
  align-items: stretch;
  width: 100%;
  height: 100%;
  padding-left: 20px;
  background-color: #fff;
}

.content-left {
  width: 730px;
  height: 1000px;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
}

/* Cesium */
.cesium-view {
  border: 1px solid #dee2e6;
  margin: 10px 5px;
  padding: 10px;
  background-color: #fff;
  position: relative;
}

#cesiumContainer {
  min-width: 700px;
  height: 550px;
}

/* 卫星列表 */
.sat-list-session {
  height: 250px;
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
  display: flex;
  width: 450px;
  flex-direction: column;
  justify-content: stretch;
}

/* 地面站信息 */
.gs-info-session {
  height: 200px;
  border: 1px solid #dee2e6;
  margin: 10px 5px;
  background-color: #fff;
}

/* 卫星信息展示 */
.sat-info-session {
  height: 136px;
  border: 1px solid #dee2e6;
  margin: 10px 5px;
  background-color: #fff;
}

/* 过境信息展示 */
.pass-info-session {
  height: 457px;
  border: 1px solid #dee2e6;
  margin: 10px 5px;
  background-color: #fff;
}
</style>