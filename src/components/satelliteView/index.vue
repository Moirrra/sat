<template>
  <div id="satellite-wrap">
    <div class="search">
      <el-input class="search-input" v-model="search" size="mini" placeholder="输入norad_id搜索" />
      <el-button type="primary" size="small" @click="handleSearch">搜索</el-button>
    </div>
    <div class="satellite-table">
      <el-table :data="showData" border stripe min-height="480" style="width: 95%" ref="satTable">
        <el-table-column fixed type="index" :resizable="false">
        </el-table-column>
        <el-table-column fixed prop="id" label="Norad ID" width="100" :resizable="false">
        </el-table-column>
        <el-table-column fixed prop="name" label="Satellite Name" width="180" :resizable="false">
        </el-table-column>
        <el-table-column fixed prop="tle1" label="TLE1" width="260" :resizable="false">
        </el-table-column>
        <el-table-column fixed prop="tle2" label="TLE2" width="260" :resizable="false">
        </el-table-column>
        <el-table-column fixed label="操作" :resizable="false">
          <template slot-scope="scope">
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
      filterData: [],
      currentPage: 1,
      pageSize: 5,
      search: ''
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
    total() {
      if (this.filterData) {
        return this.filterData.length
      } else {
        return 0
      }
    }
  },
  methods: {
    async getData() {
      let result = await this.$API.sat.reqAllSats()
      if (result.status == 0) {
        this.satelliteList = result.data
        this.filterData = this.satelliteList
      } else {
        console.log(result.message)
      }
    },
    async handleRemove(row) {
      let result = await this.$API.sat.reqDeleteSat(row.id)
      if (result.status == 0) {
        console.log(result.message)
        this.getData()
      } else {
        console.log(result.message)
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
    handleCreate() {
      this.$router.push('/add_satellite')
    },
    handleEdit(row) {
      this.$router.push(`edit_satellite/${row.id}`)
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
  margin: 20px 10px;
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