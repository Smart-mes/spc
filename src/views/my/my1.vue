<template>
  <div>
    <h2 class="headTitle">设置账号</h2>
    <div class="p-20">
      <el-form ref="customForm" :inline="true" :model="customForm" label-width="80px">
        <div class="type">
          <el-form-item
            label="分析类型"
            prop="type"
            :rules="{
              required: true, message: '分析类型不能为空', trigger: 'change'
            }"
          >
            <el-select v-model="customForm.type" placeholder="请选择分析类型">
              <el-option label="区域一" value="shanghai"/>
              <el-option label="区域二" value="beijing"/>
            </el-select>
          </el-form-item>

          <el-form-item
            label="入参"
            prop="type"
            :rules="{
              required: true, message: '入参不能为空', trigger: 'change'
            }"
          >
            <el-select v-model="customForm.type" placeholder="请选择出参">
              <el-option label="区域一" value="shanghai"/>
              <el-option label="区域二" value="beijing"/>
            </el-select>
          </el-form-item>

          <el-form-item
            label="出参"
            prop="join"
            :rules="{
              required: true, message: '出参不能为空', trigger: 'change'
            }"
          >
            <el-select v-model="customForm.join" placeholder="请选择入参">
              <el-option label="区域一" value="shanghai"/>
              <el-option label="区域二" value="beijing"/>
            </el-select>
          </el-form-item>
        <!-- =========================== -->
        </div>
        <!-- /分析类型 -->
        <div class="must">
          <h4 class="subtitle">
            <span>·</span>必填内容
          </h4>
          <el-form-item
            v-for="(item, i) in customForm.mustFill"
            :key="i"
            :label="item.key"
            :prop="'mustFill.' + i + '.value'"
            :rules="{
              required: true, message: '不能为空', trigger: 'blur'
            }"
          >
            <el-input v-model="item.value"/>
          </el-form-item>
        </div>
        <!-- /必填 -->
        <div class="custom">
          <h4 class="subtitle">
            <span>·</span>自定义内容
          </h4>
          <div class="add_btn">
            <el-button type="primary" @click="addCustom">添加<i class="iconfont icontianjiajiahaowubiankuang"/></el-button>
          </div>

          <div v-for="(custom,i) in customForm.custom" :key="i" class="row">
            <el-form-item label="字段名">
              <el-input v-model="custom.key"/>
            </el-form-item>
            <el-form-item label="属性名">
              <el-input v-model="custom.value"/>
            </el-form-item>
            <el-form-item>
              <el-button>删除</el-button>
            </el-form-item>
          </div>
        </div>
        <!-- /自定义 -->
        <div class="btn">
          <el-button type="primary" size="medium" @click="submitForm('customForm')">提交</el-button>
          <el-button size="medium" @click="resetForm('customForm')">重置</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      customForm: {
        type: '',
        join: '',
        leave: '',
        mustFill: [
          { key: '姓名', value: '' },
          { key: '性别', value: '' },
          { key: '职业', value: '' },
          { key: '收入', value: '' },
        ],
        custom: [
          { key: '', value: '' },
        ],
      },

    }
  },
  methods: {
    // 自定义添加表单
    addCustom () {
      const obj = { key: '', vulue: '' }
      this.customForm.custom.push(obj)
      // console.log('customForm.custom', this.customForm)
    },
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.customForm.custom = []
    },
  },
}
</script>
<style lang="scss" scoped>
.headTitle{
  padding: 0 20px;
  height: 45px;
  line-height: 45px;
  font-size: 16px;
  color: $blue-color;
  border-bottom: 1px solid $line-color;
}

.type {
  border-bottom: 1px solid $line-color;
}
.must{
  max-width: 1080px;
}
.custom{
  padding-bottom: 20px;
  .add_btn{
    padding-bottom: 10px;
    .iconfont{font-size: 12px; padding-left:5px}
  }
  }
 .btn-warp{
   text-align:center;
 }
</style>
