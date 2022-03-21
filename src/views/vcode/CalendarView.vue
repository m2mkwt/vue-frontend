<template>
  <div class="conts-area">
    <div class="conts-tit">
      <h2>캘린더 관리 {{ yymmddTitle }}</h2>
    </div>
    <div class="list-top-area">
    <div class="fl">
        <label for="s1">년도</label>
        <select id="s1" title="select"  @change="onChangeYear($event)">
          <option v-for="Y in callYears" v-bind:key="Y.year" v-bind:value="Y">{{Y}}</option>
        </select>
        <label for="s2">월</label>
        <select id="s2" title="select" @change="onChangeMonth($event)">
          <option value="1">01</option>
          <option value="2">02</option>
          <option value="3">03</option>
          <option value="4">04</option>
          <option value="5">05</option>
          <option value="6">06</option>
          <option value="7">07</option>
          <option value="8">08</option>
          <option value="9">09</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
        </select>
    </div>
      <div class="fr">
        <button type="button" title="캘린더 생성" v-on:click="newCalendar()" class="btn btn-blue">캘린더 생성</button>
        <newCalendarPop :visible.sync="visible">
        </newCalendarPop>
      </div>
    </div>
    <!-- <div class="color-sample">
      컬러 관련 sample
      <ul>
        <li><span class="c-box bg-red">공휴일/class: bg-red</span></li>
      </ul>
    </div> -->
    <v-calendar
      class="custom-calendar mt30"
      :masks="masks"
      :attributes="attributes"
      disable-page-swipe
      nav-visibility="hidden"
      ref="calendar"
    >
      <div
        slot="day-content"
        slot-scope="{ day, attributes }"
        class="flex"
        v-on:click="registerModal(day.day)"
      >
        <span>{{ day.day }}</span> <!-- Day -->
        <div class="flex-grow">
          <p v-for="attr in attributes" class="day-plan" :class="attr.customData.class" v-bind:key="attr.dkey">
            {{ attr.customData.title }}
          </p>
        </div>
      </div>
    </v-calendar>

  <!-- Modal start -->
  <MyModal v-if="modalVisible">
      <template slot="header">
        법정공휴일 등록
      </template>
      <!-- default 슬롯 콘텐츠 -->
      <div class="tbl-area">
        <table class="tbl tb-detail mt10">
          <caption>디테일 테이블</caption>
          <colgroup>
            <col style="width:30%">
            <col style="width:70%">
          </colgroup>
          <tbody>
            <tr>
              <th>공휴일 등록 일자</th>
              <td class="t-left">
                {{ modalData.date.substring(0,4) }}년  {{ modalData.date.substring(4,6) }}월  {{ modalData.date.substring(6,8) }}일
              </td>
            </tr>
            <tr>
              <th>공휴일 유형</th>
              <td class="t-left">
                <select id="s1" title="select" class="wp100" v-model="sHoliday" @change="onChangeHolidayOption($event)">
                  <option v-for="hDay in holidayList" v-bind:key="hDay.scode" v-bind:value="hDay.scode" > {{ hDay.scodeNm }} </option>
                </select>
              </td>
            </tr>
            <!-- <th colspan="2">해당일을 공휴일로 지정하시겠습니까?</th> -->
          </tbody>
        </table>
      </div>
      <!-- /default -->
      <!-- footer 슬롯 콘텐츠 -->
      <template slot="footer">
        <div class="t-center">
          <button type="button" class="btn btn-blue" v-on:click="saveNewHoliday(modalData, holydayOption)" >저장</button>
          <button type="button" class="btn btn-gray" v-on:click='modalVisible=false'>취소</button>
        </div>
      </template>
      <!-- /footer -->
    </MyModal>
    <!-- modal end -->
  </div>
</template>

<script>

import axios from 'axios'
import newCalendarPop from '../popup/newCalendar.vue' /* 캘린터 생성 팝업 컴포넌트 */
import MyModal from '../../components/MyModal.vue' /* 법정공휴일 등록 모달 컴포넌트 */
// import addHoliday from '../popup/addHoliday.vue' /* 법정공휴일 등록 팝업 컴포넌트 */

