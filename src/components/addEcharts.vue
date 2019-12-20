<template>
  <div class="option-wrap">
    <ul :class="['box',getClass()]">
      <li v-for="(item,i) in boxNum" :key="i">
        <div class="box-item">
          <i v-show="optionList[i]?true:false" class="iconfont iconsanjiaodagou"/>
          <div class="operate">
            <el-button type="primary" :disabled="optionList[i]? true:false" @click="add(i)">
              <i class="iconfont icontianjia"/>添加配置
            </el-button>
            <el-button type="primary" :disabled="!optionList[i]?true:false" @click="modify(i)">
              <i class="iconfont iconxiugai"/>修改配置
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
        <el-form-item
          label="数据源"
          prop="dataSource"
          :rules="rule.mustSelect"
        >
          <el-select v-model="formOption.dataSource">
            <el-option label="区域一" value="shanghai"/>
            <el-option label="区域二" value="beijing"/>
          </el-select>
        </el-form-item>
        <el-form-item
          label="分析模型"
          prop="model"
          :rules="rule.mustSelect"
        >
          <el-select v-model="formOption.model">
            <el-option label="区域一" value="shanghai"/>
            <el-option label="区域二" value="beijing"/>
          </el-select>
        </el-form-item>
        <div class="must">
          <h4 class="subtitle">
            <span class="icon-circle">●</span>必选的内容
          </h4>
          <el-form-item
            v-for="(option,i) in formOption.mustList"
            :key="option.key"
            :label="option.label"
            :prop="'mustList.' + i + '.value'"
            :rules="rule.must"
          >
            <el-input v-model="option.value"/>
          </el-form-item>
          <div v-if="!formOption.mustList.length" class="pl-20">请选择分析模型类型</div>
        </div>
        <el-form-item label="清洗条件" prop="wash">
          <el-input v-model="formOption.wash"/>
        </el-form-item>
        <el-form-item label="自定义" prop="custom">
          <el-input v-model="formOption.custom"/>
        </el-form-item>
        <el-form-item
          label="图表配置"
          prop="echartOption"
          :rules="rule.must"
          class="textarea"
        >
          <el-input v-model="formOption.echartOption" type="textarea" rows="5"/>
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
        dataSource: '',
        model: '',
        mustList: [
          { label: '姓名', value: '' },
          { label: '性别', value: '' },
          { label: '职业', value: '' },
          { label: '收入', value: '' },
        ],
        wash: '',
        custom: '',
        echartOption: '',

      },
      optionList: [],
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
      }
    },
    boxNum () {
      this.optionList = []
    },
  },
  mounted () {
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
      console.log(this.formOption)
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
  .iconsanjiaodagou{
    position: absolute;
    top:0;
    left: 0;
    font-size: 40px;
    color:$Grass-green-color;
  }
}
.box-none{display: none}
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
</style>
