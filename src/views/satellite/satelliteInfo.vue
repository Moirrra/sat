<template>
  <div id="detail-wrap">
    <div class="info-content">
      <el-descriptions class="margin-top"  border :column="1" style="width: 90%">
      <el-descriptions-item label="Norad ID">{{ satInfo.id }}</el-descriptions-item>
      <el-descriptions-item label="卫星名称">{{ satInfo.name }}</el-descriptions-item>
      <el-descriptions-item label="状态">
        <template>
          <el-tag :type="satInfo.status|getStatus" close-transition>
            {{satInfo.status}}
          </el-tag>
        </template>
      </el-descriptions-item>
      <el-descriptions-item label="国家">{{ satInfo.countries }}</el-descriptions-item>
      <el-descriptions-item label="TLE1">{{ satInfo.tle1 }}</el-descriptions-item>
      <el-descriptions-item label="TLE2">{{ satInfo.tle2 }}</el-descriptions-item>
    </el-descriptions>
    </div>
  </div>
</template>

<script>
export default {
  name: 'satelliteInfo',
  data() {
    return {
      satInfo: {
        id: '',
        name: '',
        tle1: '',
        tle2: '',
        status: '',
        countries: '',
      }
    }
  },
  methods: {
    // 获取当前卫星数据
    async getData() {
      if (this.$route.params.id) {
        let result = await this.$API.sat.reqSatById(this.$route.params.id)
        console.log(result.message)
        if (result.status == 0) {
          this.satInfo.id = result.data.id
          this.satInfo.name = result.data.name
          this.satInfo.tle1 = result.data.tle1
          this.satInfo.tle2 = result.data.tle2
        } else {
          this.$message.error('获取卫星数据失败！')
        }
        
        let result1 = await this.$API.satinfo.reqSatInfoById(this.$route.params.id)
        console.log(result1.message)
        if (result1.status == 0) {
          this.satInfo.status = result1.data.status
          this.satInfo.countries = result1.data.countries
        } else {
          this.$message.error('获取卫星信息数据失败！')
        }
      }
    },
  },
  filters: {
    getStatus(status) {
      const bindColor = {
        'alive': 'success',
        'dead': 'danger',
      }
      return bindColor[status]
    }
  },
  mounted() {
    this.getData()
  },
}
</script>

<style scoped>
#detail-wrap {
  width: 100%;
  height: 100%;
  min-height: 700px;
  margin: 50px
}

.info-content {
  margin-top: 20px;
}
</style>