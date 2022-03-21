<template>
  <div class="conts-area">
    <div class="conts-tit">
      <h2>월별 근태 조회</h2>
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
    </div>
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
      >
        <span>{{ day.day }}</span>
        <div class="flex-grow">
          <p v-for="attr in attributes" :class="attr.customData.class" v-bind:key="attr.dkey">
            {{ attr.customData.title }}
          </p>
        </div>
      </div>
    </v-calendar>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'DeptPlando',
  data () {
    return {
      masks: {
        weekdays: 'WW'
      },
      attributes: [],
      yymmddTitle: '',
      callYears: [],
      selectedYear: '',
      selectedMonth: ''
    }
  },
  mounted: function () {
    var calPreAndNextBtn = document.querySelectorAll('.vc-svg-icon')
    calPreAndNextBtn[0].addEventListener('click', this.selectPreCalendarElement, false)
    calPreAndNextBtn[1].addEventListener('click', this.selectNextCalendarElement, false)
    this.selectCalendarElement()
    this.getCalendarYear()

    // 셀렉트 박스 초기값 현재 달로 설정
    const month = new Date().getMonth()
    var sel = document.getElementById('s2')
    sel[month].selected = true
  },
  methods: {
    onChangeMonth (event) { // 캘린더 달 바뀔 시
      this.selectedYear = document.getElementById('s1').value
      this.selectdMonth = document.getElementById('s2').value
      var paramDate = this.selectdMonth + '월' + this.selectedYear
      const calendar = this.$refs.calendar
      calendar.move(new Date(this.selectedYear, this.selectdMonth - 1, 1))
      axios
        .get('/api/vacation/selectCalendarElement', {
          params: { strDate: paramDate },
          headers: { 'X-Api-Key': 'my-api-key' }
        })
        .then(res => {
          for (const i in res.data.data) {
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
            this.attributes[i].dates = new Date(res.data.data[i].year, res.data.data[i].month, res.data.data[i].dkey)
            this.attributes[i].dkey = res.data.data[i].dkey
            this.attributes[i].customData.class = res.data.data[i].tempClass
            obj = null
          }
        })
    },
    onChangeYear (event) { // 캘린더 년도 바뀔 시
      this.selectedYear = event.target.value
      this.selectdMonth = document.getElementById('s2').value
      var paramDate = this.selectdMonth + '월' + this.selectedYear
      const calendar = this.$refs.calendar
      calendar.move(new Date(this.selectedYear, this.selectdMonth - 1, 1))
      axios
        .get('/api/vacation/selectCalendarElement', {
          params: { strDate: paramDate },
          headers: { 'X-Api-Key': 'my-api-key' }
        })
        .then(res => {
          for (const i in res.data.data) {
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
            this.attributes[i].dates = new Date(res.data.data[i].year, res.data.data[i].month, res.data.data[i].dkey)
            this.attributes[i].dkey = res.data.data[i].dkey
            this.attributes[i].customData.class = res.data.data[i].tempClass
            obj = null
          }
        })
    },
    getCalendarYear: function () { // 캘린더 년도 정보 가져오기
      axios
        .get('/api/vacation/selectCalendarYear')
        .then(res => {
          const year = new Date().getFullYear()
          for (const i in res.data.data) {
            this.callYears.push(res.data.data[i].year)
            if (String(year) === String(this.callYears[i])) {
              this.callYears.splice(i, 1)
            }
          }
          this.callYears.sort()
          this.callYears.unshift(String(year))
          if (this.callYears[0] !== '') {
            this.selectedYear = this.callYears[0]
          }
        })
    },
    selectCalendarElement: function () { // 유저의 근태정보 조회(최초 load시)
      const titleText = document.getElementsByClassName('vc-title')[0].innerHTML
      this.yymmddTitle = titleText
      axios
        .get('/api/vacation/selectCalendarElement', {
          params: { strDate: this.yymmddTitle },
          headers: { 'X-Api-Key': 'my-api-key' }
        })
        .then(res => {
          for (const i in res.data.data) {
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
            this.attributes[i].dates = new Date(res.data.data[i].year, res.data.data[i].month, res.data.data[i].dkey)
            this.attributes[i].dkey = res.data.data[i].dkey
            this.attributes[i].customData.class = res.data.data[i].tempClass
            obj = null
          }
        })
    },
    selectPreCalendarElement: function () { // 유저의 근태정보 조회(이전 달)
      const titleText = document.getElementsByClassName('vc-title')[0].innerHTML
      var splitTitleText = titleText.split('월')
      var tempTitle = ''
      var selMonth = document.getElementById('s2')
      if (splitTitleText[0] === '1') { // 금년도 1월 -> 전년도 12월 파라미터 설정
        var finalTitle = tempTitle.concat(12, '월', Number(splitTitleText[1]) - 1)
        if (this.callYears.includes(String(Number(splitTitleText[1]) - 1)) === false) { // 캘린더 데이터에 존재하지 않는 년도 일 때
          alert('캘린더에는' + '  ' + this.selectedYear + '년 전의 년도는 저장되어 있지 않습니다.')
          document.getElementById('s1').value = Number(splitTitleText[1])
          selMonth[0].selected = true
          const calendar = this.$refs.calendar
          calendar.move(new Date(this.selectedYear, 1, 1))
        } else {
          document.getElementById('s1').value = Number(splitTitleText[1]) - 1// 년도 수정해주기
          selMonth[11].selected = true
        }
      } else {
        finalTitle = tempTitle.concat(Number(splitTitleText[0]) - 1, '월', splitTitleText[1])
        selMonth[splitTitleText[0] - 2].selected = true
      }
      this.yymmddTitle = finalTitle
      axios
        .get('/api/vacation/selectCalendarElement', {
          params: { strDate: this.yymmddTitle },
          headers: { 'X-Api-Key': 'my-api-key' }
        })
        .then(res => {
          for (const i in res.data.data) {
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
            this.attributes[i].dates = new Date(res.data.data[i].year, res.data.data[i].month, res.data.data[i].dkey)
            this.attributes[i].dkey = res.data.data[i].dkey
            this.attributes[i].customData.class = res.data.data[i].tempClass
            obj = null
          }
        })
    },
    selectNextCalendarElement: function () { // 유저의 근태정보 조회(다음 달)
      const titleText = document.getElementsByClassName('vc-title')[0].innerHTML
      var splitTitleText = titleText.split('월')
      var tempTitle = ''
      var selMonth = document.getElementById('s2')
      this.temp = Number(this.temp) + 1
      if (splitTitleText[0] === '12') { // 금년도 12월 -> 후년도 12월 파라미터 설정
        var finalTitle = tempTitle.concat(1, '월', Number(splitTitleText[1]) + 1)
        selMonth[0].selected = true
        document.getElementById('s1').value = Number(splitTitleText[1]) + 1 // 년도 수정해주기
      } else {
        finalTitle = tempTitle.concat(Number(splitTitleText[0]) + 1, '월', splitTitleText[1])
        selMonth[splitTitleText[0]].selected = true
      }
      this.yymmddTitle = finalTitle
      axios
        .get('/api/vacation/selectCalendarElement', {
          params: { strDate: this.yymmddTitle },
          headers: { 'X-Api-Key': 'my-api-key' }
        })
        .then(res => {
          for (const i in res.data.data) {
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
            this.attributes[i].dates = new Date(res.data.data[i].year, res.data.data[i].month, res.data.data[i].dkey)
            this.attributes[i].dkey = res.data.data[i].dkey
            this.attributes[i].customData.class = res.data.data[i].tempClass
            obj = null
          }
        })
    }
  }
}
</script>

