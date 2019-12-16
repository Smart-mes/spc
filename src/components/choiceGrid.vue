<template>
  <ul :class="['box',getClass()]">
    <li v-for="(item) in boxNum" :key="item">
      <div class="box-item"/>
    </li>
  </ul>
</template>
<script>
export default {
  name: 'ChoiceLayout',
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
      return !this.gridNum ? 0 : Number(this.gridNum)
    },
  },
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
  margin: 0;
  padding: 5px;
  list-style: none;
  width: 60px;
  height: 60px;
  background-color: #eee;
  > li {
    padding: 5px;
    text-align: center;
    box-sizing: border-box;
  }

  .box-item {
    width: 100%;
    height: 100%;
    border: 1px solid #aaa;
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
