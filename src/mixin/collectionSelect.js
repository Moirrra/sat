export const mixins = {
  data() {
    return {
      collectionList: [], // 所有Collection列表
      // 已选Collection
      collection: {
        id: '',
        name: '',
      },
      assignmentList: [],
      satelliteList: [],
    }
  },
  watch: {
    collection: {
      deep: true,
      handler() {
        this.getAssignmentData()
      }
    }
  },
  mounted() {
    this.getCollectionData()
  },
  methods: {
    // 获取collection列表
    async getCollectionData() {
      let result = await this.$API.collection.reqAllCollections()
      if (result.status == 0) {
        this.collectionList = result.data
      }
    },
    // 获取Assignment
    async getAssignmentData() {
      // 获取assignment
      let result = await this.$API.assignment.reqAssignmentByCollection(parseInt(this.collection.id))
      console.log(result.message)
      if (result.status == 0) {
        this.assignmentList = result.data
        await this.getSatData()
      } else {
        this.$message.error('获取Assignment列表失败！')
      }
    },
    // 获取卫星列表
    async getSatData() {
      let sList = []
      for (let i = 0; i < this.assignmentList.length; i++) {
        sList.push(this.assignmentList[i].satellite_id)
      }
      let result = await this.$API.sat.reqSatByIdList(sList)
      console.log(result.message)
      if (result.status == 0) {
        this.satelliteList = result.data
      } else {
        this.$message.error('获取卫星列表失败！')
      }
    },
    showOrbits() {
      if (this.satelliteList) {
        this.$emit('createOrbits', this.satelliteList, this.collection.id)
      }
    },
    handleClick(row) {
      console.log('handleClick', row.id)
      // 获取实体信息
      this.$emit('getEntity', row.id)
    }
  },
}