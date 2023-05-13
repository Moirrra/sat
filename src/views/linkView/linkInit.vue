<template >
  <div id="link-wrap">
    <div class="link-header">创建连线</div>
    <div class="link-create">
      <div class="select-list">
        <div class="select">
          <span class="label">From:</span>
          <el-select class="select-from" v-model="from_id" value-key="from_id" filterable placeholder="起点卫星">
            <el-option v-for="item in satelliteList" :key="item.id" :value="item.id" :label="item.id + ': ' + item.name">
            </el-option>
          </el-select>
        </div>
        <div class="select">
          <span class="label">To:</span>
          <el-select class="select-to" v-model="to_id" value-key="to_id" filterable placeholder="终点卫星">
            <el-option v-for="item in satelliteList" :key="item.id" :value="item.id" :label="item.id + ': ' + item.name">
            </el-option>
          </el-select>
        </div>
        <div class="select">
          <span class="label">Color:</span>
          <el-color-picker v-model="color" size="mini">
          </el-color-picker>
        </div>
        <el-button class="btn-create" @click="createLink">
          创建
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LinkInit',
  data() {
    return {
      satelliteList: [],
      assignmentList: [],
      from_id: "",
      to_id: "",
      color: "#FFFFFF",
    }
  },
  mounted() {

  },
  methods: {
    // 获取Assignment
    async getAssignmentData(collection_id) {
      // 获取assignment
      let result = await this.$API.assignment.reqAssignmentByCollection(collection_id)
      console.log(result.message)
      if (result.status == 0) {
        this.assignmentList = result.data
        await this.getSatData()
      } else {
        this.$message.error('获取Assignment列表失败！')
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
        this.$message.error('获取卫星列表失败！')
      }
    },
    // 点击创建卫星的回调
    createLink() {
      if (this.from_id && this.to_id) {
        this.$emit('createLink', this.from_id, this.to_id, this.color)
      }
    }
  },
}
</script>
<style scoped>
.link-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 10px;
  height: 30px;
  background-color: #eee;
  border-bottom: 1px solid #dee2e6;
  font-size: 14px;
}

.link-create {
  padding: 10px;
  display: flex;
}

.select-list {
  display: flex;
  flex-direction: column;
}

.label {
  display: inline-block;
  width: 80px;
  font-size: 14px;
}

.select {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.select-from,
.select-to {
  width: 220px;
}

.btn-create {
  width: 200px;
  margin-left: 80px;
}

</style>