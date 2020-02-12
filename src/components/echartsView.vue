<template>
  <div class="custom-wrap">
    <div class="customSearch">
      <el-form :inline="true" label-width="150px">
        <div v-for="custom in formCustom.customList" :key="custom.id" class="custom-box">
          <div class="subtitle2">
            <h4>{{ custom.name }}</h4>
          </div>
          <div v-for="(customItem1,i) in custom.customParam" :key="i" class="list-box">
            <el-form-item
              v-for="(customItem2,j) in customItem1"
              :key="j"
              :label="customItem2.label +' ('+customItem2.option+')'"
              :title="customItem2.label +' ('+customItem2.option+')'"
            >
              <el-date-picker
                v-if="(/^.*(time).*$/gi).test(customItem2.key)"
                v-model="customItem2.value"
                size="mini"
                type="datetime"
                placeholder="选择日期时间"
              />

              <el-input
                v-else
                v-model="customItem2.value"
                size="mini"
              />
            </el-form-item>
          </div>
        </div>
        <div class="btn">
          <el-button type="primary" @click="search">
            <i class="iconfont search"/>搜索
          </el-button>
          <el-button @click="clearSearch">清空搜索</el-button>
        </div>
      </el-form>
    </div>
    <!-- 搜索条件 -->
    <div :id="`echear${tagsItem.no}`" class="echear-warp">
      <ul :class="['box',getClass()]">
        <li v-for="(item,i) in boxNum" :key="i">
          <div v-if="cpkList[i].modelCode==='CPK'" class="box-item cpk-item">
            <div class="cpk-box">
              <div class="cpk-box-item">
                <h5> 统计样本</h5>
                <ul>
                  <li><span>统计样本：</span>{{ cpkList[i].data.totalnum }}</li>
                  <li><span>平 均 值：</span>{{ cpkList[i].data.mean }}</li>
                  <li><span>最 大 值：</span>{{ cpkList[i].data.dataMax }}</li>
                  <li><span>最 小 值：</span>{{ cpkList[i].data.dataMin }}</li>
                </ul>
              </div>
              <!-- /统计样本 -->
              <div class="cpk-box-item">
                <h5>常量</h5>
                <ul>
                  <li><span>子组大小：</span>{{ cpkList[i].data.size }}</li>
                  <li><span>规格下限：</span>{{ cpkList[i].data.lsl }}</li>
                  <li><span>目 标 值：</span>{{ cpkList[i].data.target }}</li>
                  <li><span>规格上限：</span>{{ cpkList[i].data.usl }}</li>
                </ul>
              </div>
              <!-- /常量-->
              <div class="cpk-box-item">
                <h5>计算值</h5>
                <ul>
                  <li><span>标准差：</span>{{ cpkList[i].data.sigma }}</li>
                  <li><span>+3标准差：</span>{{ cpkList[i].data.sigmaMin }}</li>
                  <li><span>-3标准差：</span>{{ cpkList[i].data.sigmaMax }}</li>
                </ul>
              </div>
              <!-- /计算值-->
            </div>
            <div class="echarts-box"/>
            <div class="cpk-right cpk-box">
              <h4>——短期</h4>
              <div class="cpk-box-item">
                <h5>短期工序能力</h5>
                <ul>
                  <li><span>Cpk：</span>{{ cpkList[i].data.cpk }}</li>
                  <li><span>Cp：</span>{{ cpkList[i].data.cp }}</li>
                  <li><span>CPL：</span>{{ cpkList[i].data.cpl }}</li>
                  <li><span>CPU：</span>{{ cpkList[i].data.cpu }}</li>
                </ul>
              </div>
              <!-- /短期工序能力-->
              <div class="cpk-box-item">
                <h5>其他值</h5>
                <ul>
                  <li><span>CA：</span>{{ cpkList[i].data.ca }}</li>
                </ul>
              </div>
              <!-- /短期工序能力-->
            </div>
          </div>
          <div v-else class="box-item">
            <div class="echarts-box"/>
          </div>
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
      // cpk
      cpkKey: {
        totalnum: '',
        mean: '',
        dataMax: '',
        dataMin: '',
        size: '',
        lsl: '',
        target: '',
        usl: '',
        sigma: '',
        sigmaMin: '',
        sigmaMax: '',
        cpk: '',
        cp: '',
        cpl: '',
        cpu: '',
        ca: '',
      },
      cpkList: [],
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
        const { template, analysisDetails } = data
        this.dataList = data
        this.tempType = template

        //  cpk存储数据
        this.cpkList = analysisDetails.map(analysisItem => {
          const { modelCode } = analysisItem
          if (modelCode === 'CPK') {
            const cpkObj = {}
            Object.keys(this.cpkKey).map(key => {
              cpkObj[key] = ''
            })
            return {
              modelCode,
              data: cpkObj,
            }
          } else {
            return { modelCode, data: {}}
          }
        })
      })
      .then(() => {
        // 搜索表单赋值
        this.formCustom.customList = JSON.parse(
          JSON.stringify(this.customParamList)
        )
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
      // 清空CPK的数据
      this.clearCPK()

      // 处理表单的数据
      let { customList } = this.formCustom
      customList = customList.map(custom => {
        const { id, name, customParam } = custom
        return {
          id,
          name,
          customParam: JSON.stringify(customParam),
        }
      })

      // 参数合并, 遍历数据
      const { id, analysisDetails } = this.dataList
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

        // 存cpk的数据
        echartArr.map((echartItem, i) => {
          const { modelCode, data } = echartItem
          if (modelCode === 'CPK' && data !== null) {
            const cpkObj = {}
            Object.keys(this.cpkKey).map(key => {
              cpkObj[key] = data[key]
            })
            this.cpkList[i].data = cpkObj
          }
        })

        this.echartInit(echartArr)
      })
    },
    // 执行echarts
    echartInit (echartData) {
      echartData.map((item, i) => {
        const div = document
          .getElementById(`echear${this.tagsItem.no}`)
          .getElementsByClassName('echarts-box')[i]
        const chart = this.$echarts.init(div)
        const { option, data } = item
        // 清空为空的数据
        if (data === null) {
          chart.clear()
          return false
        }

        //  获取echartsOption
        let echartsOption
        if (option !== '') {
          echartsOption = this.getEchart(item)
        } else {
          echartsOption = this.handleEchart(item)
        }

        chart.setOption(echartsOption, true)
        // 浏览器重置
        window.addEventListener('resize', () => {
          chart.resize()
        })
      })
    },
    // 清空搜索
    clearSearch () {
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
    // 图形配置
    drowxbar (objParame) {
      return {
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
          splitLine: {
            show: false,
          },
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
            data: [
              {
                type: 'average',
                name: 'CL',
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
      return {
        title: [
          {
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
        grid: [
          {
            top: '15%',
            bottom: '60%',
          },
          {
            top: '60%',
            bottom: '15%',
          },
        ],
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
          splitLine: {
            show: false,
          },
          max: dataParame[0].max,
          min: dataParame[0].min,
        },
        {
          name: dataParame[1].yName,
          nameLocation: 'middle',
          nameGap: 50,
          splitNumber: 5,
          splitLine: {
            show: false,
          },
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
            color: '#009900',
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
                name: 'Cl',
              },
              {
                name: 'UCL',
                yAxis: dataParame[0].ucl,
              },
              {
                name: 'LCL',
                yAxis: dataParame[0].lcl,
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
                name: 'CL',
              },
              {
                name: 'UCL',
                yAxis: dataParame[1].ucl,
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
        modelCode,
        rchartdata,
        yArr,
        min,
        max,
        lsl,
        target,
        usl,
        mean,
        sigmaMax,
        sigmaMin,
      } = objParame

      return {
        title: {
          text: `[${modelCode}控制图]`,
          top: 'top',
          left: 'center',
          textStyle: {
            fontSize: 12,
            fontWeight: 'normal',
          },
        },
        color: ['#7CCD7C', '#d14a61', '#675bba'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
        },
        xAxis: [{
          type: 'value',
          min: min,
          max: max,
        }],
        yAxis: [{
          type: 'value',
          name: '频率',
          position: 'right',
          axisLine: {
            lineStyle: {
              color: '#d14a61',
            },
          },
          axisLabel: {
            formatter: '{value}',
          },
        }, {
          type: 'value',
          position: 'left',
          axisLine: {
            lineStyle: {
              color: '#7CCD7C',
            },
          },
          axisLabel: {
            formatter: '{value}',
          },
        }],
        series: [{
          name: '原数据频率',
          type: 'bar',
          yAxisIndex: 1,
          data: rchartdata,
        }, {
          name: '正态分布',
          type: 'line',
          smooth: true,
          yAxisIndex: 0,
          data: yArr,
        },
        {
          name: 'markLine1',
          type: 'line',
          markLine: {
            precision: 3,
            label: {
              position: 'end',
              normal: {
                formatter: '{b}',
              },
            },
            lineStyle: {
              type: 'solid',
              color: '#000000',
            },
            data: [{
              name: 'lsl',
              xAxis: lsl,
            }, {
              name: 'target',
              xAxis: target,
            }, {
              name: 'usl',
              xAxis: usl,
            }],
          },
        },
        {
          name: 'markLine2',
          type: 'line',
          markLine: {
            precision: 3,
            label: {
              position: 'end',
              normal: {
                formatter: '{b}',
              },
            },
            lineStyle: {
              type: 'solid',
              color: '#6666cc',
            },
            data: [{
              name: 'mean',
              xAxis: mean,
            }, {
              name: '+3sigma',
              xAxis: sigmaMax,
            }, {
              name: '-3sigma',
              xAxis: sigmaMin,
            }],
          },
        }],
      }
    },
    // 默认echartsjs赋值
    handleEchart (itemData) {
      const { modelCode, data } = itemData
      const {
        // xbax
        xchartdata,
        dataindex,
        xucl,
        xlcl,
        xdataMax,
        xdataMin,
        // R
        rchartdata,
        rucl,
        rlcl,
        rdataMax,
        rdataMin,
        // S
        schartdata,
        sucl,
        slcl,
        sdataMax,
        sdataMin,
        // CPK
        leftindex,
        rightindex,
        lsl,
        target,
        usl,
        mean,
        sigmaMax,
        sigmaMin,
        yArr,
      } = data

      // echarts的参数,option
      let echartsParame
      let echartsOption

      // CPK
      switch (modelCode) {
        case 'Xbar':
          echartsParame = {
            modelCode,
            data: xchartdata,
            dataindex,
            ucl: xucl,
            lcl: xlcl,
            yName: '平均值',
            max: xdataMax,
            min: xdataMin,
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
            max: rdataMax,
            min: rdataMin,
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
            max: sdataMax,
            min: sdataMin,
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
              max: xdataMax,
              min: xdataMin,
            },
            {
              modelCode: 'R',
              data: rchartdata,
              dataindex,
              ucl: rucl,
              lcl: rlcl,
              yName: '极差值',
              max: rdataMax,
              min: rdataMin,
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
              max: xdataMax,
              min: xdataMin,
            },
            {
              modelCode: 'S',
              data: schartdata,
              dataindex,
              ucl: sucl,
              lcl: slcl,
              yName: '标准值',
              max: sdataMax,
              min: sdataMin,
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
              max: xdataMax,
              min: xdataMin,
            },
            {
              modelCode: 'R',
              data: rchartdata,
              dataindex: dataindex,
              ucl: rucl,
              lcl: rlcl,
              yName: '移动极差值',
              max: rdataMax,
              min: rdataMin,
            },
          ]

          echartsOption = this.drowXbarR(echartsParame)
          break

        case 'CPK':
          echartsParame = {
            modelCode: 'CPK',
            rchartdata,
            yArr,
            min: leftindex,
            max: rightindex,
            lsl,
            target,
            usl,
            mean,
            sigmaMax,
            sigmaMin,
          }
          echartsOption = this.drowCPK(echartsParame)
          break
      }

      return echartsOption
    },
    // 自定义echarts赋值
    getEchart (itemData) {
      const { modelCode, option, data } = itemData
      const {
        // xbax
        xchartdata,
        dataindex,
        xucl,
        xlcl,
        xdataMax,
        xdataMin,
        // R
        rchartdata,
        rucl,
        rlcl,
        rdataMax,
        rdataMin,
        // S
        schartdata,
        sucl,
        slcl,
        sdataMax,
        sdataMin,
        // CPK
        lsl,
        target,
        usl,
        mean,
        sigmaMax,
        sigmaMin,
        yArr,
        leftindex,
        rightindex,

      } = data

      // echarts的参数,option
      let echartsParame
      let echartsOption

      switch (modelCode) {
        case 'Xbar':
          echartsParame = {
            modelCode,
            option,
            data: xchartdata,
            dataindex,
            ucl: xucl,
            lcl: xlcl,
            yName: '平均值',
            max: xdataMax,
            min: xdataMin,
          }
          echartsOption = this.customXbaxValue(echartsParame)
          break

        case 'R':
          echartsParame = {
            modelCode,
            option,
            data: rchartdata,
            dataindex,
            ucl: rucl,
            lcl: rlcl,
            yName: '极差值',
            max: rdataMax,
            min: rdataMin,
          }
          echartsOption = this.customXbaxValue(echartsParame)
          break

        case 'S':
          echartsParame = {
            modelCode,
            option,
            data: schartdata,
            dataindex,
            ucl: sucl,
            lcl: slcl,
            yName: '标准值',
            max: sdataMax,
            min: sdataMin,
          }
          echartsOption = this.customXbaxValue(echartsParame)
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
              max: xdataMax,
              min: xdataMin,
            },
            {
              modelCode: 'R',
              data: rchartdata,
              dataindex,
              ucl: rucl,
              lcl: rlcl,
              yName: '极差值',
              max: rdataMax,
              min: rdataMin,
            },
          ]
          echartsOption = this.customXbaxRValue(echartsParame, option)
          break

        case 'Xbar-S':
          echartsParame = [
            {
              modelCode: 'xbax',
              option,
              data: xchartdata,
              dataindex,
              ucl: xucl,
              lcl: xlcl,
              yName: '平均值',
              max: xdataMax,
              min: xdataMin,
            },
            {
              modelCode: 'S',
              data: schartdata,
              dataindex,
              ucl: sucl,
              lcl: slcl,
              yName: '标准值',
              max: sdataMax,
              min: sdataMin,
            },
          ]
          echartsOption = this.customXbaxRValue(echartsParame, option)
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
              max: xdataMax,
              min: xdataMin,
            },
            {
              modelCode: 'R',
              data: rchartdata,
              dataindex: dataindex,
              ucl: rucl,
              lcl: rlcl,
              yName: '移动极差值',
              max: rdataMax,
              min: rdataMin,
            },
          ]

          echartsOption = this.customXbaxRValue(echartsParame, option)
          break

        case 'CPK':
          echartsParame = {
            modelCode: 'CPK',
            option,
            rchartdata,
            yArr,
            min: leftindex,
            max: rightindex,
            lsl,
            target,
            usl,
            mean,
            sigmaMax,
            sigmaMin,
          }

          echartsOption = this.customCpkValue(echartsParame)
          break
      }

      return echartsOption
    },
    customXbaxValue (xbaxObj) {
      const option = (new Function('return ' + xbaxObj.option))()

      const { title, xAxis, yAxis, visualMap, series: [seriesItem] } = option
      const { modelCode, dataindex, yName, max, min, ucl, lcl, data } = xbaxObj

      title.text = title.text || `[${modelCode} 控制图]`
      xAxis.data = dataindex
      yAxis.name = yAxis.name || yName
      yAxis.max = max
      yAxis.min = min
      visualMap.pieces.gte = ucl
      visualMap.pieces.lte = lcl
      seriesItem.name = seriesItem.name || `${modelCode}图`
      seriesItem.data = data
      seriesItem.markLine.data[1].yAxis = ucl
      seriesItem.markLine.data[2].yAxis = lcl

      return option
    },
    customXbaxRValue (XbaxRObj, echartOption) {
      const option = (new Function('return ' + echartOption))()
      const {
        title: [titleItem1, titleItem2],
        xAxis: [xAxisItem1, xAxisItem2],
        yAxis: [yAxisItem1, yAxisItem2],
        visualMap: [visualMapItem1, visualMapItem2],
        series: [seriesItem1, seriesItem2],
      } = option

      const [XbaxRObjItem1, XbaxRObjItem2] = XbaxRObj
      // console.log('option', option)
      titleItem1.text = titleItem1.text || `[${XbaxRObjItem1.modelCode}控制图]`
      titleItem2.text = titleItem2.text || `[${XbaxRObjItem2.modelCode}控制图]`
      xAxisItem1.data = XbaxRObjItem1.dataindex
      xAxisItem2.data = XbaxRObjItem2.dataindex

      yAxisItem1.name = yAxisItem1.name || XbaxRObjItem1.yName
      yAxisItem1.max = XbaxRObjItem1.max
      yAxisItem1.min = XbaxRObjItem1.min

      yAxisItem2.name = yAxisItem2.name || XbaxRObjItem2.yName
      yAxisItem2.max = XbaxRObjItem2.max
      yAxisItem2.min = XbaxRObjItem2.min

      visualMapItem1.pieces.gte = XbaxRObjItem1.ucl
      visualMapItem1.pieces.lte = XbaxRObjItem1.lcl

      visualMapItem2.pieces.gte = XbaxRObjItem2.ucl
      visualMapItem2.pieces.lte = XbaxRObjItem2.lcl

      seriesItem1.name = seriesItem1.name || `${XbaxRObjItem1.modelCode}图`
      seriesItem1.data = XbaxRObjItem1.data
      seriesItem1.markLine.data[1].yAxis = XbaxRObjItem1.ucl
      seriesItem1.markLine.data[2].yAxis = XbaxRObjItem1.lcl

      seriesItem2.name = seriesItem2.name || `${XbaxRObjItem2.modelCode}图`
      seriesItem2.data = XbaxRObj[1].data
      seriesItem2.markLine.data[1].yAxis = XbaxRObjItem2.ucl
      seriesItem2.markLine.data[2].yAxis = XbaxRObjItem2.lcl

      return option
    },
    customCpkValue (cpkObj) {
      const option = (new Function('return ' + cpkObj.option))()
      const { title, xAxis: [xAxisItem1], series: [seriesItem1, seriesItem2, seriesItem3, seriesItem4] } = option
      const {
        modelCode,
        rchartdata,
        yArr,
        min,
        max,
        lsl,
        target,
        usl,
        mean,
        sigmaMax,
        sigmaMin,
      } = cpkObj

      title.text = title.text || `[${modelCode} 控制图]`
      xAxisItem1.min = min
      xAxisItem1.max = max
      seriesItem1.data = yArr
      seriesItem2.data = rchartdata

      seriesItem3.markLine.data[0].xAxis = lsl
      seriesItem3.markLine.data[1].xAxis = target
      seriesItem3.markLine.data[2].xAxis = usl

      seriesItem4.markLine.data[0].xAxis = mean
      seriesItem4.markLine.data[1].xAxis = sigmaMax
      seriesItem4.markLine.data[2].xAxis = sigmaMin
      return option
    },
    // 清空cpk赋值
    clearCPK () {
      this.cpkList = this.cpkList.map(cpkItem => {
        const { modelCode, data } = cpkItem
        if (modelCode === 'CPK') {
          // for (const i in data) {
          //   data[i] = ''
          // }
          Object.keys(data).map(key => {
            data[key] = ''
          })
        }
        return cpkItem
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.custom-wrap{
padding: 0 20px;
 height: calc(100vh - 160px);
 overflow-y: auto;
}
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
    /deep/.el-form-item__label{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
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
  /deep/ .el-date-editor.el-input{
    width:160px;
  }
}
.echear-warp {
  margin-top: 15px;
  padding: 10px;
  height: 600px;
  background: #f3f3f3;
}
// 选择
.box {
  display: -webkit-flex;
  display: flex;
  -webkit-flex-wrap: wrap;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  // background-color: #eee;
  > li {
    padding:7px;
    text-align: center;
    box-sizing: border-box;
  }

  .box-item {
    height: 100%;
    border: 1px solid #aaa;
    background: #fff;
  }
  .echarts-box{height: 100%;}
  .cpk-item{
    display: flex;
    .cpk-box{
     width: 150px;
     height: 100%;

    }
    .echarts-box{ flex: auto;}
    .cpk-box-item{
      margin:5px 0 0 10px;
      font-size: 12px;
      text-align: left;
      border: 1px solid #aaa;
      ul{ padding: 3px;}
       li>span{
        display: inline-block;
        text-align: right;
        width: 65px;
        }
      h5{
        //  margin-bottom:5px;
        padding-left: 10px;
        color: $blue-color;
        border-bottom: 1px solid #aaa;
      }
    }
    .cpk-right{
      // width: 100px;
      .cpk-box-item{
        margin:10px 10px 0 0;
       li>span{
        width: 50px;
        }
      }
    }

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
// .mt-40{
//   margin-top: 30px !important;
// }
</style>
