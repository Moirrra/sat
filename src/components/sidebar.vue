<template>
  <div id="sidebar-wrap">
    <div class="sidebar-content">
      <div class="menu-title">
        <h3 v-show="!this.isCollapse">Satellite Server</h3>
      </div>
      <div class="menu-toggle" @click.prevent="control">
        <i class="el-icon-arrow-left" v-show="!isCollapse" title="收起"></i>
        <i class="el-icon-arrow-right" v-show="isCollapse" title="展开"></i>
      </div>
      <el-menu default-active="1" class="el-menu-vertical-demo" 
        :router='true' @select="handleSelect"
        @open="handleOpen" @close="handleClose"
        :collapse="isCollapse" background-color="#343a40" 
        :defaultActive="$route.path" text-color="#fff" active-text-color="#409EFF">
        <el-menu-item index="/orbit-view">
          <i class="el-icon-s-help"></i>
          <span slot="title">卫星轨道</span>
        </el-menu-item>
        <el-menu-item index="/network-view">
          <i class="el-icon-aim"></i>
          <span slot="title">星座组网</span>
        </el-menu-item>
        <el-menu-item index="/pass-view">
          <i class="el-icon-discover"></i>
          <span slot="title">卫星过境</span>
        </el-menu-item>
        <el-menu-item index="/link-view">
          <i class="el-icon-share"></i>
          <span slot="title">星间链路</span>
        </el-menu-item>
        <el-menu-item index="/collection">
          <i class="el-icon-folder"></i>
          <span slot="title">Collections</span>
        </el-menu-item>
        <el-menu-item index="/satellite">
          <i class="el-icon-position"></i>
          <span slot="title">Satellites</span>
        </el-menu-item>
        <el-menu-item index="/setting">
          <i class="el-icon-setting"></i>
          <span slot="title">设置</span>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      isCollapse: false,
      activeIndex: "",
    }
  },
  watch:{
    $route() {
      this.handleSelect(this.activeIndex)
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleSelect(index) {
      this.activeIndex = index
    },
    control() {
      this.isCollapse = !this.isCollapse
    },
  }
}
</script>

<style scoped>
.sidebar-content {
  height: 100%;
  position: relative;
}

.el-menu {
  height: 100%;
  border: 0 !important;
}

.el-menu--collapse {
  width: 60px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  box-sizing: border-box;
  width: 150px;
}

.el-menu-item {
  padding: 0 10px;
}

.el-menu-item i {
  padding: 0;
}

.el-submenu .el-menu-item {
  min-width: 150px;
  overflow: hidden;
}

.menu-title {
  height: 60px;
  background-color: #343a40;
  text-align: center;
  color: #1f2d3d;
}

.menu-title h3 {
  font-size: 18px;
  color: #fff;
  padding: 10px;
}

.menu-toggle {
  position: absolute;
  top: 300px;
  left: 100%;
  transform: translateX(-50%);
  z-index: 999;
  width: 30px;
  height: 30px;
  border-radius: 30px;
  color: #fff;
  background: #343a40;
  font-size: 18px;
  line-height: 30px;
  text-align: center;
}

.menu-toggle:hover {
  cursor: pointer;
}
</style>