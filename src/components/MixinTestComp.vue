<template>
  <div>
    <p>{{ testData }}</p>
  </div>
</template>

<script>
import MixinsTest from './mixin/mixintest.js'

export default {
  mixins: [MixinsTest],
  name: 'MixinTestComp',
  data: function () {
    return {
      testData: '"MixinTestComp.vue"입니다.'
    }
  },
  created: function () {
    this.testData = this.mixinData
  }
}
</script>

<style>
</style>
