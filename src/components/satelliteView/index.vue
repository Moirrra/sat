<template>
  <div id="satellite-wrap">
    <div class="search">
      <el-input class="search-input" v-model="search" size="mini" placeholder="输入Norad ID搜索" />
      <el-button type="primary" size="small" @click="handleSearch">搜索</el-button>
    </div>
    <div class="satellite-table">
      <el-table :data="showData" border stripe style="width: 95%" ref="satTable">
        <el-table-column fixed type="index" :index="tableIndex" align="center" :resizable="false">
        </el-table-column>
        <el-table-column fixed prop="id" label="Norad ID" width="150" :resizable="false">
        </el-table-column>
        <el-table-column fixed prop="name" label="Satellite Name" :resizable="false">
        </el-table-column>
        <el-table-column fixed label="操作" :resizable="false">
          <template slot-scope="scope">
            <el-button class="btn" @click="handleLook(scope.row)" type="text" size="small">查看</el-button>
            <el-button class="btn" @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button class="btn" @click="handleRemove(scope.row)" type="text" size="small">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination :page-size="pageSize" :pager-count="11" layout="total, prev, pager, next, jumper" :total="total"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <div class="btn-create" @click="handleCreate">
      <el-button type="primary">创建Satellite</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SatelliteView',
  data() {
    return {
      filterData: [], // 过滤搜索的表格数据
      currentPage: 1, // 当前页码
      pageSize: 10,  // 每页数据条数
      search: '', // 搜索关键字
    }
  },
  computed: {
    // 表格展示的分页数据
    showData() {
      if (this.filterData) {
        return this.filterData.slice(
          (this.currentPage - 1) * this.pageSize,
          this.currentPage * this.pageSize)
      } else {
        return this.satelliteList
      }
    },
    // 总数据条数
    total() {
      if (this.filterData) {
        return this.filterData.length
      } else {
        return 0
      }
    },
  },
  methods: {
    // 获取所有卫星列表
    async getData() {
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
    // 当前页变化事件
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
    },
    // 分页表格序号
    tableIndex(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1
    },
    // 点击移除卫星
    async handleRemove(row) {
      this.$confirm('此操作将永久删除该卫星, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.deleteSat(row.id)
        this.getData()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 点击查看卫星
    handleLook(row) {
      this.$router.push(`satellite_info/${row.id}`)
    },
    // 点击编辑卫星
    handleEdit(row) {
      this.$router.push(`edit_satellite/${row.id}`)
    },
    // 点击创建卫星
    handleCreate() {
      this.$router.push('/add_satellite')
    },
    // 删除卫星
    async deleteSat(id) {
      let result = await this.$API.sat.reqDeleteSat(id)
      console.log(result.message)
      if (result.status == 0) {
        this.$message({
          type: 'success',
          message: '删除卫星成功!'
        })
      } else {
        this.$message({
          type: 'danger',
          message: '删除卫星失败！'
        })
      }
    },
  },
  created() {
    this.getData()
  },
  mounted() {
    this.handleSearch()
  },
}
</script>

<style scoped>
#satellite-wrap {
  width: 100%;
  height: 100%;
  min-height: 700px;
  margin-left: 50px
}

.satellite-table {
  margin: 20px 0;
}

.btn {
  margin: 0 10px;
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
</style>