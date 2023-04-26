<template>
  <div id="detail-wrap">
    <div>
      <el-button class="btn-back" @click="goBack()">返回</el-button>
      <span class="col-name">{{ collection.name }}</span>
    </div>
    <div class="satellite-table">
      <el-table :data="satelliteList" border stripe max-height="480" style="width: 90%"
        @selection-change="handleSelectionChange" :row-key="getRowKeys">
        <el-table-column type="selection" :reserve-selection="true" width="50" :resizable="false">
        </el-table-column>
        <el-table-column fixed type="index" :resizable="false">
        </el-table-column>
        <el-table-column fixed prop="id" label="Norad ID" width="100" :resizable="false">
        </el-table-column>
        <el-table-column fixed prop="name" label="Satellite Name" width="180" :resizable="false">
        </el-table-column>
        <el-table-column fixed prop="tle1" label="TLE1" :resizable="false">
        </el-table-column>
        <el-table-column fixed prop="tle2" label="TLE2" :resizable="false">
        </el-table-column>
      </el-table>
    </div>
    <div class="btn">
      <el-button type="primary" @click="handleEdit">编辑Collection</el-button>
      <el-button @click="handleRemoveSelection">删除所选卫星</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'collectionInfo',
  data() {
    return {
      collection: {
        id: '',
        name: '',
      },
      assignmentList: [], // collection对应assignment
      satelliteList: [], // collection下所有卫星
      selection: [], // 所选卫星
    }
  },
  methods: {
    // 返回Collection
    goBack() {
      this.$router.push('/collection')
    },
    // 获取Collection
    async getCollectionData() {
      let result = await this.$API.collection.reqCollectionById(this.$route.params.id)
      console.log(result.message)
      if (result.status == 0) {
        this.collection = result.data
      } else {
        this.$message({
          type: 'danger',
          message: '获取Collection数据失败！'
        })  
      }
    },
    // 获取Assignment
    async getAssignmentData() {
      // 获取assignment
      let result = await this.$API.assignment.reqAssignmentByCollection(parseInt(this.$route.params.id))
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
      // 
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
    // 处理多选变化事件
    handleSelectionChange(selectedList) {
      this.selection = selectedList
    },
    getRowKeys(row) {
      return row.id
    },
    // 点击编辑
    handleEdit() {
      this.$router.push({
        name: '编辑Collection',
        params: {
          id: this.$route.params.id,
        }
      })
    },
    // 点击删除所选卫星
    async handleRemoveSelection() {
      this.$confirm('此操作将永久删除所选卫星, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.removeSelection()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 删除所选卫星
    removeSelection() {
      // 请求队列
      let queue = []
      this.selection.forEach((sat) => {
        let res = this.assignmentList.find((item) => {
          return item.satellite_id == sat.id
        })
        queue.push(this.$API.assignment.reqDeleteAssignment(res.id))
      })
      Promise.all(queue).then((results) => {
        console.log(results[0].message)
        if (results[0].status == 0) {
          this.getSatData()
          this.$message({
            type: 'success',
            message: '删除所选卫星成功!'
          })
        } else {
          this.$message({
            type: 'danger',
            message: '删除所选卫星失败！'
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    },
  },
  mounted() {
    this.getCollectionData()
    this.getAssignmentData()
  },
}
</script>

<style scoped>
#detail-wrap {
  width: 100%;
  height: 100%;
  min-height: 600px;
  margin-left: 50px
}

.btn-back {
  margin: 10px 0;
}

.col-name {
  font-size: 20px;
  font-weight: 700;
  color: #4d4e59;
  margin: 0 20px;
}

.satellite-table,
.btn {
  margin-top: 10px
}
</style>