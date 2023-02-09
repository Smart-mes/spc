<template>
  <div v-loading="loading" class="custom-wrap">
    <div class="customSearch">
      <el-form :inline="true" label-position="left" label-width="105px" class="formInline">
        <div
          v-for="(custom) in formCustom.customList"
          :key="custom.id"
          class="custom-box"
        >
          <div v-if="custom.customParam.length>0" class="subtitle2">
            <h4 class="fl">{{ custom.name }}</h4>
            <i
              :title="custom.isVisible?'展开':'收起'"
              :class="['fr','iconfont',custom.isVisible?'icon-drown':'icon-up']"
              @click="custom.isVisible=!custom.isVisible"
            />
          </div>
          <div v-show="custom.isVisible">
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
                  value-format="yyyy-MM-dd HH:mm:ss"
                  default-time="08:00:00"
                  placeholder="选择日期时间"
                />

                <el-input
                  v-else
                  v-model="customItem2.value"
                  size="mini"
                  clearable
                />
              </el-form-item>
            </div>
          </div>
        </div>
        <!-- SPC判异 -->
        <div v-if="searchVisible">
          <div class="subtitle2">
            <h4 class="fl">spc判异</h4>
            <i
              :title="spcVisible?'展开':'收起'"
              :class="['fr','iconfont',spcVisible?'icon-drown':'icon-up']"
              @click="spcVisible=!spcVisible"
            />
          </div>
          <div v-show="spcVisible" class="problem">
            <el-form-item label="判异选择">
              <el-checkbox-group v-model="formCustom.type">
                <el-checkbox label="r0" name="type" disabled>r0,超出规格</el-checkbox>
                <el-checkbox label="r1" name="type">r1,落在3倍sigma区以外</el-checkbox>
                <el-checkbox label="r2" name="type">r2,连续9个点在中心线同侧</el-checkbox>
                <el-checkbox label="r3" name="type">r3,连续6点递增或递减</el-checkbox>
                <el-checkbox label="r4" name="type">r4,连续14点中相邻点交替上下</el-checkbox>
                <el-checkbox label="r5" name="type">r5,连续3个点中有2点在中心线同侧2倍sigma区以外</el-checkbox>
                <el-checkbox label="r6" name="type">r6,连续5个点中有4点在中心线同侧1倍sigma区以外</el-checkbox>
                <el-checkbox label="r7" name="type">r7,连续15个点落在中心线两侧的1倍的sigma区内</el-checkbox>
                <el-checkbox label="r8" name="type">r8,连续8个点落在中心线两侧且无在1倍sigma区内</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div class="btn">
        <el-button
          type="primary"
          :disabled="isBtnSearch"
          @click="search"
        >
          <i class="iconfont icon-search"/>搜索
        </el-button>
        <el-button @click="clearSearch">清空搜索</el-button>
      </div>
    </div>
    <!-- 搜索条件 -->
    <div
      :id="`echarts${tagsItem.no}`"
      v-loading="echartsLoading"
      class="echarts-warp"
    >
      <ul :class="['box',getClass()]">
        <li v-for="(item,i) in tempNum" :key="i" :data-id="customData.analysisDetails[i].id">
          <div v-if="cpkList[i].modelCode==='CPK'" class="box-item cpk-item">
            <div v-contextmenu="CPKcontextmenuCfg" class="contextmenu" :data-index="i"/>
            <!-- 正文 -->
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
                  v-show="isEchartsList[i].isVisible"
                  class="none"
                >
                  没有数据
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
          <div v-else class="box-item">
            <div v-contextmenu="contextmenuCfg" class="contextmenu" :data-index="i"/>
            <!-- 正文 -->
            <div class="echarts-box"/>
            <div v-show="isEchartsList[i].isVisible" class="none">没有数据</div>
          </div>
        </li>
      </ul>
    </div>
    <!--sigma 弹窗-->
    <el-dialog
      :title="problemTitle"
      :visible.sync="problemVisible"
      width="850px"
      center
    >
      <el-form :model="problemForm" label-width="50px">
        <el-form-item label="" prop="type" class="problemFrom">
          <el-checkbox-group v-model="problemForm.type">
            <el-checkbox label="r0" name="type" disabled>r0,超出规格</el-checkbox>
            <el-checkbox v-show="proDisabled()" label="r1" name="type">r1,落在3倍sigma区以外</el-checkbox>
            <el-checkbox label="r2" name="type">r2,连续9个点在中心线同侧</el-checkbox>
            <el-checkbox label="r3" name="type">r3,连续6点递增或递减</el-checkbox>
            <el-checkbox label="r4" name="type">r4,连续14点中相邻点交替上下</el-checkbox>
            <el-checkbox v-show="proDisabled()" label="r5" name="type">r5,连续3个点中有2点在中心线同侧2倍sigma区以外</el-checkbox>
            <el-checkbox v-show="proDisabled()" label="r6" name="type">r6,连续5个点中有4点在中心线同侧1倍sigma区以外</el-checkbox>
            <el-checkbox v-show="proDisabled()" label="r7" name="type">r7,连续15个点落在中心线两侧的1倍的sigma区内</el-checkbox>
            <el-checkbox v-show="proDisabled()" label="r8" name="type">r8,连续8个点落在中心线两侧且无在1倍sigma区内</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="problemVisible = false">取 消</el-button>
        <el-button type="primary" @click="problemSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import unusual from '@/assets/js/unusual'
