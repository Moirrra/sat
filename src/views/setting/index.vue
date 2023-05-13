<template>
  <div id="setting-wrap">
    <div class="setting-list">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item name="1">
          <template slot="title">
            <div class="title">上传TLE文件</div>
          </template>
          <div class="content">
            <div class="description">上传卫星TLE文件, 加载至Satellite数据库中</div>
            <el-upload class="upload-demo" ref="upload_tle" accept=".txt" :file-list="fileList" :http-request="uploadTLE"
              action="#" :auto-upload="false" multiple>
              <div class="btn-list">
                <template>
                  <el-button slot="trigger" size="small">选择文件</el-button>
                </template>
                <template>
                  <el-button style="margin-left: 10px;" size="small" type="primary"
                    @click.stop="handleUploadTLE">上传</el-button>
                </template>
              </div>
              <div slot="tip" class="el-upload__tip">支持文件格式: txt, 大小不超过2M</div>
            </el-upload>
          </div>
        </el-collapse-item>
        <el-collapse-item name="2">
          <template slot="title">
            <div class="title">更新TLE数据</div>
          </template>
          <div class="content">
            <div class="description">更新数据库 (数据来源: satNOGS DB)</div>
            <el-button @click="updateSat" :loading="updateSatLoading">更新卫星轨道数据</el-button>
            <el-button @click="updateSatInfo" :loading="updateSatInfoLoading">更新卫星信息</el-button>
          </div>
        </el-collapse-item>
        <el-collapse-item name="3">
          <template slot="title">
            <div class="title">默认地面站设置</div>
          </template>
          <div class="content">
            <div class="description">
              <div class="detail-form">
                <el-form label-position="left" label-width="80px" :model="groundStation" clearable>
                  <el-form-item label="纬度(°)">
                    <el-input v-model="groundStation.latitude" oninput="value=value.replace(/[^0-9.]/g,'')"
                      clearable></el-input>
                  </el-form-item>
                  <el-form-item label="经度(°)">
                    <el-input v-model="groundStation.longitude" oninput="value=value.replace(/[^0-9.]/g,'')"
                      clearable></el-input>
                  </el-form-item>
                  <el-form-item label="高度(km)">
                    <el-input v-model="groundStation.height" oninput="value=value.replace(/[^0-9.]/g,'')"
                      clearable></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <el-button type="primary" @click="handleSave">保存</el-button>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Setting',
  data() {
    return {
      activeNames: [],
      fileList: [],
      fileList1: [],
      updateSatLoading: false,
      updateSatInfoLoading: false,
      groundStation: {
        latitude: '',
        longitude: '',
        height: '',
      }
    }
  },
  mounted() {
    let gs = this.$store.state.groundStation
    this.groundStation = gs
  },
  methods: {
    handleChange(val) {
      console.log(val);
    },
    // 点击上传TLE的回调
    handleUploadTLE() {
      this.$refs.upload_tle.submit()
    },
    async uploadTLE(param) {
      let file = param.file
      // 文件类型&大小
      const isTXT = file.name.split('.')[1] === 'txt'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isTXT) {
        this.$message.error('上传文件只能是 txt 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传单个文件大小不能超过 10MB!')
        return false
      }
      // 上传文件
      let formData = new FormData()
      formData.append('file', file)
      let result = await this.$API.data.reqUploadTLE(formData)
      if (result.status == 0) {
        this.$message.success('上传文件成功!')
      } else {
        this.$message.error('上传文件失败!')
      }
    },
    handleUploadCOL() {
      this.$refs.upload_col.submit()
    },
    // 点击更新数据库
    async updateSat() {
      this.updateSatLoading = true
      let result = await this.$API.data.reqDownloadSat()
      this.updateSatLoading = false
      console.log(result.message)
      if (result.status == 0) {
        this.$message.success('更新数据库satellite成功!')
      } else {
        this.$message.error('更新数据库satellite失败!')
      }
    },
    async updateSatInfo() {
      this.updateSatInfoLoading = true
      let result = await this.$API.data.reqDownloadSatInfo()
      this.updateSatInfoLoading = false
      console.log(result.message)
      if (result.status == 0) {
        this.$message.success('更新数据库satellite_info成功!')
      } else {
        this.$message.error('更新数据库satellite_info失败!')
      }
    },
    // 点击保存地面站的回调
    handleSave() {
      this.groundStation.latitude = parseFloat(this.groundStation.latitude)
      this.groundStation.longitude = parseFloat(this.groundStation.longitude)
      this.groundStation.height = parseFloat(this.groundStation.height)
      this.$store.commit('SET_DEFAULT_GROUND_STATION', this.groundStation)
    },
  },
}
</script>

<style scoped>
#setting-wrap {
  width: 100%;
  height: 100%;
  min-height: 700px;
  padding: 50px 0;
  background-color: #eee;
}

.setting-list {
  width: 800px;
  height: 100%;
  margin: 0 auto;
  padding: 0 10px;
  border-radius: 5px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  background-color: #fff;
}


.title {
  font-size: 16px;
  padding-left: 10px;
}

.content {
  margin: 10px 10px;
  min-height: 80px;
}

.description {
  margin-bottom: 10px;
}

.detail-form {
  width: 500px;
}
</style>