<template>
  <div class="home">
    <head-top/>
    <div class="wrapper">
      <div class="side" :style="{width:isCollapse?'65px':'200px'}">
        <sidebar/>
      </div>
      <div class="main" :style="{left:isCollapse?'65px':'200px'}">
        <!-- <tags/> -->
        <!-- /tags -->
        <div class="container">
          <transition name="move" mode="out-in">
            <keep-alive>
              <router-view :key="$route.fullPath"/>
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
// import tags from '@/views/layout/tags/tags'
export default {
  name: 'Layout',
  components: { headTop, sidebar },
  data () {
    return {}
  },

  computed: {
    ...mapState({
      isCollapse: state => state.isCollapse,
    }),
  },
  mounted () {
    console.log('isCollapse', this.isCollapse)
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
  position: relative;
  // display: flex;
  height: calc(100vh - 50px);
  background: #f3f3f3;
}
.side {
  overflow: hidden;
  position: absolute;
   top: 0;
   left: 0;
  height: 100%;
  background: #444c63;
}
.main {
  display: flex;
  flex-direction: column;
  // flex: 1;
  // .tag {
  //   height: 40px;
  // }
  position: absolute;
  top: 0;
  left:200px;
  right: 0;
  height: 100%;
  .container {
     flex: 1;
    margin: 15px;
    overflow-y: auto;
    background: #fff;
    border: 1px solid $line-color;
  }
}
</style>
