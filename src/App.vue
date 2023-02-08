<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
@import '~@/assets/css/font/iconfont.css';
html,body {
  overflow: hidden;
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  font-size: 14px;
}
#app {
    height: 100%;
    width: 100%;
    font-family: "Microsoft YaHei", 微软雅黑, "MicrosoftJhengHei", 华文细黑,STHeiti, MingLiu;
}
#nprogress .bar { background: #00cc66 !important; }
</style>
