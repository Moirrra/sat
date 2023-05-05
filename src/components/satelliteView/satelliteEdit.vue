<template>
  <div id="detail-wrap">
    <div class="btn-back" @click="goBack">
      <el-button>返回</el-button>
    </div>
    <div class="detail-form">
      <el-form label-position="left" label-width="80px" :model="satInfo">
        <el-form-item label="norad_id" v-if="$route.params.id">
          <el-input v-model.number="satInfo.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="norad_id" v-else>
          <el-input v-model.number="satInfo.id" oninput="value=value.replace(/[^0-9]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="name">
          <el-input v-model="satInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select class="select" v-model="satInfo.status">
            <el-option v-for="(item, index) in statusList" :key="index" :value="item" :label="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="国家">
          <el-input v-model="satInfo.countries"></el-input>
        </el-form-item>
        <el-form-item label="TLE1">
          <el-input v-model="satInfo.tle1"></el-input>
        </el-form-item>
        <el-form-item label="TLE2">
          <el-input v-model="satInfo.tle2"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="btn-add" v-if="!$route.params.id">
      <el-button type="primary" @click="handleCreate">添加卫星</el-button>
    </div>
    <div class="btn-save" v-else>
      <el-button type="primary" @click="handleSave">保存结果</el-button>
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
        tle_updated: '',
        status: '',
        countries: '',
      },
      statusList: ['alive', 'dead', 're-entered']
    }
  },
  methods: {
    goBack() {
      this.$router.push('/satellite')
    },
    // 返回Satellite
    goSatellite() {
      this.$router.push('/satellite')
    },
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
          this.$message({
            type: 'danger',
            message: '获取卫星数据失败！'
          })
        }

        let result1 = await this.$API.satinfo.reqSatInfoById(this.$route.params.id)
        console.log(result1.message)
        if (result1.status == 0) {
          this.satInfo.status = result1.data.status
          this.satInfo.countries = result1.data.countries
        } else {
          this.$message({
            type: 'danger',
            message: '获取卫星信息数据失败！'
          })
        }
      }
    },
    // 点击添加卫星
    async handleCreate() {
      let result = await this.$API.sat.reqCreateSat({
        "id": this.satInfo.id,
        "name": this.satInfo.name,
        "tle1": this.satInfo.tle1,
        "tle2": this.satInfo.tle2,
      })
      console.log(result.message)
      let result1 = await this.$API.satinfo.reqCreateSatInfo({
        "id": this.satInfo.id,
        "status": this.satInfo.status,
        "countries": this.satInfo.countries,
      })
      console.log(result1.message)
      if (result.status == 0 && result1.status == 0) {
        this.$message({
          type: 'success',
          message: '创建Satellite成功!'
        })
        this.goSatelliteInfo()
      } else {
        this.$message({
          type: 'danger',
          message: '创建Satellite失败！'
        })
      }
    },
    // 点击保存卫星
    async handleSave() {
      let tle_updated = new Date().toISOString()
      let result = await this.$API.sat.reqUpdateSat({
        "id": this.satInfo.id,
        "name": this.satInfo.name,
        "tle1": this.satInfo.tle1,
        "tle2": this.satInfo.tle2,
        'tle_updated': tle_updated
      })
      console.log(result.message)
      
      let result1 = await this.$API.satinfo.reqUpdateSatInfo({
        "id": this.satInfo.id,
        "status": this.satInfo.status,
        "countries": this.satInfo.countries,
      })
      console.log(result1.message)
      if (result.status == 0 && result1.status == 0) {
        this.$message({
          type: 'success',
          message: '保存Satellite成功!'
        })
        this.goSatellite()
      } else {
        this.$message({
          type: 'danger',
          message: '保存Satellite失败！'
        })
      }
    },
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
  margin: 10px 50px
}

.btn-back {
  margin: 10px 0;
}

.detail-form {
  margin: 20px 0;
}

.el-input {
  width: 600px;
}

.btn-add,
.btn-save {
  margin-top: 30px;
}
</style>