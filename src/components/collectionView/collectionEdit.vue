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
    <div class="satellite-table">
      <el-table :data="satelliteList.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
        stripe max-height="400" style="width: 90%" ref="multipleTable" @selection-change="handleSelectionChange"
        :row-key="getRowKeys">
        <el-table-column type="selection" :reserve-selection="true" width="50">
        </el-table-column>
        <el-table-column fixed prop="id" sortable label="Norad ID" width="250">
        </el-table-column>
        <el-table-column fixed prop="name" sortable label="Satellite Name">
        </el-table-column>
        <el-table-column fixed>
          <template slot="header">
            <el-input class="search-input" v-model="search" size="mini" placeholder="输入卫星名称搜索" />
          </template>
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
      search: '',
      selection: [],
    }
  },
  computed: {
    ...mapState({
      satelliteList: state => state.satList,
    }),
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
      console.log('222')
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
    async handleSave() {
      let result = await this.$API.collection.reqUpdateCollection(this.collectionInfo)
      if (result.status == 0) {
        console.log(result.message)
      } else {
        console.log(result.message)
      }
      // 已有
      if (this.satIdList.length > 0) {
        // 删除原有assignment
        let result1 = await this.$API.assignment.reqDeleteAssignmentByCollection(this.collectionInfo.id)
        if (result1.status == 0) {
          console.log(result1.message)

        } else {
          console.log(result1.message)
        }
      }
      // 新增assignment
      let c_id = this.collectionInfo.id
      this.selection.forEach(async (item) =>  {
        let s_id = item.id
        let result2 = await this.$API.assignment.reqCreateAssignment(c_id, s_id)
        if (result2.status == 0) {
          console.log(result2.message)
        } else {
          console.log(result2.message)
        }
      })
    },
    handleCreate() { },
  },

  mounted() {
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

.search-input {
  width: 200px;
}

.btn-save {
  margin: 10px 0;
}
</style>