<style lang="postcss" scoped>
/deep/ .custom-calendar ::-webkit-scrollbar {width: 0px}
/deep/ .custom-calendar ::-webkit-scrollbar-track {display: none}
/deep/ .custom-calendar {width:100%; border-radius:0}
/deep/ .custom-calendar.vc-container {}
/deep/ .custom-calendar.vc-container .vc-header {border:0; padding:10px; background-color:#e2e8f0}
/deep/ .custom-calendar.vc-container .vc-weeks {padding:0}
/deep/ .custom-calendar.vc-container .vc-weekday {padding:10px 0; border-top:1px solid #ddd; border-bottom:1px solid #ddd; background-color:#f7f7f7; color:#666}
/deep/ .custom-calendar.vc-container .vc-day {height:90px; padding:5px; border:1px solid #ddd; border-left:0; border-top:0;}
/deep/ .custom-calendar.vc-container .vc-day.weekday-1 {background-color: #eff8ff; color:#e53e3e}
/deep/ .custom-calendar.vc-container .vc-day.weekday-7 {background-color: #eff8ff; border-right:0; color:blue}
/deep/ .custom-calendar.vc-container .vc-day-dots {}
/deep/ .custom-calendar.vc-container .vc-bg-blue-100 {background-color:#2D3748; outline:none}
.vc-grid-cell {background-color:#4a5568 !important}
</style>
