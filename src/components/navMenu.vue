<template>
  <div id="navMenu">
    <div class="nav-button">
      <el-button @click="changeSatSelect">卫星列表</el-button>
      <el-button @click="changeSatInfo">卫星信息</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavMenu',
  data() {
      return {

      };
  },
  computed: {

  },
  mounted() {

  },
  methods: {
    changeSatSelect() {
      this.$bus.$emit('changeSatSelect')
    },
    changeSatInfo() {
      this.$bus.$emit('changeSatInfo')
    }
  }
}
</script>

<style scoped>
  #navMenu {
    position: relative;
    box-sizing: border-box;
    z-index: 888;
  }

  .nav-button {
    display: flex;
    position: absolute;
    top: 20px;
    left: 20px;
  }

  .el-buttton {
    width: 60px;
    height: 40px;
  }
</style>