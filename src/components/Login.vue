<template>
<div>

<!-- logo start -->
<div class="login-logo">
  <img src="../assets/images/logo.png" alt="login">
</div>
<!-- //logo end -->

<!-- login start -->
<div class="login-area">
  <form id="" name="" method="" @submit.prevent="onSubmit">
    <fieldset>
    <legend>login</legend>
      <ul class="login-form">
        <li>
          <label for="text1">USER ID</label>
          <input type="text" id="text1" name="" value="" placeholder="ID" v-model="id">
        </li>
        <li>
          <label for="pw1">PASSWORD</label>
          <input type="password" id="pw1" name="" value="" placeholder="PASSWORD" v-model="password">
        </li>
        <li>
          <button type="submit" title="login" class="btn btn-login">LOGIN</button>
        </li>
      </ul>
    </fieldset>
  </form>
</div>
<!-- //login end -->

</div>
</template>

<script>
import router from '../router/index.js'
import store from '../store/index.js'

export default {
  name: 'Login',
  data: () => ({
    id: '',
    password: '',
    loginState: true,
    loginToken: '',
    msg: '',
    chiefYn: ''
  }),
  methods: {
    onSubmit: function () {
      const id = this.id
      const password = this.password
      this.$store.dispatch('LOGIN', { id, password })
        .then((data) => {
          if (data.isSuccess) {
            this.chiefYn = data.chiefYn
            this.redirect()
          }
        })
        .catch(({ message }) => {
          this.msg = message
        })
    },
    redirect: function () {
      this.$emit('loginState', store.loginState)
      this.$emit('snbLink', 'mypage')
      router.push({ name: 'AppReceive' })
    }
  }
}
</script>

<style>
</style>
