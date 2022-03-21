<template>
  <div class="conts-area">
    <div class="conts-tit">
      <h2>년도별 월별 사용자별 휴가 사용 현황</h2>
    </div>
    <div class="list-top-area">
      <label for="s1">년도</label>
      <select id="s1" title="select" v-model="sel_searchYear" v-on:change="loadDayOffList()">
        <option v-for="v in searchYear" v-bind:key="v.year" v-bind:value="v.year">{{ v.year }}</option>
      </select>
      <label for="s2">월</label>
      <select id="s2" title="select" v-model="sel_searchMonth" v-on:change="loadDayOffList()">
        <option>01</option>
        <option>02</option>
        <option>03</option>
        <option>04</option>
        <option>05</option>
        <option>06</option>
        <option>07</option>
        <option>08</option>
        <option>09</option>
        <option>10</option>
        <option>11</option>
        <option>12</option>
      </select>
    </div>
    <div class="tbl-area">
      <!-- table detail start -->
      <table class="tbl tb-detail" id="tableId">
        <caption>디테일 테이블</caption>
        <colgroup>
          <col style="width:30%">
          <col style="width:70%">
        </colgroup>
        <thead>
          <tr>
            <th>성명</th>
            <th>휴가사용일수/발생일수</th>
          </tr>
        </thead>
        <tbody>
          <tr class="select" v-for="v in dayOffList" v-bind:key="v.id">
            <th v-on:click="userVacationByMonth(v.id, v.name)" style="cursor: pointer">{{ v.name }}</th>
            <td>{{ v.sumMinusDayoff }} / {{ v.acnt }}</td>
          </tr>
        </tbody>
      <userVacationByMonthPop :visible.sync="visible" :tempData.sync="tempData" :eachDayOffList.sync="eachDayOffList" :eachMonthOffList.sync="eachMonthOffList">
      </userVacationByMonthPop>
      </table>
      <!-- table detail end -->
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import userVacationByMonthPop from '../gostop/userVacationByMonthPop.vue'

export default {
  name: 'DeptPlando',
  data () {
    return {
      searchYear: [],
      sel_searchYear: moment(new Date()).format('yyyy'),
      sel_searchMonth: moment(new Date()).format('MM'),
      visible: false,
      tempData: {
        userId: '',
        userName: '',
        selYear: ''
      },
      dayOffList: {
        eachMember: {
          id: '',
          name: '',
          acnt: '',
          sumMinusDayoff: ''
        }
      },
      eachDayOffList: {
        acnt: '',
        sumMinusDayoff: ''
      },
      eachMonthOffList: [
        {
          months: '',
          dayOff: '',
          halfOff: ''
        }
      ]
    }
  },
  components: {
    userVacationByMonthPop: userVacationByMonthPop
  },
  methods: {
    /* 연도별, 사용자별 휴가 사용 현황 리스트 */
    loadDayOffList: function () {
      axios.post('/api/vacation/selectAllMembersDayOffList', {
        gdate: this.sel_searchYear,
        month: this.sel_searchMonth
      })
        .then((result) => {
          this.dayOffList = result.data.data
        })
    },
    /* 근태 접수된 연도 */
    loadAllYear: function () {
      axios.get('/api/vacation/selectGuntaeYear')
        .then((result) => {
          this.searchYear = result.data.data
          this.loadDayOffList()
        })
    },
    /* 각 사용자 이름 클릭 액션 ==> 월별,연도별 사용자 휴가사용 현황 팝업 open */
    userVacationByMonth: function (userId, userName) {
      this.tempData.userId = userId
      this.tempData.userName = userName
      this.tempData.selYear = this.sel_searchYear
      // 연도별 휴가사용일수 / 발생일수
      axios.post('/api/vacation/selectMembersDayOffList', {
        gdate: this.tempData.selYear,
        id: this.tempData.userId
      })
        .then((result) => {
          this.eachDayOffList.acnt = result.data.data.acnt
          this.eachDayOffList.sumMinusDayoff = result.data.data.sumMinusDayoff
        })
      // 월별 휴가사용 일자
      axios.post('/api/vacation/selectUsersOffDay', {
        gdate: this.tempData.selYear,
        id: this.tempData.userId
      })
        .then((result) => {
          this.eachMonthOffList = result.data.data
        })
      this.visible = !this.visible
    }
  },
  created () {
    /* 페이지 로드시 기본작동 메소드 */
    this.loadAllYear()
  }
}
</script>

<style>
</style>
