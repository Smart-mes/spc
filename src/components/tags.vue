<template>
  <div class="tags">
    <div class="tag-box">
      <ul>
        <li
          v-for="(item,i) in tags"
          v-show="item.visible"
          :key="item.key"
          :class="{'active':i === activeValue}"
          @click="tagsChange(i)"
        >
          <span>{{ item.title }}-{{ item.no }}</span>
          <span class="tag_delete" @click.stop="del(i)">
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
          <el-dropdown-item v-show="!tagsTitle" command="a">关闭其它</el-dropdown-item>
          <el-dropdown-item command="b">关闭所有</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      indexPath: [],
      activeValue: 0,
    }
  },
  computed: {
    ...mapState({
      tags: state => state.tags,
      tagsTitle: state => state.tagsTitle,
    }),

  },
  watch: {
    tagsTitle (val) {
      if (val) {
        for (var i = 0; i < this.tags.length; i++) {
          const { visible } = this.tags[i]
          if (visible) {
            this.activeValue = i
            this.$emit('getActive', this.activeValue)
            break
          }
        }
      }
    },
  },
  methods: {
    ...mapMutations(['del_tags', 'set_state']),
    tagsChange (i) {
      this.setActive(i)
    },
    del (i) {
      this.del_tags(i)

      let active = this.activeValue
      const tagsLen = this.tags.length
      if (tagsLen && active === tagsLen) {
        active--
      } else if (!tagsLen) {
        this.set_state({ tagsNo: 0 })
      }

      this.activeValue = active
      this.$emit('getActive', this.activeValue)
    },
    handleCommand (command) {
      if (command === 'a') {
        this.set_state({ tags: [{ ...this.tags[this.activeValue] }] })
        this.setActive(0)
      } else if (command === 'b') {
        this.set_state({ tags: [], tagsNo: 0 })
        this.setActive(0)
      }
    },
    setActive (num) {
      this.activeValue = num
      this.$emit('getActive', this.activeValue)
    },
  },
}
</script>
<style lang="scss" scoped>
.tags {
  display: flex;
  padding: 10px 35px 10px 20px;
  align-items: center;
  height: 30px;
  background: #fff;
}
.tags .tag-box {
  -webkit-flex: 1;
  flex: 1;
}
.tags {
  ul {
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
  color: $white-color;
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
