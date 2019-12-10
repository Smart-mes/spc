<template>
  <div>
    <el-button
      v-for="(btn,i) in buttons"
      :key="i"
      :type="btn.type"
      :loading="btn.loading"
      :disabled="isDisabled(btn)"
      @click="typeof btn.click === 'function' && btn.click()"
    >
      <i v-if="btn.icon" :class="[btn.icon,'iconfont']"/>{{ btn.text }}
    </el-button>
  </div>
</template>
<script>
export default {
  name: 'BtnTool',
  props: {
    buttons: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    isDisabled (btn) {
      if (btn.loading) {
        return true
      } else {
        return typeof btn.disabled === 'function' ? btn.disabled() : btn.disabled
      }
    },
  },
}
</script>
<style lang="scss" scoped>
</style>
