<template>
  <div>
    <head-title/>
    <div class="wrap">
      <el-form ref="customForm" :inline="true" :model="customForm" label-width="80px">
        <div class="custom-type">
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
            prop="join"
            :rules="{
              required: true, message: '入参不能为空', trigger: 'change'
            }"
          >
            <el-select v-model="customForm.join" placeholder="请选择出参">
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
        </div>
        <div class="custom-border">
          <!-- /分析类型 -->
          <div class="custom-must">
            <div class="subtitle mt-0">
              <h4>必填内容</h4>
            </div>
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
          <div class="custom-content">
            <div class="subtitle">
              <h4>自定义内容</h4>
            </div>
            <div class="add_btn">
              <el-button type="primary" @click="addCustom">
                添加
                <i class="iconfont icontianjiajiahaowubiankuang"/>
              </el-button>
            </div>

            <div v-for="(custom,i) in customForm.custom" :key="i" class="row">
              <el-form-item label="字段名">
                <el-input v-model="custom.key"/>
              </el-form-item>
              <el-form-item label="属性名">
                <el-input v-model="custom.value"/>
              </el-form-item>
              <el-form-item>
                <a class="icon-delete" @click="customDelete(i)">
                  <i class="iconfont iconicon7" title="删除"/>
                </a>
              </el-form-item>
            </div>
          </div>
        </div>
        <!-- /自定义 -->
        <div class="submit-btn">
          <el-button type="primary" @click="submitForm('customForm')">提交</el-button>
          <el-button @click="resetForm('customForm')">重置</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import headTitle from '@/components/headTitle/headTitle'

export default {
  components: {
    headTitle,
  },
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
        custom: [{ key: '', value: '' }],
      },
    }
  },
  methods: {
    // 自定义添加表单
    addCustom () {
      const obj = { key: '', vulue: '' }
      this.customForm.custom.push(obj)
    },
    // 自定义删除
    customDelete (i) {
      this.customForm.custom.splice(i, 1)
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
.custom-type {
}
.custom-must {
}
.custom-content {
  .add_btn {
    padding: 0 20px 10px 20px;
    .iconfont {
      font-size: 12px;
      padding-left: 5px;
    }
  }
  .icon-delete {
    cursor: pointer;
  }
}

.custom-border {
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid $line-color;
}
</style>
