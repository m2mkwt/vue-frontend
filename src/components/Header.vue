<template>
  <div id="header">
    <h1 class="logo"><router-link to="/mypage/receive"><img src="../assets/images/logo.png" alt="logo"></router-link></h1>
    <div class="gnb">
      <ul>
        <li @click="snbLink('mypage')"><router-link to="/mypage/receive">마이페이지</router-link></li>
        <li @click="snbLink('plando')"><router-link to="/plando/dept">업무실적</router-link></li>
        <li @click="snbLink('gostop')"><router-link to="/gostop/view">근태관리</router-link></li>
        <li @click="snbLink('vcode')" v-if="$store.dept == '1'"><router-link to="/vcode/common">관리자설정</router-link></li>
      </ul>
    </div>
    <div class="login-info">{{ $store.loginInfo }}</div>
    <div class="btn-logout">
      <button type="button" class="btn btn-blue" @click="logout">로그아웃</button>
    </div>
  </div>
</template>

<script>
import router from '../router/index.js'
import store from '../store/index.js'

export default {
  name: 'Header',
  methods: {
    logout: function () {
      this.$store.dispatch('LOGOUT')
        .then((data) => {
          if (data) {
            this.$emit('loginState', store.loginState)
            router.push({ name: 'Login' })
          }
        })
        .catch(({ message }) => {
          this.msg = message
        })
    },
    snbLink: function (link) {
      // console.log('store :: ' + JSON.stringify($store.dept))
      this.$store.dispatch('SNBLINK', link)
      this.$emit('snbLink', link)
    }
  }
}
</script>

<style>
.login-info {position:absolute; top:20px; right:130px; font-size:14px; font-weight:bold; color:#fff}
.btn-logout {position:absolute; top:14px; right:30px}
.btn-logout .btn {background-color:#359cda !important}
</style>
