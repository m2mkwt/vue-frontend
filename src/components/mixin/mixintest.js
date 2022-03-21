export default {
  data: function () {
    return {
      mixinData: ''
    }
  },
  created: function () {
    this.mixinData = '"mixintest.js -> created: function ()"입니다.'
    // console.log('created: mixintest.js -> ' + this.mixinData)
  }
}
