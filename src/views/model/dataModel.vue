<template>
  <div>
    <head-title/>
    <div class="wrap">
      <el-form ref="customForm" :inline="true" :model="customForm" label-width="90px">
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
            prop="leave"
            :rules="{
              required: true, message: '出参不能为空', trigger: 'change'
            }"
          >
            <el-select v-model="customForm.leave" placeholder="请选择入参">
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
            <div>
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
            <!-- /数据库 -->
            <div>
              <el-form-item
                label="数据url"
                prop="mustUrl"
                :rules="{
                  required: true, message: '不能为空', trigger: 'change'
                }"
              >
                <el-input v-model="customForm.mustUrl"/>
              </el-form-item>
            </div>
          </div>
          <!-- /必填url -->
          <div>
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
          <!-- 上传exl -->
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
        mustUrl: '',
        custom: [{ key: '', value: '' }],
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
    // 上传
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
    // 提交
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
  // border: 1px solid $line-color;
  border-top: 1px dashed $line-color;
  border-bottom: 1px dashed $line-color;
}
</style>
