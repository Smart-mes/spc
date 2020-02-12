<template>
  <div class="option-wrap">
    <ul :class="['box',getClass()]">
      <li v-for="(item,i) in boxNum" :key="i">
        <div class="box-item">
          <i v-show="optionList[i]?true:false" class="iconfont tick"/>
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
    <!-- /列表 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      label-width="90px"
      width="700px"
      class="demo-form-inline"
    >
      <el-form
        ref="formOption"
        :inline="true"
        :model="formOption"
        label-width="90px"
        class="formInline"
      >
        <el-form-item label="数据源" prop="dataSourceId" :rules="rule.mustSelect">
          <el-select v-model="formOption.dataSourceId">
            <el-option
              v-for="data in dataSource"
              :key="data.id"
              :label="data.name"
              :value="data.id"
            />
          </el-select>
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
    <!-- /弹窗 -->
  </div>
</template>
<script>
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
      optionList: [],
      // 请求数据
      dataSource: [],
      modelList: [],
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
      }
    },
    boxNum (val) {
      // 数据改变清空数据
      this.optionList = []
    },
    analysisList (val) {
      this.optionList = JSON.parse(JSON.stringify(val))
      this.$emit('optionData', this.optionList)
    },
  },
  mounted () {
    this.$nextTick(() => {
      // this.optionList = JSON.parse(JSON.stringify(this.analysisList))
      // this.$emit('optionData', this.optionList)
      this.getDataSource()
      this.getModelList()
    })
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
    async getDataSource () {
      const { data: { list }} = await this.$http.get('/api/dataSource/myDataSource')
      this.dataSource = list
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
  .tick {
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
</style>
