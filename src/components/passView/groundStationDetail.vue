<template >
  <div id="gs-wrap">
    <div class="gs-info">
      <div class="gs-info-header">
        <span>地面站</span>
      </div>
      <div class="gs-info-content">
        <div class="detail-form">
          <el-form label-position="left" label-width="80px" :model="groundStation" clearable>
            <el-form-item label="纬度(°)">
              <el-input v-model="groundStation.latitude" oninput="value=value.replace(/[^0-9.]/g,'')" clearable></el-input>
            </el-form-item>
            <el-form-item label="经度(°)">
              <el-input v-model="groundStation.longitude" oninput="value=value.replace(/[^0-9.]/g,'')" clearable></el-input>
            </el-form-item>
            <el-form-item label="高度(m)">
              <el-input v-model="groundStation.height" oninput="value=value.replace(/[^0-9.]/g,'')" clearable></el-input>
              <el-button class="btn" type="primary" @click="handleUpdate">更新</el-button>
            </el-form-item>
          </el-form>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'GroundStationDetail',
  data() {
    return {
      groundStation: {
        latitude: '',
        longitude: '',
        height: '',
      }
    }
  },
  computed: {
    ...mapState({
      satOnShow: state => state.satOnShow,
    }),
  },
  mounted() {
    this.$store.commit('INIT_GROUND_STATION')
    let gs = this.$store.state.groundStation
    this.groundStation = gs
  },
  methods: {
    // 点击更新地面站的回调
    handleUpdate() {
      this.groundStation.latitude = parseFloat(this.groundStation.latitude)
      this.groundStation.longitude = parseFloat(this.groundStation.longitude)
      this.groundStation.height = parseFloat(this.groundStation.height)
      this.$store.commit('SET_GROUND_STATION', this.groundStation)
      this.$emit('refreshPasses', this.satOnShow.id)
    },
  }
}
</script>

<style scoped>
.gs-info-header {
  display: flex;
  align-items: center;
  padding-left: 10px;
  height: 30px;
  background-color: #eee;
  border-bottom: 1px solid #dee2e6;
  font-size: 14px;
}

.gs-info-content {
  margin: 10px;
}

.el-input {
  width: 150px;
}

.el-form-item {
  margin-bottom: 10px
}

.btn {
  margin-left: 10px;
}

</style>