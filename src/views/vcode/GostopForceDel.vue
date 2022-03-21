<template>
  <div class="conts-area">
    <div class="conts-tit">
      <h2>사용자별 월별 근태 조회 및 삭제</h2>
    </div>
    <div class="list-top-area">
    <div class="fl">
        <label for="s1">년도</label>
        <select id="s1" title="select"  @change="onChangeYear($event)">
          <option v-for="Y in callYears" v-bind:key="Y.year" v-bind:value="Y">{{Y}}</option>
        </select>
        <label for="s2">월</label>
        <select id="s2" title="select" @change="onChangeYear($event)">
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
        <label for="s1">이름</label>
        <select id="worker" title="select" v-model="sel_worker" @change="onChangeYear($event)">
          <option id="workerOption" v-for="v in workerForYear" v-bind:key="v.id" v-bind:value="v.id">{{ v.name }}</option>
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
          <p v-for="attr in attributes" :class="attr.customData.class" v-bind:key="attr.dkey" v-on:click.self="openModal(attr.customData.title, attr.dates, attr.customData.minus, attr.customData.vCode)">
            {{ attr.customData.title }}
          </p>
        </div>
      </div>
    </v-calendar>

    <!-- Modal start -->
    <MyModal v-if="modalVisible">
      <template slot="header">
        결재
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
              <th>휴가일자</th>
              <td class="t-left">
                {{ modalData.date }}
              </td>
            </tr>
            <tr>
              <th>결재종류</th>
              <td class="t-left">
                {{ modalData.title }}
              </td>
            </tr>
            <tr>
              <th>이름</th>
              <td class="t-left">
                {{ modalData.name }}
              </td>
            </tr>
            <tr>
              <th>복구예상 차감일수</th>
              <td class="t-left">
                {{ modalData.minus }}
              </td>
            </tr>
            <th colspan="2">정말 위 사람의 근태를 강제적으로 삭제하시겠습니까?</th>
          </tbody>
        </table>
      </div>
      <!-- /default -->
      <!-- footer 슬롯 콘텐츠 -->
      <template slot="footer">
        <div class="t-center">
          <button type="button" class="btn btn-blue" v-on:click="guntaeDel()">강제삭제</button>
          <button type="button" class="btn btn-gray" v-on:click="closeModal">취소</button>
        </div>
      </template>
      <!-- /footer -->
    </MyModal>
    <!-- modal end -->
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import MyModal from '../../components/MyModal.vue'

