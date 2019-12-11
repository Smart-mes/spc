<template>
  <div class="model">
    <head-title/>
    <div class="wrap">
      <div class="btn-tool">
        <btn-tool :buttons="btnList"/>
      </div>
      <!-- /工具条 -->
      <el-table
        :data="tableData"
        highlight-current-row
        border
        stripe
        style="width: 100%"
        @current-change="tableCurrentRow"
        @selection-change="tableSelection"
      >
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="date" label="ID" width="180"/>
        <el-table-column prop="name" label="名称" width="180"/>
        <el-table-column prop="address" label="入参类型"/>
        <el-table-column prop="address2" label="时间"/>
      </el-table>
      <div class="page">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[20, 30, 40, 50]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <!-- 添加修改弹窗 -->
      <el-dialog :visible.sync="dialogVisible" width="850px">
        <div slot="title" class="dialog-header">{{ dialogTitle }}</div>
        <div class="dialog-step">
          <el-steps :active="activeStep" finish-status="success">
            <el-step title="模型参数"/>
            <el-step title="自定义参数"/>
            <el-step title="完成"/>
          </el-steps>
        </div>
        <el-form
          ref="modelForm"
          label-width="85px"
          :inline="true"
          :model="modelForm"
          class="demo-form-inline"
        >
          <div v-show="activeStep===1" class="must">
            <el-form-item
              label="模型名称"
              prop="name"
              :rules="rule.must"
            >
              <el-input v-model="modelForm.name" size="mini"/>
            </el-form-item>
            <el-form-item
              label="入参类型"
              prop="entryType"
              :rules="rule.mustSelect"
            >
              <el-select v-model="modelForm.entryType" size="mini">
                <el-option label="数据库" value="dataDase"/>
                <el-option label="api" value="api"/>
                <el-option label="excel" value="excel"/>
              </el-select>
            </el-form-item>
            <!--/选择类型 -->
            <h4 class="subtitle">
              <span class="icon-circle">●</span>必选的内容
            </h4>
            <div class="must-warp">
              <div v-if="modelForm.entryType==='dataDase'">
                <el-form-item
                  v-for="(item, i) in modelForm.dataDase"
                  :key="i"
                  :label="item.key"
                  :prop="'dataDase.' + i + '.value'"
                  :rules="rule.must"
                >
                  <el-input v-model="item.value" size="mini"/>
                </el-form-item>
              </div>
              <!-- /数据库 -->
              <div v-else-if="modelForm.entryType==='api'">
                <el-form-item
                  label="数据url"
                  prop="apiUrl"
                  :rules="rule.must"
                >
                  <el-input v-model="modelForm.apiUrl" size="mini"/>
                </el-form-item>
              </div>
              <!-- /数据url -->
              <div v-else-if="modelForm.entryType==='excel'" class="pl-10">
                <el-upload
                  class="upload-demo"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :before-remove="beforeRemove"
                  multiple
                  :limit="3"
                  :on-exceed="handleExceed"
                  :file-list="fileList"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
              </div>
              <div v-else class="pl-10">请选择入参类型</div>
              <!-- /上传exl -->
            </div>
          </div>
          <!-- /必填内容 -->
          <div v-show="activeStep===2" class="custom">
            <h4 class="subtitle">
              <span class="icon-circle">●</span>自定义内容
            </h4>
            <div class="custom-add">
              <el-button type="primary" size="mini" @click="customAdd">
                <i class="icontianjia iconfont"/>添加
              </el-button>
            </div>
            <div v-for="(custom,i) in modelForm.custom" :key="i" class="custom-list">
              <div class="custom-list-add">
                <el-button type="primary" title="添加" size="mini" @click="customItemAdd(i)">
                  <i class="iconfont icontianjia"/>
                </el-button>
                <el-button type="danger" title="删除" size="mini" @click="customDelete(i)">
                  <i class="iconfont iconicon7"/>
                </el-button>
              </div>
              <div v-for="(item,j) in custom" :key="j" class="custom-item">
                <el-form-item
                  label="名称"
                  label-width="60px"
                  :prop="'custom.' +i+'.'+j+'.key'"
                  :rules="rule.customName"
                >
                  <el-input v-model="item.key" size="mini"/>
                </el-form-item>
                <el-form-item
                  label="值"
                  label-width="60px"
                >
                  <el-input v-model="item.value" size="mini"/>
                </el-form-item>
                <el-form-item
                  label="字符"
                  label-width="60px"
                >
                  <el-input v-model="item.option" size="mini"/>
                </el-form-item>
                <el-form-item>
                  <a class="icon-delete">
                    <el-button type="danger" title="删除" size="mini" @click="customItemDelete(i,j)">
                      <i class="iconfont iconicon7"/>
                    </el-button>
                  </a>
                </el-form-item>
              </div>
            </div>
            <div v-if="!modelForm.custom.length" class="pl-10">还没有添加自定义参数</div>
          </div>
          <!-- /自定义 -->
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogStep">{{ dialogBtnTxt }}</el-button>
          <el-button type="primary" @click="dialogSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import headTitle from '@/components/headTitle'
