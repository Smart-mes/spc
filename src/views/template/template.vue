<template>
  <div>
    <head-title/>
    <div class="wrap">
      <div class="btn-tool">
        <btn-tool :buttons="btnList"/>
      </div>
      <!-- /btnTool -->
      <choiceLayout box-num="1"/>
    </div>
  </div>
</template>
<script>
import headTitle from '@/components/headTitle'
import btnTool from '@/components/btnTool'
import choiceLayout from '@/components/choiceLayout'
export default {
  name: 'Template',
  components: {
    headTitle,
    btnTool,
    choiceLayout,
  },
  data () {
    return {
      // tool
      btnList: [
        {
          type: 'primary',
          icon: 'icontianjia',
          text: '添加模板',
          disabled: () => {
            return false
          },
          click: () => {
            console.log('添加模板')
          },
        },
        {
          type: 'primary',
          icon: 'iconxiugai',
          text: '修改模板',
          disabled: () => {
            return true
          },
          click: () => {
            console.log('修改模板')
          },
        },
      ],
    }
  },
}
</script>
<style lang="scss" scoped>

</style>
