<template>
  <ul :class="['box',getClass()]">
    <li v-for="(item,i) in OptionList" :key="i">
      <div class="box-item">
        <div class="operate">
          <el-button type="primary">
            <i class="iconfont icontianjia"/>添加配置
          </el-button>
          <el-button type="primary">
            <i class="iconfont iconxiugai"/>修改配置
          </el-button>
        </div>
      </div>
    </li>
  </ul>
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
    return {}
  },
  computed: {
    boxNum () {
      console.log('this.gridNum', this.gridNum)
      if (!this.gridNum) {
        return 0
      }
      return Number(this.gridNum)
    },
    // 处理获得数据
    OptionList () {
      const arrList = []
      const optionObj = {
        dataSource: '',
        model: '',
        must: [
          { key: '姓名', value: '' },
          { key: '性别', value: '' },
          { key: '职业', value: '' },
          { key: '收入', value: '' },
        ],
        wash: '',
        echartOption: '',
        custom: '',
      }
      for (let i = 0; i < this.boxNum; i++) {
        arrList.push(optionObj)
      }
      return arrList
    },
  },
  mounted () {},
  methods: {
    getClass () {
      switch (this.boxNum) {
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
  },
}
</script>
<style lang="scss" scoped>
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
    display: flex;
    flex-direction: column;
    flex: auto;
    align-items: center; /*由于flex-direction: column，因此align-items代表的是水平方向*/
    justify-content: center;
    border: 1px solid $grid-line-color;
  }
}

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
</style>
