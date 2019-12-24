<template>
  <div class="model">
    <head-title/>
    <div class="wrap">
      <div class="btn-tool">
        <btn-tool :buttons="btnList"/>
      </div>
      <!-- /工具条 -->
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        border
        stripe
        style="width: 100%"
        @selection-change="tableSelection"
      >
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="id" label="ID" width="180"/>
        <el-table-column prop="name" label="名称" width="180"/>
        <el-table-column prop="inputCode" label="入参类型"/>
        <el-table-column label="时间">
          <template slot-scope="scope">{{ momentTime(scope.row.createTime) }}</template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          :current-page="pageNum"
          :page-sizes="[20, 30, 40, 50]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageTotal"
          @size-change="pageSizeFn"
          @current-change="pageNumFn"
        />
      </div>
      <!-- 添加修改弹窗 -->
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="820px">
        <div class="dialog-step">
          <el-steps :active="activeStep" finish-status="success">
            <el-step title="模型参数"/>
            <el-step title="自定义参数"/>
            <el-step title="完成"/>
          </el-steps>
        </div>
        <el-form
          ref="modelForm"
          label-width="90px"
          :inline="true"
          :model="modelForm"
          class="formInline"
        >
          <div v-show="activeStep===1" class="must">
            <el-form-item label="模型名称" prop="name" :rules="rule.must">
              <el-input v-model="modelForm.name" size="mini"/>
            </el-form-item>
            <el-form-item label="入参类型" prop="inputCode" :rules="rule.mustSelect">
              <el-select v-model="modelForm.inputCode" size="mini">
                <el-option label="数据库" value="Database"/>
                <el-option label="API" value="API"/>
                <el-option label="Excel" value="Excel"/>
              </el-select>
            </el-form-item>
            <!--/选择类型 -->
            <h4 class="subtitle">
              <span class="icon-circle">●</span>必选的内容
            </h4>
            <div class="must-warp">
              <div v-if="modelForm.inputCode==='Database'">
                <el-form-item
                  v-for="(item, i) in modelForm.mustList"
                  :key="i"
                  :label="item.lable"
                  :prop="'mustList.' + i + '.value'"
                  :rules="rule.must"
                >
                  <el-input v-model="item.value" size="mini"/>
                </el-form-item>
              </div>
              <!-- /数据库 -->
              <div v-else-if="modelForm.inputCode==='API'">
                <el-form-item label="数据url" prop="url" :rules="rule.must">
                  <el-input v-model="modelForm.url" size="mini"/>
                </el-form-item>
              </div>
              <!-- /数据url -->
              <div v-else-if="modelForm.inputCode==='Excel'" class="pl-20">
                <el-upload
                  class="upload-demo"
                  multiple
                  action="string"
                  :limit="1"
                  :file-list="fileList"
                  :before-upload="beforeUpload"
                  :on-exceed="handleExceed"
                  :http-request="httpRequest"
                  :on-remove="handleRemove"
                  accept=".xls, .xlsx"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传一个文件，仅限.xls, .xlsx格式</div>
                </el-upload>
              </div>
              <div v-else class="pl-20">请选择入参类型</div>
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
            <div v-for="(custom,i) in modelForm.customList" :key="i" class="custom-list">
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
                  label="属性名"
                  label-width="70px"
                  :prop="'customList.' +i+'.'+j+'.key'"
                  :rules="rule.customName"
                >
                  <el-input v-model="item.key" size="mini"/>
                </el-form-item>
                <el-form-item
                  label="值"
                  label-width="70px"
                  :prop="'customList.' +i+'.'+j+'.value'"
                  :rules="rule.must"
                >
                  <el-input v-model="item.value" size="mini"/>
                </el-form-item>
                <el-form-item
                  label="运算符"
                  label-width="70px"
                  :prop="'customList.' +i+'.'+j+'.option'"
                  :rules="rule.mustSelect"
                >
                  <!-- <el-input v-model="item.option" size="mini"/> -->
                  <el-select v-model="item.option" size="mini">
                    <el-option label="等于" value="="/>
                    <el-option label="大于" value=">"/>
                    <el-option label="小于" value="<"/>
                    <el-option label="大等于" value=">="/>
                    <el-option label="小等于" value="<="/>
                    <el-option label="不等于" value="!="/>
                  </el-select>
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
            <div v-if="!modelForm.customList.length" class="pl-20">还没有添加自定义参数</div>
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
import moment from 'moment'
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
          required: true,
          message: '不能为空',
          trigger: 'blur',
        },
        mustSelect: {
          required: true,
          message: '不能为空',
          trigger: 'change',
        },
        customName: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur',
          },
          {
            max: 4,
            message: '不能超过4个字符',
            trigger: 'blur',
          },
        ],
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
            return this.tableSelected.length !== 1
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
      tableLoading: false,
      tableData: [],
      // currentRow: null,
      tableSelected: [],
      // 分页
      pageNum: 1,
      pageSize: 20,
      pageTotal: 0,
      // 弹窗
      dialogVisible: false,
      dialogTitle: '添加模型',
      modelForm: {
        name: '',
        inputCode: '',
        mustList: [
          { lable: '驱动', key: 'driver', value: '' },
          { lable: 'url', key: 'url', value: '' },
          { lable: '账号', key: 'username', value: '' },
          { lable: '密码', key: 'password', value: '' },
          { lable: 'SQ', key: 'sql', value: '' },
        ],
        customList: [],
        url: '',
      },
      // 上传exl数据
      fileList: [],
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
        this.modelForm.inputCode = ''
        this.modelForm.customList = []
      }
    },
  },
  mounted () {
    this.$nextTick(() => {
      this.getTable()
    })
  },
  methods: {
    // 表格
    tableAdd () {
      this.dialogTitle = '添加模型'
      this.dialogVisible = true
    },
    tableModify () {
      this.dialogTitle = '修改模型'
      this.dialogVisible = true
      this.getModifyData()
    },
    // tableCurrentRow (val) {
    //   this.currentRow = val
    // },
    tableSelection (val) {
      this.tableSelected = val
    },
    // 分页
    pageSizeFn (val) {
      this.pageSize = val
      this.getTable()
    },
    pageNumFn (val) {
      this.pageNum = val
      this.getTable()
    },
    // 上传exl
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    beforeUpload (file) {
      const isXls =
        file.type === 'application/vnd.ms-excel'
          ? true
          : file.type ===
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      if (!isXls) {
        this.$message.error('上传的文件只能是xls以及xlsx格式!')
      }
      return isXls
    },
    handleExceed (files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    httpRequest (params) {
      console.log('params', params)
      const formdata = new FormData()
      formdata.append('file', params.file)
      // formdata.append('name', params.file.name)
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }

      this.$http
        .post('/api/analysis/upload', formdata, config)
        .then(({ data }) => {
          this.$message.success('上传成功！')
          const { filename, path } = data
          this.fileList = [{ name: filename, url: path }]
          console.log('this.fileList', this.fileList)
        })
        .catch(() => {
          this.$message.error('上传失败！')
        })
    },
    // Step
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
    // 自定义一维数组操作
    customAdd () {
      const customArr = [{ key: '', value: '', option: '' }]
      this.modelForm.customList.push(customArr)
    },
    customDelete (i) {
      this.modelForm.customList.splice(i, 1)
    },
    customItemAdd (i) {
      const customObj = { key: '', value: '', option: '' }
      this.modelForm.customList[i].push(customObj)
    },
    customItemDelete (i, j) {
      console.log(this.modelForm.customList[i][j])
      this.modelForm.customList[i].splice(j, 1)

      if (!this.modelForm.customList[i].length) {
        this.modelForm.customList.splice(i, 1)
      }
    },
    // 表单提交
    dialogSubmit () {
      this.$refs.modelForm.validate(valid => {
        if (valid) {
          if (this.activeStep === 2) {
            this.submitData()
            return false
          }
          this.activeStep += 1
        } else {
          return false
        }
      })
    },
    submitData () {
      const param = this.handleParam(this.modelForm)
      // 提交
      this.$http
        .post('/api/dataSource/addDataSource', param)
        .then(res => {
          this.$message({
            message: '添加成功！',
            type: 'success',
          })
          this.dialogVisible = false
        })
        .catch(() => {
          this.$message.error('错了哦，这是一条错误消息')
        })
    },

    // 修改获取数据
    getModifyData () {
      // const [{ name, inputCode, param, customParam }] = this.tableSelected
      // switch (inputCode) {
      //   case 'Database':
      //     break
      //   case 'API':
      //     break
      //   case 'API':
      //     break
      // }
      // console.log('selected', selected)
    },
    // 获取table数据
    getTable () {
      this.tableLoading = true
      this.$http
        .get('/api/dataSource/myDataSource', {
          params: {
            from: '',
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            to: '',
          },
        })
        .then(({ data }) => {
          this.tableLoading = false
          const { list, total } = data
          this.tableData = list
          this.pageTotal = total
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    // ---- 公共函数
    // 处理表单提交参数
    handleParam (formParam) {
      const { name, inputCode, mustList, customList, url } = formParam
      let param = {}
      // if (inputCode === "Database") {
      //   mustList.map(must => {
      //     const { key, value } = must;
      //     param[key] = value;
      //   });
      //   param = JSON.stringify(param);
      // } else if (inputCode === "API") {
      //   param = { url };
      //   param = JSON.stringify(param);
      // } else if (inputCode === "Excel") {
      //   if (!this.fileList.length) {
      //     this.$message.error("还没有上传文件不能提交！");
      //     return false;
      //   }
      //   const [file] = this.fileList;
      //   param = { path: file.url };
      //   param = JSON.stringify(param);
      // }
      if (inputCode === 'Excel' && !this.fileList.length) {
        this.$message.error('还没有上传文件不能提交！')
        return false
      }

      switch (inputCode) {
        case 'Database':
          mustList.map(must => {
            const { key, value } = must
            param[key] = value
          })
          param = JSON.stringify(param)
          break

        case 'API':
          param = { url }
          param = JSON.stringify(param)
          break

        case 'Excel':
          // const [file] = this.fileList
          param = { path: this.fileList[0].url }
          param = JSON.stringify(param)
          break
      }

      const customParam = JSON.stringify(customList)
      const paramObj = { name, inputCode, param, customParam }
      return paramObj
    },
    momentTime (item) {
      return moment(item).format('YYYY-MM-DD HH:mm:ss')
    },
  },
}
</script>
<style lang="scss" scoped>
.page {
  margin-top: 10px;
}

.dialog-step {
  margin: 0 auto 40px auto;
  width: 600px;
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
    padding-left: 20px;
    // background-color: #eee;
  }
}
.wrap {
  /deep/.el-table__body-wrapper {
    height: calc(100vh - 300px);
    overflow-y: auto;
  }
}
.formInline {
  /deep/.el-input__inner {
    width: 160px;
  }
}
</style>
