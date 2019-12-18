<template>
  <div v-if="isShowTags" class="tags">
    <div class="tag-box">
      <ul>
        <li
          v-for="(item,index) in indexPath"
          :key="index"
          :class="{'active':item.name === activeValue}"
        >
          <router-link
            class="tab-item"
            :class="{active:activeValue===index}"
            :to="{path:item.path}"
          >
            <span>{{ item.name }}</span>
          </router-link>
          <span class="tag_delete" @click="closeTag(index)">
            <i class="el-icon-close"/>
          </span>
        </li>
      </ul>
    </div>
    <div class="tag-close-box">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          标签设置
          <i class="el-icon-arrow-down el-icon--right"/>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="a">关闭其它</el-dropdown-item>
          <el-dropdown-item command="b">关闭所有</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeValue: '', // 当前选中的路由名称
      indexPath: [], // 将点击过的路由信息添加进来
      isShowTags: true, // 标签设置 关闭所有隐藏
    }
  },
  watch: {
    $route (newValue) {
      // 监听路由的变化获取最新的路由信息
      console.log('newValue', newValue)
      this.setTags(newValue)
    },
  },
  // created () {
  //   this.setTags(this.$route)
  //   // console.log('route', this.$route)
  //   // console.log('this.indexPath', this.indexPath)
  // },
  // activated () {
  //   // console.log(this.$route.params.id)
  // },
  methods: {
    setTags (route) {
      this.activeValue = route.meta.title
      const isExist = this.indexPath.some(item => {
        return item.path === route.path
      })

      !isExist &&
        this.indexPath.unshift({
          name: route.meta.title,
          path: route.path,
        })

      if (this.indexPath.length > 8) {
        this.indexPath.splice(this.indexPath.length - 1, 1)
      }
    },
    closeTag (index) {
      // 删除当前点击的tag
      const closePath = this.indexPath.splice(index, 1)[0]
      // 获取删除后当前下标的tag(如果当前下标有选择当前否则选前一个)
      const item = this.indexPath[index]
        ? this.indexPath[index]
        : this.indexPath[index - 1]
      if (item) {
        // 如果删除的的元素path等于当前路由path 执行改变路由
        closePath.path === this.$route.path && this.$router.push(item.path)
      } else {
        // 不存在跳转到我的账户
        this.$router.push('/dataModel')
      }
    },
    handleCommand (command) {
      console.log(command)
      command === 'a'
        ? (this.indexPath = [
          { name: this.$route.meta.title, path: this.$route.path },
        ])
        : (this.indexPath = [])
      if (!this.indexPath.length) {
        this.isShowTags = false
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.tags {
  display: -webkit-flex;
  display: flex;
  align-items: center;
  background: #fff;
  height: 30px;
  padding: 5px 15px;
}
.tags .tag-box {
  -webkit-flex: 1;
  flex: 1;
}
.tags {
   ul{
       align-content: center;
  display: -webkit-flex;
  display: flex;
  padding-top: 2px;
   }
   li {
  align-items: center;
  border-radius: 4px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  border: 1px solid rgba(64, 158, 255, 0.2);

  cursor: pointer;
  display: -webkit-flex;
  display: flex;
  font-size: 12px;
  height: 26px;
  list-style: none;
  line-height: 26px;
  margin-right: 10px;
  padding: 0 6px;
  white-space: nowrap;
  -webkit-transition: all 0.5s ease-in;
  -moz-transition: all 0.5s ease-in;
  transition: all 0.5s ease-in;
}
 li a {
  display: block;
  color: #409eff;
  text-decoration: none;
}
}

/*关闭标签按钮*/
.tag-close-box .el-dropdown span {
  color: #409eff;
  cursor: pointer;
  font-size: 14px;
}
/*选中状态*/
.tags li.active {
  background: #409eff;
}
.tags li.active {
  a {
    color: #fff;
  }

  .tag_delete {
    color: #fff;
  }
  .tag_delete:hover {
    background: #fff;
    color: #409eff;
  }
}
/*删除*/
.tag_delete {
  border-radius: 50%;
  color: #409eff;
  display: inline-block;
  height: 16px;
  line-height: 16px;
  width: 16px;
  margin-left: 3px;
  text-align: center;
  -webkit-transition: all 0.2s ease-in;
  -moz-transition: all 0.2s ease-in;
  transition: all 0.2s ease-in;
  &:hover {
    background: $blue-color;
    color: #fff;
  }
}
</style>
