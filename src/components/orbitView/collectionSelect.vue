<template >
  <div id="select-wrap">
    <div class="select-list-header">已选卫星列表</div>
    <div class="select-list">
      <el-select class="select" v-model="collection" value-key="id"
        filterable placeholder="请选择Collection">
        <el-option v-for="item in collectionList" :key="item.id" :value="item" :label="item.name">
        </el-option>
      </el-select>
      <el-button class="btn-show" @click="showOrbits">展示轨道</el-button>
    </div>
    <div class="select-table">
      <el-table :data="satelliteList" 
        border max-height="310" style="width: 100%" 
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
export default {
  name: 'CollectionSelect',
  data() {
    return {
      collectionList: [], // 所有Collection列表
      // 已选Collection
      collection: {
        id: '',
        name: '',
      },
      assignmentList: [],
      satelliteList: [],
    }
  },
  watch: {
    collection: {
      deep: true,
      handler() {
        this.getAssignmentData()
      }
    }
  },
  methods: {
    // 获取collection列表
    async getCollectionData() {
      let result = await this.$API.collection.reqAllCollections()
      if (result.status == 0) {
        this.collectionList = result.data
      }
    },
    // 获取Assignment
    async getAssignmentData() {
      // 获取assignment
      let result = await this.$API.assignment.reqAssignmentByCollection(parseInt(this.collection.id))
      console.log(result.message)
      if (result.status == 0) {
        this.assignmentList = result.data
        await this.getSatData()
      } else {
        this.$message({
          type: 'danger',
          message: '获取Assignment列表失败！'
        })
      }
    },
    // 获取卫星列表
    async getSatData() {
      let sList = []
      for (let i = 0; i < this.assignmentList.length; i++) {
        sList.push(this.assignmentList[i].satellite_id)
      }
      let result = await this.$API.sat.reqSatByIdList(sList)
      console.log(result.message)
      if (result.status == 0) {
        this.satelliteList = result.data
      } else {
        this.$message({
          type: 'danger',
          message: '获取卫星列表失败！'
        })
      }
    },
    showOrbits() {
      if (this.satelliteList) {
        this.$bus.$emit('createOrbits', this.satelliteList)
      }
    },
    handleClick(row) {
      console.log('handleClick', row.id)
      // 获取实体信息
      this.$bus.$emit('getEntity', row.id)
    }
  },
  mounted() {
    this.getCollectionData()
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