<template >
  <div id="link-wrap">
    <div class="link-header">连线列表</div>
    <div class="link-list">
      <el-table :data="linkList" border max-height="350" max-width="315" style="width: 100%">
        <el-table-column fixed type="index" align="center" width="50" :resizable="false">
        </el-table-column>
        <el-table-column fixed prop="from_id" label="起点ID" :resizable="false">
        </el-table-column>
        <el-table-column fixed prop="to_id" label="终点ID" :resizable="false">
        </el-table-column>
        <el-table-column fixed label="颜色" width="50" :resizable="false">
          <template slot-scope="scope">
            <el-color-picker v-model="scope.row.color" color-format="hex" size="mini">
            </el-color-picker>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="50" :resizable="false">
          <template slot-scope="scope" >
            <el-button icon="el-icon-delete" type="text" size="small" 
              v-show="scope.row.isTemp" @click="handleRemove(scope.row)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-button class="btn-save" @click="handleSave">保存</el-button>
  </div>
</template>

<script>
export default {
  name: 'LinkList',
  data() {
    return {
      linkList: [],
      collection_id: '',
    }
  },
  mounted() {
  },
  methods: {
    async getLinkData(collection_id) {
      console.log('getLinkData')
      this.collection_id = collection_id
      this.linkList = []
      let result = await this.$API.link.reqLinkByCollection(this.collection_id)
      if (result.status == 0) {
        let list = result.data
        for (let i = 0; i < list.length; i++) {
          this.$emit('createLink', list[i].from_id, list[i].to_id, list[i].color, false)
        }
      }
      this.$emit('initShowLinkList', )
    },
    updateLinkList(link) {
      this.linkList.push(link)
    },
    handleRemove(row) {
      console.log(row)
      let link_id = row.id
      this.linkList = this.linkList.filter(item => item.id != link_id)
      this.$emit('removeLink', link_id)
    },
    async handleSave() {
      const newLinkList = []
      for (let i = 0; i < this.linkList.length; i++) {
        if (this.linkList[i].isTemp) {
          newLinkList.push(this.linkList[i])
        }
      }
      if (newLinkList.length > 0) {
        let result = await this.$API.link.reqCreateLinkList(this.collection_id, newLinkList)
        if (result.status == 0) {
          for (let i = 0; i < this.linkList.length; i++) {
            if (this.linkList[i].isTemp) {
              this.linkList[i].isTemp = false
            }
          }
          this.$message.success('保存新链路成功！')
        } else {
          this.$message.error('保存新链路失败！')
        }
      }
    },
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

.label {
  display: inline-block;
  width: 80px;
  font-size: 14px;
}


.btn-save {
  width: 200px;
  margin-left: 80px;
}

.link-list {
  padding: 0 5px;
  margin: 10px 0;
}
</style>