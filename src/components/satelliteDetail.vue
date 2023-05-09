<template >
  <div id="sat-info">
    <div class="info-view">
      <div class="sat-info-header" v-if="JSON.stringify(satOnShow) !== '{}'">
        <span>{{ satOnShow.name }}</span>
        <el-button type="text" icon="el-icon-search" circle size="mini" @click="goSatInfo">
        </el-button>
      </div>
      <div class="sat-info-header" v-else>
        当前卫星信息
      </div>
      <div class="sat-info-content">
        <div class="sat-info-table" v-if="JSON.stringify(satOnShow) !== '{}'">
          <div class="info">
            <span class="info-label">纬度：</span>
            <span>{{ position.latitude }}</span>
          </div>
          <div class="info">
            <span class="info-label">经度：</span>
            <span>{{ position.longitude }}</span>
          </div>
          <div class="info">
            <span class="info-label">海拔：</span>
            <span>{{ position.height }}</span>
          </div>
        </div>
        <h3 v-else>数据为空</h3>
      </div>
    </div>
  </div>
</template>

<script>
import { mixins } from "@/mixin/satelliteDetail"
export default {
  name: 'SatelliteDetail',
  mixins: [mixins],
  props: ['position'],
  data() {
    return {}
  },
  methods: {
  },
}
</script>

<style scoped>
.sat-info-header {
  display: flex;
  align-items: center;
  padding-left: 10px;
  height: 30px;
  background-color: #eee;
  border-bottom: 1px solid #dee2e6;
  font-size: 14px;
}

.header {
  display: flex;
}

.sat-info-content {
  margin: 10px;
}

.info {
  margin-bottom: 10px;
  font-size: 14px;
}

.info-label {
  display: inline-block;
  width: 80px;
  font-weight: 700;
}
</style>