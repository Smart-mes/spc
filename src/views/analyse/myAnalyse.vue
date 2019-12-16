<template>
  <div>
    <head-title/>
    <div class="wrap">
      dasga gdffhdshfsh
    </div>
  </div>
</template>
<script>
import headTitle from '@/components/headTitle'
export default {
  components: {
    headTitle,
  },
  data () {
    return {}
  },
  activated () {
    // debugger
    this.echartsInt()
    // console.log(' this.$route', this.$route)
  },
  methods: {

  },
}
</script>

<style lang="scss" scoped>
.wrap{display:flex;}
.analyse-left{width: 150px; border-right:1px solid $line-color; }
.analyse-right{
  margin-left: 20px;
  flex: 1;
}
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
