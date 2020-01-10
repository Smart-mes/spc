<template>
  <div>
    <div class="customSearch">
      <el-form :inline="true" label-width="100px">
        <div v-for="custom in formCustom.customList" :key="custom.id" class="custom-box">
          <div class="subtitle2">
            <h4>{{ custom.name }}</h4>
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
      optionList: [],
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

      const newParame = { id, analysisDetails: analysisArr }

      this.$http.post('/api/analysis/doMyAnalysis', newParame).then(res => {
        const { data: { data }} = res
        // console.log('data打印:::', data)

        // 组装data
        const { analysisDetails } = this.dataList

        const echartArr = analysisDetails.map(analysisItem => {
          const { modelCode, option } = analysisItem
          const [filterItem] = data.filter(filterItem => {
            const { id, dataSourceId } = filterItem
            return analysisItem.id === id && analysisItem.dataSourceId === dataSourceId
          })
          return {
            modelCode,
            option,
            ...filterItem,
          }
        })

        // console.log('echartArr', echartArr)
        this.init(echartArr)
      })
    },
    // 执行echarts
    init (echartData) {
      echartData.map((item, i) => {
        const div = document
          .getElementById(`echear${this.tagsItem.no}`)
          .getElementsByClassName('box-item')[i]
        const chart = this.$echarts.init(div)

        const { modelCode, data } = item

        // 清空为空的数据
        if (data === null) {
          chart.clear()
          return false
        }

        const {
          // xbax
          xchartdata,
          dataindex,
          xucl,
          xlcl,
          // R
          rchartdata,
          rucl,
          rlcl,
          // S
          schartdata,
          sucl,
          slcl,
          // CPK
          // lsl,
          // target,
          // usl,
          // sigma,
          // sigmaMax,
          // sigmaMin,

        } = data

        let echartsOption
        let echartsParame
        switch (modelCode) {
          case 'Xbar':
            echartsParame = {
              modelCode,
              data: xchartdata,
              dataindex,
              ucl: xucl,
              lcl: xlcl,
              yName: '平均值',
              max: (xucl + 0.001),
              min: (xlcl - 0.001),
            }
            echartsOption = this.drowxbar(echartsParame)
            break

          case 'R':
            echartsParame = {
              modelCode,
              data: rchartdata,
              dataindex,
              ucl: rucl,
              lcl: rlcl,
              yName: '极差值',
              max: (rucl + 0.001),
              min: (rlcl - 0.001),
            }
            echartsOption = this.drowxbar(echartsParame)
            break

          case 'S':
            echartsParame = {
              modelCode,
              data: schartdata,
              dataindex,
              ucl: sucl,
              lcl: slcl,
              yName: '标准值',
              max: (sucl + 0.001),
              min: (slcl - 0.001),
            }
            echartsOption = this.drowxbar(echartsParame)
            break

          case 'Xbar-R':
            echartsParame = [
              {
                modelCode: 'xbax',
                data: xchartdata,
                dataindex,
                ucl: xucl,
                lcl: xlcl,
                yName: '平均值',
                max: (xucl + 0.001),
                min: (xlcl - 0.001),
              },
              {
                modelCode: 'R',
                data: rchartdata,
                dataindex,
                ucl: rucl,
                lcl: rlcl,
                yName: '极差值',
                max: (rucl + 0.001),
                min: (rlcl - 0.001),
              },
            ]
            echartsOption = this.drowXbarR(echartsParame)
            break

          case 'Xbar-S':
            echartsParame = [
              {
                modelCode: 'xbax',
                data: xchartdata,
                dataindex,
                ucl: xucl,
                lcl: xlcl,
                yName: '平均值',
                max: (xucl + 0.001),
                min: (xlcl - 0.001),
              },
              {
                modelCode: 'S',
                data: schartdata,
                dataindex,
                ucl: sucl,
                lcl: slcl,
                yName: '标准值',
                max: (sucl + 0.001),
                min: (slcl - 0.001),
              },
            ]
            echartsOption = this.drowXbarR(echartsParame)
            break

          case 'I-MR':
            rchartdata[0] = ''
            echartsParame = [
              {
                modelCode: 'xbax',
                data: xchartdata,
                dataindex,
                ucl: xucl,
                lcl: xlcl,
                yName: '单值',
                max: (xucl + 0.001),
                min: (xlcl - 0.001),
              },
              {
                modelCode: 'R',
                data: rchartdata,
                dataindex: dataindex,
                ucl: rucl,
                lcl: rlcl,
                yName: '移动极差值',
                max: (rucl + 0.001),
                min: (rlcl - 0.001),
              },
            ]
            echartsOption = this.drowXbarR(echartsParame)
            break

          case 'CPK':

            echartsParame = {
              dataIndex: ['-6486', '-6103', '-5720', '-5337', '-4954', '-4571', '-4188', '-3805', '-3422', '-3039', '-2729',
                '-2656', '-2273', '-1890', '-1507', '-1124', '-741', '-358', '25', '408', '791', '1174', '1557', '1940', '2323',
                '2706', '3090', '3473', '3856', '4239', '4622', '5005', '5388', '5771', '6154', '6537', '6920', '7249', '7303',
                '7686', '8069', '8452', '8835', '9218', '9601', '9984', '10367', '10750', '11133', '11516', '11899', '12282',
                '12666', '13049', '13432', '13815', '14198', '14581', '14964', '15347', '15730', '16113', '16496', '16879',
                '17226', '17262', '17645', '18028', '18411', '18794', '19177', '19560', '19943', '20326', '20709', '21092',
                '21475', '21858', '22242', '22625', '23008', '23391', '23774', '24157', '24540', '24923', '25306', '25689',
                '26072', '26455', '26838', '27221', '27604', '27987', '28370', '28753', '29136', '29519', '29902', '30285',
                '30668', '31051', '31434',
              ],
              barData: ['1', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '17', '9', '2',
                '3',
                '3', '2', '1', '4', '7', '9', '29', '30', '42', '32', '25', '48', '33', '41', '33', '38', '36', '29', '28', '33',
                '23', '15', '20', '43', '18', '19', '12', '13', '7', '5', '7', '2', '3', '1', '2', '1', '0', '0', '0', '2', '1',
                '0', '1', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '1', '0', '0', '0', '0', '0', '0', '0', '0', '0',
                '0', '0', '0', '0', '0', '0', '0', '0', '0', '1', '0', '0', '0', '0', '1',
              ],
              lineData: ['0.26', '0.42', '0.66', '1.03', '1.58', '2.40', '3.59', '5.30', '7.72', '11.10', '14.74', '15.74',
                '22.04', '30.44', '41.49', '55.81', '74.09', '97.05', '125.46', '160.05', '201.48', '250.29', '306.84', '371.21',
                '443.16', '522.09', '607.21', '696.61', '788.65', '881.09', '971.39', '1056.84', '1134.66', '1202.17', '1256.91',
                '1296.83', '1320.39', '1326.85', '1326.68', '1315.43', '1287.09', '1242.78', '1184.18', '1113.49', '1033.22',
                '946.11', '854.93', '762.36', '670.85', '582.56', '499.22', '422.17', '352.13', '289.98', '235.65', '188.98',
                '149.55', '116.79', '90.01', '68.45', '51.37', '38.05', '27.81', '20.05', '14.75', '14.27', '10.02', '6.95',
                '4.75', '3.21', '2.14', '1.40', '0.91', '0.58', '0.37', '0.23', '0.14', '0.09', '0.05', '0.03', '0.02', '0.01',
                '0.01', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00',
                '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00',
              ],
              lsl: '26072',
              target: '26455',
              usl: '26838',
              sigma: '27987',
              sigmaMax: '27221',
              sigmaMin: '27604',
            }

            // echartsParame = {
            //   dataIndex: xchartdata,
            //   barData: rchartdata,
            //   lineData: xchartdata,
            //   lsl: (lsl).toString(),
            //   target: (target).toString(),
            //   usl: (usl).toString(),
            //   sigma: (sigma).toString(),
            //   sigmaMax: (sigmaMax).toString(),
            //   sigmaMin: (sigmaMin).toString(),
            // }

            echartsParame = this.drowCPK(echartsParame)
            // console.log('lsl', lsl)
            // console.log('echartsParame', echartsParame)
            break
        }
        // 自定义修改echarts
        // if (option !== 'undefined' && option !== '') {
        //   const optionJson = (new Function('return ' + option))()

        //   for (const key in optionJson) {
        //     Object.assign(echartsOption[key], optionJson[key])
        //   }
        // }

        chart.setOption(echartsOption, true)
        // 浏览器重置
        window.addEventListener('resize', () => {
          chart.resize()
        })
      })
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
    handleEchart () {},
    // 图形配置
    drowxbar (objParame) {
      return			{
        title: {
          text: `[${objParame.modelCode} 控制图]`,
          top: 'top',
          left: 'center',
          textStyle: {
            fontSize: 12,
            fontWeight: 'normal',
          },
        },
        grid: {
          left: '10%',
          right: '10%',
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          data: objParame.dataindex,
        },
        yAxis: {
          name: objParame.yName,
          nameLocation: 'middle',
          nameGap: 50,
          splitNumber: 5,
          max: objParame.max,
          min: objParame.min,
        },
        visualMap: { // 区间内控制显示颜色
          show: false,
          dimension: 1,
          pieces: [{
            gte: objParame.ucl,
            lte: objParame.lcl,
            color: 'red',
          }],
          outOfRange: {
            color: '#000000',
          },
        },
        series: [{
          name: `${objParame.modelCode}图`,
          data: objParame.data,
          type: 'line',
          markLine: {
            symbol: ['none', 'none'],
            precision: 3,
            label: {
              formatter: function (value) {
                return value.value.toFixed(3)
              },
              normal: {
                formatter: '{b}:{c}',
              },
            },
            data: [{
              type: 'average',
              name: 'cl',
            },
            {
              name: 'UCL',
              yAxis: objParame.ucl,
            },
            {
              name: 'LCL',
              yAxis: objParame.lcl,
            },
            ],
          },
        }],

      }
    },
    drowXbarR (dataParame) {
      // console.log('dataParame', dataParame)
      return {
        title: [{
          text: `[${dataParame[0].modelCode}控制图]`,
          top: 'top',
          left: 'center',
          textStyle: {
            fontSize: 12,
            fontWeight: 'normal',
          },
        },
        {
          text: `[${dataParame[1].modelCode}控制图]`,
          top: '50%',
          left: 'center',
          textStyle: {
            fontSize: 12,
            fontWeight: 'normal',
          },
        },
        ],
        grid: [{
          top: '15%',
          bottom: '60%',
        }, {
          top: '60%',
          bottom: '15%',
        }],
        // 鼠标移动上去同时触发
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            animation: false,
          },
        },
        axisPointer: {
          link: {
            xAxisIndex: 'all',
          },
        },
        xAxis: [{
          type: 'category',
          data: dataParame[0].dataindex,
        },
        {
          type: 'category',
          data: dataParame[1].dataindex,
          gridIndex: 1,
        },
        ],
        yAxis: [{
          name: dataParame[0].yName,
          nameLocation: 'middle',
          nameGap: 50,
          splitNumber: 5,
          max: dataParame[0].max,
          min: dataParame[0].min,
        },
        {
          name: dataParame[1].yName,
          nameLocation: 'middle',
          nameGap: 50,
          splitNumber: 5,
          max: dataParame[1].max,
          min: dataParame[1].min,
          gridIndex: 1,
        },
        ],
        // 区间内控制显示颜色
        visualMap: [{
          show: false,
          dimension: 1,
          pieces: [{
            gte: dataParame[0].ucl,
            lte: dataParame[0].lcl,
            color: 'red',
          }],
          outOfRange: {
            color: '#000000',
          },
          seriesIndex: 0,
        },
        {
          show: false,
          dimension: 1,
          pieces: [{
            gte: dataParame[1].ucl,
            lte: dataParame[1].lcl,
            color: 'red',
          }],
          outOfRange: {
            color: '#00ff00',
          },
          seriesIndex: 1,
        },
        ],
        series: [
          {
            name: `${dataParame[0].modelCode}图`,
            data: dataParame[0].data,
            type: 'line',
            markLine: {
              symbol: ['none', 'none'],
              precision: 3, // 精度
              label: {
                formatter: function (value) {
                  return value.value.toFixed(3)
                },
                normal: {
                  formatter: '{b}:{c}',
                },
              },
              data: [{
                type: 'average',
                name: 'cl',
              },
              {
                name: 'UCL',
                yAxis: dataParame[0].ucl,
              },
              {
                name: 'LCL',
                yAxis: dataParame[1].lcl,
              },
              ],
            },
          },
          {
            name: `${dataParame[1].modelCode}图`,
            data: dataParame[1].data,
            type: 'line',
            xAxisIndex: 1,
            yAxisIndex: 1,
            markLine: {
              symbol: ['none', 'none'],
              precision: 3,
              label: {
                formatter: function (value) {
                  return value.value.toFixed(3)
                },
                normal: {
                  formatter: '{b}:{c}',
                },
              },
              data: [{
                type: 'average',
                name: 'cl',
              },
              {
                name: 'UCL',
                yAxis: dataParame[0].ucl,
              },
              {
                name: 'LCL',
                yAxis: dataParame[1].lcl,
              },
              ],
              itemStyle: {
                normal: {
                  color: '#d53a35',
                },
              },
            },
          },
        ],
      }
    },
    drowCPK (objParame) {
      const {
        dataIndex,
        barData,
        lineData,
        lsl,
        target,
        usl,
        sigma,
        sigmaMax,
        sigmaMin,
      } = objParame

      return {
        title: {
          text: '正太分布图',
          left: 'center',
        },
        color: ['#5793f3', '#d14a61', '#675bba'],
        tooltip: {
          trigger: 'axis',
        },
        xAxis: [{
          type: 'category',
          data: dataIndex,
        }],
        yAxis: [{
          show: false,
        },
        {
          type: 'value',
          position: 'left',
          axisLabel: {
            formatter: '{value}',
          },
        },
        ],
        series: [{
          name: '原数据频率',
          type: 'bar',
          yAxisIndex: 1,
          data: barData,
        },
        {
          name: '正态分布',
          type: 'line',
          smooth: true,
          yAxisIndex: 0,
          data: lineData,
        },
        {
          name: 'markLine1',
          type: 'line',
          markLine: {
            symbol: 'none',
            label: {
              position: 'end',
              normal: {
                formatter: '{b}',
                borderColor: '#ca8622',
              },
            },
            data: [{
              name: 'lsl',
              xAxis: lsl,
            },
            {
              name: 'target',
              xAxis: target,
            },
            {
              name: 'usl',
              xAxis: usl,
            },
            ],
          },
        },
        {
          name: 'markLine2',
          type: 'line',
          markLine: {
            symbol: 'none',
            label: {
              position: 'end',
              normal: {
                formatter: '{b}',
                borderColor: '#00ff00',
              },
            },
            data: [{
              name: 'sigma',
              xAxis: sigma,
            },
            {
              name: 'sigmaMax',
              xAxis: sigmaMax,
            },
            {
              name: 'sigmaMin',
              xAxis: sigmaMin,
            },
            ],
          },
        },
        ],
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.customSearch {
  overflow: hidden;
  width: 100%;
  // border-top: 1px solid $line-color;
  .custom-box {
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
