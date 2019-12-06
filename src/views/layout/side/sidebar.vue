<template>
  <div class="sidebar">
    <el-menu
      :collapse="isCollapse"

      class="el-menu-vertical-demo"
      background-color="#444c63"
      text-color="#fff"
      active-text-color="#409eff"
      unique-opened
      :default-active="active"
    >
      <template v-for="(item) in menus">
        <el-submenu v-if="item.children" :key="item.id" :index="item.path">
          <template slot="title">
            <i :class="item.icon"/>
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item-group>
            <!--<template slot="title">分组一</template>-->
            <el-menu-item
              v-for="(list) in item.children"
              :key="list.id"
              :index="list.path"
              @click="toPath(list)"
            >
              {{ list.title }}---{{ list.id }}
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item v-else :key="item.id" @click="toPath(item)">
          <template>
            <i :class="item.icon"/>
            <span slot="title">{{ item.title }}</span>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Sidebar',
  data () {
    return {

    }
  },
  computed: {
    ...mapState({
      menus: state => state.menus,
      isCollapse: state => state.isCollapse,
    }),
    active () {
      return this.$route.path
    },
  },
  mounted () {

  },
  methods: {
    toPath (item) {
      const path = item.path.split('?')

      if (path.length !== 2) {
        this.$router.push({ path: item.path })
      } else {
        this.$router.push({ path: path[0], params: { id: 'a' }})
      }
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
    color: $white-color;
  }
}
</style>
