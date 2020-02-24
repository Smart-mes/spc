<template>
  <div class="custom-wrap">
    <div class="customSearch">
      <el-form :inline="true" label-width="105px" class="formInline">
        <div
          v-for="(custom,customIndex) in formCustom.customList"
          :key="custom.id"
          class="custom-box"
        >
          <div
            class="subtitle2"
          >
            <h4 class="fl">{{ custom.name }}</h4>
            <i
              v-if="custom.customParam.length>0"
              :title="customDisplay[customIndex].isDisplay?'展开':'收起'"
              :class="['fr','iconfont',customDisplay[customIndex].isDisplay?'icon-drown':'icon-up']"
              @click="customDisplayFn(customIndex)"
            />
          </div>
          <div v-show="customDisplay[customIndex].isDisplay">
            <div
              v-for="(customItem1,i) in custom.customParam"
              :key="i"
              class="list-box"
            >
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
        </div>
        <div class="btn">
          <el-button
            type="primary"
            :disabled="isBtnSearch"
            @click="search"
          >
            <i class="iconfont icon-search"/>搜索
          </el-button>
          <el-button
            @click="clearSearch"
          >
            清空搜索
          </el-button>
        </div>
      </el-form>
    </div>
    <!-- 搜索条件 -->
    <div
      :id="`echarts${tagsItem.no}`"
      v-loading="echartsLoading"
      class="echarts-warp"
    >
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
                <div
                  v-show="isEchartsList[i].isDisplay"
                  class="none"
                >
                  暂时没有数据
                </div>
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
          <div
            v-else
            class="box-item"
            @mouseover="sigmaBtnList[i].isBtn=true"
            @mouseleave="sigmaBtnList[i].isBtn=false"
          >
            <div class="echarts-box"/>
            <div v-show="sigmaBtnList[i].isBtn" class="btn-box">
              <el-button
                size="mini"
                :type="sigmaList[i].length?'primary':''"
                @click="sigmaDialogOpen(i)"
              >
                配置
              </el-button>
            </div>
            <div v-show="isEchartsList[i].isDisplay" class="none">没有数据</div>
          </div>
        </li>
      </ul>
    </div>
    <!--sigma 弹窗-->
    <el-dialog
      :title="sigmaDialogTitle"
      :visible.sync="sigmaDialogVisible"
      width="840px"
    >
      <el-form :model="sigmaForm" label-width="50px">
        <el-form-item label="" prop="type" class="sigmaFrom">
          <el-checkbox-group v-model="sigmaForm.type">
            <el-checkbox label="r0" name="type">R0,超出上限下限</el-checkbox>
            <el-checkbox v-show="proDisabled()" label="r1" name="type">R1,1个点落在A区以外</el-checkbox>
            <el-checkbox label="r2" name="type">R2,连续9个点落在中心线的同一侧</el-checkbox>
            <el-checkbox label="r3" name="type">R3,连续6个点递增或者递减</el-checkbox>
            <el-checkbox label="r4" name="type">R4,连续14个点中相邻点上下交错</el-checkbox>
            <el-checkbox v-show="proDisabled()" label="r5" name="type">R5,连续3个点有2个点落在中心线同一侧B区以外</el-checkbox>
            <el-checkbox v-show="proDisabled()" label="r6" name="type">R6,连续5个点有4个点落在中心线同一侧C区以外</el-checkbox>
            <el-checkbox v-show="proDisabled()" label="r7" name="type">R7,连续15个点落在中心线两侧的C区以内</el-checkbox>
            <el-checkbox v-show="proDisabled()" label="r8" name="type">R8,连续8个点落在中心线两次且无一在C区内</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sigmaDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sigmaSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import unusual from '@/assets/js/unusual'

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
      isBtnSearch: false,
      echartsLoading: false,
      dataList: [],
      formCustom: {
        customList: [],
      },
      customDisplay: [],
      // 模板类型
      tempType: '',
      // optionList: [],
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
      // sigma
      sigmaDialogVisible: false,
      sigmaDialogTitle: 'SPC个八判异',
      sigmaList: [],
      sigmaBtnList: [],
      sigmaForm: {
        type: [],
      },
      sigmaIndex: 0,
      // 判异类型
      problemType: '',
      // 搜索后判断是否有数据
      isEchartsList: [],
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
  watch: {
    sigmaDialogVisible (val) {
      if (!val) {
        this.sigmaForm.type = []
      }
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

        this.cpkList = analysisDetails.map((analysisItem, i) => {
          const { modelCode } = analysisItem
          // 存储sigmaList
          this.sigmaList.push([])

          // 判断echarts是否执行
          const isEchartsObj = { isDisplay: true }
          const isBtnObj = { isBtn: false }

          this.isEchartsList.push(isEchartsObj)
          this.sigmaBtnList.push(isBtnObj)

          //  cpk存储数据
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
        // // 判断echarts是否执行
        // for (let i = 0; i < this.boxNum; i++) {
        //   const isEchartsObj = { isDisplay: true }
        //   const isBtnObj = { isBtn: false }
        //   this.isEchartsList.push(isEchartsObj)
        //   this.sigmaBtnList.push(isBtnObj)
        // }
      })
      .then(() => {
        // 搜索表单赋值
        this.formCustom.customList = JSON.parse(
          JSON.stringify(this.customParamList)
        )
        // 搜索列表展开收起
        const custom = this.formCustom.customList
        this.customDisplay = custom.map(item => {
          return { isDisplay: true }
        })
      })
  },
  methods: {
    getClass () {
      if (this.boxNum === 1) {
        return 'boxDefault'
      } else {
        const className = (this.boxNum % 2 === 0) ? 'boxEven' : 'boxOdd'
        return className
      }
    },
    search () {
      this.isBtnSearch = true
      this.echartsLoading = true
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
        this.isBtnSearch = false
        this.echartsLoading = false
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

        echartArr.map((echartItem, i) => {
          const { modelCode, data } = echartItem
          // 存cpk的数据
          if (modelCode === 'CPK' && data !== null) {
            const cpkObj = {}
            Object.keys(this.cpkKey).map(key => {
              cpkObj[key] = data[key]
            })
            this.cpkList[i].data = cpkObj
          }
          this.isEchartsList[i].isDisplay = data === null
        })
        this.echartInit(echartArr)
      }).catch((error) => {
        this.$message.error(error)
        this.isBtnSearch = false
        this.echartsLoading = false
      })
    },
    // 执行echarts
    echartInit (echartData) {
      echartData.map((item, i) => {
        const div = document
          .getElementById(`echarts${this.tagsItem.no}`)
          .getElementsByClassName('echarts-box')[i]
        const chart = this.$echarts.init(div)
        const { data } = item
        // 清空为空的数据
        if (data === null) {
          chart.clear()
          return false
        }

        const echartsOption = this.handleEchart({ ...item, i })

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
      const { modelCode, dataindex, yName, max, min, cl, ucl, lcl, data, problemData } = objParame
      return {
        title: {
          text: `[${modelCode} 控制图]`,
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
          data: dataindex,
        },
        yAxis: {
          name: yName,
          nameLocation: 'middle',
          nameGap: 50,
          splitNumber: 5,
          max: max,
          min: min,
          splitLine: {
            show: false,
          },
        },
        series: [{
          name: `${modelCode}图`,
          data: data,
          type: 'line',
          itemStyle: {
            normal: {
              color: function (parame) { // 折点颜色
                const { dataIndex } = parame
                if (problemData.includes(dataIndex)) {
                  return '#ff0000'
                }
                return '#000000'
              },
              lineStyle: {
                color: '#000000', // 折线颜色
              },
            },
          },
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
            lineStyle: {
              color: '#ff0000',
            },
            data: [
              {
                name: 'CL',
                yAxis: cl,
              },
              {
                name: 'UCL',
                yAxis: ucl,
              },
              {
                name: 'LCL',
                yAxis: lcl,
              },
            ],
          },
        }],
      }
    },
    drowXbarR (dataParame) {
      const [xbarRItem1, xbarRItem2] = dataParame
      console.log('xbarRItem2', xbarRItem2)
      return {
        title: [
          {
            text: `[${xbarRItem1.modelCode}控制图]`,
            top: 'top',
            left: 'center',
            textStyle: {
              fontSize: 12,
              fontWeight: 'normal',
            },
          },
          {
            text: `[${xbarRItem2.modelCode}控制图]`,
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
          data: xbarRItem1.dataindex,
        },
        {
          type: 'category',
          data: xbarRItem2.dataindex,
          gridIndex: 1,
        },
        ],
        yAxis: [
          {
            name: xbarRItem1.yName,
            nameLocation: 'middle',
            nameGap: 50,
            splitNumber: 5,
            splitLine: {
              show: false,
            },
            max: xbarRItem1.max,
            min: xbarRItem1.min,
          },
          {
            name: xbarRItem2.yName,
            nameLocation: 'middle',
            nameGap: 50,
            splitNumber: 5,
            splitLine: {
              show: false,
            },
            max: xbarRItem2.max,
            min: xbarRItem2.min,
            gridIndex: 1,
          },
        ],
        series: [
          {
            name: `${xbarRItem1.modelCode}图`,
            data: xbarRItem1.data,
            type: 'line',
            itemStyle: {
              normal: {
                color: function (parame) {
                  const { dataIndex } = parame
                  if (xbarRItem1.problemData.includes(dataIndex)) {
                    return '#ff0000'
                  }
                  return '#000000'
                },
                lineStyle: {
                  color: '#000000',
                },
              },
            },
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
              itemStyle: {
                normal: {
                  color: '#d53a35',
                },
              },
              data: [
                {
                  name: 'CL',
                  yAxis: xbarRItem1.cl,
                },
                {
                  name: 'UCL',
                  yAxis: xbarRItem1.ucl,
                },
                {
                  name: 'LCL',
                  yAxis: xbarRItem1.lcl,
                },
              ],
            },
          },
          {
            name: `${xbarRItem2.modelCode}图`,
            data: xbarRItem2.data,
            xAxisIndex: 1,
            yAxisIndex: 1,
            type: 'line',
            itemStyle: {
              normal: {
                color: function (parame) { // 折点颜色
                  const { dataIndex } = parame
                  if (xbarRItem2.problemData.includes(dataIndex)) {
                    return '#ff0000'
                  }
                  return '#000000'
                },
                lineStyle: {
                  color: '#000000', // 折线颜色
                },
              },
            },
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
              itemStyle: {
                normal: {
                  color: '#d53a35',
                },
              },
              data: [
                {
                  name: 'CL',
                  yAxis: xbarRItem2.cl,
                },
                {
                  name: 'UCL',
                  yAxis: xbarRItem2.ucl,
                },
                {
                  name: 'LCL',
                  yAxis: xbarRItem2.lcl,
                },
              ],
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
      const { i, modelCode, option, data } = itemData
      const {
        // +sigma
        rsigma,
        rsigma2,
        rsigma3,
        // // -sigma
        lsigma,
        lsigma2,
        lsigma3,
        // xbax
        xchartdata,
        dataindex,
        xcl,
        xucl,
        xlcl,
        xdataMax,
        xdataMin,
        // R
        rchartdata,
        rcl,
        rucl,
        rlcl,
        rdataMax,
        rdataMin,
        // S
        schartdata,
        scl,
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

      const sigmaData = {
        upSigma: rsigma,
        up2Sigma: rsigma2,
        up3Sigma: rsigma3,
        downSigma: lsigma,
        down2Sigma: lsigma2,
        down3Sigma: lsigma3,
      }

      // 判断判异变量
      const sigmaLen = this.sigmaList[i].length
      const upSigma4 = (rsigma3 + (rsigma3 - rsigma2)).toFixed(3)
      const downSigma4 = (lsigma3 - (lsigma2 - lsigma3)).toFixed(3)

      // echarts的参数,option
      let echartsParame
      let echartsOption
      // 单图
      let problemData
      // 组合图
      // let sigmafilter
      let problemData1
      let problemData2

      switch (modelCode) {
        case 'Xbar':
          problemData = !sigmaLen ? [] : this.getSPCProblem({
            sigmaList: this.sigmaList[i],
            data: xchartdata,
            cl: xcl,
            ucl: xucl,
            lcl: xlcl,
            sigmaData,
          })

          echartsParame = {
            option,
            modelCode,
            data: xchartdata,
            dataindex,
            cl: xcl,
            ucl: xucl,
            lcl: xlcl,
            yName: '平均值',
            max: !sigmaLen ? xdataMax : upSigma4,
            min: !sigmaLen ? xdataMin : downSigma4,
            problemData,
          }

          if (option !== '') {
            echartsOption = this.customXbaxValue(echartsParame)
          } else {
            echartsOption = this.drowxbar(echartsParame)
          }

          break

        case 'R':
          problemData = !sigmaLen ? [] : this.getSPCProblem({
            sigmaList: this.sigmaList[i],
            data: rchartdata,
            cl: rcl,
            ucl: rucl,
            lcl: rlcl,
            sigmaData,
          })

          echartsParame = {
            option,
            modelCode,
            data: rchartdata,
            dataindex,
            cl: rcl,
            ucl: rucl,
            lcl: rlcl,
            yName: '极差值',
            max: rdataMax,
            min: rdataMin,
            problemData,
          }

          if (option !== '') {
            echartsOption = this.customXbaxValue(echartsParame)
          } else {
            echartsOption = this.drowxbar(echartsParame)
          }

          break

        case 'S':
          problemData = !sigmaLen ? [] : this.getSPCProblem({
            sigmaList: this.sigmaList[i],
            data: schartdata,
            cl: scl,
            ucl: sucl,
            lcl: slcl,
            sigmaData,
          })

          echartsParame = {
            option,
            modelCode,
            data: schartdata,
            dataindex,
            cl: scl,
            ucl: sucl,
            lcl: slcl,
            yName: '标准值',
            max: sdataMax,
            min: sdataMin,
            problemData,
          }

          if (option !== '') {
            echartsOption = this.customXbaxValue(echartsParame)
          } else {
            echartsOption = this.drowxbar(echartsParame)
          }

          break

        case 'Xbar-R':
          problemData1 = !sigmaLen ? [] : this.getSPCProblem({
            sigmaList: this.sigmaList[i],
            data: xchartdata,
            cl: xcl,
            ucl: xucl,
            lcl: xlcl,
            sigmaData,
          })

          problemData2 = !sigmaLen ? [] : this.getSPCProblem({
            sigmaList: this.sigmafilter(this.sigmaList[i]),
            data: rchartdata,
            cl: rcl,
            ucl: rucl,
            lcl: rlcl,
            sigmaData,
          })

          console.log(' problemData2 ', problemData2)

          echartsParame = [
            {
              modelCode: 'xbax',
              data: xchartdata,
              dataindex,
              cl: xcl,
              ucl: xucl,
              lcl: xlcl,
              yName: '平均值',
              max: !sigmaLen ? xdataMax : upSigma4,
              min: !sigmaLen ? xdataMin : downSigma4,
              problemData: problemData1,
            },
            {
              modelCode: 'R',
              data: rchartdata,
              dataindex,
              cl: rcl,
              ucl: rucl,
              lcl: rlcl,
              yName: '极差值',
              max: rdataMax,
              min: rdataMin,
              problemData: problemData2,
            },
          ]

          if (option !== '') {
            echartsOption = this.customXbaxRValue(echartsParame, option)
          } else {
            echartsOption = this.drowXbarR(echartsParame)
          }

          break

        case 'Xbar-S':
          problemData1 = !sigmaLen ? [] : this.getSPCProblem({
            sigmaList: this.sigmaList[i],
            data: xchartdata,
            cl: xcl,
            ucl: xucl,
            lcl: xlcl,
            sigmaData,
          })
          problemData2 = !sigmaLen ? [] : this.getSPCProblem({
            sigmaList: this.sigmafilter(this.sigmaList[i]),
            data: schartdata,
            cl: scl,
            ucl: sucl,
            lcl: slcl,
            sigmaData,
          })

          echartsParame = [
            {
              modelCode: 'xbax',
              data: xchartdata,
              dataindex,
              cl: xcl,
              ucl: xucl,
              lcl: xlcl,
              yName: '平均值',
              max: !sigmaLen ? xdataMax : upSigma4,
              min: !sigmaLen ? xdataMin : downSigma4,
              problemData: problemData1,
            },
            {
              modelCode: 'S',
              data: schartdata,
              dataindex,
              cl: scl,
              ucl: sucl,
              lcl: slcl,
              yName: '标准值',
              max: sdataMax,
              min: sdataMin,
              problemData: problemData2,
            },
          ]

          if (option !== '') {
            echartsOption = this.customXbaxRValue(echartsParame, option)
          } else {
            echartsOption = this.drowXbarR(echartsParame)
          }

          break

        case 'I-MR':
          rchartdata[0] = ''

          problemData1 = !sigmaLen ? [] : this.getSPCProblem({
            sigmaList: this.sigmaList[i],
            data: xchartdata,
            cl: xcl,
            ucl: xucl,
            lcl: xlcl,
            sigmaData,
          })
          problemData2 = !sigmaLen ? [] : this.getSPCProblem({
            sigmaList: this.sigmafilter(this.sigmaList[i]),
            data: rchartdata.slice(1),
            cl: rcl,
            ucl: rucl,
            lcl: rlcl,
            sigmaData,
          })

          if (problemData2.length > 0) {
            problemData2 = problemData2.map(proItem => {
              return proItem + 1
            })
          }

          echartsParame = [
            {
              modelCode: 'xbax',
              data: xchartdata,
              dataindex,
              cl: xcl,
              ucl: xucl,
              lcl: xlcl,
              yName: '单值',
              max: !sigmaLen ? xdataMax : upSigma4,
              min: !sigmaLen ? xdataMin : downSigma4,
              problemData: problemData1,
            },
            {
              modelCode: 'R',
              data: rchartdata,
              dataindex: dataindex,
              cl: rcl,
              ucl: rucl,
              lcl: rlcl,
              yName: '移动极差值',
              max: rdataMax,
              min: rdataMin,
              problemData: problemData2,
            },
          ]
          if (option !== '') {
            echartsOption = this.customXbaxRValue(echartsParame, option)
          } else {
            echartsOption = this.drowXbarR(echartsParame)
          }
          break

        case 'CPK':
          echartsParame = {
            option,
            modelCode,
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

          if (option !== '') {
            echartsOption = this.customCpkValue(echartsParame)
          } else {
            echartsOption = this.drowCPK(echartsParame)
          }
          break
      }

      return echartsOption
    },
    customXbaxValue (xbaxObj) {
      const option = (new Function('return ' + xbaxObj.option))()

      const { title, xAxis, yAxis, series: [seriesItem] } = option
      const { modelCode, dataindex, yName, max, min, cl, ucl, lcl, data, problemData } = xbaxObj

      title.text = title.text || `[${modelCode} 控制图]`
      xAxis.data = dataindex
      yAxis.name = yAxis.name || yName
      yAxis.max = max
      yAxis.min = min
      // visualMap.pieces.gte = ucl
      // visualMap.pieces.lte = lcl
      seriesItem.name = seriesItem.name || `${modelCode}图`
      seriesItem.data = data

      const spotColor = seriesItem.itemStyle.normal.color || '#000000'
      seriesItem.itemStyle.normal.color = function (parame) {
        const {	dataIndex } = parame
        if (problemData.includes[dataIndex]) {
          return '#ff0000'
        }
        return spotColor
      }
      seriesItem.markLine.data[0].yAxis = cl
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
        // visualMap: [visualMapItem1, visualMapItem2],
        series: [seriesItem1, seriesItem2],
      } = option

      const [XbaxRObjItem1, XbaxRObjItem2] = XbaxRObj

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

      seriesItem1.name = seriesItem1.name || `${XbaxRObjItem1.modelCode}图`
      seriesItem1.data = XbaxRObjItem1.data

      const spotColor1 = seriesItem1.itemStyle.normal.color || '#000000'
      seriesItem1.itemStyle.normal.color = function (parame) {
        const {	dataIndex } = parame
        if (XbaxRObjItem1.problemData.includes[dataIndex]) {
          return '#ff0000'
        }
        return spotColor1
      }

      seriesItem1.markLine.data[0].yAxis = XbaxRObjItem1.cl
      seriesItem1.markLine.data[1].yAxis = XbaxRObjItem1.ucl
      seriesItem1.markLine.data[2].yAxis = XbaxRObjItem1.lcl

      seriesItem2.name = seriesItem2.name || `${XbaxRObjItem2.modelCode}图`
      seriesItem2.data = XbaxRObjItem2.data

      const spotColor2 = seriesItem2.itemStyle.normal.color || '#000000'
      seriesItem2.itemStyle.normal.color = function (parame) {
        const {	dataIndex } = parame
        if (XbaxRObjItem2.problemData.includes[dataIndex]) {
          return '#ff0000'
        }
        return spotColor2
      }

      seriesItem2.markLine.data[0].yAxis = XbaxRObjItem2.cl
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
    // sigma勾选
    sigmaDialogOpen (i) {
      const { analysisDetails } = this.dataList

      this.sigmaDialogVisible = true
      this.sigmaDialogTitle = `SPC个八判异-${i + 1}`
      this.sigmaForm.type = this.sigmaList[i]
      this.sigmaIndex = i

      this.problemType = analysisDetails[i].modelCode
    },
    sigmaSubmit () {
      this.sigmaList[this.sigmaIndex] = this.sigmaForm.type
      this.sigmaDialogVisible = false
    },
    getSPCProblem (spcParame) {
      const {
        sigmaList,
        data,
        cl,
        ucl,
        lcl,
        sigmaData: {
          upSigma,
          up2Sigma,
          up3Sigma,
          downSigma,
          down2Sigma,
          down3Sigma,
        },
      } = spcParame

      console.log('sigmaList', sigmaList)

      const resultArr = []

      sigmaList.forEach(sigmaItem => {
        let newArr = []
        switch (sigmaItem) {
          case 'r0':
            newArr = unusual.getSpc1({ data, greater: ucl, less: lcl })
            console.log('r0', newArr)
            break
          case 'r1':
            newArr = unusual.getSpc1({ data, greater: up3Sigma, less: down3Sigma })
            console.log('r1', newArr)
            break

          case 'r2':
            newArr = unusual.getSpc2({ data, greater: cl, less: cl, segment: 9, total: 9 })
            console.log('r2', newArr)
            break

          case 'r3':
            newArr = unusual.getSpc3({ data, segment: 6, total: 5 })
            console.log('r3', newArr)
            break

          case 'r4':
            newArr = unusual.getSpc4({ data, segment: 14 })
            console.log('r4', newArr)
            break

          case 'r5':
            newArr = unusual.getSpc2({ data, greater: up2Sigma, less: down2Sigma, segment: 3, total: 2 })
            console.log('r5', newArr)
            break

          case 'r6':
            newArr = unusual.getSpc2({ data, greater: upSigma, less: downSigma, segment: 5, total: 4 })
            console.log('r6', newArr)
            break

          case 'r7':
            newArr = unusual.getSpc7({ data, segment: 15, total: 15, greater: downSigma, less: upSigma, cl, type: 'seven' })
            console.log('r7', newArr)
            break

          case 'r8':
            console.log('r8', newArr)
            newArr = unusual.getSpc7({ data, segment: 8, total: 8, greater: upSigma, less: downSigma, cl, type: 'eight' })
            break
        }
        resultArr.push(...newArr)
      })
      console.log('暂时测试-------------------------------------')
      return Array.from(new Set(resultArr))
    },
    customDisplayFn (i) {
      this.customDisplay[i].isDisplay = !this.customDisplay[i].isDisplay
    },
    // 判异类型禁用
    proDisabled () {
      return !(this.problemType === 'R' || this.problemType === 'S')
    },
    sigmafilter (parameArr) {
      return parameArr.filter(item => {
        return !['r1', 'r5', 'r6', 'r', 'r8'].includes(item)
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
    padding:5px 20px 0 20px;
    border-bottom: 1px dashed $line-color;
    /deep/.el-form-item__label{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  }
  .subtitle2 {
    overflow: hidden;
    margin: 5px 0;
    line-height: 20px;
    i{
      font-size: 12px;
      color: $font-gray;
      cursor: pointer;
    }
  }
  /deep/.el-form-item {
    margin-bottom: 5px;
  }
  .btn {
    padding: 5px 0 0 20px;
    text-align: left;
  }
  /deep/ .el-date-editor.el-input{
    width:160px;
  }
}
.echarts-warp {
  margin-top: 15px;
  padding: 10px;
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
    height: 320px;
  }

  .box-item {
    position: relative;
    height: 100%;
    border: 1px solid #aaa;
    background: #fff;
    .btn-box{
      position: absolute;
      top: 10px;
      right:10px;
    }
    .none{
      position: absolute;
      top: 50%;
      vertical-align:middle;
      width: 100%;
      line-height:100%;
      text-align: center;
      color: $font-light-gray
    }
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

       li{
         overflow: hidden;
         text-overflow:ellipsis;
         white-space: nowrap;
         >span{
        display: inline-block;
        text-align: right;
        width: 65px;
        }
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
.boxDefault {
  > li {
    flex: 1;
  }
}
.boxOdd{
  > li {
    width: 50%;
  }
  > li:last-child {
    width: 100%;
  }
}

.boxEven {
  > li {
    width: 50%;
  }
}
.sigmaFrom{
  /deep/ .el-checkbox{
   width: 330px;
  }
}
.formInline{
    /deep/.el-input__inner{
        width: 180px;
    }
}

</style>
