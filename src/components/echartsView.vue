<template>
  <div>
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
        // console.log('echartArr', echartArr)
        this.echartInit(echartArr)
        // console.log('echartArr', echartArr)
      })
    },
    // 执行echarts
    echartInit (echartData) {
      echartData.map((item, i) => {
        const div = document
          .getElementById(`echear${this.tagsItem.no}`)
          .getElementsByClassName('box-item')[i]
        const chart = this.$echarts.init(div)
        const { modelCode, option, data } = item

        // 清空为空的数据
        if (data === null) {
          chart.clear()
          return false
        }

        //  获取echartsOption
        // const echartsOption = option !== '' ? this.getEchart(item) : this.handleEchart(item)

        // 获取echartsOption
        let echartsOption

        if (option !== '' && modelCode === 'Xbar' || modelCode === 'R' || modelCode === 'S') {
          echartsOption = this.getEchart(item)
        } else if (option !== '' && modelCode === 'Xbar-R' || modelCode === 'Xbar-S' || modelCode === 'I-MR') {
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
      // console.log('dataParame', dataParame)
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

        // title: {
        //   text: '正太分布图',
        //   left: 'center',
        // },
        title: {
          text: `[${modelCode} 控制图]`,
          top: 'top',
          left: 'center',
          textStyle: {
            fontSize: 12,
            fontWeight: 'normal',
          },
        },
        color: ['#5793f3', '#d14a61', '#675bba'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
        },
        xAxis: [{
          type: 'category',
          data: dataIndex,
        }],
        yAxis: [
        //   {
        //   show: false,
        // },
          {
            type: 'value',
            name: '频率',
            position: 'right',
            axisLine: {
              lineStyle: {
                color: '#00cc00',
              },
            },
            axisLabel: {
              formatter: '{value}',
            },
          },
          {
            type: 'value',
            position: 'left',
            axisLabel: {
              formatter: '{value}',
            },
          },
        ],
        series: [
          {
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
                  borderColor: '#000000',
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
    // cpk数据处理
    handleCPK (x, u, a) {
      return (1 / Math.sqrt(2 * Math.PI) * a) * Math.exp(-1 * ((x - u) * (x - u)) / (2 * a * a))
    },
    handleLineData (xchartdata, mean, multiplier) {
      const CPKArr = []
      for (var j = 0; j < xchartdata.length; j++) {
        const res = this.handleCPK(xchartdata[j], mean, multiplier).toFixed(2)
        CPKArr.push(res)
      }
      return CPKArr
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
        lsl,
        target,
        usl,
        sigma,
        sigmaMax,
        sigmaMin,
        mean,
        multiplier,

      } = data

      // echarts的参数,option
      let echartsParame
      let echartsOption

      // CPK
      // const x = ['-6486', '-6103', '-5720', '-5337', '-4954', '-4571', '-4188', '-3805', '-3422', '-3039', '-2729', '-2656', '-2273', '-1890', '-1507', '-1124', '-741', '-358', '25', '408', '791', '1174', '1557', '1940', '2323', '2706', '3090', '3473', '3856', '4239', '4622', '5005', '5388', '5771', '6154', '6537', '6920', '7249', '7303', '7686', '8069', '8452', '8835', '9218', '9601', '9984', '10367', '10750', '11133', '11516', '11899', '12282', '12666', '13049', '13432', '13815', '14198', '14581', '14964', '15347', '15730', '16113', '16496', '16879', '17226', '17262', '17645', '18028', '18411', '18794', '19177', '19560', '19943', '20326', '20709', '21092', '21475', '21858', '22242', '22625', '23008', '23391', '23774', '24157', '24540', '24923', '25306', '25689', '26072', '26455', '26838', '27221', '27604', '27987', '28370', '28753', '29136', '29519', '29902', '30285', '30668', '31051', '31434']
      // const y = ['1', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '17', '9', '2', '3', '3', '2', '1', '4', '7', '9', '29', '30', '42', '32', '25', '48', '33', '41', '33', '38', '36', '29', '28', '33', '23', '15', '20', '43', '18', '19', '12', '13', '7', '5', '7', '2', '3', '1', '2', '1', '0', '0', '0', '2', '1', '0', '1', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '1', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '1', '0', '0', '0', '0', '1']
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

          // 处理lineData
          // for (var j = 0; j < x.length; j++) {
          //   const res = this.handleCPK(x[j], 7248.59, 3325.93).toFixed(2)
          //   CPKArr.push(res)
          // }

          // echartsParame = {
          //   dataIndex: x,
          //   barData: y,
          //   lineData: CPKArr,
          //   lsl: '-6486',
          //   target: '-5337',
          //   usl: '-4954',
          //   sigma: '-4188',
          //   sigmaMax: '16113',
          //   sigmaMin: '27987',
          // }
          console.log('x', JSON.stringify(xchartdata))
          console.log('y', JSON.stringify(rchartdata))
          echartsParame = {
            modelCode,
            dataIndex: xchartdata,
            barData: rchartdata,
            lineData: this.handleLineData(xchartdata, mean, multiplier),
            lsl: (lsl).toString(),
            target: (target).toString(),
            usl: (usl).toString(),
            sigma: (sigma).toString(),
            sigmaMax: (sigmaMax).toString(),
            sigmaMin: (sigmaMin).toString(),
          }

          echartsOption = this.drowCPK(echartsParame)

          break
      }

      return echartsOption
    },
    // 自定义赋值
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
        // lsl,
        // target,
        // usl,
        // sigma,
        // sigmaMax,
        // sigmaMin,
        // mean,
        // multiplier,
        // firstData,

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
      }

      return echartsOption
    },
    customXbaxValue (xbaxObj) {
      // console.log('customObj', customObj)
      const option = (new Function('return ' + xbaxObj.option))()
      console.log('option', option)
      const { title, xAxis, yAxis, visualMap, series: [seriesItem] } = option

      title.text = title.text || `[${xbaxObj.modelCode} 控制图]`
      xAxis.data = xbaxObj.dataindex
      yAxis.name = yAxis.name || xbaxObj.yName
      yAxis.max = xbaxObj.max
      yAxis.min = xbaxObj.min
      visualMap.pieces.gte = xbaxObj.ucl
      visualMap.pieces.lte = xbaxObj.lcl
      seriesItem.name = seriesItem.name || `${xbaxObj.modelCode}图`
      seriesItem.data = xbaxObj.data
      seriesItem.markLine.data[1].yAxis = xbaxObj.ucl
      seriesItem.markLine.data[2].yAxis = xbaxObj.lcl

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
      // console.log('option', option)
      titleItem1.text = titleItem1.text || `[${XbaxRObj[0].modelCode}控制图]`
      titleItem2.text = titleItem2.text || `[${XbaxRObj[1].modelCode}控制图]`
      xAxisItem1.data = XbaxRObj[0].dataindex
      xAxisItem2.data = XbaxRObj[1].dataindex

      yAxisItem1.name = yAxisItem1.name || XbaxRObj[0].yName
      yAxisItem1.max = XbaxRObj[0].max
      yAxisItem1.min = XbaxRObj[0].min

      yAxisItem2.name = yAxisItem2.name || XbaxRObj[1].yName
      yAxisItem2.max = XbaxRObj[1].max
      yAxisItem2.min = XbaxRObj[1].min

      visualMapItem1.pieces.gte = XbaxRObj[0].ucl
      visualMapItem1.pieces.lte = XbaxRObj[0].lcl

      visualMapItem2.pieces.gte = XbaxRObj[1].ucl
      visualMapItem2.pieces.lte = XbaxRObj[1].lcl

      seriesItem1.name = seriesItem1.name || `${XbaxRObj[0].modelCode}图`
      seriesItem1.data = XbaxRObj[0].data
      seriesItem1.markLine.data[1].yAxis = XbaxRObj[0].ucl
      seriesItem1.markLine.data[2].yAxis = XbaxRObj[0].lcl

      seriesItem2.name = seriesItem2.name || `${XbaxRObj[1].modelCode}图`
      seriesItem2.data = XbaxRObj[1].data
      seriesItem2.markLine.data[1].yAxis = XbaxRObj[1].ucl
      seriesItem2.markLine.data[2].yAxis = XbaxRObj[1].lcl

      return option
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
