<template>
  <div>
    <head-title/>
    <div class="wrap">
      <div class="analyse-must">
        <div class="subtitle mt-0">
          <h4>
            必填内容
          </h4>
        </div>
        <div class="must-list">
          <span>分析类型：表格</span>
          <span>入参：进度条</span>
          <span>入参：echear图形</span>
          <span>姓名：张三</span>
          <span>工作：赛车手</span>
          <span>爱好：读书</span>
        </div>
      </div>
      <!-- 必填字段 -->
      <div class="analyse-custom">
        <div class="subtitle">
          <h4>
            自定义内容
          </h4>
        </div>
        <div class="custom-form">
          <el-form
            :inline="true"
            :model="customForm"
            class="demo-form-inline"
            label-width="80px"
          >
            <el-form-item label="审批人">
              <el-input v-model="customForm.user"/>
            </el-form-item>
            <el-form-item label="活动区域">
              <el-input v-model="customForm.region"/>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- /自定义字段 -->
      <!-- <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item> -->
      <div class="submit-btn">
        <el-button type="primary" @click="customSearch">查询</el-button>
        <el-button @click="resetForm('customForm')">清空</el-button>
      </div>

      <div id="main" style="height:400px;"/>
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
        user: '',
        region: '',
      },
    }
  },
  mounted () {
    this.echartsInt()
  },
  methods: {
    customSearch () {
      console.log('搜索')
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    echartsInt () {
      var myChart = this.$echarts.init(document.getElementById('main'))

      var option = {
        grid: {
          left: '2%',
          right: '2%',
          bottom: '5%',
          top: '5%',

        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
          type: 'value',
        },
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
        }],
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
  },
}
</script>

<style lang="scss" scoped>
.analyse-must{
  margin-bottom: 35px;
.must-list{
  padding: 0 20px;
  >span{
    display:inline-block;
    margin-right: 30px;
    color:$font-gray;
  }
}
}
.custom-form{
  // padding: 0 20px;
}
.custom-border{
     margin-bottom: 20px;
   padding: 20px;
    border: 1px solid $line-color;
 }
</style>
