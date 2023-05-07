<template>
  <div id="content-wrap">
    <div class="content-header">
      <h3>{{ $route.name }}</h3>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'Content',
}
</script>

<style scoped>
  #content-wrap {
    width: 100%;
    height: 100%;
    margin: 0;
  }

  .content-header {
    width: 100%;
    height: 45px;
    background-color: #fff;
    border-bottom: 1px solid #dee2e6;
    display: flex;
    align-items: center;
    box-sizing: border-box;
  }

  .content-header h3 {
    padding-left: 50px;
    font-size: 18px;
    /* font-weight: 700; */
    color: #4d4e59;
  }

</style>