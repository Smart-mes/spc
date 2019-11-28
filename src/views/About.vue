<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  mounted () {
    this.$http.get('http://rap2api.taobao.org/app/mock/164351/getList')
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        console.log(error)
      })
  },
}
</script>
