<template>
  <div class="home">
    <head-top/>
    <div class="wrapper">
      <div class="side" :style="{width:isCollapse?'65px':'200px'}">
        <sidebar/>
      </div>
      <div class="main">
        <tags/>
        <!-- /tags -->
        <div class="container">
          <transition name="move" mode="out-in">
            <keep-alive>
              <router-view/>
            </keep-alive>
          </transition>
        </div>
        <!-- /右下 -->
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import headTop from '@/views/layout/head/head'
import sidebar from '@/views/layout/side/sidebar'
import tags from '@/views/layout/tags/tags'
export default {
  name: 'Layout',
  components: { headTop, sidebar, tags },
  data () {
    return {}
  },
  computed: {
    ...mapState({
      isCollapse: state => state.isCollapse,
    }),
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
  display: flex;
  height: calc(100vh - 50px);
  background: #f3f3f3;
}
.side {
  overflow: hidden;
  // width: 200px;
  height: 100%;
  background: #444c63;
}
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  // .tag {
  //   height: 40px;
  // }
  .container {
    flex: 1;
    margin: 15px;
    overflow-y: auto;
    background: #fff;
  }
}
</style>
