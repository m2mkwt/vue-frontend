<template>
  <div class="conts-area">
    <div class="conts-tit">
      <h2>관리자 패스워드 변경</h2>
    </div>
    <div class="tbl-area">
      <!-- table list start -->
      <table class="tbl">
        <caption>관리자 패스워드 변경</caption>
        <colgroup>
          <col style="width:30%">
          <col style="width:70%">
        </colgroup>
        <tbody>
          <tr>
            <th>아이디</th>
            <td class="t-left">
              <select id="s1" title="select" class="wp20" v-model="member" @change="onChange">
                <option value="">선택</option>
                <option v-for="(item, i) in list" v-bind:key="i" v-bind:value="item">{{ item.id }}</option>
              </select>
              <input type="text" id="name" v-model="member.name" readonly>
            </td>
          </tr>
          <tr>
            <th>패스워드</th>
            <td class="t-left">
              <input type="password" id="pwd1" v-model="pwd1">
            </td>
          </tr>
          <tr>
            <th>패스워드 확인</th>
            <td class="t-left">
              <input type="password" id="pwd2" v-model="pwd2">
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <br />
    <div class="t-center">
      <button type="button" class="btn btn-blue" @click="pwdSave">저장</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'PwdChg',
  data: () => ({
    list: [],
    member: '',
    pwd1: '',
    pwd2: ''
  }),
  methods: {
    memberList: function () {
      axios.get('/api/mypage/memberList')
        .then(res => {
          this.list = res.data.data
        }).catch(() => {
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
    },
    pwdSave: function () {
      if (this.member === '') {
        alert('아이디를 선택하세요.')
      } else if (this.pwd1 === '' || this.pwd2 === '') {
        alert('변경할 패스워드를 입력하세요.')
      } else {
        if (this.pwd1 !== this.pwd2) {
          alert('패스워드를 확인해 주세요.')
        } else {
          this.updatePassword()
        }
      }
    },
    updatePassword: function () {
      axios.post('/api/mypage/passwordChange', {
        id: this.member.id,
        pwd1: this.pwd1,
        pwd2: this.pwd2
      })
        .then(res => {
          if (res.data.success) {
            alert('패스워드가 변경되었습니다.')
            this.pwd1 = ''
            this.pwd2 = ''
          }
        }).catch(() => {
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
    },
    onChange: function () {
      this.pwd1 = ''
      this.pwd2 = ''
    }
  },
  created: function () {
    this.memberList()
  }
}
</script>

<style>
</style>
