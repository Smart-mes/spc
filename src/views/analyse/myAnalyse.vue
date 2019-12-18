<template>
  <div>
    <ul>
      <li v-for="(v,i) in path" :key="i">{{ v.name }}</li>
    </ul>
    <head-title/>
    <div class="wrap">
      <div class="customSearch">
        <el-form :inline="true" label-width="100px">
          <div v-for="(customList,i) in formCustom.customList" :key="i" class="list-box">
            <h4 class="subtitle">
              <span class="icon-circle">●</span>员工清单
            </h4>
            <div class="list-item-box">
              <el-form-item
                v-for="(custom,j) in customList"
                :key="j"
                :label="custom.key+' ('+custom.option+')'"
              >
                <el-input v-model="formCustom.user" size="mini"/>
              </el-form-item>
            </div>
          </div>
          <div class="btn">
            <el-button type="primary">
              <i class="iconfont iconsousuo"/>搜索
            </el-button>
          </div>
        </el-form>
      </div>
      <!-- 搜索条件 -->
      <div class="echear-warp">
        <echarts-view
          :grid-num="tempType"
          :option-list="optionList"
        />
      </div>
    </div>
  </div>
</template>
<script>
import headTitle from '@/components/headTitle'
import echartsView from '@/components/echartsView'
// import tags from '@/components/tags'
export default {
  components: {
    headTitle,
    echartsView,
    // tags,
  },
  data () {
    return {
      formCustom: {
        user: '',
        region: '',
        customList: [
          [
            { key: 'url', value: '', option: '>=' },
            { key: '数据库', value: '', option: '>=' },
            { key: 'api', value: '', option: '>' },
            { key: '职业', value: '', option: '>=' },
          ],
          [
            { key: '前端', value: '', option: '>' },
            { key: '后端', value: '', option: '<' },
          ],
        ],
      },
      // 图表显示
      tempType: '4',

      optionList: [
        {
          legend: {},
          tooltip: {},
          dataset: {

            dimensions: ['product', '2015', '2016', '2017'],
            source: [
              { product: 'Matcha Latte', '2015': 43.3, '2016': 85.8, '2017': 93.7 },
              { product: 'Milk Tea', '2015': 83.1, '2016': 73.4, '2017': 55.1 },
              { product: 'Cheese Cocoa', '2015': 86.4, '2016': 65.2, '2017': 82.5 },
              { product: 'Walnut Brownie', '2015': 72.4, '2016': 53.9, '2017': 39.1 },
            ],
          },
          xAxis: { type: 'category' },
          yAxis: {},
          series: [
            { type: 'bar' },
            { type: 'bar' },
            { type: 'bar' },
          ],
        },
        {
          legend: {},
          tooltip: {},
          dataset: {

            dimensions: ['product', '2015', '2016', '2017'],
            source: [
              { product: 'Matcha Latte', '2015': 43.3, '2016': 85.8, '2017': 93.7 },
              { product: 'Milk Tea', '2015': 83.1, '2016': 73.4, '2017': 55.1 },
              { product: 'Cheese Cocoa', '2015': 86.4, '2016': 65.2, '2017': 82.5 },
              { product: 'Walnut Brownie', '2015': 72.4, '2016': 53.9, '2017': 39.1 },
            ],
          },
          xAxis: { type: 'category' },
          yAxis: {},
          series: [
            { type: 'bar' },
            { type: 'bar' },
            { type: 'bar' },
          ],
        },
        {
          legend: {},
          tooltip: {},
          dataset: {

            dimensions: ['product', '2015', '2016', '2017'],
            source: [
              { product: 'Matcha Latte', '2015': 43.3, '2016': 85.8, '2017': 93.7 },
              { product: 'Milk Tea', '2015': 83.1, '2016': 73.4, '2017': 55.1 },
              { product: 'Cheese Cocoa', '2015': 86.4, '2016': 65.2, '2017': 82.5 },
              { product: 'Walnut Brownie', '2015': 72.4, '2016': 53.9, '2017': 39.1 },
            ],
          },
          xAxis: { type: 'category' },
          yAxis: {},
          series: [
            { type: 'bar' },
            { type: 'bar' },
            { type: 'bar' },
          ],
        },
        {
          legend: {},
          tooltip: {},
          dataset: {

            dimensions: ['product', '2015', '2016', '2017'],
            source: [
              { product: 'Matcha Latte', '2015': 43.3, '2016': 85.8, '2017': 93.7 },
              { product: 'Milk Tea', '2015': 83.1, '2016': 73.4, '2017': 55.1 },
              { product: 'Cheese Cocoa', '2015': 86.4, '2016': 65.2, '2017': 82.5 },
              { product: 'Walnut Brownie', '2015': 72.4, '2016': 53.9, '2017': 39.1 },
            ],
          },
          xAxis: { type: 'category' },
          yAxis: {},
          series: [
            { type: 'bar' },
            { type: 'bar' },
            { type: 'bar' },
          ],
        },
      ],
      path: [],
    }
  },
  activated () {
    // this.setTags(this.$route)
    // console.log('path', this.path)
  },
  methods: {
    // setTags (route) {
    //   const a = JSON.parse(JSON.stringify())
    //   console.log('a', a)
    //   // const{}=route
    //   // this.path.push({ fullPath: fullPath, title: title })
    // },
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
