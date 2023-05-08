<template >
  <div id="sat-info">
    <div class="info-view">
      <div class="sat-info-header" v-if="JSON.stringify(satOnShow) !== '{}'">
        <span>{{ satOnShow.name }}</span>
        <el-button type="text" icon="el-icon-search" circle size="mini"
          @click="goSatInfo">
        </el-button>
      </div>
      <div class="sat-info-header" v-else>
        当前卫星信息 & 过境时间
      </div>
      <div class="sat-info-content">
        <div class="sat-info-table" v-if="JSON.stringify(satOnShow) !== '{}'">
          <div class="info">
            <span class="info-label" v-if="latitude !== ''">纬度：</span>
            <span>{{ latitude }}</span>
          </div>
          <div class="info">
            <span class="info-label" v-if="longitude !== ''">经度：</span>
            <span>{{ longitude }}</span>
          </div>
          <div class="info">
            <span class="info-label" v-if="height !== ''">海拔：</span>
            <span>{{ height }}</span>
          </div>
        </div>
        <h3 v-else>数据为空</h3>
      </div>
      <div class="sat-info-pass">
        <div class="pass-header">
          卫星过境数据
          <el-button type="text" icon="el-icon-refresh" @click="handleRefresh"></el-button>
          <span class="current-time">(当前时间：{{ currentTime }})</span>
        </div>
        <el-table :data="passList" 
          border height="450" style="width: 100%" >
          <el-table-column fixed prop="countdown" label="Countdown" width="100" align="center" :resizable="false">
          </el-table-column>
          <el-table-column fixed prop="start" label="Start" align="center" width="110"  :resizable="false">
          </el-table-column>
          <el-table-column fixed prop="end" label="End" align="center" width="80" :resizable="false">
          </el-table-column>
          <el-table-column fixed prop="el" label="El" align="center" width="50" :resizable="false">
          </el-table-column>
          <el-table-column fixed prop="az" label="Az" align="center" width="70" :resizable="false">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mixins } from "@/mixin/satelliteDetail"
import dayjs from 'dayjs'
export default {
  name: 'SatelliteDetail',
  mixins: [mixins],
  data() {
    return {
      passList: [],
      currentTime: '暂无',
    }
  },
  methods: {
    updatePasses(passList, time) {
      this.clearPasses()
      this.passList = passList
      // 时区差
      let offset = new Date().getTimezoneOffset() / 60
      this.currentTime = dayjs(time).add(offset, 'hour').format("MM.DD HH:mm:ss")
    },
    clearPasses() {
      this.passList = []
      this.currentTime = '暂无'
    },
    handleRefresh() {
      console.log('handleRefresh')
      this.$emit('refreshPasses', this.satOnShow.id)
    },
  },
  mounted() {
    this.$bus.$on('getSatInfoById_pass', this.getSatInfoById)
    this.$bus.$on('updateInfo_pass', this.updateInfo)
    this.$bus.$on('updatePasses', this.updatePasses)
    this.$bus.$on('clearPasses', this.clearPasses)
  },
  beforeDestroy() {
    this.$bus.$off('getSatInfoById_pass')
    this.$bus.$off('updateInfo_pass')
    this.$bus.$off('updatePasses')
    this.$bus.$off('clearPasses')
  }
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

.sat-info-pass {
  padding: 5px;
  min-height: 470px;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
}

.pass-header {
  font-weight: 700;
  padding: 10px;
  font-size: 14px;
}

.current-time {
  margin-left: 10px;
  font-size: 10px;
  font-weight: 400;
  color: #555;
}

.el-table {
  font-size: 12px;
}
</style>