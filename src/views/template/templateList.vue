<template>
  <div>
    <head-title/>
    <div class="wrap">
      <el-table
        :data="tableData"
        stripe
        border
      >
        <el-table-column
          prop="id"
          label="ID"
          width="60"
        />
        <el-table-column
          prop="name"
          label="模板名称"
        />
        <el-table-column
          prop="address"
          label="布局类型"
        />
        <el-table-column
          prop="date"
          label="时间"
        />
        <el-table-column
          label="操作"
          width="280"
        >
          <template>
            <el-button type="primary"><i class="iconfont iconxiugai"/>修改</el-button>
            <el-button type="danger"><i class="iconfont iconicon7"/>删除</el-button>
            <el-button type="success"><i class="iconfont iconicon7"/>启动</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[20, 30, 40, 50]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400"
          @size-change="pageSize"
          @current-change="pageCurrent"
        />
      </div>
    </div>
  </div>
</template>
<script>
import headTitle from '@/components/headTitle'
export default {
  name: 'TemplateList',
  components: {
    headTitle,
  },
  data () {
    return {
      tableData: [{
        id: '1',
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      }, {
        id: '2',
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
      }, {
        id: '3',
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
      }, {
        id: '4',
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄',
      }],
      // 分页
      currentPage: 1,
    }
  },
  methods: {
    // 分页
    pageSize (val) {
      console.log(`每页 ${val} 条`)
    },
    pageCurrent (val) {
      console.log(`当前页: ${val}`)
    },
  },
}
</script>
<style lang="scss" scoped>
.wrap{
  /deep/.el-table__body-wrapper{
      height: calc(100vh - 250px);
    overflow-y:auto;
  }
}
.page {
  margin-top: 10px;
}
</style>
