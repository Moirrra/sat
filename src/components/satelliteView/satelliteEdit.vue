<template>
  <div id="detail-wrap">
    <div class="btn-back" @click="goBack()">
      <el-button>返回</el-button>
    </div>
    <div class="detail-form">
      <el-form label-position="left" label-width="80px" :model="satInfo">
        <el-form-item label="norad_id">
          <el-input type="number" v-model.number="satInfo.id" :disabled="$route.params.id"></el-input>
        </el-form-item>
        <el-form-item label="name">
          <el-input v-model="satInfo.name" :disabled="$route.params.id"></el-input>
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
      <el-button type="primary">添加卫星</el-button>
    </div>
    <div class="btn-save" v-else>
      <el-button type="primary">保存结果</el-button>
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
      }
    }
  },
  methods: {
    goBack() {
      this.$router.push('/satellite')
    },
    async getData() {
      if (this.$route.params.id) {
        let result = await this.$API.sat.reqSatById(this.$route.params.id)
        if (result.status == 0) {
          this.satInfo.id = result.data.id
          this.satInfo.name = result.data.name
          this.satInfo.tle1 = result.data.tle1
          this.satInfo.tle2 = result.data.tle2
        } else {
          console.log(result.message)
        }
      }
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
  margin-left: 50px
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

.btn-add {
  margin: 10px 0;
}
</style>