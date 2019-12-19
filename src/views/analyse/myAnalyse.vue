<template>
  <div>
    <tags @getActive="getActive"/>
    <div class="wrap">
      <echarts-view v-for="(item,i) in tags" v-show="activeValue===i" :key="item.key" :echarts-id="`echarts${i}`"/>
    </div>
  </div>
</template>
<script>
import echartsView from '@/components/echartsView'
import tags from '@/components/tags'
import { mapState } from 'vuex'
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
  mounted () {
    console.log('this.$route', this.$route)
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
    //  border-top:1px dashed $line-color;
    text-align: right;
  }
}
.echear-warp {
  margin-top: 15px;
  padding: 10px;
  height: 500px;
  background: #eee;
}
</style>
