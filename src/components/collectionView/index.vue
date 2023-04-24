<template>
  <div id="collection-wrap">
    <div class="collection-table">
      <el-table :data="collectionList" stripe max-height="480" style="width: 90%">
        <el-table-column fixed type="index">
        </el-table-column>
        <el-table-column fixed prop="name" label="Collection Name" style="width: 50%">
        </el-table-column>
        <el-table-column label="操作">
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
    handleLook(row) {
      // console.log(row.id)
      this.$router.push({
        name: 'Collection详情',
        params: {
          id: row.id,
        }
      })
    },
    handleCreate() {
      // this.$router.push({
      //   name: '编辑Collection',
      // })
      this.$router.push('/create_collection')
    },
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

.collection-table, .btn {
  margin-top: 20px
}
</style>