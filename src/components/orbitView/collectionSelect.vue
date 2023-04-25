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
      <el-table :data="satelliteList" border max-height="310" style="width: 100%" @row-click="handleClick">
        <el-table-column fixed prop="id" label="norad_id" width="100" :resizable="false">
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
      collectionList: [],
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
        this.getSatData()
      }
    }
  },
  methods: {
    // 向服务请请求获取collection列表
    async getCollectionData() {
      let result = await this.$API.collection.reqAllCollections()
      if (result.status == 0) {
        this.collectionList = result.data
      }
    },
    async getSatData() {
      console.log('getSatData')
      // 获取assignment
      let result1 = await this.$API.assignment.reqAssignmentByCollection(this.collection.id)
      if (result1.status == 0) {
        this.assignmentList = result1.data
        let sList = []
        for (let i = 0; i < this.assignmentList.length; i++) {
          sList.push(this.assignmentList[i].satellite_id)
        }
        // 获取卫星信息
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
    showOrbits() {
      if (this.satelliteList) {
        this.$emit('createOrbits', this.satelliteList)
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
#select-wrap {
}
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