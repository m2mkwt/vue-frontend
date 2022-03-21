<template>
  <div class="conts-area">
    <div class="conts-tit">
      <h2>법정공휴일 등록</h2>
    </div>
    <div class="tbl-area">

      <!-- table detail start -->
      <table class="tbl tb-detail">
        <caption>디테일 테이블</caption>
        <colgroup>
          <col style="width:40%">
          <col style="width:40%">
          <col style="width:10%">
        </colgroup>
        <thead>
          <tr>
            <th>일자</th>
            <th>공휴일</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>
              <!-- calendar start -->
              <div class="vcal-area">
                <v-date-picker
                  v-model='yyyymmdd'
                  :disabled-dates='{ weekdays: [1, 7] }'
                  :popover="{ placement: 'bottom', visibility: 'click' }">
                </v-date-picker>
              </div>
              <!-- //calendar end -->
            </th>
            <td class="t-left">
              <label for="s1" class="blind">공휴일</label>
              <select id="s1" title="select" class="wp100" v-model="sHoliday" >
                <option v-for="hDay in holidayList" v-bind:key="hDay.scode" v-bind:value="hDay.scode" > {{ hDay.scodeNm }} </option>
              </select>
            </td>
            <td>
              <button type="button" title="등록" v-on:click="regHoliday()" class="btn btn-blue">저장</button>
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
  name: 'HolidayRegi',
  data () {
    return {
      yyyymmdd: new Date(),
      holidayList: '',
      sHoliday: ''
    }
  },
  created () {
    this.getHolidayList()
  },
  methods: {
    /* 공휴일 목록 조회 */
    getHolidayList: function () {
      axios.get('/api/calendar/selectHolidayList')
        .then(res => {
          this.holidayList = res.data.data
          this.sHoliday = this.holidayList[0].scode
        })
        .catch(() => {
          // console.log('ERROR!! => ' + ex)
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
    },
    /* 법정공휴일 등록 */
    regHoliday: function () {
      /* params set */
      const years = this.yyyymmdd.getFullYear()
      const months = this.yyyymmdd.getMonth() + 1
      const days = this.yyyymmdd.getDate()
      const date = ''
      const sdate = date.concat(years, ',', months, ',', days)
      axios.get('/api/calendar/registHoliday', {
        params: {
          strDate: sdate,
          holiday: this.sHoliday
        }
      })
        .then(res => {
          // console.log(res.data)
          alert(res.data.message)
        })
        .catch(() => {
          // console.log('Error!!!! : ' + ex)
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
    }
  }
}
</script>

<style>
</style>
