<template>
  <div>
    <head-title/>
    <div class="wrap">
      <div class="btn-tool">
        <btn-tool :buttons="btnList"/>
      </div>
      <div class="tempLayout">
        <add-echarts
          :grid-num="tempType"
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
      <el-form ref="gridForm" :model="gridForm" :rules="gridRules" label-width="90px" class="gridFrom">
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
      // tool
      btnList: [
        {
          type: 'primary',
          icon: 'icontianjia',
          text: '添加布局',
          disabled: () => {
            return false
          },
          click: () => {
            this.gridAdd()
          },
        },
        {
          type: 'primary',
          icon: 'iconxiugai',
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
          icon: 'iconbaocun',
          text: '保存模板',
          disabled: () => {
            const layoutLen = !this.tempType ? 0 : Number(this.tempType)
            const chartLen = this.chartList.length
            if (!layoutLen && !chartLen) {
              return true
            }
            return layoutLen !== chartLen
          },
          click: () => {
            console.log('点击保持模版！')
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
    }
  },
  computed: {},
  watch: {
    dialogGridVisible (val) {
      if (!val) {
        this.$refs.gridForm.resetFields()
      }
    },
  },
  methods: {
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
          console.log('error submit!!')
          return false
        }
      })
    },
    getChart (val) {
      console.log('val', val)
      this.chartList = val
    },
  },
}
</script>
<style lang="scss" scoped>
.gridFrom{
  /deep/.el-input__inner{
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
