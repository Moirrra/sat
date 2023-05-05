<template >
  <div id="sat-info">
    <div class="info-view">
      <div class="sat-info-header" v-if="JSON.stringify(satOnShow) !== '{}'">
        {{ satOnShow.name }}
      </div>
      <div class="sat-info-header" v-else>
        当前卫星信息
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
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'SatelliteInfo',
  data() {
    return {
      longitude: '',
      latitude: '',
      height: '',
    }
  },
  computed: {
    ...mapState({
      satOnShow: state => state.satOnShow,
    }),
  },
  methods: {
    // 获取卫星信息
    getSatInfoById(id) {
      this.$store.dispatch('getSatById', id)
    },
    // 更新卫星位置信息
    updateInfo(obj) {
      this.longitude = obj.longitude.toFixed(2) + '°'
      this.latitude = obj.latitude.toFixed(2) + '°'
      this.height = (obj.height / 1000).toFixed(2) + ' km'
    }
  },
  mounted() {
    this.$bus.$on('getSatInfoById', this.getSatInfoById)
    this.$bus.$on('updateInfo', this.updateInfo)
  },
  beforeDestroy() {
    this.$bus.$off('getSatInfoById')
    this.$bus.$off('updateInfo')
  }
}
</script>

<style scoped>
.sat-info-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
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
</style>