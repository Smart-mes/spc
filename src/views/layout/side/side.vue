<template>
  <div class="sidebar">
    <el-menu
      :collapse="isCollapse"
      class="el-menu-vertical-demo"
      background-color="#444c63"
      text-color="#ffffff"
      active-text-color="#00ccff"
      unique-opened
      :default-active="active"
    >
      <template
        v-for="(item) in menus"
      >
        <el-submenu
          v-if="item.children"
          :key="item.id"
          :index="item.path"
        >
          <template slot="title" style="background:#00ff00">
            <div
              @click="toPath(item)"
            >
              <i :class="[item.icon,'iconfont']"/>
              <span>{{ item.title }}</span>
            </div>
          </template>
          <el-menu-item-group>
            <el-menu-item
              v-for="(list) in item.children"
              :key="list.id"
              class="analyse-item"
              :index="list.path"
              @click="toPath(list)"
            >
              <span
                class="menu-text fl"
              > {{ list.title }}</span>
              <i
                class="iconfont icon-add fr"
                @click.stop="clickFilter(list)"
              />
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item
          v-else
          :key="item.id"
          :index="item.path"
          @click="toPath(item)"
        >
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
    return {
      id: '',
    }
  },
  computed: {
    ...mapState({
      menus: state => state.menus,
      isCollapse: state => state.isCollapse,
      tagsTitle: state => state.tagsTitle,
    }),
    active () {
      return this.id ? `${this.$route.path}?id=${this.id}` : this.$route.path
    },
  },
  methods: {
    ...mapMutations(['add_tags', 'set_state', 'fiter_tags']),
    toPath (item) {
      const { title } = item
      const [path, dataParams] = item.path.split('?')

      if (dataParams && path === '/analyse/myAnalyse') {
        // console.log('1')
        this.id = dataParams.substring(3)
        this.set_state({ tagsType: 'filter' })
        this.fiter_tags(title)
      } else if (!dataParams && path === '/analyse/myAnalyse') {
        this.id = ''
        this.set_state({ tagsType: 'filter' })
        this.fiter_tags('')
      } else {
        this.id = ''
      }

      this.$router.push({ path })
    },
    clickFilter (item) {
      const { id, title } = item

      this.id = id
      this.add_tags(item)
      this.set_state({ tagsType: 'add' })
      this.fiter_tags(title)
      this.$router.push({ path: '/analyse/myAnalyse' })
    },
  },
}
</script>
<style lang="scss" scoped>
.sidebar {
  margin-top: 5px;
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
    padding: 0 10px;
  }
  /deep/.el-menu-item.is-active {
   .iconfont{ color: #00ccff;}
}
}
.analyse-item {
  .iconfont{
    font-size: $f-14;
    display: none;
  }
  &:hover .iconfont{
    display: block !important;
  }
}
.menu-text{
    width: 125px;
     @extend %ellipsis;
}
</style>
