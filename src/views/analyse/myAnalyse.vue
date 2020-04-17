<template>
  <div>
    <tags v-if="tags.length" @getActive="getActive"/>
    <div class="wrap">
      <echarts-view v-for="(item,i) in tags" v-show="activeValue===i" :key="item.key" :tags-item="item"/>
      <div v-if="!tags.length" class="none">还没有选择我的分析！</div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import echartsView from '@/components/echartsView'
import tags from '@/components/tags'

export default {
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
.wrap{
  padding: 0;
}
</style>