export default {
  name: 'CalendarView',
  data () {
    return {
      masks: {
        weekdays: 'WWW'
      },
      attributes: [],
      visible: false,
      yymmddTitle: '',
      callYears: [],
      selectedYear: '',
      selectedMonth: '',
      selectedDay: '',
      modalVisible: false,
      modalData: {
        dates: '',
        holydayOption: ''
      },
      holidayList: '',
      sHoliday: ''
    }
  },
  created () {
    this.getHolidayList()
  },
  components: {
    newCalendarPop: newCalendarPop, /* 캘린터 생성 팝업 컴포넌트 */
    MyModal /* 법정공휴일 등록 모달 컴포넌트 */
    // addHoliday: addHoliday /* 법정공휴일 등록 팝업 컴포넌트 */
  },
  mounted () {
    var calPreAndNextBtn = document.querySelectorAll('.vc-svg-icon')
    calPreAndNextBtn[0].addEventListener('click', this.selectPreCalendarElement, false)
    calPreAndNextBtn[1].addEventListener('click', this.selectNextCalendarElement, false)
    this.getCalYears()
    this.getCalendarYear()

    const month = new Date().getMonth()
    var sel = document.getElementById('s2')
    sel[month].selected = true
  },
  methods: {
    getHolidayList: function () { /* 공휴일 목록 조회 */
      axios.get('/api/calendar/selectHolidayList')
        .then(res => {
          this.holidayList = res.data.data
          this.sHoliday = this.holidayList[0].scode
          this.holydayOption = '1'
        })
        .catch((ex) => {
          console.log('ERROR!! => ' + ex)
        })
    },
    registerModal (day) { /* 특정 셀을 클릭시 이벤트 */
      /* 페이지의 년도와 개월수 값 - 콤보박스에서 가져오기 */
      this.selectedYear = document.getElementById('s1').value
      if (Number(document.getElementById('s2').value) < '10') {
        this.selectedMonth = '0' + document.getElementById('s2').value
      } else {
        this.selectedMonth = document.getElementById('s2').value
      }
      if (day < 10) { /* 클릭한 셀의 텍스트 가져오기 */
        this.selectedDay = '0' + day
      } else {
        this.selectedDay = day
      }
      this.modalData.date = document.getElementById('s1').value + this.selectedMonth + this.selectedDay
      this.modalVisible = true
    },
    onChangeHolidayOption ($event) { /* 모달 내부의 onChange */
      this.holydayOption = event.target.value
      console.log(event.target.value)
    },
    saveNewHoliday (modalData, holydayOption) { /* 모달창에서 법정공휴일 추가 저장 */
      axios
        .get('/api/calendar/registHoliday', {
          params: {
            strDate: this.modalData.date,
            holiday: this.holydayOption
          }
        })
        .then(res => {
          alert(res.data.message)
          this.modalVisible = false /* 저장 완료 후, 콘솔 종료 및 캘린더 리프레시 */
          location.reload()
          // this.$router.reload()
        })
        .catch((ex) => {
          console.log('Error!!!! : ' + ex)
        })
    },
    onChangeMonth (event) { // 캘린더 달 바뀔 시
      this.selectedYear = document.getElementById('s1').value
      this.selectdMonth = document.getElementById('s2').value
      var paramDate = this.selectdMonth + '월' + this.selectedYear
      const calendar = this.$refs.calendar
      calendar.move(new Date(this.selectedYear, this.selectdMonth - 1, 1))
      axios
        .get('/api/calendar/selectCalYearsList', {
          params: { strDate: paramDate },
          headers: { 'X-Api-Key': 'my-api-key' }
        })
        .then(res => {
          for (var i in res.data.data) {
            var obj = {
              dkey: '',
              customData: {
                title: '',
                class: ''
              },
              dates: null
            }
            this.attributes.push(obj)
            this.attributes[i].customData.title = res.data.data[i].title
            this.attributes[i].dates = new Date(res.data.data[i].years, res.data.data[i].months, res.data.data[i].dkey)
            this.attributes[i].dkey = res.data.data[i].dkey
            this.attributes[i].customData.class = res.data.data[i].tempClass
            obj = null
          }
        }).catch((error) => {
          console.log(error)
        })
    },
    onChangeYear (event) { // 캘린더 년도 바뀔 시
      this.selectedYear = event.target.value
      this.selectdMonth = document.getElementById('s2').value
      var paramDate = this.selectdMonth + '월' + this.selectedYear
      const calendar = this.$refs.calendar
      calendar.move(new Date(this.selectedYear, this.selectdMonth - 1, 1))
      axios
        .get('/api/calendar/selectCalYearsList', {
          params: { strDate: paramDate },
          headers: { 'X-Api-Key': 'my-api-key' }
        })
        .then(res => {
          for (var i in res.data.data) {
            var obj = {
              dkey: '',
              customData: {
                title: '',
                class: ''
              },
              dates: null
            }
            this.attributes.push(obj)
            this.attributes[i].customData.title = res.data.data[i].title
            this.attributes[i].dates = new Date(res.data.data[i].years, res.data.data[i].months, res.data.data[i].dkey)
            this.attributes[i].dkey = res.data.data[i].dkey
            this.attributes[i].customData.class = res.data.data[i].tempClass
            obj = null
          }
        }).catch((error) => {
          console.log(error)
        })
    },
    getCalendarYear: function () { // 캘린더 년도 정보 가져오기
      this.callYears.splice(0)
      axios
        .get('/api/vacation/selectCalendarYear')
        .then(res => {
          for (const i in res.data.data) {
            this.callYears.push(res.data.data[i].year)
          }
          this.callYears.sort()
          if (this.callYears[0] !== '') {
            this.selectedYear = this.callYears[0]
          }
        }).catch((error) => {
          console.log(error)
        })
    },
    /* 초기 조회 함수(현제 날짜) */
    getCalYears: function () {
      /* params set */
      const titleText = document.getElementsByClassName('vc-title')[0].innerHTML
      // const zz = titleText.split('월')
      // const tas = ''
      // const ddd = tas.concat(Number(zz[0]) - 1, '월', zz[1])
      this.yymmddTitle = titleText
      axios.get('/api/calendar/selectCalYearsList', {
        params: { strDate: this.yymmddTitle },
        headers: { 'X-Api-Key': 'my-api-key' }
      })
        .then(res => {
          const month = new Date().getMonth()
          const year = new Date().getFullYear()
          for (const v in res.data.data) {
            // console.log('month :: ' + month)
            // console.log('year :: ' + year)
            var obj = {
              dkey: '',
              customData: {
                title: '',
                class: ''
              },
              dates: null
            }
            this.attributes.push(obj)
            this.attributes[v].customData.title = res.data.data[v].title
            this.attributes[v].dates = new Date(year, month, res.data.data[v].dkey)
            this.attributes[v].key = res.data.data[v].dkey
            this.attributes[v].customData.class = res.data.data[v].tempClass
            obj = null
          }
        })
        .catch((ex) => {
          console.log('Error!!!! : ' + ex)
        })
    },
    selectPreCalendarElement: function () { // 유저의 근태정보 조회(이전 달)
      const titleText = document.getElementsByClassName('vc-title')[0].innerHTML
      const zz = titleText.split('월')
      const tas = ''
      if (zz[0] === '1') { /* 금년도 1월 -> 전년도 12월 파라메터 설정 */
        zz[0] = '13'
        zz[1] = Number(zz[1]) - 1
      }
      const ddd = tas.concat(Number(zz[0]) - 1, '월', zz[1])
      console.log('ddd :: ' + ddd)
      this.yymmddTitle = ddd
      axios
        .get('/api/calendar/selectCalYearsList', {
          params: { strDate: this.yymmddTitle },
          headers: { 'X-Api-Key': 'my-api-key' }
        })
        .then(res => {
          for (var i in res.data.data) {
            var obj = {
              dkey: '',
              customData: {
                title: '',
                class: ''
              },
              dates: null
            }
            this.attributes.push(obj)
            this.attributes[i].customData.title = res.data.data[i].title
            this.attributes[i].dates = new Date(res.data.data[i].years, res.data.data[i].months, res.data.data[i].dkey)
            this.attributes[i].dkey = res.data.data[i].dkey
            this.attributes[i].customData.class = res.data.data[i].tempClass
            obj = null
          }
        }).catch((error) => {
          console.log(error)
        })
    },
    selectNextCalendarElement: function () { // 유저의 근태정보 조회(이전 달)
      const titleText = document.getElementsByClassName('vc-title')[0].innerHTML
      const zz = titleText.split('월')
      const tas = ''
      if (zz[0] === '12') { /* 금년도 12월 -> 차년도 1월 파라메터 설정 */
        zz[0] = '0'
        zz[1] = Number(zz[1]) + 1
      }
      const ddd = tas.concat(Number(zz[0]) + 1, '월', zz[1])
      this.yymmddTitle = ddd
      axios
        .get('/api/calendar/selectCalYearsList', {
          params: { strDate: this.yymmddTitle },
          headers: { 'X-Api-Key': 'my-api-key' }
        })
        .then(res => {
          for (var i in res.data.data) {
            var obj = {
              dkey: '',
              customData: {
                title: '',
                class: ''
              },
              dates: null
            }
            this.attributes.push(obj)
            this.attributes[i].customData.title = res.data.data[i].title
            this.attributes[i].dates = new Date(res.data.data[i].years, res.data.data[i].months, res.data.data[i].dkey)
            this.attributes[i].dkey = res.data.data[i].dkey
            this.attributes[i].customData.class = res.data.data[i].tempClass
            obj = null
          }
        }).catch((error) => {
          console.log(error)
        })
    },
    /* 캘린더 생성 팝업 호출 */
    newCalendar: function () {
      this.visible = !this.visible
    }
  }
}
</script>

