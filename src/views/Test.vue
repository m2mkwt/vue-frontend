<template>
  <div>
    <h1>Test</h1>
    <MixinTestComp />
    <button v-on:click="axiosTest">axios 테스트</button>
  </div>
</template>

<script>
import axios from 'axios'
import MixinTestComp from '../components/MixinTestComp.vue'

export default {
  name: 'Test',
  components: {
    MixinTestComp
  },
  methods: {
    axiosTest: function () {
      axios.get('/selectExample01List')
        .then(res => {
          console.log(res.data)
        }).catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>

<style>
</style>
