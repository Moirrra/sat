<template >
  <div id="pass-info">
    <div class="info-view">
      <div class="pass-info-header">
        <span>过境时间</span>
      </div>
      <div class="pass-info-content">
        <!-- <div class="current-time">
          (当前时间：{{ currentTime }})
        </div> -->
        <el-table :data="passList" 
          border height="410" style="width: 100%" >
          <el-table-column fixed prop="countdown" label="Countdown" width="100" align="center" :resizable="false">
          </el-table-column>
          <el-table-column fixed prop="start" label="Start" align="center" :resizable="false">
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
export default {
  name: 'PassDetail',
  props: ['passList'],
  data() {
    return {
      currentTime: '暂无',
    }
  },
  methods: {

  },
}
</script>

<style scoped>
.pass-info-header {
  display: flex;
  align-items: center;
  padding-left: 10px;
  height: 30px;
  background-color: #eee;
  border-bottom: 1px solid #dee2e6;
  font-size: 14px;
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

.pass-info-content {
  padding: 5px;
  min-height: 410px;
  display: flex;
  flex-direction: column;
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