<template>
  <div class="main-page">
    <tags v-if="tags.length" ref="tags" @getActive="getActive"/>
    <div class="wrap">
      <echarts-view
        v-for="(item,i) in tags"
        v-show="activeValue===i&&tags[i].title===tagsTitle||!tagsTitle&&activeValue===i"
        :key="item.key"
        :tags-item="item"
        style="{height:100px}"
      />
      <div v-if="tags.length&&!echartsVisible" class="none add-none">请添加我的分析！</div>
      <div v-if="!tags.length" class="none">还没有选择我的分析！</div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import echartsView from '@/components/echartsView/echartsView'
import tags from '@/components/tags'

export default {
  name: 'MyAnalyse',
  components: {
    echartsView,
    tags,
  },
  data () {
    return {
      activeValue: 0,
    }
  },
  computed: {
    ...mapState({
      tags: state => state.tags,
      tagsTitle: state => state.tagsTitle,
      echartsVisible () {
        return this.tags.some(tagsItem => {
          return tagsItem.visible
        })
      },
    }),
  },
  methods: {
    getActive (val) {
      this.activeValue = val
    },

  },
}
</script>

<style lang="scss" scoped>
.customSearch {
  overflow: hidden;
  width: 100%;
  border-top: 1px solid $line-color;
  .list-box {
    overflow: hidden;
    padding: 5px 0;
    border-bottom: 1px dashed $line-color;
  }
  .subtitle {
    margin: 0;
  }
  /deep/.el-form-item {
    margin-bottom: 5px;
  }
  .btn {
    padding-top: 5px;
    text-align: right;
  }
}
.echear-warp {
  margin-top: 15px;
  padding: 10px;
  height: 500px;
  background: #eee;
}
.none{
  margin-top: 40px;
  padding: 0 20px;
}
.add-none{
  margin: 0;
}
.wrap{
  padding: 0;
}
</style>