<style lang="postcss" scoped>
/deep/ .custom-calendar ::-webkit-scrollbar {width: 0px}
/deep/ .custom-calendar ::-webkit-scrollbar-track {display: none;}
/deep/ .custom-calendar {width:100%; border-radius:0}
/deep/ .custom-calendar.vc-container {}
/deep/ .custom-calendar.vc-container .vc-header {border:0; padding:10px; background-color:#e2e8f0}
/deep/ .custom-calendar.vc-container .vc-weeks {padding:0}
/deep/ .custom-calendar.vc-container .vc-weekday {padding:10px 0; border-top:1px solid #ddd; border-bottom:1px solid #ddd; background-color:#f7f7f7; color:#666}
/deep/ .custom-calendar.vc-container .vc-day {height:90px; padding:5px; border:1px solid #ddd; border-left:0; border-top:0;}
/deep/ .custom-calendar.vc-container .vc-day.weekday-1 {background-color: #eff8ff; color:#e53e3e}
/deep/ .custom-calendar.vc-container .vc-day.weekday-7 {background-color: #eff8ff; border-right:0; color:#e53e3e}
/deep/ .custom-calendar.vc-container .vc-day-dots {}
/deep/ .custom-calendar.vc-container .vc-bg-blue-100 {background-color:#2D3748; outline:none}
.vc-grid-cell {background-color:#4a5568 !important}
</style>
