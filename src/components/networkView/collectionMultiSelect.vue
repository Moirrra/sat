<template >
  <div id="select-wrap">
    <div class="select-list-header">Collection列表</div>
    <div class="select-table">
      <el-table :data="collectionList" 
        border max-height="310" style="width: 100%" 
        @selection-change="handleSelectionChange" :row-key="getRowKeys">
        <el-table-column type="selection" :reserve-selection="true" width="40" :resizable="false">
        </el-table-column>
        <el-table-column fixed prop="name" label="名称" :resizable="false">
        </el-table-column>
        <el-table-column fixed label="轨道颜色" width="80" :resizable="false">
          <template slot-scope="scope">
            <el-color-picker v-model="colorObj['val' + scope.row.id]" 
            show-alpha size="mini">
            </el-color-picker>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-button class="btn-show" @click="showOrbits">展示轨道</el-button>
  </div>
</template>

<script>
export default {
  name: 'CollectionMultiSelect',
  data() {
    return {
      collectionList: [], // 所有Collection列表
      selectedCollections: [], // 选中的Collection列表 id name color
      assignmentList: [],
      satelliteList: [],
      colorList: [], // 选中collection的颜色
      // 颜色选择器中的颜色  
      // colorObj['val101'] 表示id为101的collection轨道颜色
      colorObj: {}, 
    }
  },
  methods: {
    // 获取所有collection列表
    async getCollectionData() {
      let result = await this.$API.collection.reqAllCollections()
      if (result.status == 0) {
        this.collectionList = result.data
      }
      for(let i = 0; i < this.collectionList.length; i++) {
        let color = this.generateColor()
        this.$set(this.colorObj, 'val'+ this.collectionList[i].id, color)
      }
    },
    generateColor() {
      let colorArr = [
        Math.floor(100 + 155 * Math.random(0, 1)),
        Math.floor(100 + 155 * Math.random(0, 1)),
        Math.floor(100 + 155 * Math.random(0, 1)),
        1
      ]
      return 'rgba(' + colorArr.join(',') + ')'
    },
    // 获取Assignment
    async getAssignmentData() {
      this.assignmentList = []
      for (let i = 0; i < this.selectedCollections.length; i++) {
        // 获取assignment
        let result = await this.$API.assignment.reqAssignmentByCollection(this.selectedCollections[i].id)
        console.log(result.message)
        if (result.status == 0) {
          this.assignmentList.push(result.data)
        } else {
          this.$message({
            type: 'danger',
            message: '获取Assignment列表失败！'
          })
        }
      }
      await this.getSatData()
    },
    // 获取卫星列表
    async getSatData() {
      let sList = []
      this.satelliteList = []
      for (let i = 0; i < this.assignmentList.length; i++) {
        sList[i] = []
        for (let j = 0; j < this.assignmentList[i].length; j++) {
          sList[i].push(this.assignmentList[i][j].satellite_id)
        }
      }

      for (let i = 0; i < sList.length; i++) {
        let result = await this.$API.sat.reqSatByIdList(sList[i])
        console.log(result.message)
        if (result.status == 0) {
          this.satelliteList.push(result.data)
        } else {
          this.$message({
            type: 'danger',
            message: '获取卫星列表失败！'
          })
        }
      }
    },
    async showOrbits() {
      await this.getAssignmentData()
      this.colorList = []
      for (let i = 0; i < this.selectedCollections.length; i++) {
        this.colorList.push(this.colorObj['val'+this.selectedCollections[i].id])
      }
      this.$bus.$emit('createOrbitsNetwork', this.satelliteList, this.colorList)
    },
    // 处理多选变化事件
    handleSelectionChange(selectedList) {
      console.log('change')
      this.selectedCollections = selectedList
    },
    getRowKeys(row) {
      return row.id
    },
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
  margin-left: 220px;
}

.select-table {
  padding: 0 10px;
  margin: 10px 5px;
}
</style>