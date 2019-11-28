<template>
  <div class="home">
    <head-top/>
    <div class="wrapper">
      <div class="wrapper-left">
        <sidebar/>
      </div>
    </div>
  </div>
</template>
<script>
import headTop from '@/views/layout/Head'
import sidebar from '@/views/layout/Sidebar'
export default {
  components: { headTop, sidebar },

  data () {
    return {}
  },
}
</script>
<style lang="scss" scoped>
.home {
  height: 100vh;
  width: 100vw;
}
.wrapper {
  overflow: hidden;
  height: calc(100vh - 50px);
  .wrapper-left {
    overflow: hidden;
    width: 170px;
    height: 100%;
    background: #444c63;
  }
}
</style>
