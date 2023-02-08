<template>
  <div class="main-page">
    <head-title/>
    <div class="wrap">
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        stripe
        border
        height=" calc(100vh - 190px)"
        highlight-current-row
        @current-change="tableHandleRowChange"
        @row-dblclick="tableDblclick"
      >
        <el-table-column prop="id" label="ID" width="60"/>
        <el-table-column prop="name" label="模板名称"/>
        <el-table-column label="布局类型">
          <template slot-scope="scope">
            <div class="templateType">
              <span class="fl">  {{ scope.row.template+'布局' }}</span>
              <choice-grid :grid-num="scope.row.template"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="创建用户"/>
        <!-- username -->
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{ $moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <div class="operate-btn">
              <!-- <el-button type="success" @click="tableStartUp(scope.row)">
                <i class="iconfont icon-startUp"/>启动
              </el-button> -->
              <el-button type="primary" @click="tableModify(scope.row)">
                <i class="iconfont icon-modify"/>修改
              </el-button>
              <el-button type="danger" @click="delConfirm(scope.row)">
                <i class="iconfont icon-delete"/>删除
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
          :page-sizes="[10,20, 30, 40]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSize"
          @current-change="handlePageNum"
        />
      </div>
    </div>
  </div>
</template>
<script>

import { mapMutations } from 'vuex'
import choiceGrid from '@/components/choiceGrid'
export default {
  name: 'TemplateList',
  components: {
    choiceGrid,
  },
  data () {
    return {
      // table
      tableLoading: false,
      tableRow: {},
      tableData: [],
      // 分页
      pageNum: 1,
      pageSize: 20,
      pageTotal: 0,
    }
  },
  activated () {
    this.getTable()
  },
  methods: {
    // ...mapMutations(['add_tags', 'set_state']),
    ...mapMutations(['set_state']),
    // 分页
    handlePageSize (val) {
      this.pageSize = val
      this.getTable()
    },
    handlePageNum (val) {
      this.pageNum = val
      this.getTable()
    },
    delConfirm (row) {
      this.tableRow = row
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.tableDelete()
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
    },
    tableModify (row) {
      this.$router.push({
        path: '/template',
        query: {
          id: row.id,
        },
      })
    },
    tableDelete () {
      const { id } = this.tableRow
      this.$http
        .delete('/analysis/deleteAnalysis', {
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
        })
        .then(() => {
          // 动态添加路由，清空tags
          this.$store.dispatch('queryMenus')
          const { routes } = this.$store.getters
          if (routes.length) {
            routes.push(
              {
                path: '*',
                redirect: '/404',
              }
            )
            this.$router.addRoutes(routes)
          }
          this.set_state({ tags: [], tagsNo: 0 })
        })
        // .catch((error) => {
        //   this.$message.error(error)
        // })
    },
    // tableStartUp (row) {
    //   const { name, id } = row
    //   const item = {
    //     componentPath: '/analyse/myAnalyse',
    //     id: id,
    //     path: `/analyse/myAnalyse?id=${id}`,
    //     title: name,
    //   }
    //   this.$router.push({ path: '/analyse/myAnalyse' })
    //   this.add_tags(item)
    // },
    tableDblclick () {
      this.tableModify(this.tableRow)
    },
    tableHandleRowChange (row) {
      // if (row) {
      this.tableRow = row
      // }
    },
    getTable () {
      this.tableLoading = true
      this.$http
        .get('/analysis/myAnalysis', {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
          },
        }).then(({ data }) => {
          this.tableLoading = false
          const { list, total } = data
          this.tableData = list
          this.pageTotal = total
          this.tableRow = {}
        }).catch(() => {
          this.tableLoading = false
        })
    },
    // --公共的函数--
    // momentTime (item) {
    //   return this.$moment(item).format('YYYY-MM-DD HH:mm:ss')
    // },
  },
}
</script>
<style lang="scss" scoped>
// .wrap {
//   /deep/.el-table__body-wrapper {
//     height: calc(100vh - 250px);
//     overflow-y: auto;
//   }
// }
.page {
  margin-top: 10px;
}
// 修改布局类型
.templateType {
  .fl{ margin-right: 10px;}
  /deep/ .box{
    padding: 0;
    width: 25px;
    height: 25px;
    >li{
      padding: 0;
    }

  }
}
</style>
