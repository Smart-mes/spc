<template>
  <div class="sidebar">
    <el-menu
      :collapse="collapse"
      class="el-menu-vertical-demo"
      background-color="#444c63"
      text-color="#fff"
      active-text-color="#409eff"
      unique-opened
      router
    >
      <template v-for="(item) in sidebarInfo">
        <el-submenu v-if="item.children" :key="item.index" :index="item.path">
          <template slot="title">
            <i :class="item.icon"/>
            <span>{{ item.name }}-1</span>
          </template>
          <el-menu-item-group>
            <!--<template slot="title">分组一</template>-->
            <el-menu-item
              v-for="(list) in item.children"
              :key="list.index"
              :index="list.path"
            >
              {{ list.name }}
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item v-else :key="item.index" :index="item.path">
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
export default {
  name: 'Sidebar',
  data () {
    return {
      collapse: false,
      indexPath: [], // 保存点击过的页面路由信息
      sidebarInfo: [
        {
          path: '/my',
          name: '我的账户',
          icon: 'el-icon-tickets',
          children: [
            {
              path: '/my/my1',
              name: '设置账号',
            },
            {
              path: '/my/my2',
              name: '我的资产',
            },
          ],
        },
        {
          path: '/data',
          name: '我的数据',
          icon: 'el-icon-goods',
          children: [
            {
              path: '/data/data1',
              name: '基础数据',
            },
            {
              path: '/data/data2',
              name: '数据来源',
            },
          ],
        },
      ],
    }
  },
  methods: {},
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
