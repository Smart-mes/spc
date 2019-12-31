<template>
  <div>
    <head-title/>
    <div class="wrap">
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        stripe
        border
      >
        <el-table-column prop="id" label="ID" width="60"/>
        <el-table-column prop="name" label="模板名称"/>
        <el-table-column prop="template" label="布局类型"/>
        <el-table-column label="创建时间">
          <template slot-scope="scope">{{ momentTime(scope.row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="320">
          <template slot-scope="scope">
            <div class="operate-btn">
              <el-button type="primary" @click="tableModify(scope.row)">
                <i class="iconfont iconxiugai"/>修改
              </el-button>
              <el-button type="danger" @click="tableDelete(scope.row.id)">
                <i class="iconfont iconicon7"/>删除
              </el-button>
              <el-button type="success" @click="tableStartUp(scope.row)">
                <i class="iconfont iconicon7"/>启动
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          :current-page="pageNum"
          :page-size="pageSize"
          :total="pageTotal"
          :page-sizes="[20, 30, 40, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSize"
          @current-change="handlePageNum"
        />
      </div>
    </div>
  </div>
</template>
<script>
import headTitle from '@/components/headTitle'
import moment from 'moment'
export default {
  name: 'TemplateList',
  components: {
    headTitle,
  },
  data () {
    return {
      // table
      tableLoading: false,
      tableData: [],
      // 分页
      pageNum: 1,
      pageSize: 20,
      pageTotal: 0,
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getTable()
    })
  },
  methods: {
    // 分页
    handlePageSize (val) {
      this.pageSize = val
      this.getTable()
    },
    handlePageNum (val) {
      this.pageNum = val
      this.getTable()
    },
    tableModify (row) {
      this.$router.push({
        path: '/template',
        query: {
          id: row.id,
        },
      })
      sessionStorage.setItem('analyseRow', JSON.stringify(row))
    },
    tableDelete (id) {
      this.$http
        .delete('/api/analysis/deleteAnalysis', {
          params: {
            id,
          },
        })
        .then(res => {
          this.$message({
            message: '删除成功',
            type: 'success',
          })
          this.getTable()
        }).catch(() => {
          this.$message.error('删除失败')
        })
    },
    tableStartUp () {},
    getTable () {
      this.tableLoading = true
      this.$http.get('/api/analysis/myAnalysis', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        },
      }).then(({ data }) => {
        this.tableLoading = false
        const { list, total } = data
        this.tableData = list
        this.pageTotal = total
      }).catch(() => {
        this.tableLoading = false
      })
    },
    // --公共的函数--
    momentTime (item) {
      return moment(item).format('YYYY-MM-DD HH:mm:ss')
    },
  },
}
</script>
<style lang="scss" scoped>
.wrap {
  /deep/.el-table__body-wrapper {
    height: calc(100vh - 250px);
    overflow-y: auto;
  }
}
.page {
  margin-top: 10px;
}
.operate-btn{
  text-align: center
}
</style>
