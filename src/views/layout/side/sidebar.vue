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
        <el-submenu v-if="item.children" :key="item.id" :index="item.url">
          <template slot="title">
            <i :class="item.icon"/>
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item-group>
            <!--<template slot="title">分组一</template>-->
            <el-menu-item
              v-for="(list) in item.children"
              :key="list.id"
              :index="list.url"
              @click="toPath(list)"
            >
              {{ list.title }}
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item v-else :key="item.id" :index="item.url" @click="toPath(item)">
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
      const url = !this.$route.query.id
        ? this.$route.path
        : `${this.$route.path}?id=${this.$route.query.id}`
      return url
    },
  },
  created () {
    this.routeTitle()
  },
  methods: {
    ...mapMutations(['set_tags']),
    toPath (item) {
      const [path, params] = item.url.split('?')
      if (params) {
        const paramsId = Number(params.substring(3))
        this.$router.push({ path: path, query: { id: paramsId }})
        this.$route.meta.title = item.title
        this.set_tags(item)
      } else {
        this.$router.push({ path: path })
      }
    },
    // 解决刷新路由title
    routeTitle () {
      const [{ children }] = this.menus.filter(menus => {
        return menus.children
      })
      const item = children.filter(v => {
        return v.url === this.active
      })

      if (item.length) {
        const [{ title }] = item
        this.$route.meta.title = title
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