import btnTool from '@/components/btnTool'
export default {
  name: 'DataModel',
  components: {
    headTitle,
    btnTool,
  },
  data () {
    return {
      rule: {
        must: {
          required: true, message: '不能为空', trigger: 'blur',
        },
        mustSelect: {
          required: true, message: '不能为空', trigger: 'change',
        },
        customName: {
          validator: (rule, value, callback) => {
            if (value.length > 4) {
              return callback(new Error('长度不能大于四个字符'))
            }
            callback()
          }, trigger: 'blur',
        },
      },
      // tool
      btnList: [
        {
          type: 'primary',
          icon: 'icontianjia',
          text: '添加',
          disabled: () => {
            return false
          },
          click: () => {
            this.tableAdd()
          },
        },
        {
          type: 'primary',
          icon: 'iconxiugai',
          text: '修改',
          disabled: () => {
            return false
          },
          click: () => {
            this.tableModify()
          },
        },
        {
          type: 'danger',
          icon: 'iconicon7',
          text: '删除',
          disabled: () => {
            return false
          },
          click: () => {
            alert('删除')
          },
        },
      ],
      // table
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          address2: '上海市普陀区金沙江路 1518 弄',
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
          address2: '上海市普陀区金沙江路 1518 弄',
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          address2: '上海市普陀区金沙江路 1518 弄',
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
          address2: '上海市普陀区金沙江路 1518 弄',
        },
      ],
      currentRow: null,
      tableSelected: [],
      // 分页
      currentPage: 1,
      // 弹窗
      dialogVisible: false,
      dialogTitle: '模型添加',
      modelForm: {
        name: '',
        entryType: '',
        dataDase: [
          { key: '姓名', value: '' },
          { key: '性别', value: '' },
          { key: '职业', value: '' },
          { key: '收入', value: '' },
        ],
        custom: [],
        apiUrl: '',
      },
      // 上传exl数据
      fileList: [
        {
          name: 'food.jpeg',
          url:
            'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
        },
        {
          name: 'food2.jpeg',
          url:
            'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
        },
      ],
      // step
      activeStep: 1,
      dialogBtnTxt: '取消',
    }
  },
  watch: {
    activeStep (val) {
      this.dialogBtnTxt = val === 1 ? '取消' : '上一步'
    },
    dialogVisible (val) {
      if (!val) {
        this.$refs.modelForm.resetFields()
        this.activeStep = 1
        this.modelForm.custom = []
      }
    },
  },
  mounted () {
    this.$nextTick(() => {
      // var dom = document.querySelector('.model')
      // console.log('dom', dom)
    })
  },
  methods: {
    // 表格
    tableAdd () {
      this.dialogTitle = '模型添加'
      this.dialogVisible = true
    },
    tableModify () {
      this.dialogTitle = '模型修改'
      this.dialogVisible = true
    },
    tableCurrentRow (val) {
      this.currentRow = val
    },
    tableSelection (val) {
      this.tableSelected = val
    },
    // 分页
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    },
    // 上传exl
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    handleExceed (files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 自定义一维数组操作
    customAdd () {
      const customArr = [{ key: '', value: '', option: '' }]
      this.modelForm.custom.push(customArr)
    },
    customDelete (i) {
      this.modelForm.custom.splice(i, 1)
    },
    customItemAdd (i) {
      const customObj = { key: '', value: '', option: '' }
      this.modelForm.custom[i].push(customObj)
    },
    customItemDelete (i, j) {
      console.log(this.modelForm.custom[i][j])
      this.modelForm.custom[i].splice(j, 1)

      if (!this.modelForm.custom[i].length) {
        this.modelForm.custom.splice(i, 1)
      }
    },
    // 表单提交
    dialogSubmit () {
      this.$refs.modelForm.validate(valid => {
        if (valid) {
          if (this.activeStep === 2) {
            console.log('提交代码')
            return false
          }
          this.activeStep += 1
        } else {
          return false
        }
      })
    },
    dialogStep () {
      switch (this.activeStep) {
        case 1:
          this.dialogVisible = false
          break
        case 2:
          this.activeStep = 1
          break
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.page {
  margin-top: 10px;
}
// 弹窗修改
.dialog-header {
  line-height: 24px;
  font-size: 18px;
  color: #303133;
}
.dialog-step {
  margin: 0 auto 40px auto;
  width: 500px;
}
.must {
  .must-warp {
    min-height: 90px;
  }
  .must-excel {
    padding-left: 20px;
  }
}
.custom {
  .custom-add {
    margin-bottom: 15px;
  }
  .custom-list {
    padding: 15px 0;
    border-top: 1px dashed $line-color;

    button {
      .iconfont {
        padding-right: 0;
      }
    }
  }
  .custom-list-add {
    margin-bottom: 15px;
    // padding: 5px 0;
    padding-left: 20px;
    // background-color: #eee;
  }
}
.wrap{
  /deep/.el-table__body-wrapper{
      height: calc(100vh - 300px);
    overflow-y:auto;
  }
}

</style>
