<template>
  <div class="home">
    <head-top/>
    <div class="wrapper">
      <div class="side" :style="{width:isCollapse?'65px':'200px'}">
        <side/>
      </div>
      <div class="main" :style="{left:isCollapse?'65px':'200px'}">
        <div class="container">
          <!-- <keep-alive>
              <router-view :key="$route.fullPath"/>
            </keep-alive> -->
          <transition name="fade-transform" mode="out-in">
            <keep-alive>
              <router-view v-if="$route.meta.keepAlive"/>
            </keep-alive>
          </transition>
          <transition name="fade-transform" mode="out-in">
            <router-view v-if="!$route.meta.keepAlive"/>
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
import side from '@/views/layout/side/side'

export default {
  name: 'Layout',
  components: { headTop, side },
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
  position: relative;
  height: calc(100vh - 50px);
  background: #f3f3f3;
}
.side {
  position: relative;
  overflow: hidden;
  // overflow-y: auto;
  position: absolute;
   top: 0;
   left: 0;
  height: 100%;
  background: #444c63;
}
.main {

  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left:200px;
  right: 0;
  height: 100%;
  .container {
    overflow: hidden;
    flex: 1;
    padding: 10px;
    background: #fff;
    border: 1px solid $line-color;
  }
}
// 动画
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all .5s
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