export default {
  name: 'DeptPlando',
  components: { MyModal },
  data () {
    return {
      masks: {
        weekdays: 'WW'
      },
      attributes: [],
      yymmddTitle: '',
      callYears: [],
      selectedYear: '',
      selectedMonth: '',
      workerForYear: {
        id: '',
        name: ''
      },
      sel_worker: '',
      modalVisible: false,
      modalData: {
        title: '',
        date: '',
        minus: '',
        name: '',
        vcode: ''
      }
    }
  },
  mounted: function () {
    var calPreAndNextBtn = document.querySelectorAll('.vc-svg-icon')
    calPreAndNextBtn[0].addEventListener('click', this.selectPreCalendarElement, false)
    calPreAndNextBtn[1].addEventListener('click', this.selectNextCalendarElement, false)
    this.getCalendarYear()

    // 셀렉트 박스 초기값 현재 달로 설정
    const month = new Date().getMonth()
    var sel = document.getElementById('s2')
    sel[month].selected = true
  },
  methods: {
    openModal (title, dates, minus, vcode) {
      if (title !== '' && title !== '출근' && title !== '법정공휴일') {
        this.modalData.title = title
        this.modalData.date = moment(dates[0].date).format('yyyyMMDD')
        this.modalData.minus = minus
        var target = document.getElementById('worker')
        this.modalData.name = target.options[target.selectedIndex].text
        this.modalData.vcode = vcode
        this.modalVisible = true
      }
      // this.guntaeDel(title, this.modalData.date, minus, vcode)
    },
    closeModal () {
      this.modalVisible = false
    },
    onChangeMonth (event) { // 캘린더 달 바뀔 시
      this.selectedYear = document.getElementById('s1').value
      this.selectdMonth = document.getElementById('s2').value
      var paramDate = this.selectdMonth + '월' + this.selectedYear
      const calendar = this.$refs.calendar
      calendar.move(new Date(this.selectedYear, this.selectdMonth - 1, 1))
      axios
        .get('/api/vacation/selectCalendarElement_ForceDel', {
          params: { strDate: paramDate, id: this.sel_worker },
          headers: { 'X-Api-Key': 'my-api-key' }
        })
        .then(res => {
          this.settingAttributes(res)
        }).catch(() => {
          // console.log(error)
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
    },
    onChangeYear (event) { // 캘린더 년도 바뀔 시
      this.selectedYear = document.getElementById('s1').value
      this.selectdMonth = document.getElementById('s2').value
      var paramDate = this.selectdMonth + '월' + this.selectedYear
      const calendar = this.$refs.calendar
      calendar.move(new Date(this.selectedYear, this.selectdMonth - 1, 1))
      console.log('선택된 자 :', this.sel_worker)
      axios
        .get('/api/vacation/selectCalendarElement_ForceDel', {
          params: { strDate: paramDate, id: this.sel_worker },
          headers: { 'X-Api-Key': 'my-api-key' }
        })
        .then(res => {
          this.settingAttributes(res)
        }).catch(() => {
          // console.log(error)
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
    },
    getCalendarYear: function () { // 캘린더 년도 정보 가져오기 (2020년부터 당해년도까지)
      // console.log('현재년도 : ' + moment(new Date()).format('YYYY'))
      var thisYear = moment(new Date()).format('YYYY')
      for (var i = 2020; i <= thisYear; i++) {
        // console.log('다음년도 : ' + i)
        this.callYears.push(i)
      }
      this.selectedYear = thisYear
      this.loadWorker()
    },
    guntaeDel: function () {
      // console.log('강제삭제할 modalDate : ', this.modalData)
      axios.post('/api/vacation/forceDelGuntae', {
        id: this.sel_worker,
        vcode: this.modalData.vcode,
        gdate: this.modalData.date,
        minusDayoff: this.modalData.minus
      })
        .then((result) => {
          // console.log('강제삭제 result', result.data.data)
          this.modalVisible = false
          this.selectCalendarElement_ForceDel()
        }).catch(() => {
          // console.log('error', error)
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
    },
    /* 연도별 사원목록 */
    loadWorker: function () {
      // console.log('연도별 사원목록 가져오자!!')
      // console.log('해당 연도 : ' + this.selectedYear)
      axios.post('/api/vacation/selectWorkerForYear', {
        sdate: this.selectedYear
      })
        .then((result) => {
          // console.log('연도별 사원목록 result', result.data.data)
          this.workerForYear = result.data.data
          this.sel_worker = result.data.data[0].id
          this.selectCalendarElement_ForceDel()
        }).catch(() => {
          // console.log('error', error)
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
    },
    selectCalendarElement_ForceDel: function () { // 유저의 근태정보 조회(최초 load시)
      const titleText = document.getElementsByClassName('vc-title')[0].innerHTML
      this.yymmddTitle = titleText
      // console.log('유저 근태정보 조회용 유저 id : ' + this.sel_worker)
      axios
        .get('/api/vacation/selectCalendarElement_ForceDel', {
          params: { strDate: this.yymmddTitle, id: this.sel_worker },
          headers: { 'X-Api-Key': 'my-api-key' }
        })
        .then(res => {
          this.settingAttributes(res)
        }).catch(() => {
          // console.log(error)
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
    },
    selectPreCalendarElement: function () { // 유저의 근태정보 조회(이전 달)
      const titleText = document.getElementsByClassName('vc-title')[0].innerHTML
      var splitTitleText = titleText.split('월')
      var tempTitle = ''
      if (splitTitleText[0] === '1') { // 금년도 1월 -> 전년도 12월 파라미터 설정
        var finalTitle = tempTitle.concat(12, '월', Number(splitTitleText[1]) - 1)
      } else {
        finalTitle = tempTitle.concat(Number(splitTitleText[0]) - 1, '월', splitTitleText[1])
      }
      this.yymmddTitle = finalTitle
      axios
        .get('/api/vacation/selectCalendarElement_ForceDel', {
          params: { strDate: this.yymmddTitle, id: this.sel_worker },
          headers: { 'X-Api-Key': 'my-api-key' }
        })
        .then(res => {
          this.settingAttributes(res)
        }).catch(() => {
          // console.log(error)
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
    },
    selectNextCalendarElement: function () { // 유저의 근태정보 조회(다음 달)
      const titleText = document.getElementsByClassName('vc-title')[0].innerHTML
      var splitTitleText = titleText.split('월')
      var tempTitle = ''
      this.temp = Number(this.temp) + 1
      if (splitTitleText[0] === '12') { // 금년도 12월 -> 후년도 12월 파라미터 설정
        var finalTitle = tempTitle.concat(1, '월', Number(splitTitleText[1]) + 1)
      } else {
        finalTitle = tempTitle.concat(Number(splitTitleText[0]) + 1, '월', splitTitleText[1])
      }
      this.yymmddTitle = finalTitle
      axios
        .get('/api/vacation/selectCalendarElement_ForceDel', {
          params: { strDate: this.yymmddTitle, id: this.sel_worker },
          headers: { 'X-Api-Key': 'my-api-key' }
        })
        .then(res => {
          this.settingAttributes(res)
        }).catch(() => {
          // console.log(error)
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
    },
    settingAttributes: function (res) {
      for (const i in res.data.data) {
        var obj = {
          dkey: '',
          customData: {
            title: '',
            class: '',
            minus: '',
            vCode: ''
          },
          dates: null
        }
        this.attributes.push(obj)
        this.attributes[i].customData.title = res.data.data[i].title
        this.attributes[i].dates = new Date(res.data.data[i].year, res.data.data[i].month, res.data.data[i].dkey)
        this.attributes[i].dkey = res.data.data[i].dkey
        this.attributes[i].customData.class = res.data.data[i].tempClass
        this.attributes[i].customData.minus = res.data.data[i].minus
        this.attributes[i].customData.vCode = res.data.data[i].vcode
        // console.log(i + '번째 마이너스 : ' + this.attributes[i].customData.minus + ' | 근태코드 : ' + this.attributes[i].customData.vCode)
        obj = null
      }
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
.bg-red {cursor: pointer}
.bg-blue {cursor: pointer}
.bg-indigo {cursor: pointer}
.bg-teal {cursor: pointer}
.bg-orange {cursor: pointer}
</style>
