<template>
  <div id="detail-wrap">
    <div>
      <el-button class="btn-back" @click="goBack()">返回</el-button>
      <span class="col-name">{{ collection.name }}</span>
    </div>
    <div class="satellite-table">
      <el-table :data="satelliteList" 
      border stripe max-height="480" style="width: 90%"
      @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50">
        </el-table-column>
        <el-table-column fixed type="index">
        </el-table-column>
        <el-table-column fixed prop="id" label="Norad ID" width="100">
        </el-table-column>
        <el-table-column fixed prop="name" label="Satellite Name" width="180">
        </el-table-column>
        <el-table-column fixed prop="tle1" label="TLE1">
        </el-table-column>
        <el-table-column fixed prop="tle2" label="TLE2">
        </el-table-column>
      </el-table>
    </div>
    <div class="btn">
      <el-button type="primary" @click="handleEdit()">编辑Collection</el-button>
      <el-button @click="handleRemove()" >删除所选卫星</el-button>
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
      assignmentList: [],
      satelliteList: [],
    }
  },
  methods: {
    async getData() {
      console.log(this.$route.params.id)
      // 获取Collection
      let result = await this.$API.collection.reqCollectionById(this.$route.params.id)
      if (result.status == 0) {
        this.collection = result.data
      } else {
        console.log(result.message)
      }
      // 获取卫星列表
      let result1 = await this.$API.assignment.reqAssignmentByCollection(parseInt(this.$route.params.id))
      if (result1.status == 0) {
        this.assignmentList = result1.data
        let sList = []
        for (let i = 0; i < this.assignmentList.length; i++) {
          sList.push(this.assignmentList[i].satellite_id)
        }
        console.log(sList)
          let result2 = await this.$API.sat.reqSatByIdList(sList)
          if (result2.status == 0) {
            this.satelliteList = result2.data
          } else {
            console.log(result2.message)
          }
      } else {
        console.log(result1.message)
      }
    },
    handleEdit() {
      this.$router.push({
        name: '编辑Collection',
        params: {
          id: this.$route.params.id,
        }
      })
    },
    async handleRemove(row) {
      for (let i = 0; i < this.assignmentList.length; i++) {
        if (row.id == this.assignmentList[i].satellite_id) {
          let result = await this.$API.assignment.reqDeleteAssignment(this.assignmentList[i].id)
          if (result.status == 0) {
            console.log(result.message)
            this.getData()
          } else {
            console.log(result.message)
          }
        }
      }
    },
    handleSelectionChange(selectedList) {
      console.log(selectedList)
    },
    goBack() {
      this.$router.push('/collection')
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

.satellite-table, .btn {
  margin-top: 10px
}


</style>