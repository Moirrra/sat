<template>
  <div id="satellite-wrap">
    <div class="satellite-table">
      <el-table :data="satelliteList" 
      border stripe max-height="480" style="width: 95%"
      ref="satTable"
      >
        <el-table-column fixed type="index">
        </el-table-column>
        <el-table-column fixed prop="id" label="Norad ID" width="100">
        </el-table-column>
        <el-table-column fixed prop="name" label="Satellite Name" width="180">
        </el-table-column>
        <el-table-column fixed prop="tle1" label="TLE1" width="260">
        </el-table-column>
        <el-table-column fixed prop="tle2" label="TLE2" width="260">
        </el-table-column>
        <el-table-column fixed label="操作" >
          <template slot-scope="scope">
            <el-button class="btn" @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button class="btn" @click="handleRemove(scope.row)" type="text" size="small">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="btn-create" @click="createSat">
      <el-button type="primary">创建Satellite</el-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'SatelliteView',
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      totalPage: 0
    }
  },
  computed: {
    ...mapState({
      satelliteList: state => state.satList,
    }),
  },
  methods: {
    getData() {
      this.$store.dispatch('getAllSats')
      this.totalPage = this.satelliteList.length / this.pageSize
      let nextData = this.satelliteList.splice((this.currentPage-1) * this.pageSize, this.pageSize)
      this.tableData = this.tableData.concat(nextData)
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
    handleEdit(row) {
      this.$router.push(`edit_satellite/${row.id}`)
    },
    tableListener() {
      let _this = this
      let dom = _this.$refs.satTable.bodyWrapper
      dom.addEventListener("scroll", function() {
        const scrollDistance = dom.scrollHeight - dom.scrollTop
        console.log(scrollDistance)
        if (scrollDistance <= 500) {
          if (_this.currentPage < _this.totalPage) {
            _this.currentPage++
            _this.getData()
          }
        }
      })
    },
    createSat() {
      this.$router.push('/add_satellite')
    }
  },
  mounted() {
    this.getData()
    // this.tableListener()
    
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

.satellite-table, .btn {
  margin: 20px 0;
}
</style>