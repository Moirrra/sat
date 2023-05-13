<template>
  <div id="view-wrap">
    <div class="content-left">
      <div class="cesium-view">
        <div id="cesiumContainer"></div>
      </div>
      <div class="sat-list-session session">
        <CollectionSelect @createOrbits="createOrbits" @getEntity="getEntity">
        </CollectionSelect>
      </div>
    </div>
    <div class="content-right">
      <div class="sat-info-session session">
        <SatelliteDetail :position="satPosition">
        </SatelliteDetail>
      </div>
      <div class="link-init-session session">
        <LinkInit ref="linkInit" @createLink="createLink">
        </LinkInit>
      </div>
      <div class="link-list-session session">
        <LinkList ref="linkList" 
          @createLink="createLink" 
          @removeLink="removeLink">
        </LinkList>
      </div>
    </div>
  </div>
</template>

<script>
import * as Cesium from 'cesium'
import { mixins } from "@/mixin/cesiumOrbit"
import CollectionSelect from './collectionSelect.vue'
import SatelliteDetail from '@/components/satelliteDetail.vue'
import LinkInit from './linkInit.vue'
import LinkList from './linkList.vue'
import tles2czml from '@/utils/tles2czml.js'
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjNzBjYTE0YS04YjkxLTQ5MWYtYWVlNC1jZGU4MmFmNDk5NzIiLCJpZCI6MTI1NTExLCJpYXQiOjE2Nzk3MzgzOTF9.eRbziwrHaWTSTQwRUzoZ97d6fjHiKwUgK21YKO5dMsk'

export default {
  name: "LinkView",
  mixins: [mixins],
  components: { CollectionSelect, SatelliteDetail, LinkInit, LinkList },
  data() {
    return {
      collection_id: '',
      showLinkList: [],
    }
  },

  methods: {
    // 生成轨道数据
    createOrbits(list, collection_id) {
      this.collection_id = collection_id
      this.$refs.linkInit.getAssignmentData(collection_id)
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
      // 只展示卫星
      const czml = tles2czml(startTime, endTime, tleList, 300, false)
      this.viewer.dataSources.add(
        this.czmlPromise = Cesium.CzmlDataSource.load(czml)
      )
      this.czmlPromise.then(() => this.$refs.linkList.getLinkData(this.collection_id))
    },
    // 创建连线
    createLink(from_id, to_id, color = '#FF0000', isTemp=true) {
      console.log(`create Link ${from_id.toString()}-${to_id.toString()}`)

      // 起点和终点不能相同
      if (from_id == to_id) {
        this.$message.error('起点和终点不能相同！')
        return
      }

      this.czmlPromise.then((czml) => {
        const linkEntity = new Cesium.Entity({
          id: `${from_id.toString()}-${to_id.toString()}`,
          polyline: {
            positions: new Cesium.CallbackProperty((time) => {
              const fromEntity = czml.entities.getById(from_id.toString())
              const toEntity = czml.entities.getById(to_id.toString())
              const fromPosition = fromEntity.position.getValue(time)
              const toPosition = toEntity.position.getValue(time)
              const fromCartographic = Cesium.Cartographic.fromCartesian(fromPosition)
              const toCartographic = Cesium.Cartographic.fromCartesian(toPosition)
              const linePosition = [
                parseFloat(Cesium.Math.toDegrees(fromCartographic.longitude).toFixed(4)),
                parseFloat(Cesium.Math.toDegrees(fromCartographic.latitude).toFixed(4)),
                parseFloat(fromCartographic.height),
                parseFloat(Cesium.Math.toDegrees(toCartographic.longitude).toFixed(4)),
                parseFloat(Cesium.Math.toDegrees(toCartographic.latitude).toFixed(4)),
                parseFloat(toCartographic.height)
              ]
              return Cesium.Cartesian3.fromDegreesArrayHeights(linePosition)
            }, false),
            width: 2,
            material: new Cesium.PolylineArrowMaterialProperty(
              Cesium.Color.fromCssColorString(color)
            ),
          },
        })
        if (this.viewer.entities.getById(`${from_id.toString()}-${to_id.toString()}`)) {
          this.$message.error('不能重复创建链路！')
          return
        }
        this.viewer.entities.add(linkEntity)
        const link = {
          id: `${from_id.toString()}-${to_id.toString()}`,
          "collection_id": this.collection_id,
          from_id,
          to_id,
          color,
          isTemp,
        }
        this.showLinkList.push(link)
        this.$refs.linkList.updateLinkList(link)
        console.log('linkEntity:', linkEntity)
      }).catch((error) => {
        console.log(error)
      })
    },
    // 删除连线
    removeLink(link_id) {
      this.viewer.entities.removeById(link_id)
      console.log(`链路${link_id}已删除！`)
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

.session {
  border: 1px solid #dee2e6;
  margin: 5px;
  background-color: #fff;
}

/* 卫星列表 */
.sat-list-session {
  height: 250px;
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
  width: 350px;
  flex-direction: column;
  justify-content: stretch;
}

/* 卫星信息展示 */
.sat-info-session {
  height: 136px;
}

/* 创建连线 */
.link-init-session {
  height: 230px;
}

/* 卫星列表 */
.link-list-session {
  height: 452px;
}
</style>