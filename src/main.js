import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VCalendar from 'v-calendar'
import moment from 'moment'
// import stylus from 'stylus-loader'

axios.defaults.baseURL = ''
axios.defaults.headers.common.Accept = 'application/json'
axios.interceptors.response.use(
  response => response,
  (error) => {
    if (error.response.status === 401) {
      const { loginInfo } = sessionStorage
      if (loginInfo) {
        alert(error.response.data.message)
      }
      sessionStorage.clear()
      router.push({ name: 'Login' })
      location.reload()
    }
    return Promise.reject(error)
  }
)

Vue.config.productionTip = false

Vue.use(VCalendar)

Vue.use(moment)

// Vue.use(stylus)

new Vue({
  router,
  store,
  beforeCreate () {
    this.$store.dispatch('INFO')
  },
  render: h => h(App)
}).$mount('#app')
