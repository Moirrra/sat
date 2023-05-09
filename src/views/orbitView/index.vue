<template>
  <div id="view-wrap">
    <div class="content-left">
      <div class="cesium-view">
        <div id="cesiumContainer"></div>
      </div>
    </div>
    <div class="content-right">
      <div class="sat-info-session">
        <SatelliteDetail :position="satPosition"></SatelliteDetail>
      </div>
      <div class="sat-list-session">
        <CollectionSelect @createOrbits="createOrbits" @getEntity="getEntity" ></CollectionSelect>
      </div>
    </div>
  </div>
</template>

<script>
import * as Cesium from 'cesium'
import { mixins } from "@/mixin/cesiumOrbit"
import CollectionSelect from './collectionSelect.vue'
import SatelliteDetail from '@/components/satelliteDetail.vue'
import tles2czml from '@/utils/tles2czml.js'
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjNzBjYTE0YS04YjkxLTQ5MWYtYWVlNC1jZGU4MmFmNDk5NzIiLCJpZCI6MTI1NTExLCJpYXQiOjE2Nzk3MzgzOTF9.eRbziwrHaWTSTQwRUzoZ97d6fjHiKwUgK21YKO5dMsk'

export default {
  name: "OrbitView",
  mixins: [mixins],
  components: { CollectionSelect, SatelliteDetail },
  data() {
    return {
    }
  },
  methods: {
    // 生成轨道数据
    createOrbits(list) {
      this.viewer.dataSources.removeAll(true)
      this.clearSatDetail()
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

      const czml = tles2czml(startTime, endTime, tleList, 300, true, true)
      this.viewer.dataSources.add(
        this.czmlPromise = Cesium.CzmlDataSource.load(czml)
      )
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
  height: 600px;
}

.content-right {
  display: flex;
  width: 350px;
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
  height: 417px;
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


/* 卫星信息展示 */
.sat-info-session {
  height: 136px;
  border: 1px solid #dee2e6;
  margin: 10px 5px;
  background-color: #fff;
}
</style>