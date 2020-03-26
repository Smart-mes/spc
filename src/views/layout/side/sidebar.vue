<template>
  <div class="sidebar">
    <el-menu
      :collapse="isCollapse"
      class="el-menu-vertical-demo"
      background-color="#444c63"
      text-color="#ffffff"
      active-text-color="#ffffff"
      unique-opened
      :default-active="active"
    >
      <template v-for="(item) in menus">
        <el-submenu v-if="item.children" :key="item.id" :index="item.path">
          <template slot="title" style="background:#00ff00">
            <div @click="toAnalyse(item)">
              <i :class="[item.icon,'iconfont']"/>
              <span>{{ item.title }}</span>
            </div>
          </template>
          <el-menu-item-group>
            <el-menu-item
              v-for="(list) in item.children"
              :key="list.id"
              :index="list.path"
              @click="toPath(list)"
            >
              {{ list.title }}
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item v-else :key="item.id" :index="item.path" @click="toPath(item)">
          <template>
            <i :class="[item.icon,'iconfont']"/>
            <span slot="title">{{ item.title }}</span>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'Sidebar',
  data () {
    return {}
  },
  computed: {
    ...mapState({
      menus: state => state.menus,
      isCollapse: state => state.isCollapse,
    }),
    active () {
      // return this.$route.fullPath
      return this.$route.path
    },
  },
  methods: {
    ...mapMutations(['add_tags']),
    toPath (item) {
      const [path, dataParams] = item.path.split('?')
      if (dataParams && path === '/analyse/myAnalyse') {
        this.$router.push({ path: path })

        this.add_tags(item)
      } else {
        this.$router.push({ path: path })
      }
    },
    toAnalyse (item) {
      item.path === '/analyse/myAnalyse' && this.$router.push({ path: '/analyse/myAnalyse' })
    },
  },
}
</script>
<style lang="scss" scoped>
.sidebar {
  /deep/.el-menu {
    border: 0;
  }
  /deep/.el-submenu__icon-arrow {
    margin-top: -2px;
    color: $white-color;
  }
  /deep/.el-menu-item-group__title {
    padding: 0;
  }
  i {
    padding-right: 5px;
    color: $white-color;
  }
  /deep/.el-menu-item{
    @extend %ellipsis;
    padding: 0 10px;
  }
  /deep/.el-menu-item.is-active {
   background-color: #2376c4 !important;
}
}
</style>
