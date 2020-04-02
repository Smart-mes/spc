<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
@import '~@/assets/css/font/iconfont.css';
//  @import '~@/assets/css/iconfont.css';
html,
body {
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 14px;
}
#app {
  font-family: "Microsoft YaHei", 微软雅黑, "MicrosoftJhengHei", 华文细黑,
    STHeiti, MingLiu;
    height: 100vh;
    width: 100vw;
}
#nprogress .bar {
      background: #00cc66 !important; //自定义颜色
    }
</style>
