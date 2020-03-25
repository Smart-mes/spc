<template>
  <div>
    <head-title :head-title="title"/>
    <div class="wrap">
      <div class="btn-tool">
        <btn-tool :buttons="btnList"/>
      </div>
      <div class="tempLayout">
        <add-echarts
          ref="addEcharts"
          :grid-num="tempType"
          :analysis-list="analysisList"
          @optionData="getChart"
        />
        <!-- tempType -->
      </div>
      <!-- /btnTool -->
    </div>
    <!-- 弹窗 -->
    <el-dialog
      :title="dialogGridTitle"
      :visible.sync="dialogGridVisible"
      label-width="90px"
      width="650px"
    >
      <el-form
        ref="gridForm"
        :model="gridForm"
        :rules="gridRules"
        label-width="90px"
        class="gridFrom"
      >
        <el-form-item label="模板名称" prop="name">
          <el-input v-model="gridForm.name"/>
        </el-form-item>
        <div class="grid">
          <el-form-item label="布局类型" prop="type">
            <el-radio-group v-model="gridForm.type">
              <el-radio label="1">
                <choice-grid grid-num="1"/>
              </el-radio>
              <el-radio label="2">
                <choice-grid grid-num="2"/>
              </el-radio>
              <el-radio label="3">
                <choice-grid grid-num="3"/>
              </el-radio>
              <el-radio label="4">
                <choice-grid grid-num="4"/>
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogGridVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogGridSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import headTitle from '@/components/headTitle'
import btnTool from '@/components/btnTool'
import choiceGrid from '@/components/choiceGrid'
import addEcharts from '@/components/addEcharts'
import { mapMutations } from 'vuex'

