<template>
  <header class="clear">
    <div class="logo fl">
      <img src="~@/assets/images/logo.png" class="logo-img fl">
      <h1 class="logo-text">数据分析平台</h1>
    </div>
    <div class="user fr">
      <span>欢迎您，张三</span>
      <span>|</span>
      <span class="user-out">退出</span>
    </div>
  </header>
</template>
<script>
export default {}
</script>
<style lang="scss" scoped>
header {
  overflow: hidden;
  padding: 0 10px;
  height: 50px;
  color: $white-color;
  background: $blue-color;
}
.logo {
  width: 210px;
  .logo-img {
    margin: 8px 5px 0 0;
    height: 35px;
  }
  .logo-text {
    margin: 0;
    font-size: 18px;
    line-height: 50px;
  }
}
.user{
  line-height: 50px;
  >span{padding-left: 10px;}
  .user-out{
    cursor: pointer;
  }
}
</style>
