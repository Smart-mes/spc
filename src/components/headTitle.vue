<template>
  <h2 class="headTitle">{{ title }}</h2>
</template>
<script>
export default {
  name: 'HeadTitle',
  props: {
    headTitle: {
      type: String,
      default: '',

    },
  },
  data () {
    return {}
  },
  computed: {
    title () {
      if (this.headTitle) {
        return `${this.headTitle}-模板`
      } else {
        return this.$route.meta.title
      }
    },
  },
}
</script>
<style lang="scss" scoped>
 .headTitle{
    padding:15px;
    font-size: 18px;
    color: $blue-color;
    // border-bottom: 1px solid $line-color;
  }

</style>
