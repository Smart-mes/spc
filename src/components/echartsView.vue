<template>
  <div>
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
              <el-input v-model="custom.value" size="mini"/>
            </el-form-item>
          </div>
        </div>
        <div class="btn">
          <el-button type="primary" @click="search">
            <i class="iconfont iconsousuo"/>搜索
          </el-button>
        </div>
      </el-form>
    </div>
    <!-- 搜索条件 -->
    <div :id="echartsId" class="echear-warp">
      <ul :class="['box',getClass()]">
        <li v-for="(item,i) in boxNum" :key="i">
          <div class="box-item"/>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'EchartsView',
  props: {
    echartsId: {
      type: String,
      default: '',
    },
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
    }
  },
  computed: {
    boxNum () {
      return !this.tempType ? 0 : Number(this.tempType)
    },
  },
  methods: {
    getClass () {
      switch (this.boxNum) {
        case 1:
          return 'box1'
        case 2:
          return 'box2'
        case 3:
          return 'box3'
        case 4:
          return 'box4'
      }
    },
    search () {
      this.init()
    },
    // 执行echarts
    init () {
      for (let i = 0; i < this.boxNum; i++) {
        const div = document.getElementById(this.echartsId).getElementsByClassName('box-item')[i]
        const chart = this.$echarts.init(div)
        chart.setOption(this.optionList[i])
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.customSearch {
  overflow: hidden;
  padding-top: 10px;
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
  height: 550px;
  background: #eee;
}
// 选择
.box {
  display: -webkit-flex;
  display: flex;
  -webkit-flex-wrap: wrap;
  flex-wrap: wrap;
  width:100%;
  height: 100%;
  background-color: #eee;
  > li {
    padding: 10px;
    text-align: center;
    box-sizing: border-box;
  }

  .box-item {
    height: 100%;
    border: 1px solid #aaa;
  }
}

/* 不同的列表*/
.box1 {
  > li {
    flex: 1;
    height: 100%;
  }
}

.box2 {
  > li {
    flex: 1;
    height: 100%;
  }
}

.box3 {
  > li {
    width: 50%;
    height: 50%;
  }
}

.box3 {
  > li:last-child {
    width: 100%;
  }
}
.box4 {
  > li {
    width: 50%;
    height: 50%;
  }
}
</style>