import echartsFn from './echartsFn'
import setEchartsFn from './setEchartsFn'

export default {
  name: 'EchartsView',
  props: {
    tagsItem: {
      type: Object,
      default: () => {},
    },
  },
  data () {
    return {
      loading: false,
      isBtnSearch: false,
      echartsLoading: false,
      customData: [],
      formCustom: { customList: [], type: ['r0'] },
      // customVisible: [],
      spcVisible: true,
      // 配置规则
      // modelOptList: [],
      // 模板类型
      tempNum: '',
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
      // 判异
      problemVisible: false,
      problemTitle: 'SPC个八判异',
      problemList: [],
      // problemBtnList: [],
      problemForm: { type: [] },
      problemIndex: 0,
      problemType: '',
      // 最后获得判异
      ProList: [],
      // 搜索后判断是否有数据
      isEchartsList: [],
    }
  },
  computed: {
    searchVisible () {
      const arr = this.cpkList.map(mapItem => mapItem.modelCode).filter(filterItem => filterItem !== 'CPK')
      return !!arr.length
    },
    CPKcontextmenuCfg () {
      return {
        'contextmenu': {
          list: [
            {
              label: '编辑规则',
              handler: (target) => { this.contextmenu(target) },
            },
          ],
        },
      }
    },
    contextmenuCfg () {
      return {
        'contextmenu': {
          list: [
            {
              label: 'spc判异',
              handler: (target) => {
                this.problemOpen(target.getAttribute('data-index'))
              },
            },
            {
              label: '编辑规则',
              handler: (target) => { this.contextmenu(target) },
            },
          ],
        },
      }
    },
  },
  watch: {
    problemVisible (val) {
      if (!val) { this.problemForm.type = [] }
    },
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const { id } = this.tagsItem
      this.loading = true

      this.$http
        .get('/analysis/viewMyAnalysis', { params: { id: id }})
        .then(({ data }) => {
          this.customData = data
          this.tempNum = Number(data.template)
          this.cpkList = data.analysisDetails.map((analysisItem, i) => {
            const { modelCode } = analysisItem
            // 存储problemList
            this.problemList.push(['r0'])

            // echarts是否有数据
            this.isEchartsList.push({ isVisible: true })

            // spc弹窗是否选中
            // this.problemBtnList.push({ isBtn: false })

            //  cpk存储数据
            if (modelCode === 'CPK') {
              const cpkObj = {}
              Object.keys(this.cpkKey).map(key => { cpkObj[key] = '' })
              return { modelCode, data: cpkObj }
            } else {
              return { modelCode, data: {}}
            }
          })
        })
        .then(() => {
        // 搜索表单赋值
          this.loading = false
          const customList = this.getCustomList()
          this.formCustom.customList = JSON.parse(JSON.stringify(customList))
          // this.modelOptList = this.customData.analysisDetails.map(({ modelOption }) => JSON.parse(modelOption))
        })
        .catch(() => {
          this.loading = false
        })
    },
    getCustomList () {
      const { analysisDetails } = this.customData
      const obj = {}
      // 筛选数据，去重，清空value
      return analysisDetails.map(customItem1 => {
        const { dataSource: { id, name, customParam }} = customItem1
        return {
          id,
          name,
          customParam: JSON.parse(customParam),
        }
      })
        .reduce((cur, next) => {
          obj[next.id] ? '' : (obj[next.id] = true && cur.push(next))
          return cur
        }, [])
        .map(customItem2 => {
          const { id, name, customParam } = customItem2
          const getCustom = customParame => {
            return customParame.map(item => {
              if (item.value) {
                item.label = item.key
                item.key = item.value
                item.value = ''
              }
              if (item.length) item = getCustom(item)
              return item
            })
          }
          const newCustomParam = getCustom(customParam)
          return { id, name, isVisible: true, customParam: newCustomParam }
        })
    },
    getClass () {
      if (this.tempNum === 1) { return 'boxDefault' }
      return (this.tempNum % 2 === 0) ? 'boxEven' : 'boxOdd'
    },
    search () {
      this.isBtnSearch = true
      this.echartsLoading = true
      // 清空CPK的数据
      this.clearCPK()
      // 处理表单的数据
      const { customList } = this.formCustom
      const { id, analysisDetails } = this.customData

      const customArr = customList.map(({ id, name, customParam }) => {
        return {
          id,
          name,
          customParam: JSON.stringify(customParam),
        }
      })

      // 参数合并, 遍历数据
      const analyseArr = analysisDetails.map((analysisItem) => {
        const { id, analysisId, modelCode, modelOption, dataSource } = analysisItem

        const [customObj] = customArr.filter(customItem => {
          if (dataSource.id === customItem.id) { return customItem }
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

      this.$http
        .post('/analysis/doMyAnalysis', { id, analysisDetails: analyseArr })
        .then(res => {
          this.isBtnSearch = false
          this.echartsLoading = false
          const { data: { data }} = res

          // 组装data
          const { analysisDetails } = this.customData
          const echartArr = analysisDetails.map(analysisItem => {
            const { modelCode, option } = analysisItem
            const [filterItem] = data.filter(filterItem => {
              const { id, dataSourceId } = filterItem
              return analysisItem.id === id && analysisItem.dataSourceId === dataSourceId
            })
            return { modelCode, option, ...filterItem }
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
            this.isEchartsList[i].isVisible = data === null
          })
          this.echartInit(echartArr)
        }).catch(() => {
          // this.$message.error(error)
          this.isBtnSearch = false
          this.echartsLoading = false
        })
    },
    // 执行echarts
    echartInit (echartData) {
      echartData.map((item, i) => {
        const div = document.getElementById(`echarts${this.tagsItem.no}`).getElementsByClassName('echarts-box')[i]
        const chart = this.$echarts.init(div)
        const { data } = item
        // 清空为空的数据
        if (data === null) {
          return void chart.clear()
        }

        const echartsOption = this.handleEchart({ ...item, i })
        chart.setOption(echartsOption, true)
        // 浏览器重置
        window.addEventListener('resize', () => { chart.resize() })
      })
    },
    // 清空搜索
    clearSearch () {
      this.formCustom.type = ['r0']
      const { customList } = this.formCustom

      customList.forEach(customItem => {
        const { customParam } = customItem
        const clearValue = customParam => {
          return customParam.forEach(paramItem => {
            if (paramItem.value) { paramItem.value = '' }
            paramItem.length && clearValue(paramItem)
          })
        }
        // 执行
        clearValue(customParam)
      })
    },
    // 图形配置
    ...echartsFn,

    // 默认echartsjs赋值
    handleEchart (itemData) {
      // 获取判异数组
      this.getProList()

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

      // echarts的参数,option
      let echartsParame
      let echartsOption

      // 单图
      let problemData
      // 组合图
      let problemData1
      let problemData2

      switch (modelCode) {
        case 'Xbar':
          problemData = this.getProblem({
            problemList: this.ProList[i],
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
            max: xdataMax,
            min: xdataMin,
            problemData,
          }

          if (option !== '') {
            echartsOption = this.customXbaxValue(echartsParame)
          } else {
            echartsOption = this.drowxbar(echartsParame)
          }

          break

        case 'R':
          problemData = this.getProblem({
            problemList: this.proFilter(this.ProList[i]),
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
          problemData = this.getProblem({
            problemList: this.proFilter(this.ProList[i]),
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
          problemData1 = this.getProblem({
            problemList: this.ProList[i],
            data: xchartdata,
            cl: xcl,
            ucl: xucl,
            lcl: xlcl,
            sigmaData,
          })

          problemData2 = this.getProblem({
            problemList: this.proFilter(this.ProList[i]),
            data: rchartdata,
            cl: rcl,
            ucl: rucl,
            lcl: rlcl,
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
              max: xdataMax,
              min: xdataMin,
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
          problemData1 = this.getProblem({
            problemList: this.ProList[i],
            data: xchartdata,
            cl: xcl,
            ucl: xucl,
            lcl: xlcl,
            sigmaData,
          })
          problemData2 = this.getProblem({
            problemList: this.proFilter(this.ProList[i]),
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
              max: xdataMax,
              min: xdataMin,
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
          problemData1 = this.getProblem({
            problemList: this.ProList[i],
            data: xchartdata,
            cl: xcl,
            ucl: xucl,
            lcl: xlcl,
            sigmaData,
          })
          problemData2 = this.getProblem({
            problemList: this.proFilter(this.ProList[i]),
            data: rchartdata.slice(1),
            cl: rcl,
            ucl: rucl,
            lcl: rlcl,
            sigmaData,
          })

          if (problemData2.length) {
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
              max: xdataMax,
              min: xdataMin,
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
    ...setEchartsFn,
    // 清空cpk赋值
    clearCPK () {
      this.cpkList = this.cpkList.map(cpkItem => {
        const { modelCode, data } = cpkItem
        if (modelCode === 'CPK') {
          Object.keys(data).map(key => {
            data[key] = ''
          })
        }
        return cpkItem
      })
    },
    // sigma勾选
    problemOpen (i) {
      const { analysisDetails } = this.customData

      this.problemVisible = true
      this.problemTitle = `SPC个八判异-${i + 1}`
      this.problemForm.type = this.problemList[i]
      this.problemIndex = i

      this.problemType = analysisDetails[i].modelCode
    },
    problemSubmit () {
      this.problemList[this.problemIndex] = this.problemForm.type
      this.problemVisible = false
    },
    getProblem (spcParame) {
      const {
        problemList,
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

      const resultArr = []

      problemList.forEach(sigmaItem => {
        let newArr = []
        switch (sigmaItem) {
          case 'r0':
            newArr = unusual.getSpc1({ data, greater: ucl, less: lcl })
            break
          case 'r1':
            newArr = unusual.getSpc1({ data, greater: up3Sigma, less: down3Sigma })
            break

          case 'r2':
            newArr = unusual.getSpc2({ data, greater: cl, less: cl, segment: 9, total: 9 })
            break

          case 'r3':
            newArr = unusual.getSpc3({ data, segment: 6, total: 5 })
            break

          case 'r4':
            newArr = unusual.getSpc4({ data, segment: 14 })
            break

          case 'r5':
            newArr = unusual.getSpc2({ data, greater: up2Sigma, less: down2Sigma, segment: 3, total: 2 })
            break

          case 'r6':
            newArr = unusual.getSpc2({ data, greater: upSigma, less: downSigma, segment: 5, total: 4 })
            break

          case 'r7':
            newArr = unusual.getSpc7({ data, segment: 15, total: 15, greater: downSigma, less: upSigma, cl, type: 'seven' })
            break

          case 'r8':
            newArr = unusual.getSpc7({ data, segment: 8, total: 8, greater: upSigma, less: downSigma, cl, type: 'eight' })
            break
          default:
        }
        resultArr.push(...newArr)
      })

      return Array.from(new Set(resultArr))
    },
    // 判异类型禁用
    proDisabled () {
      return !(this.problemType === 'R' || this.problemType === 'S')
    },
    proFilter (parameArr) {
      return parameArr.filter(item => !['r1', 'r5', 'r6', 'r7', 'r8'].includes(item))
    },
    // 得到最新的判异
    getProList () {
      this.ProList = this.problemList.map(item => item.length > 1 ? item : this.formCustom.type)
    },
    // 规则
    getModelForm (modelOpt) {
      const dialog = {
        dialogAttrs: {
          title: '编辑规则',
          width: '400px',
        },
        formConfig: {
          formAttrs: { labelWidth: '110px' },
          formItems: {},
          formData: {},
          rules: {},
          beforeOpen (formData) {
            return formData
          },
          beforeSubmit (formData) {
            return formData
          },
        },
      }
      modelOpt.forEach(({ key, value, label }) => {
        dialog.formConfig.formItems[key] = { label, component: 'el-input', clearable: true, span: 22 }
        dialog.formConfig.formData[key] = value
        dialog.formConfig.rules[key] = [{ required: true, message: `请输入${label}` }]
      })
      return Promise.resolve(dialog)
    },
    contextmenu (target) {
      const i = target.getAttribute('data-index')
      const modelOpt = JSON.parse(this.customData.analysisDetails[i].modelOption)

      this.getModelForm(modelOpt)
        .then(formCfg => this.$showDialogForm(formCfg))
        .then(formData => {
          const { analysisDetails, id, name, template } = this.customData
          // modelOpt
          const modelOption = modelOpt.map((modelItem) => {
            modelItem.value = formData[modelItem.key]
            return modelItem
          })

          return {
            analysisDetails: [
              {
                id: analysisDetails[i].id,
                cleanData: analysisDetails[i].cleanData,
                customOption: analysisDetails[i].customOption,
                dataSource: { name: analysisDetails[i].name },
                name: analysisDetails[i].name,
                dataSourceId: analysisDetails[i].dataSourceId,
                modelCode: analysisDetails[i].modelCode,
                option: analysisDetails[i].option,
                modelOption: JSON.stringify(modelOption),
              },
            ],
            id,
            name,
            template,
          }
        })
        .then((data) => {
          this.$http.put('/analysis/updateDesign', data).then(() => {
            this.$message.success('修改成功')
          })
        })
    },
  },
}
</script>
<style lang="scss" scoped>
.custom-wrap{
padding: 0 20px;
 height: calc(100vh - 140px);
 overflow-y: auto;
}
.customSearch {
  overflow: hidden;
  width: 100%;
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
    .contextmenu{position: absolute; width: 100%;height: 100%;z-index: 9;}
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
      font-size:$f-12;
      text-align: left;
      border: 1px solid #aaa;
      ul{ padding: 3px;}
       li{
         overflow: hidden;
         text-overflow:ellipsis;
         white-space: nowrap;
         span{
          display: inline-block;
          text-align: right;
          width: 65px;
        }
       }
      h5{
        padding-left: 10px;
        color: $blue-color;
        border-bottom: 1px solid #aaa;
      }
    }
    .cpk-right{
      // width: 100px;
      .cpk-box-item{
        margin:10px 10px 0 0;
       li span{ width: 50px; }
      }
    }

  }

}
/* 不同的列表*/
.boxDefault { li { flex: 1;}}
.boxOdd{
   li { width: 50%;
  }
   li:last-child {
    width: 100%;
  }
}

.boxEven {
   li { width: 50%;}
}
.problemFrom{
  /deep/ .el-checkbox{
   width: 340px;
  }
}
.formInline{
    /deep/.el-input__inner,
    /deep/.el-input{
         width: 180px !important;
    }

}

.problem{
  position: relative;
  overflow: hidden;

  /deep/.el-form-item__label{
    position:absolute;
    left:15px;
    z-index: 99;
  }
  /deep/.el-form-item__content{
  padding-left:125px;
  }

  /deep/ .el-checkbox{
    display: block;
    float: left;
    width: 350px;
  }
}

</style>
