<template>
  <div>
    <ul>
      <li>dfa'ga'g</li>
    </ul>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      path: [],
    }
  },
  computed: {
    ...mapState({
      tags: state => state.tags,
    }),
  },
  activated () {
    console.log('mapState', this.tags)
  },
  methods: {

  },
}
</script>
<style lang="sass" scoped>

</style>
