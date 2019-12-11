<template>
  <ul :class="['box', getClass(boxNum)]">
    <li>
      <div class="box-item">a</div>
    </li>
  </ul>
</template>
<script>
export default {
  name: 'ChoiceLayout',
  props: {
    boxNum: {
      type: Number,
      default: 1,
    },
  },
  data () {
    return {}
  },
//   computed: {
//     className () {
//       switch (this.boxNum) {
//         case 1:
//           return 'box1'
//         case 2:
//           return 'box2'
//         case 3:
//           return 'box3'
//         case 4:
//           return 'box4'
//       }
//     },
//   },
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
  width: 80px;
  height: 80px;
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