export default {
  name: 'Template',
  components: {
    headTitle,
    btnTool,
    choiceGrid,
    addEcharts,
  },
  data () {
    return {
      title: '',
      // tool
      btnList: [
        {
          type: 'primary',
          icon: 'icon-add',
          text: '添加布局',
          disabled: () => {
            return !!this.tempType
          },
          click: () => {
            this.gridAdd()
          },
        },
        {
          type: 'primary',
          icon: 'icon-modify',
          text: '修改布局',
          disabled: () => {
            return !this.tempType
          },
          click: () => {
            this.gridmodify()
          },
        },
        {
          type: 'success',
          icon: 'icon-save',
          text: '保存模板',
          disabled: () => {
            const layoutLen = !this.tempType ? 0 : Number(this.tempType)
            const chartLen = this.chartList.length
            // console.log('layoutLen', layoutLen)
            // console.log('chartLen', chartLen)
            // if (!layoutLen && !chartLen) {
            //   return true
            // }
            // return

            return !layoutLen && !chartLen ? true : layoutLen !== chartLen
          },
          click: () => {
            if (this.saveType === 'add') {
              this.addSave()
            } else if (this.saveType === 'modify') {
              this.modifySave()
            }
            // 动态添加路由，清空tags
            this.$store.dispatch('queryMenus')
            const { routes } = this.$store.getters
            if (routes.length) {
              routes.push(
                {
                  path: '*',
                  redirect: '/404',
                }
              )
              this.$router.addRoutes(routes)
            }
            this.set_state({ tags: [], tagsNo: 0 })
          },
        },
      ],
      // 选择布局
      gridForm: {
        name: '',
        type: '',
      },
      gridRules: {
        name: [
          {
            required: true,
            message: '名称不能为空',
            trigger: 'blur',
          },
        ],
        type: [
          {
            required: true,
            message: '请选择布局类型',
            trigger: 'change',
          },
        ],
      },
      tempName: '',
      tempType: '',
      dialogGridVisible: false,
      dialogGridTitle: '添加布局',
      chartList: [],
      // 保存类型
      saveType: 'add',
      // 修改传参到子组件
      analysisList: [],
    }
  },
  computed: {
  },
  watch: {
    dialogGridVisible (val) {
      if (!val) {
        this.$refs.gridForm.resetFields()
      }
    },
  },
  mounted () {
    if (!this.$route.query.id) {
      sessionStorage.clear()
    }
    this.modifyValue()
  },
  methods: {
    ...mapMutations(['set_state']),
    // 选择布局
    gridAdd () {
      this.dialogGridVisible = true
      this.dialogGridTitle = '添加布局'
    },
    gridmodify () {
      this.dialogGridVisible = true
      this.dialogGridTitle = '修改布局'
      this.gridForm.name = this.tempName
      this.gridForm.type = this.tempType
    },
    dialogGridSubmit () {
      this.$refs.gridForm.validate(valid => {
        if (valid) {
          this.dialogGridVisible = false
          this.tempType = this.gridForm.type
          this.tempName = this.gridForm.name
        } else {
          return false
        }
      })
    },
    getChart (val) {
      console.log('this.chartList', this.chartList)
      this.chartList = val
    },
    addSave () {
      const addParame = this.handleParame()

      this.$http
        .post('/api/analysis/addDesign', addParame)
        .then(res => {
          this.clearData()
          this.$confirm('添加成功！', '提示', {
            confirmButtonText: '继续添加',
            cancelButtonText: '查看列表',
            type: 'success',
          })
            .then(() => {
              this.$router.push({ path: '/template' })
            })
            .catch(() => {
              this.$router.push({ path: '/templateList' })
            })
        })
        .catch((error) => {
          this.$message.error(error)
        })
    },
    // 处理参数
    handleParame () {
      const modelList = this.chartList.map(chart => {
        chart.modelOption = JSON.stringify(chart.modelOption)
        return chart
      })

      const parame = {
        name: this.tempName,
        template: this.tempType,
        analysisDetails: modelList,
      }

      return parame
    },
    // 清空
    clearData () {
      sessionStorage.clear()
      this.saveType = 'add'
      this.title = ''
      this.tempName = ''
      this.tempType = ''
      this.analysisList = []
      this.$refs.addEcharts.optionList = []
    },
    // 修改赋值
    modifyValue () {
      this.$http
        .get('/api/analysis/viewMyAnalysis', {
          params: {
            id: this.$route.query.id,
          },
        })
        .then(({ data }) => {
          sessionStorage.setItem('analyseRow', JSON.stringify(data))
          // let analyseData = sessionStorage.getItem('analyseRow')
          // 处理参数
          if (this.$route.query.id && data) {
            // analyseData = JSON.parse(analyseData)
            const { name, template, analysisDetails } = data
            const analysisArr = analysisDetails.map(analys => {
              const {
                dataSourceId,
                dataSource: { name },
                modelCode,
                modelOption,
                cleanData,
                customOption,
                option,
              } = analys

              return {
                dataSourceId,
                dataSource: { name },
                modelCode,
                modelOption: JSON.parse(modelOption),
                cleanData,
                customOption,
                option,
              }
            })
            // 赋值
            this.saveType = 'modify'
            this.title = name
            this.tempName = name
            this.tempType = template
            this.analysisList = analysisArr
          }
        })
    },
    modifySave () {
      const modifyParame = this.handleParame()
      const modifyDetails = modifyParame.analysisDetails

      // 获取数据
      const analyseData = JSON.parse(sessionStorage.getItem('analyseRow'))
      const analyseDetails = analyseData.analysisDetails
      // 赋值id
      analyseDetails.map((item, i) => {
        modifyDetails[i].id = item.id
      })

      modifyParame.id = analyseData.id

      this.$http.put('/api/analysis/updateDesign', modifyParame)
        .then(res => {
          this.clearData()
          this.$confirm('修改成功！', '提示', {
            confirmButtonText: '继续添加',
            cancelButtonText: '查看列表',
            type: 'success',
          })
            .then(() => {
              this.$router.push({ path: '/template' })
            })
            .catch(() => {
              this.$router.push({ path: '/templateList' })
            })
        })
        .catch((error) => {
          this.$message.error(error)
        })
    },
  },
}
</script>
<style lang="scss" scoped>
.gridFrom {
  /deep/.el-input__inner {
    width: 465px;
  }
  .grid {
    margin: 30px 0;
    /deep/.el-form-item__label {
      line-height: 60px;
    }
    /deep/.el-radio-group {
      display: flex;
      flex-direction: row;
      .el-radio {
        margin-right: 30px;
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    }
  }
}
.btn-tool {
  border-bottom: 1px solid $line-color;
}
// 模板布局
.tempLayout {
  margin-top: 15px;
  padding: 10px;
  background: #eeecec;
  height: calc(100vh - 235px);
}
</style>
