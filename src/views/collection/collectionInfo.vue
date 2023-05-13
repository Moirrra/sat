<template>
  <div id="detail-wrap">
    <div>
      <el-button class="btn-back" @click="goBack()">返回</el-button>
      <span class="col-name">{{ collection.name }}</span>
    </div>
    <div class="tab">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="卫星" name="sat">
          <div class="satellite-table">
            <el-table :data="satelliteList" border stripe max-height="480" style="width: 90%"
              @selection-change="handleSelectionChange" :row-key="getRowKeys">
              <el-table-column type="selection" :reserve-selection="true" width="50" :resizable="false">
              </el-table-column>
              <el-table-column fixed type="index" align="center" :resizable="false">
              </el-table-column>
              <el-table-column fixed prop="id" label="Norad ID" :resizable="false">
              </el-table-column>
              <el-table-column fixed prop="name" label="Satellite Name" :resizable="false">
              </el-table-column>
            </el-table>
            <div class="btn">
              <el-button type="primary" @click="handleEdit">编辑Collection</el-button>
              <el-button @click="handleRemoveSelection">删除所选卫星</el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="星间链路" name="link">
          <div class="link-table">
            <el-table :data="linkList" border stripe max-height="480" style="width: 90%"
              @selection-change="handleLinkSelectionChange" :row-key="getLinkRowKeys">
              <el-table-column type="selection" :reserve-selection="true" width="50" :resizable="false">
              </el-table-column>
              <el-table-column fixed type="index" align="center" :resizable="false">
              </el-table-column>
              <el-table-column fixed prop="from_id" label="起点Norad ID" :resizable="false">
              </el-table-column>
              <el-table-column fixed prop="from_name" label="起点卫星名称" :resizable="false">
              </el-table-column>
              <el-table-column fixed prop="to_id" label="终点Norad ID" :resizable="false">
              </el-table-column>
              <el-table-column fixed prop="to_name" label="终点卫星名称" :resizable="false">
              </el-table-column>
              <el-table-column fixed label="颜色" width="50" :resizable="false">
                <template slot-scope="scope">
                  <el-color-picker v-model="scope.row.color" :disabled="true" color-format="hex" size="mini">
                  </el-color-picker>
                </template>
              </el-table-column>
            </el-table>
            <div class="btn">
              <el-button type="primary" @click="handleAddLink">添加链路</el-button>
              <el-button @click="handleRemoveLinkSelection">删除所选链路</el-button>
            </div>
            <div class="link-create">
              <el-dialog title="添加链路" :visible.sync="dialogFormVisible" width="40%">
                <div class="select-list">
                  <div class="select">
                    <span class="label">From:</span>
                    <el-select class="select-from" v-model="linkInfo.from_id" value-key="from_id" filterable placeholder="起点卫星">
                      <el-option v-for="item in satelliteList" :key="item.id" :value="item.id" :label="item.id + ': ' + item.name">
                      </el-option>
                    </el-select>
                  </div>
                  <div class="select">
                    <span class="label">To:</span>
                    <el-select class="select-to" v-model="linkInfo.to_id" value-key="to_id" filterable placeholder="终点卫星">
                      <el-option v-for="item in satelliteList" :key="item.id" :value="item.id" :label="item.id + ': ' + item.name">
                      </el-option>
                    </el-select>
                  </div>
                  <div class="select">
                    <span class="label">Color:</span>
                    <el-color-picker v-model="linkInfo.color" size="mini">
                    </el-color-picker>
                  </div>
                </div>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogFormVisible = false">取 消</el-button>
                  <el-button type="primary" @click="handleConfirmAddLink">确 定</el-button>
                </div>
              </el-dialog>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
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
      activeName: 'sat', // 当前tab
      assignmentList: [], // collection对应assignment
      satelliteList: [], // collection下所有卫星
      satelliteMap: null,
      selection: [], // 所选卫星
      linkList: [], // collection下所有星间链路
      linkSelection: [],
      dialogFormVisible: false,
      linkInfo: {
        collection_id: '',
        from_id: '',
        to_id: '',
        color: '',
      }
    }
  },
  methods: {
    // 返回Collection
    goBack() {
      this.$router.push('/collection')
    },
    async getData() {
      await this.getCollectionData()
      await this.getAssignmentData()
      await this.getSatData()
      await this.getLinkData()
    },
    // 获取Collection
    async getCollectionData() {
      let result = await this.$API.collection.reqCollectionById(this.$route.params.id)
      console.log(result.message)
      if (result.status == 0) {
        this.collection = result.data
      } else {
        this.$message.info('获取Collection数据失败！')  
      }
    },
    // 获取Assignment
    async getAssignmentData() {
      // 获取assignment
      let result = await this.$API.assignment.reqAssignmentByCollection(parseInt(this.$route.params.id))
      console.log(result.message)
      if (result.status == 0) {
        this.assignmentList = result.data
      } else {
        this.$message.error('获取Assignment列表失败！')
      }
    },
    // 获取卫星列表
    async getSatData() {
      let sList = []
      this.satelliteMap = new Map()
      for (let i = 0; i < this.assignmentList.length; i++) {
        sList.push(this.assignmentList[i].satellite_id)
      }
      let result = await this.$API.sat.reqSatByIdList(sList)
      console.log(result.message)
      if (result.status == 0) {
        this.satelliteList = result.data
        this.satelliteList.forEach(item => {
          this.satelliteMap.set(item.id, item.name)
        })
      } else {
        this.$message.info('获取卫星列表失败！')
      }
    },
    async getLinkData() {
      this.linkList = []
      let result = await this.$API.link.reqLinkByCollection(this.collection.id)
      if (result.status == 0) {
        let list = result.data
        for (let i = 0; i < list.length; i++) {
          const link = {
            "id": list[i].id,
            "from_id": list[i].from_id,
            "from_name": this.satelliteMap.get(list[i].from_id),
            "to_id": list[i].to_id,
            "to_name": this.satelliteMap.get(list[i].to_id),
            "color": list[i].color,
          }
          this.linkList.push(link)
        }
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
        this.$message.info('已取消删除')
      })
    },
    // 删除所选卫星
    removeSelection() {
      // 请求队列
      let queue = []
      this.selection.forEach((sat) => {
        // 筛选卫星对应的的assignment
        let res = this.assignmentList.find((item) => {
          return item.satellite_id == sat.id
        })
        queue.push(this.$API.assignment.reqDeleteAssignment(res.id))
        queue.push(this.$API.link.reqDeleteLinkByColSat(this.collection.id, sat.id))
      })
      Promise.all(queue).then(async (results) => {
        console.log(results[0].message)
        if (results[0].status == 0) {
          this.$message.success('删除所选卫星成功!')
          this.selection = []
          await this.getAssignmentData()
          await this.getSatData()
          await this.getLinkData()
        } else {
          this.$message.error('删除所选卫星失败！')
        }
      }).catch(() => {
        this.$message.error('删除所选卫星失败！')
      })
    },
    // 星间链路
    // 处理多选变化事件
    handleLinkSelectionChange(selectedList) {
      this.linkSelection = selectedList
    },
    getLinkRowKeys(row) {
      return row.id
    },
    // 添加链路的回调
    handleAddLink() {
      this.linkInfo = {
        collection_id: this.collection.id,
        from_id: '',
        to_id: '',
        color: '#FFFFFF',
      }
      this.dialogFormVisible = true
    },
    async handleRemoveLinkSelection() {
      this.$confirm('此操作将永久删除所选链路, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.removeLinkSelection()
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    removeLinkSelection() {
      // 请求队列
      let queue = []
      this.linkSelection.forEach((link) => {
        queue.push(this.$API.link.reqDeleteLink(link.id))
      })
      Promise.all(queue).then(async (results) => {
        console.log(results[0].message)
        if (results[0].status == 0) {
          this.$message.success('删除所选链路成功!')
          this.linkSelection = []
          await this.getLinkData()
        } else {
          this.$message.error('删除所选链路失败！')
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    async handleConfirmAddLink() {
      // 起点和终点不能相同
      if (this.linkInfo.from_id == this.linkInfo.to_id) {
        this.$message.error('起点和终点不能相同！')
        return
      }
      // 判断是否已存在相同链路
      for (let i = 0; i < this.linkList.length; i++) {
        if (this.linkList[i].from_id == this.linkInfo.from_id && this.linkList[i].to_id == this.linkInfo.to_id) {
          this.$message.error('不可重复添加相同链路！')
          return
        }
      }
      let result = await this.$API.link.reqCreateLink(this.linkInfo)
      if (result.status == 0) {
        await this.getLinkData()
        this.dialogFormVisible = false
        this.$message.success('添加链路成功！')
      } else {
        this.$message.error('添加链路失败！')
      }
    }
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

.satellite-table,
.btn {
  margin-top: 10px
}

.select-list {
  display: flex;
  flex-direction: column;
}

.label {
  display: inline-block;
  width: 100px;
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
}
</style>