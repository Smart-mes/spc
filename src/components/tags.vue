<template>
  <div>
    <ul>
      <li>dfa'ga'g</li>
    </ul>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  watch: {
    $route (newValue) {
      this.setTags(newValue)
    },
  },
  methods: {
    setTags (newValue) {
      console.log('newValue', newValue)
    },
  },
}
</script>
<style lang="sass" scoped>

</style>
