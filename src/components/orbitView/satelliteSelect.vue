<template >
  <div id="sat-select">
    <div class="select-list-header">已选卫星列表</div>
    <div class="select-list">
      <el-select class="select" multiple v-model="values" value-key="satellite_id" filterable placeholder="请选择">
        <el-option v-for="(item, index) in satList" :key="index" :value="item" :label="item.name"></el-option>
      </el-select>
      <el-button class="btn-show" @click="showOrbits">展示轨道</el-button>
    </div>
    <div class="select-table">
      <el-table :data="values" border style="width: 100%" max-height="200" @row-click="handleClick">
        <el-table-column prop="satellite_id" label="norad_id" width="100">
        </el-table-column>
        <el-table-column prop="name" label="卫星名称" width="150">
        </el-table-column>
        <el-table-column prop="tle1" label="TLE1">
        </el-table-column>
        <el-table-column prop="tle2" label="TLE2">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'SatelliteSelect',
  data() {
    return {
      values: [],
      tableData: [],
    }
  },
  computed: {
    ...mapState({
      satList: state => state.satList,
    }),
  },
  methods: {
    // 向服务请请求获取默认卫星轨道数据
    getData() {
      this.$store.dispatch('getAllSats')
    },
    showOrbits() {
      if (this.values)
        this.$emit('createOrbits', this.values)
    },
    handleClick(row) {
      console.log('handleClick', row.satellite_id)
      // 获取实体信息
      this.$bus.$emit('getEntity', row.satellite_id)
    }
  },
  mounted() {
    this.getData()
  },

}
</script>
<style scoped>
.select-list-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 10px;
  height: 30px;
  background-color: #eee;
  border-bottom: 1px solid #dee2e6;
  font-size: 14px;
}

.select-list {
  padding: 5px;
  margin: 10px;
}

.select {
  min-width: 550px;
  max-width: 550px;
  margin-right: 10px;
}

.btn-show {
  width: 100px;
}

.select-table {
  padding: 0 10px;
}
</style>