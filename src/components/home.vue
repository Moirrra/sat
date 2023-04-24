<template>
  <div id="home-wrap">
    <Sidebar></Sidebar>
    <Content></Content>
  </div>
</template>

<script>
import Sidebar from '@/components/sidebar.vue'
import Content from '@/components/content.vue'
export default {
  name: 'Home',
  components: { Sidebar, Content }
}
</script>

<style scoped>
  #home-wrap {
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>