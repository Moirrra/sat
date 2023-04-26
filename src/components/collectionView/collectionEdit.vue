<template>
  <div id="detail-wrap">
    <div class="btn-back" @click="goBack()">
      <el-button>返回</el-button>
    </div>
    <div class="detail-form">
      <el-form label-position="left" label-width="120px" :model="collectionInfo">
        <el-form-item label="collection_id" v-show="$route.params.id">
          <el-input v-model="collectionInfo.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="name">
          <el-input v-model="collectionInfo.name"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-view">
      <div class="table-option">
        <el-button type="text" @click="defaultSelect" v-show="$route.params.id">勾选原有卫星</el-button>
        <div class="search">
          <el-input class="search-input" v-model="search" size="mini" placeholder="输入norad_id搜索" />
          <el-button type="primary" size="small" @click="handleSearch">搜索</el-button>
        </div>
      </div>
      <div class="satellite-table">
        <el-table :data="showData" border stripe min-height="300" style="width: 90%" ref="multipleTable"
          @selection-change="handleSelectionChange" :row-key="getRowKeys">
          <el-table-column type="selection" :reserve-selection="true" width="50" :resizable="false">
          </el-table-column>
          <el-table-column fixed prop="id" label="Norad ID" :resizable="false">
          </el-table-column>
          <el-table-column fixed prop="name" label="Satellite Name" :resizable="false">
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination :page-size="pageSize" :pager-count="11" layout="total, prev, pager, next, jumper"
          :total="filterData.length" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </div>
    <div class="selection-view">
      <div class="label">已选择：</div>
      <div class="tag-list">
        <el-tag closable class="tag" v-for="tag in selection" :key="tag.id"
          @close="handleCloseTag(tag)">{{ tag.id }}</el-tag>
      </div>
    </div>
    <div class="btn-save" @click="handleSave" v-if="$route.params.id">
      <el-button type="primary">保存Collection</el-button>
    </div>
    <div class="btn-save" @click="handleCreate" v-else>
      <el-button type="primary">创建Collection</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CollectionEdit',
  data() {
    return {
      // 当前Collection
      collectionInfo: {
        id: '',
        name: '',
      },
      satelliteList: [], // 所有卫星列表
      satIdList: [], // 原来的卫星列表
      selection: [], // 选中卫星列表
      filterData: [], // 过滤搜索的表格数据
      currentPage: 1, // 当前页码
      pageSize: 5, // 每页展示数据条数
      search: '', // 搜索关键字
    }
  },
  computed: {
    // 表格展示的分页数据
    showData() {
      return this.filterData.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize)
    }
  },
  methods: {
    // 返回Collection
    goBack() {
      this.$router.push('/collection')
    },
    // 返回CollectionInfo
    goCollectionInfo() {
      this.$router.push({
        name: 'Collection详情',
        params: {
          id: this.collectionInfo.id
        }
      })
    },
    // 获取当前Collection数据
    async getCollectionData() {
      if (!this.$route.params.id) return
      let result = await this.$API.collection.reqCollectionById(this.$route.params.id)
      console.log(result.message)
      if (result.status == 0) {
        this.collectionInfo.id = result.data.id
        this.collectionInfo.name = result.data.name
      } else {
        this.$message({
          type: 'danger',
          message: '获取Collection数据失败！'
        })
      }
    },
    // 获取原有卫星列表
    async getAssignmentData() {
      if (!this.$route.params.id) return
      let result = await this.$API.assignment.reqAssignmentByCollection(this.$route.params.id)
      console.log(result.message)
      if (result.status == 0) {
        let aList = result.data
        for (let i = 0; i < aList.length; i++) {
          this.satIdList.push(aList[i].satellite_id)
        }
      } else {
        this.$message({
          type: 'danger',
          message: '获取Assignment列表失败！'
        })
      }
    },
    // 获取所有卫星列表
    async getSatData() {
      let result = await this.$API.sat.reqAllSats()
      console.log(result.message)
      if (result.status == 0) {
        this.satelliteList = result.data
        this.filterData = this.satelliteList
      } else {
        this.$message({
          type: 'danger',
          message: '获取卫星列表失败！'
        })
      }
    },
    getRowKeys(row) {
      return row.id
    },
    // 多选变化事件
    handleSelectionChange(selectedList) {
      this.selection = selectedList
    },
    // 勾选原有卫星
    defaultSelect() {
      let list = []
      this.satelliteList.forEach((item) => {
        this.satIdList.forEach(val => {
          if (val == item.id) {
            list.push(item)
          }
        })
      })
      if (list) {
        list.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, true)
        })
      }
    },
    // 删除标签
    handleCloseTag(tag) {
      this.$refs.multipleTable.toggleRowSelection(tag, false)
    },
    // 根据搜索过滤表格数据
    handleSearch() {
      this.currentPage = 1
      let filterSearch = this.search.trim()
      if (!filterSearch) {
        this.filterData = this.satelliteList
        return
      }
      let filterResource = this.satelliteList.filter(item => {
        if (String(item.id).includes(filterSearch)) {
          return item
        }
      })
      this.filterData = filterResource
    },
    // 页数变化事件
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
    },
    // 点击保存Collection
    async handleSave() {
      let result = await this.$API.collection.reqUpdateCollection(this.collectionInfo)
      if (result.status == 0) {
        console.log(result.message)
      } else {
        console.log(result.message)
      }
      // 已有 删除原有assignment
      if (this.satIdList.length > 0) {
        let result1 = await this.$API.assignment.reqDeleteAssignmentByCollection(this.collectionInfo.id)
        if (result1.status == 0) {
          console.log(result1.message)
        } else {
          console.log(result1.message)
        }
      }
      // 新增assignment
      let queue = []
      let c_id = this.collectionInfo.id
      this.selection.forEach((item) => {
        queue.push(this.$API.assignment.reqCreateAssignment(c_id, item.id))
      })
      Promise.all(queue).then((results) => {
        if (results[0].status == 0) {
          console.log(results[0].message)
          this.$message({
            type: 'success',
            message: '保存Collection成功!'
          })
          this.goCollectionInfo()
        } else {
          console.log(results[0].message)
          this.$message({
            type: 'danger',
            message: '保存Collection失败！'
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 点击创建Collection
    async handleCreate() {
      // 创建collection
      let result = await this.$API.collection.reqCreateCollection(this.collectionInfo.name)
      if (result.status == 0) {
        this.collectionInfo.id = result.data.collection_id
      } else {
        console.log(result.message)
      }
      // 创建assignment
      let c_id = this.collectionInfo.id
      let queue = []
      this.selection.forEach((item) => {
        queue.push(this.$API.assignment.reqCreateAssignment(c_id, item.id))
      })
      Promise.all(queue).then((results) => {
        console.log(results[0].message)
        if (results[0].status == 0) {
          this.$message({
            type: 'success',
            message: '创建Collection成功!'
          })
          this.goCollectionInfo()
        } else {
          this.$message({
            type: 'danger',
            message: '创建Collection失败！'
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    },
  },
  created() {
    this.getSatData()
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

.detail-form {
  margin: 20px 0;
}

.el-input {
  width: 600px;
}


.btn-save {
  margin: 10px 0;
}

.table-option {
  width: 1000px;
  display: flex;
  justify-content: space-between;
}

.search {
  margin: 10px 0 20px 0;
}

.search-input {
  width: 200px;
  margin-right: 10px;
}

.pagination {
  text-align: center;
}

.selection-view {
  width: 800px;
  margin: 10px;
  display: flex;
  align-items: center;
}

.label {
  width: 80px;

}

.tag {
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>