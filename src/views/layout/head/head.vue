<template>
  <header class="clear">
    <div class="logo fl">
      <img src="~@/assets/images/logo.png" class="logo-img fl">
      <h1 class="logo-text">数据分析平台</h1>
    </div>
    <div class="icon fl">
      <i
        :class="[isCollapse ? 'icon-shouqi' : 'icon-zhankai', 'iconfont']"
        :title="[isCollapse ? '收起' : '展开']"
        @click="set_collapse"
      />
    </div>
    <div class="user fr">
      <span>欢迎您，{{ decryptUserName }}</span>
      <span>|</span>
      <span>
        <a @click="loginClear">退出</a>
      </span>
    </div>
  </header>
</template>
<script>
import { decrypt } from '@/utils/secret'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'Head',
  data () {
    return {}
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      isCollapse: state => state.isCollapse,
    }),
    decryptUserName () {
      return decrypt(this.userInfo.userName)
    },
  },
  methods: {
    ...mapMutations(['logout', 'set_collapse']),
    loginClear () {
      this.logout()
      window.location.href = '/'
    },
  },
}
</script>
<style lang="scss" scoped>
header {
  overflow: hidden;
  padding: 0 20px;
  height: 50px;
  line-height: 50px;
  color: $white-color;
  background: $blue-color;
}
.logo {
  width: 180px;
  .logo-img {
    margin: 8px 5px 0 0;
    height: 35px;
  }
  .logo-text {
    margin: 0;
    font-size: 18px;
  }
}
.icon {
  > i {
    font-size: 18px;
    cursor: pointer;
  }
}
.user {
  > span {
    padding-left: 10px;
  }
  a {
    color: $white-color;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
