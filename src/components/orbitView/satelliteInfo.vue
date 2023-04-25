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
          <!-- <div class="info info.status">
            <span class="info-label">状态：</span>
            <span>{{ satInfoOnShow.status }}</span>
          </div>
          <div class="info info.country" v-if="satInfoOnShow.countries">
            <span class="info-label">国家：</span>
            <span>{{ satInfoOnShow.countries }}</span>
          </div>
          <div class="info info.launched" v-if="launched !== ''">
            <span class="info-label">发射日期：</span>
            <span>{{ launched }}</span>
          </div>
          <div class="info info.updated" v-if="updated !== ''">
            <span class="info-label">更新日期：</span>
            <span>{{ updated }}</span>
          </div>
          <div class="info info.decayed" v-if="decayed !== ''">
            <span class="info-label">销毁日期：</span>
            <span>{{ decayed }}</span>
          </div> -->
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
import { mapState } from 'vuex';
export default {
  name: 'SatelliteInfo',
  data() {
    return {
      isShow: false,
      longitude: '',
      latitude: '',
      height: '',
    }
  },
  computed: {
    ...mapState({
      satOnShow: state => state.satOnShow,
    }),
    // launched() {
    //   if (this.satInfoOnShow.launched) return this.satInfoOnShow.launched.slice(0, 10)
    //   return ''
    // },
    updated() {
      if (this.satOnShow.tle_updated) return this.satOnShow.tle_updated.slice(0, 10)
      return ''
    },
    // decayed() {
    //   if (this.satInfoOnShow.decayed) return this.satInfoOnShow.decayed.slice(0, 10)
    //   return ''
    // },
  },
  methods: {
    // 向服务请请求获取卫星信息
    getSatInfoById(id) {
      this.$store.dispatch('getSatById', id)
    },
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
#sat-info {

}
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
  width: 150px;
  font-weight: 700;
}
</style>