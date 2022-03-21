<template>
  <div id="loginWrap" v-if="isShow">
    <Login v-on:loginState="toggleIsShow" v-on:snbLink="onSnbLink"></Login>
  </div>
  <div id="wrap" v-else>
    <Header v-on:loginState="toggleIsShow" v-on:snbLink="onSnbLink"></Header>
    <div id="container">
        <Snb v-bind:snbLink="snbLink"/>
        <div id="contents">
          <router-view/>
        </div>
    </div>
    <Footer/>
  </div>
</template>

<script>
import Login from './components/Login.vue'
import Header from './components/Header.vue'
import Snb from './components/Snb.vue'
import Footer from './components/Footer.vue'
import store from './store/index.js'

export default {
  name: 'App',
  components: {
    Login,
    Header,
    Snb,
    Footer
  },
  data () {
    return {
      isShow: true,
      snbLink: ''
    }
  },
  created: function () {
    this.isShow = store.loginState
    this.snbLink = store.snbLink
  },
  methods: {
    toggleIsShow: function (loginState) {
      this.isShow = loginState
    },
    onSnbLink: function (link) {
      this.snbLink = link
    }
  }
}
</script>

<style>
@import "./assets/css/common.css";
</style>
