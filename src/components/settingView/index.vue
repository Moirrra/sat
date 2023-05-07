<template>
  <div id="setting-wrap">
    <div class="setting-list">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item name="1">
          <template slot="title">
            <div class="title">上传TLE文件</div>
          </template>
          <div class="content">
            <div class="description">上传多个卫星TLE文件, 加载至Satellite数据库中</div>
            <el-upload class="upload-demo" ref="upload_tle" action="" accept=".txt" :file-list="fileList"
              :before-upload="beforeUpload" :auto-upload="false">
              <div class="btn-list">
                <el-button slot="trigger" size="small">选择文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="primary" @click="uploadTLE">上传</el-button>
              </div>
              <div slot="tip" class="el-upload__tip">支持文件格式: txt</div>
            </el-upload>
          </div>
        </el-collapse-item>
        <el-collapse-item name="2">
          <template slot="title">
            <div class="title">上传Collection配置文件</div>
          </template>
          <div class="content">
            <div class="description">上传Collection配置文件, 加载至数据库中</div>
            <el-upload class="upload-demo" ref="upload_col" action="" accept=".txt" :file-list="fileList"
              :before-upload="beforeUpload" :auto-upload="false">
              <div class="btn-list">
                <el-button slot="trigger" size="small">选择文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="primary" @click="uploadCOL">上传</el-button>
              </div>
              <div slot="tip" class="el-upload__tip">支持文件格式: txt</div>
            </el-upload>
          </div>
        </el-collapse-item>
        <el-collapse-item name="3">
          <template slot="title">
            <div class="title">更新TLE数据</div>
          </template>
          <div class="content">
            <div class="description">更新数据库 (数据来源: satNOGS DB)</div>
            <el-button @click="updateSat" :loading="updateSatLoading">更新卫星轨道数据</el-button>
            <el-button @click="updateSatInfo" :loading="updateSatInfoLoading">更新卫星信息</el-button>
          </div>
        </el-collapse-item>
        <el-collapse-item name="4">
          <template slot="title">
            <div class="title">Title</div>
          </template>
          <div class="content">
            <div class="description">description</div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingView',
  data() {
    return {
      activeNames: [],
      fileList: [],
      updateSatLoading: false,
      updateSatInfoLoading: false,
    }
  },
  methods: {
    handleChange(val) {
      console.log(val);
    },
    uploadTLE() {
      this.$refs.upload_tle.submit()
    },
    uploadCOL() {
      this.$refs.upload_col.submit()
    },
    beforeUpload(file) {
      const isTXT = file.type === 'txt'
      if (!isTXT) {
        this.$message.error('上传文件只能是 txt 格式!');
      }
      return isTXT
    },
    // 点击更新数据库
    async updateSat() {
      this.updateSatLoading = true
      let result = await this.$API.data.reqDownloadSat()
      this.updateSatLoading = false
      console.log(result.message)
      if (result.status == 0) {
        this.$message({
          type: 'success',
          message: '更新数据库satellite成功!'
        })
      } else {
        this.$message({
          type: 'danger',
          message: '更新数据库satellite失败!'
        })
      }
    },
    async updateSatInfo() {
      this.updateSatInfoLoading = true
      let result = await this.$API.data.reqDownloadSatInfo()
      this.updateSatInfoLoading = false
      console.log(result.message)
      if (result.status == 0) {
        this.$message({
          type: 'success',
          message: '更新数据库satellite_info成功!'
        })
      } else {
        this.$message({
          type: 'danger',
          message: '更新数据库satellite_info失败!'
        })
      }
    }
  }
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
</style>