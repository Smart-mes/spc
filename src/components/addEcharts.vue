<template>
  <div class="option-wrap">
    <ul :class="['box',getClass()]">
      <li v-for="(item,i) in boxNum" :key="i">
        <div class="box-item">
          <i v-show="optionList[i]?true:false" class="iconfont icon-tick"/>
          <div class="operate">
            <el-button type="primary" :disabled="optionList[i]?true:false" @click="add(i)">
              <i class="iconfont icon-add"/>添加配置
            </el-button>
            <el-button type="primary" :disabled="!optionList[i]?true:false" @click="modify(i)">
              <i class="iconfont icon-modify"/>修改配置
            </el-button>
          </div>
        </div>
      </li>
    </ul>
    <div v-if="!boxNum">还没有添加布局</div>
    <!-- 添加配置弹窗 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="700px"
      class="demo-form-inline"
      @open="dialogOpen"
    >
      <el-form
        ref="formOption"
        :inline="true"
        :model="formOption"
        label-width="90px"
        class="formInline"
      >
        <el-form-item
          label="数据源"
          prop="dataSourceId"
          :rules="rule.mustSelect"
          class="dataAdd"
        >
          <el-input v-model="dataSource.name" :disabled="true">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="dataDialogVisible=true"
            />
          </el-input>
          <el-input v-show="false" v-model="formOption.dataSourceId" :disabled="true"/>
        </el-form-item>
        <el-form-item label="分析模型" prop="modelCode" :rules="rule.mustSelect">
          <el-select v-model="formOption.modelCode" @change="getModelOption()">
            <el-option
              v-for="model in modelList "
              :key="model.id"
              :label="model.name"
              :value="model.code"
            />
          </el-select>
        </el-form-item>
        <div class="must">
          <h4 class="subtitle">
            <span class="icon-circle">●</span>模型规则
          </h4>
          <el-form-item
            v-for="(option,i) in formOption.modelOption"
            :key="option.key"
            :label="option.label"
            :prop="'modelOption.' + i + '.value'"
            :rules="rule.must"
          >
            <el-input v-model="option.value"/>
          </el-form-item>
          <div v-if="!formOption.modelOption.length" class="p-20">请选择分析模型类型</div>
        </div>
        <el-form-item label="清洗条件" prop="cleanData">
          <el-input v-model="formOption.cleanData"/>
        </el-form-item>
        <el-form-item label="自定义" prop="customOption">
          <el-input v-model="formOption.customOption"/>
        </el-form-item>
        <el-form-item label="图表配置" prop="option" class="textarea">
          <el-input v-model="formOption.option" type="textarea" rows="12"/>
        </el-form-item>
        <!-- 第一步 -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加数据源的弹窗 -->
    <el-dialog
      :title="dataDialogTitle"
      :visible.sync="dataDialogVisible"
      width="50%"
      @open="dataDialogOpen"
    >
      <el-table
        v-loading="dataTableLoading"
        border
        style="width: 100%"
        height="500"
        :data="dataTable"
        highlight-current-row
        @current-change="dataHandleTableRow"
      >
        <el-table-column prop="id" label="ID" width="60"/>
        <el-table-column prop="name" label="名称"/>
        <el-table-column prop="inputCode" label="入参类型"/>
        <el-table-column label="创建时间">
          <template slot-scope="scope">{{ momentTime(scope.row.createTime) }}</template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          :current-page="dataPageNum"
          :page-size="dataPageSize"
          :total="dataPageTotal"
          :page-sizes="[10,20, 30, 40]"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="dataHandlePageNum"
          @size-change="dataHandlePageSize"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dataDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :disabled="!Object.keys(dataTableRow).length"
          @click="dataDialogSubmit"
        >
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  name: 'AddEcharts',
  props: {
    gridNum: {
      type: String,
      default: '',
    },
    analysisList: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data () {
    return {
      currentIndex: '',
      dialogTitle: '添加配置',
      dialogVisible: false,
      // form
      rule: {
        must: {
          required: true, message: '不能为空', trigger: 'blur',
        },
        mustSelect: {
          required: true, message: '不能为空', trigger: 'change',
        },
      },
      formOption: {
        dataSourceId: '',
        modelCode: '',
        modelOption: [
        ],
        cleanData: '',
        customOption: '',
        option: '',

      },
      dataSource: { name: '' },
      optionList: [],
      // 请求数据
      modelList: [],
      // 添加数据源
      dataDialogVisible: false,
      dataDialogTitle: '添加数据源',

      dataPageNum: 1,
      dataPageSize: 10,
      dataPageTotal: 0,

      dataTableLoading: false,
      dataTable: [],
      dataTableRow: {},
    }
  },
  computed: {
    boxNum () {
      return !this.gridNum ? 0 : Number(this.gridNum)
    },
  },
  watch: {
    dialogVisible (val) {
      if (!val) {
        this.$refs.formOption.resetFields()
        this.formOption.modelOption = []
        this.dataSource = { name: '' }
      }
    },
    boxNum (val) {
      // 数据改变清空数据
      this.optionList = []
    },
    analysisList (val) {
      this.optionList = JSON.parse(JSON.stringify(val))
      console.log('this.optionList', this.optionList)
      this.$emit('optionData', this.optionList)
    },
    dataDialogVisible (val) {
      if (!val) {
        this.dataPageNum = 1
        this.dataPageSize = 10
        this.dataPageTotal = 0
        this.dataTable = []
        this.dataTableRow = {}
      }
    },
  },
  methods: {
    // 获取不同的class
    getClass () {
      switch (this.boxNum) {
        case 0:
          return 'box-none'
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
    add (i) {
      this.currentIndex = i
      this.dialogTitle = `添加配置${i + 1}`
      this.dialogVisible = true
    },
    modify (i) {
      this.currentIndex = i
      this.dialogTitle = `修改配置${i + 1}`

      this.formOption = { ...this.optionList[i] }
      this.dataSource = { ...this.optionList[i].dataSource }

      this.dialogVisible = true
    },
    // 表单提交
    dialogSubmit () {
      // console.log(this.formOption)
      this.$refs.formOption.validate((valid) => {
        if (valid) {
          this.optionList[this.currentIndex] = JSON.parse(JSON.stringify(this.formOption))
          const filterList = this.optionList.filter(option => {
            return option
          })
          this.$emit('optionData', filterList)
          this.dialogVisible = false
        } else {
          return false
        }
      })
    },
    // 获取数据源
    getDataSource () {
      this.dataTableLoading = true
      this.$http
        .get('/api/dataSource/myDataSource', {
          params: {
            from: '',
            pageNum: this.dataPageNum,
            pageSize: this.dataPageSize,
            to: '',
          },
        })
        .then(({ data }) => {
          this.dataTableLoading = false
          const { list, total } = data
          this.dataTable = list
          this.dataPageTotal = total
        })
        .catch((error) => {
          this.dataTableLoading = false
          this.$message.error(error)
        })
    },
    async getModelList () {
      const { data } = await this.$http.get('/api/model/list')
      this.modelList = data
    },
    getModelOption () {
      this.$http
        .get('/api/model/getmodel', {
          params: {
            code: this.formOption.modelCode,
          },
        })
        .then(({ data }) => {
          const { param } = data
          this.formOption.modelOption = JSON.parse(param)
        })
    },
    dialogOpen () {
      this.getModelList()
    },
    // 添加数据源
    dataDialogOpen () {
      this.getDataSource()
    },
    momentTime (item) {
      return moment(item).format('YYYY-MM-DD HH:mm:ss')
    },
    dataHandleTableRow (row) {
      if (row) {
        this.dataTableRow = row
      }
    },
    dataHandlePageNum (val) {
      this.dataPageNum = val
      this.getDataSource()
    },
    dataHandlePageSize (val) {
      this.dataPageSize = val
      this.getDataSource()
    },
    dataDialogSubmit () {
      const { id, name } = this.dataTableRow
      this.formOption.dataSourceId = id
      this.dataSource.name = name
      this.dataDialogVisible = false
    },
  },
}

// 克隆对象
</script>
<style lang="scss" scoped>
.option-wrap {
  height: 100%;
}
.box {
  display: -webkit-flex;
  display: flex;
  -webkit-flex-wrap: wrap;
  flex-wrap: wrap;
  list-style: none;
  width: 100%;
  height: 100%;
  background-color: #eee;
  > li {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: 10px;
  }

  .box-item {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: auto;
    align-items: center;
    justify-content: center;
    border: 1px solid $grid-line-color;
  }
  .icon-tick {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 40px;
    color: $Grass-green-color;
  }
}
.box-none {
  display: none;
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
// step
.dialog-step {
  margin: 0 auto 40px auto;
  width: 500px;
}
.must {
  margin-bottom: 20px;
  border-bottom: 1px dashed $line-color;
}
.p-20{ padding: 0 0 20px 20px;}
// 搜索
.dataAdd{
  /deep/ .el-input__inner {
    width: 150px;
}
/deep/ .el-input-group__append{
  background: #fff;
}
}

</style>
