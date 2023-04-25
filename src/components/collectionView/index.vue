<template>
  <div id="collection-wrap">
    <div class="collection-table">
      <el-table :data="collectionList" 
        border stripe max-height="480" style="width: 90%">
        <el-table-column fixed type="index" width="50" :resizable="false">
        </el-table-column>
        <el-table-column fixed prop="name" label="Collection Name" width="300"
        style="width: 50%" :resizable="false">
        </el-table-column>
        <el-table-column label="操作" :resizable="false">
          <template slot-scope="scope">
            <el-button @click="handleLook(scope.row)" type="text" size="small">查看</el-button>
            <el-button @click="handleRemove(scope.row)" type="text" size="small">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="btn" @click="handleCreate">
      <el-button type="primary">创建Collection</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CollectionView',
  data() {
    return {
      collectionList: [],
    }
  },
  methods: {
    async getData() {
      let result = await this.$API.collection.reqAllCollections()
      if (result.status == 0) {
        // console.log(result.message)
        this.collectionList = result.data
      } else {
        console.log(result.message)
      }
    },
    // 点击查看Collection操作
    handleLook(row) {
      this.$router.push({
        name: 'Collection详情',
        params: {
          id: row.id,
        }
      })
    },
    // 点击移除Collection操作
    async handleRemove(row) {
      this.$confirm('此操作将永久删除该Collection, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.deleteCollection(row.id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })

    },
    // 点击创建Collection
    handleCreate() {
      this.$router.push('/create_collection')
    },
    // 删除Collection
    async deleteCollection(id) {
      // 删除对应assignment
      let result = await this.$API.assignment.reqDeleteAssignmentByCollection(id)
        if (result.status == 0) {
          console.log(result.message)
        } else {
          console.log(result.message)
        }
        // 删除该collection
        result = await this.$API.collection.reqDeleteCollection(id)
        if (result.status == 0) {
          console.log(result.message)
          this.$message({
            type: 'success',
            message: '删除Collection成功!'
          })
          this.getData()
        } else {
          console.log(result.message)
          this.$message({
            type: 'danger',
            message: '删除Collection失败！'
          })
        }
    }
  },
  mounted() {
    this.getData()
  },
}
</script>

<style scoped>
#collection-wrap {
  width: 100%;
  height: 100%;
  min-height: 600px;
  margin-left: 50px
}

.collection-table,
.btn {
  margin-top: 20px
}


</style>