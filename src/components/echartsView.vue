<template>
  <div>
    <div class="customSearch">
      <el-form :inline="true" label-width="100px">
        <div v-for="custom in formCustom.customList" :key="custom.id" class="custom-box">
          <div class="subtitle2">
            <h4>
              {{ custom.name }}
            </h4>
          </div>
          <div v-for="(customItem1,i) in custom.customParam" :key="i" class="list-box">
            <el-form-item
              v-for="(customItem2,j) in customItem1"
              :key="j"
              :label="customItem2.label +' ('+customItem2.option+')'"
            >
              <el-input v-model="customItem2.value" size="mini"/>
            </el-form-item>
          </div>
        </div>
        <div class="btn">
          <el-button type="primary" @click="search">
            <i class="iconfont iconsousuo"/>搜索
          </el-button>
          <el-button @click="clearData">清空搜索</el-button>
        </div>
      </el-form>
    </div>
    <!-- 搜索条件 -->
    <div :id="`echear${tagsItem.no}`" class="echear-warp">
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
    tagsItem: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data () {
    return {
      dataList: [],
      formCustom: {
        customList: [],
      },
      // 图表显示
      tempType: '',
      optionList: [
        {
          legend: {},
          tooltip: {},
          dataset: {
            dimensions: ['product', '2015', '2016', '2017'],
            source: [
              {
                product: 'Matcha Latte',
                '2015': 43.3,
                '2016': 85.8,
                '2017': 93.7,
              },
              { product: 'Milk Tea', '2015': 83.1, '2016': 73.4, '2017': 55.1 },
              {
                product: 'Cheese Cocoa',
                '2015': 86.4,
                '2016': 65.2,
                '2017': 82.5,
              },
              {
                product: 'Walnut Brownie',
                '2015': 72.4,
                '2016': 53.9,
                '2017': 39.1,
              },
            ],
          },
          xAxis: { type: 'category' },
          yAxis: {},
          series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }],
        },
        {
          legend: {},
          tooltip: {},
          dataset: {
            dimensions: ['product', '2015', '2016', '2017'],
            source: [
              {
                product: 'Matcha Latte',
                '2015': 43.3,
                '2016': 85.8,
                '2017': 93.7,
              },
              { product: 'Milk Tea', '2015': 83.1, '2016': 73.4, '2017': 55.1 },
              {
                product: 'Cheese Cocoa',
                '2015': 86.4,
                '2016': 65.2,
                '2017': 82.5,
              },
              {
                product: 'Walnut Brownie',
                '2015': 72.4,
                '2016': 53.9,
                '2017': 39.1,
              },
            ],
          },
          xAxis: { type: 'category' },
          yAxis: {},
          series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }],
        },
        {
          legend: {},
          tooltip: {},
          dataset: {
            dimensions: ['product', '2015', '2016', '2017'],
            source: [
              {
                product: 'Matcha Latte',
                '2015': 43.3,
                '2016': 85.8,
                '2017': 93.7,
              },
              { product: 'Milk Tea', '2015': 83.1, '2016': 73.4, '2017': 55.1 },
              {
                product: 'Cheese Cocoa',
                '2015': 86.4,
                '2016': 65.2,
                '2017': 82.5,
              },
              {
                product: 'Walnut Brownie',
                '2015': 72.4,
                '2016': 53.9,
                '2017': 39.1,
              },
            ],
          },
          xAxis: { type: 'category' },
          yAxis: {},
          series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }],
        },
        {
          legend: {},
          tooltip: {},
          dataset: {
            dimensions: ['product', '2015', '2016', '2017'],
            source: [
              {
                product: 'Matcha Latte',
                '2015': 43.3,
                '2016': 85.8,
                '2017': 93.7,
              },
              { product: 'Milk Tea', '2015': 83.1, '2016': 73.4, '2017': 55.1 },
              {
                product: 'Cheese Cocoa',
                '2015': 86.4,
                '2016': 65.2,
                '2017': 82.5,
              },
              {
                product: 'Walnut Brownie',
                '2015': 72.4,
                '2016': 53.9,
                '2017': 39.1,
              },
            ],
          },
          xAxis: { type: 'category' },
          yAxis: {},
          series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }],
        },
      ],
    }
  },
  computed: {
    boxNum () {
      return !this.tempType ? 0 : Number(this.tempType)
    },
    customParamList () {
      const { analysisDetails } = this.dataList
      let customArr = []
      // 遍历筛选数据
      const customMap = analysisDetails.map(custom => {
        const {
          dataSource: { id, name, customParam },
        } = custom
        return {
          id,
          name,
          customParam: JSON.parse(customParam),
        }
      })
      // 去重处理
      const obj = {}
      customArr = customMap.reduce((cur, next) => {
        obj[next.id] ? '' : (obj[next.id] = true && cur.push(next))
        return cur
      }, [])

      // 清空data里面的value的值
      if (customArr.length) {
        customArr.map(custom => {
          const { id, name } = custom
          let { customParam } = custom

          const clearValue = customParam => {
            return customParam.map(item => {
              if (item.value) {
                item.label = item.key
                item.key = item.value
                item.value = ''
              }
              if (item.length) item = clearValue(item)
              return item
            })
          }
          customParam = clearValue(customParam)
          return { id, name, customParam }
        })
      }

      return customArr
    },
  },
  mounted () {
    const { id } = this.tagsItem
    this.$http
      .get('/api/analysis/viewMyAnalysis', { params: { id: id }})
      .then(({ data }) => {
        const { template } = data
        this.dataList = data
        this.tempType = template
        console.log('data', data)
      })
      .then(() => {
        // 搜索表单赋值
        this.formCustom.customList = JSON.parse(
          JSON.stringify(this.customParamList)
        )
        // console.log('this.customParamList', this.customParamList)
      })
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
      let { customList } = this.formCustom
      // 处理表单的数据
      customList = customList.map(custom => {
        const { id, name, customParam } = custom
        return {
          id,
          name,
          customParam: JSON.stringify(customParam),
        }
      })

      // 参数合并
      const { id, analysisDetails } = this.dataList
      // 遍历数据
      const analysisArr = analysisDetails.map((analysis) => {
        const { id, analysisId, modelCode, modelOption, dataSource } = analysis

        const [customObj] = customList.filter(custom => {
          if (dataSource.id === custom.id) {
            return custom
          }
        })

        return {
          id,
          analysisId,
          modelCode,
          modelOption,
          dataSourceVo: {
            id: customObj.id,
            customParam: customObj.customParam,
          },
        }
      })

      // console.log('analysisArr', analysisArr)
      // console.log('customList', customList)
      // console.log('newParame', newParame)

      const newParame = { id, analysisDetails: analysisArr }

      this.$http.post('/api/analysis/doMyAnalysis', newParame).then(res => {
        console.log('res:', res)
      })
      this.init
    },
    // 执行echarts
    init () {
      for (let i = 0; i < this.boxNum; i++) {
        const div = document
          .getElementById(`echear${this.tagsItem.no}`)
          .getElementsByClassName('box-item')[i]
        const chart = this.$echarts.init(div)
        chart.setOption(this.optionList[i])
      }
    },
    // 清空搜索
    clearData () {
      const { customList } = this.formCustom
      customList.forEach(custom => {
        const { customParam } = custom

        const clearValue = customParam => {
          return customParam.forEach(item => {
            if (item.value) {
              item.value = ''
            }
            if (item.length) item = clearValue(item)
          })
        }
        clearValue(customParam)
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.customSearch {
  overflow: hidden;
  width: 100%;
  // border-top: 1px solid $line-color;
  .custom-box{
    overflow: hidden;
    }
  .list-box {
    overflow: hidden;
    margin-bottom: -1px;
    padding: 5px 0;
    border-bottom: 1px dashed $line-color;
  }

  .subtitle2 {
    margin: 5px 0;

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
  width: 100%;
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
