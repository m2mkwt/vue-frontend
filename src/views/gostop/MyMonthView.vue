<template>
  <div class="conts-area">
    <div class="conts-tit">
      <h2>월별 개인 휴가 사용 현황</h2>
    </div>
    <div class="list-top-area">
      <label for="s1">년도</label>
      <select id="s1" title="select" @change="onChangeYear($event)">
        <option v-for="Y in callYears" v-bind:key="Y.year" v-bind:value="Y">{{Y}}</option>
      </select>
      <label for="s2" class="ml10">성명</label>
      <select id="s2" title="select" @change="onChangeName($event)" v-model="selectedID">
        <option v-for="callName in callNames" v-bind:key="callName.id" v-bind:value="callName.id">{{ callName.name }}</option>
      </select>
    </div>
    <div class="clearfix mt30">
      <div class="d-ib">
        휴가사용일수/발생일수
        <span class="text-box">
          <span v-bind:key="callUseDate.months" v-bind:value="callUseDate.months">{{ callUseDate }} / {{ acnt }}</span>
        </span>
      </div>
      <div class="d-ib fr">
        <span class="s-box t-red">&block; 휴가</span><span class="s-box">&block; 반차</span>
      </div>
    </div>
    <div class="tbl-area">
      <!-- table detail start -->
      <table class="tbl tb-detail mt10">
        <caption>디테일 테이블</caption>
        <colgroup>
          <col style="width:20%">
          <col style="width:40%">
          <col style="width:40%">
        </colgroup>
        <thead>
          <tr>
            <th>해당 월</th>
            <th>휴가날짜</th>
            <th>반차날짜</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="K in monthsList" v-bind:key="K.months">
            <th>{{ K.months }}</th>
            <td class="t-left">
              <span class="t-red">{{ K.dayOff }}</span>
            </td>
            <td class="t-left">
              <span class="t-blue">{{ K.halfOff }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- table detail end -->

    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'LookupVacationList',
  data () {
    return {
      callYears: [],
      callNames: [],
      selectedID: [],
      callUseDate: '',
      monthsList: [],
      nameChange: [],
      changeId: '',
      selectedYear: '',
      acnt: ''
    }
  },
  created: function () {
    this.getLoginUser()/* 처음 로그인 시 Session ID 불러오기 */
  },
  methods: {
    onChangeName (event) {
      this.getCallYear()
    },
    onChangeYear (event) {
      this.selectedYear = event.target.value
      this.$nextTick(function () {
        this.getUseDate()
        this.getTable()
      })
    },
    afterPaging: function () {
      this.$nextTick(function () {
        this.getUseDate()
        this.getTable()
      })
    },
    getLoginUser: function () { /* Session id 불러오기 */
      axios
        .get('/api/vacation/loginUser', {
        })
        .then(res => {
          this.selectedID = res.data.data.id
          this.$nextTick(function () {
            this.getCallName()
            this.$nextTick(function () {
              this.getCallYear()
            })
          })
        })
    },
    getCallName: function () { /* 해당 이름 불러오기 */
      axios
        .get('/api/vacation/userList', { /* 디폴트값 = 세션에서 값 ID 가져오기 // 콤보박스 oncahge 이름 가져오기 */
        })
        .then(res => {
          this.callNames.push(...res.data.data)
        })
    },
    getCallYear: function () { /* 해당하는 년도 부르기 */
      this.callYears.splice(0)
      axios
        .get('/api/vacation/lookupVacationList', {
          params: { id: this.selectedID } /* : 디폴트값 = 세션에 담긴 id 정보 넣어주기 // 콤보박스 oncahge 이름 가져오기 */
        })
        .then(res => {
          for (const v in res.data.data) {
            this.callYears.push(res.data.data[v].year)
          }
          if (this.callYears[0] !== '') {
            this.selectedYear = this.callYears[0]
          }
          this.afterPaging()
        })
    },
    getUseDate: function () { /* 전체 사용한 휴가사용일수 가져오기 */
      axios.post('/api/vacation/selectMembersDayOffList', {
        gdate: this.selectedYear,
        id: this.selectedID
      })
        .then((result) => {
          this.acnt = result.data.data.acnt
          this.callUseDate = result.data.data.sumMinusDayoff
        })
    },
    getTable: function () { /* 사용한 휴가 날짜 정보 가져오기 */
      this.monthsList.splice(0)
      axios
        .get('/api/vacation/usedVacationTable', {
          params: { id: this.selectedID, gDate: this.selectedYear } /* : 디폴트값 = 세션에 담긴 id 정보 넣어주기 // 콤보박스 onchage 이름 가져오기 */
        })
        .then(res => {
          for (const i in res.data.data) {
            const obj = {
              months: '',
              dayOff: '',
              halfOff: ''
            }
            this.monthsList.push(obj)
            this.monthsList[i].months = res.data.data[i].months
            this.monthsList[i].dayOff = res.data.data[i].dayOff
            this.monthsList[i].halfOff = res.data.data[i].halfOff
          }
        })
    }
  }
}
</script>

<style>
</style>
