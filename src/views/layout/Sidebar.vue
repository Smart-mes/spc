<template>
  <div class="sidebar">
    <el-menu
      :collapse="collapse"
      class="el-menu-vertical-demo"
      background-color="#444c63"
      text-color="#fff"
      active-text-color="#fff"
      unique-opened
      router
    >
      <template v-for="(item) in sidebarInfo">
        <el-submenu v-if="item.subNav" :key="item.index" :index="item.index">
          <template slot="title">
            <i :class="item.icon"/>
            <span>{{ item.title }}-1</span>
          </template>
          <el-menu-item-group>
            <!--<template slot="title">分组一</template>-->
            <el-menu-item v-for="(list) in item.subNav" :key="list.index" :index="list.index">{{ list.title }}</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item v-else :key="item.index" :index="item.index">
          <template>
            <i :class="item.icon"/>
            <span slot="title">{{ item.title }}</span>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>

export default {
  name: 'Sidebar',
  data () {
    return {
      collapse: false,
      indexPath: [], // 保存点击过的页面路由信息
      sidebarInfo: [
        {
          icon: 'el-icon-setting',
          index: 'chart',
          title: '我的账户',
        },
        {
          icon: 'el-icon-tickets',
          index: '1',
          title: '原始单据',
          subNav: [
            {
              index: '/orderReceivable',
              title: '应收单据',
            },
            {
              index: '/transactionFlow',
              title: '交易流水',
            },
            {
              index: '/systemStatement',
              title: '系统对账单',
            },
            {
              index: '/bankFlow',
              title: '银行流水',
            },
          ],
        },
        {
          icon: 'el-icon-date',
          index: '2',
          title: '财务对账',
          subNav: [
            {
              index: '/verifyReceivables',
              title: '收款对账',
            },
            {
              index: '/verifyAutomate',
              title: '自动对账',
            },
            {
              index: '/verifyBankStatement',
              title: '银行对账',
            },
          ],
        },
        {
          icon: 'el-icon-goods',
          title: '月结报表',
          index: '3',
          subNav: [
            {
              index: '/verifyReceivablesRecord',
              title: '收款记录',
            },
            {
              index: '/verifyBankStatementRecord',
              title: '银行记录',
            },
          ],
        },
        {
          icon: 'el-icon-star-off',
          title: '原始数据',
          index: '4',
          subNav: [
            {
              index: '/OrderSummary',
              title: '订单执行总表',
            },
            {
              index: '/ReceivablesBalance',
              title: '收款对账余额表',
            },
          ],
        },
        {
          icon: 'el-icon-more',
          title: '系统设置',
          index: '5',
          subNav: [
            {
              index: '/Structure',
              title: '平台管理',
            },
            {
              index: '/UpdatePWD',
              title: '修改密码',
            },
            {
              index: '13',
              title: '系统设置',
            },
          ],
        },
      ],
    }
  },
  methods: {

  },
}
</script>
<style lang="scss" scoped>
.sidebar{
    /deep/.el-menu{
        border: 0;
    }
    /deep/.el-submenu__icon-arrow {
     color:$white-color;
    }
    i{
        color:$white-color;
    }
}
</style>
