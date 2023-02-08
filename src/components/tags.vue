<template>
  <div class="tags">
    <div class="tag-box">
      <ul>
        <li
          v-for="(item,i) in tags.slice(firstIndex,fristSection)"
          v-show="item.visible"
          :key="item.key"
          :class="{'active':i+firstIndex === activeValue}"
          @click="tagsChange(i+firstIndex)"
        >
          <span class="tag-text">{{ item.no }}-{{ item.title }}</span>
          <span
            class="tag_delete"
            @click.stop="del(i+firstIndex )"
          >
            <i class="el-icon-close"/>
          </span>
        </li>
      </ul>
    </div>
    <div class="tag-close-box">
      <el-dropdown
        @command="handleCommand"
      >
        <span class="el-dropdown-link">
          标签设置
          <i class="el-icon-arrow-down el-icon--right"/>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            command="a"
          >
            关闭其它
          </el-dropdown-item>
          <el-dropdown-item
            command="b"
          >
            关闭所有
          </el-dropdown-item>
          <el-dropdown-item divided/>
          <el-dropdown-item
            v-for="tagsItem in tags.slice(fristSection,tags.length)"
            v-show="tagsItem.visible"
            :key="tagsItem.key"
            :command="tagsItem"
          >
            {{ tagsItem.no }}-{{ tagsItem.title }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import * as _ from 'lodash'
export default {
  data () {
    return {
      indexPath: [],
      activeValue: 0,
    }
  },
  computed: {
    ...mapState({
      tagsType: state => state.tagsType,
      tags: state => state.tags,
      tagsTitle: state => state.tagsTitle,
      firstIndex () {
        return this.tags.findIndex(({ visible }) => visible)
      },
    }),
    fristSection () {
      return this.firstIndex + 10
    },
  },
  watch: {
    firstIndex (val) {
      if (val !== -1) {
        this.setActive(val)
      }
    },
  },
  methods: {
    ...mapMutations(['del_tags', 'swap_tags', 'set_state']),
    tagsChange (i) {
      this.setActive(i)
    },
    del (i) {
      this.del_tags(i)
      if (i === 0) {
        this.setActive(0)
      } else if (this.activeValue < i) {
        this.setActive(this.activeValue)
      } else if (this.activeValue >= i) {
        this.setActive(i - 1)
      }
      if (!this.tags.length) { this.set_state({ tagsNo: 0 }) }
    },
    handleCommand (command) {
      if (command === 'a') {
        if (!this.tagsTitle) {
          this.set_state({ tags: [{ ...this.tags[this.activeValue] }] })
        } else {
          const tagsActive = { ...this.tags[this.activeValue] }
          this.set_state({ tags: this.getTagsFilter() })
          this.tags.splice(this.firstIndex, 0, tagsActive)
        }
        this.setActive(0)
      } else if (command === 'b') {
        if (!this.tagsTitle) {
          this.set_state({ tags: [] })
        } else {
          this.set_state({ tags: this.getTagsFilter() })
        }
        this.setActive(0)
      }

      // 设置赋值
      if (command === 'b' && !this.tags.length) {
        this.set_state({ tagsNo: 0 })
      }
      if (typeof (command) === 'object') {
        this.tabSwap(command)
      }
    },
    getTagsFilter () {
      return this.tags.filter(tagsItem => {
        const { title } = tagsItem
        return !new RegExp(`^${title}`).test(this.tagsTitle)
      })
    },
    tabSwap (item) {
      const x = this.activeValue
      const y = this.tags.indexOf(item)
      this.swap_tags({ x, y })
      // this.setActive(0)
    },
    getActive () {
      this.tags
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
    display: -webkit-flex;
    display: flex;
    align-items: center;
    border-radius: 4px;
    box-sizing: border-box;
    margin-right: 10px;
    padding: 0 6px;
    cursor: pointer;
    height: 26px;
    font-size: 12px;
    list-style: none;
    line-height: 26px;
    border: 1px solid rgba(64, 158, 255, 0.2);
    white-space: nowrap;
    -webkit-transition: all 0.5s ease-in;
    -moz-transition: all 0.5s ease-in;
    transition: all 0.5s ease-in;
    .tag-text{
     max-width: 120px;
     @extend %ellipsis;
    }
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
