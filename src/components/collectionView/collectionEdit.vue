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
    <el-button type="text" @click="defaultSelect" v-show="$route.params.id">勾选原有卫星</el-button>
    <div class="search">
      <el-input class="search-input" v-model="search" size="mini" placeholder="输入norad_id搜索" />
      <el-button type="primary" size="small" @click="handleSearch">搜索</el-button>
    </div>
    <div class="satellite-table">
      <el-table :data="showData" stripe min-height="400" style="width: 95%" ref="multipleTable"
        @selection-change="handleSelectionChange" :row-key="getRowKeys">
        <el-table-column type="selection" :reserve-selection="true" width="50">
        </el-table-column>
        <el-table-column fixed prop="id" label="Norad ID" width="250">
        </el-table-column>
        <el-table-column fixed prop="name" label="Satellite Name">
        </el-table-column>
      </el-table>
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
import { mapState } from 'vuex'
export default {
  name: 'CollectionEdit',
  data() {
    return {
      collectionInfo: {
        id: '',
        name: '',
      },
      satIdList: [],
      selection: [],
      filterData: [],
      currentPage: 1,
      pageSize: 5,
      search: ''
    }
  },
  computed: {
    ...mapState({
      satelliteList: state => state.satList,
    }),
    // 表格展示的分页数据
    showData() {
      return this.filterData.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize)
    }
  },
  methods: {
    goBack() {
      this.$router.push('/collection')
    },
    async getCollectionData() {
      if (!this.$route.params.id) return
      let result = await this.$API.collection.reqCollectionById(this.$route.params.id)
      if (result.status == 0) {
        this.collectionInfo.id = result.data.id
        this.collectionInfo.name = result.data.name
      } else {
        console.log(result.message)
      }
    },
    async getAssignmentData() {
      if (!this.$route.params.id) return
      let result = await this.$API.assignment.reqAssignmentByCollection(this.$route.params.id)
      if (result.status == 0) {
        let aList = result.data
        for (let i = 0; i < aList.length; i++) {
          this.satIdList.push(aList[i].satellite_id)
        }
      } else {
        console.log(result.message)
      }
      // console.log(this.collectionInfo.satIdList)
    },
    getSatData() {
      this.$store.dispatch('getAllSats')
    },
    getRowKeys(row) {
      return row.id
    },
    handleSelectionChange(selectedList) {
      this.selection = selectedList
    },
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
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
    },
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
        if (results[0].status == 0) {
          console.log(results[0].message)
          this.$message({
            type: 'success',
            message: '创建Collection成功!'
          })
          this.goCollectionInfo()
        } else {
          console.log(results[0].message)
          this.$message({
            type: 'danger',
            message: '创建Collection失败！'
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    goCollectionInfo() {
      this.$router.push({
        name: 'Collection详情',
        params: {
          id: this.collectionInfo.id
        }
      })
    }
  },

  mounted() {
    this.getSatData()
    this.getCollectionData()
    this.getAssignmentData()
    this.handleSearch()
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

.search-input {
  width: 200px;
}

.btn-save {
  margin: 10px 0;
}
</style>