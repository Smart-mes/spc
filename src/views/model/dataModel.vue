<template>
  <div>
    <head-title/>
    <div class="wrap">
      <div class="btn-tool">
        <el-button type="primary">
          <i class="icontianjia iconfont"/>添加
        </el-button>
        <el-button type="primary">
          <i class="iconxiugai iconfont"/>修改
        </el-button>
        <el-button type="danger">
          <i class="iconicon7 iconfont"/>删除
        </el-button>
      </div>
      <el-table
        :data="tableData"
        highlight-current-row
        border
        stripe
        style="width: 100%"
        height="660"
        @current-change="tableCurrentRow"
        @selection-change="tableSelection"
      >
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="date" label="日期" width="180"/>
        <el-table-column prop="name" label="姓名" width="180"/>
        <el-table-column prop="address" label="地址"/>
        <el-table-column prop="address2" label="地址"/>
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
      <el-dialog :visible.sync="dialogVisible" width="990px">
        <div slot="title" class="dialog-header">{{ dialogTitle }}</div>
        <div class="dialog-step">
          <el-steps :active="1" finish-status="success">
            <el-step title="步骤1"/>
            <el-step title="步骤2"/>
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
          <el-form-item
            label="模型名称"
            prop="name"
            :rules="{
              required: true, message: '不能为空', trigger: 'blur'
            }"
          >
            <el-input v-model="modelForm.name"/>
          </el-form-item>
          <el-form-item
            label="入参类型"
            prop="entryType"
            :rules="{
              required: true, message: '不能为空', trigger: 'change'
            }"
          >
            <el-select v-model="modelForm.entryType">
              <el-option label="区域一" value="shanghai"/>
              <el-option label="区域二" value="beijing"/>
            </el-select>
          </el-form-item>
          <!--/选择类型 -->
          <div class="must">
            <h4 class="subtitle">
              <span class="icon-circle">●</span>必选的内容
            </h4>
            <div>
              <el-form-item
                v-for="(item, i) in modelForm.dataDase"
                :key="i"
                :label="item.key"
                :prop="'dataDase.' + i + '.value'"
                :rules="{
                  required: true, message: '不能为空', trigger: 'blur'
                }"
              >
                <el-input v-model="item.value"/>
              </el-form-item>
            </div>
            <!-- /数据库 -->
            <div v-show="false">
              <el-form-item
                label="数据url"
                prop="dataUrl"
                :rules="{
                  required: true, message: '不能为空', trigger: 'change'
                }"
              >
                <el-input v-model="modelForm.mustUrl"/>
              </el-form-item>
            </div>
            <!-- /数据url -->
            <div v-show="false">
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
            <!-- /上传exl -->
          </div>
          <!-- /必填内容 -->
          <div class="custom">
            <h4 class="subtitle">
              <span class="icon-circle">●</span>自定义内容
            </h4>
            <div class="custom-add">
              <el-button type="primary" @click="customAdd">
                <i class="icontianjia iconfont"/>添加
              </el-button>
            </div>
            <div v-for="(custom,i) in modelForm.custom" :key="i" class="custom-list">
              <div class="custom-list-add">
                <el-button type="primary" title="添加"><i class="iconfont icontianjia"/></el-button>
                <el-button type="danger" title="删除"><i class="iconfont iconicon7" @click="customDelete(i)"/></el-button>
              </div>
              <div v-for="(item,j) in custom" :key="j" class="custom-item">
                <el-form-item
                  label="名称"
                >
                  <el-input v-model="item.key"/>
                </el-form-item>
                <el-form-item
                  label="值"
                >
                  <el-input v-model="item.value"/>
                </el-form-item>
                <el-form-item
                  label="字符"
                >
                  <el-input v-model="item.option"/>
                </el-form-item>
                <el-form-item>
                  <a class="icon-delete">
                    <el-button type="danger" title="删除"><i class="iconfont iconicon7"/></el-button>
                  </a>
                </el-form-item>
              </div>
            </div>
          </div>
          <!-- /自定义 -->
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
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
      // 弹窗新增修改
      dialogVisible: true,
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
        custom: [
          [{ key: '', value: '', option: '' }],
        ],
        dataUrl: '',
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
      // 测试的数据
      a: '',
    }
  },
  methods: {
    // 表格
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
  },
}
</script>
<style lang="scss" scoped>
.btn-tool {
  padding: 0 0 10px 0;
}
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
  margin: 0 auto 20px auto;
  width: 700px;
}
.custom{
  .custom-add{
  margin-bottom: 15px;
}
.custom-list{
  margin-bottom: 15px;
  border: 1px solid $line-color;
        button{
    .iconfont{padding-right: 0;}
  }
}

.custom-list-add{
  margin-bottom: 15px;
  padding:10px 0;
  padding-left: 35px;
  background-color: #eee;
}
}

</style>
