<template>
  <div class="sidebar">
    <el-menu
      :collapse="isCollapse"
      :default-active="active"
      class="el-menu-vertical-demo"
      background-color="#444c63"
      text-color="#fff"
      active-text-color="#409eff"
      unique-opened
      router
    >
      <template v-for="(item) in menus">
        <el-submenu v-if="item.children" :key="item.path" :index="item.path">
          <template slot="title">
            <i :class="item.icon"/>
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item-group>
            <!--<template slot="title">分组一</template>-->
            <el-menu-item
              v-for="(list) in item.children"
              :key="list.path"
              :index="list.path"
            >
              {{ list.title }}
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item v-else :key="item.path" :index="item.path">
          <template>
            <i :class="item.icon"/>
            <span slot="title">{{ item.path }}</span>
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
