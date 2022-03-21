import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loginState: true,
    chiefYn: '',
    dept: '',
    headers: {
      bearer: null
    },
    snbLink: '',
    loginInfo: ''
  },
  actions: {
    LOGIN ({ commit }, { id, password }) {
      const form = new FormData()
      form.append('id', id)
      form.append('password', password)

      return axios.post('/login_processing', form)
        .then(res => {
          if (res.data.isSuccess) {
            this.chiefYn = res.data.chiefYn
            this.dept = res.data.dept
            this.loginInfo = res.data.details.deptNm + ' ' + res.data.details.name + ' ' + res.data.details.jikgubNm
            commit('LOGIN', res.headers)
            axios.defaults.headers.common.Authorization = 'Bearer ' + res.headers.bearer
          } else {
            alert(res.data.message)
          }
          return res.data
        })
    },
    LOGOUT ({ commit }) {
      commit('LOGOUT')
      return true
    },
    INFO ({ commit }) {
      this.loginState = true
      const { bearer } = sessionStorage
      if (!bearer) return
      this.loginState = false
      this.snbLink = sessionStorage.link
      this.chiefYn = sessionStorage.chiefYn
      this.dept = sessionStorage.dept
      this.loginInfo = sessionStorage.loginInfo
      axios.defaults.headers.common.Authorization = 'Bearer ' + bearer
    },
    SNBLINK ({ commit }, link) {
      this.snbLink = link
      sessionStorage.link = link
    }
  },
  mutations: {
    LOGIN (state, { bearer }) {
      this.loginState = false
      sessionStorage.bearer = bearer
      sessionStorage.link = 'mypage'
      sessionStorage.chiefYn = this.chiefYn
      sessionStorage.dept = this.dept
      sessionStorage.loginInfo = this.loginInfo
    },
    LOGOUT (state) {
      this.loginState = true
      sessionStorage.clear()
      axios.defaults.headers.common.Authorization = null
    }
  },
  modules: {
  }
})
