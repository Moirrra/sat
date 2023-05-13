<template >
  <div id="gs-wrap">
    <div class="gs-info">
      <div class="gs-info-header">
        <span>地面站</span>
      </div>
      <div class="gs-info-content">
        <div class="detail-form">
          <el-form :inline="true" label-position="left" label-width="70px" :model="groundStation" clearable>
            <el-form-item label="纬度(°)">
              <el-input v-model="groundStation.latitude" oninput="value=value.replace(/[^0-9.]/g,'')" clearable></el-input>
            </el-form-item>
            <el-form-item label="经度(°)">
              <el-input v-model="groundStation.longitude" oninput="value=value.replace(/[^0-9.]/g,'')" clearable></el-input>
            </el-form-item>
            <el-form-item label="高度(m)">
              <el-input v-model="groundStation.height" oninput="value=value.replace(/[^0-9.]/g,'')" clearable></el-input>
            </el-form-item>
          </el-form>
        </div>
        <el-button class="btn" type="primary" @click="handleUpdate">更新</el-button>
        <el-button class="btn"  @click="getCurrentPosition">获取当前定位</el-button>
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
      this.$emit('updatePasses', this.satOnShow.id)
    },
    getCurrentPosition() {
      //如果该对象存在，那么地理位置服务可用。
      if ('geolocation' in navigator) {
        /* 地理位置服务可用 */
        var options = {
          enableHighAccuracy: true, //表示系统是否使用最高精度来表示结果
          timeout: 5000, 
          maximumAge: 0 //表明可以返回多长时间（即最长年龄，单位毫秒）内的可获取的缓存位置
        }
 
        navigator.geolocation.getCurrentPosition((position) => {
          const lat = position.coords.latitude //当前位置的纬度
          const lng = position.coords.longitude //当前位置精度
          this.groundStation.latitude = lat
          this.groundStation.longitude = lng
          this.groundStation.height = 0
          console.log(`纬度：${lat} 经度：${lng}`)
        }, (err) => {
          const errorType = ['您拒绝共享位置信息', '获取不到位置信息', '获取位置信息超时']
          console.log(errorType[err.code - 1])
        }, options)
      } else {
        /* 地理位置服务不可用 */
        console.log('无法获取您的位置，请检查定位是否开启或刷新重试')
      }
    }
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

.detail-form {
  display: flex;
}

.el-input {
  width: 100px;
}

.el-form-item {
  margin-bottom: 10px
}

.btn {
  margin-right: 10px;
}

</style>