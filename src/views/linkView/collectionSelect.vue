<template >
  <div id="select-wrap">
    <div class="select-list-header">已选卫星列表</div>
    <div class="select-list">
      <el-select class="select" v-model="collection" value-key="id"
        filterable placeholder="请选择Collection">
        <el-option v-for="item in collectionList" :key="item.id" :value="item" :label="item.name">
        </el-option>
      </el-select>
      <el-button class="btn-show" @click="showOrbits">展示卫星</el-button>
    </div>
    <div class="select-table">
      <el-table :data="satelliteList" 
        border height="150" style="width: 100%" 
        @row-click="handleClick">
        <el-table-column fixed type="index" align="center" :resizable="false">
        </el-table-column>
        <el-table-column fixed prop="id" label="norad_id" width="90" :resizable="false">
        </el-table-column>
        <el-table-column fixed prop="name" label="卫星名称" :resizable="false">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mixins } from "@/mixin/collectionSelect"
export default {
  name: 'CollectionSelect',
  mixins: [mixins],
  data() {
    return {
    }
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
  padding: 10px;
  display: flex;
}

.select {
  width: 210px;
  margin-right: 5px;
}

.btn-show {
  width: 100px;
}

.select-table {
  padding: 0 10px;
  margin-bottom: 10px;
}
</style>