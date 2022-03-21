<template>
  <div class="conts-area">
    <div class="conts-tit">
      <h2>업무실적 조회</h2>
    </div>
    <div class="list-top-area">
      <div class="fl">
        <label for="s1">부서명</label>
        <select id="s1" title="select" disabled>
          <option v-for="department in departments" v-bind:key="department.scode" v-bind:value="department.scode" v-bind:selected="department.myDept==='Y'">{{ department.scodeNm }}</option>
        </select>
      </div>
      <p class="d-in fl mt5 mg10">금주</p>
      <div class="fl wp25">
        <div class="vcal-area">
          <v-date-picker
            mode='range'
            v-model='thisWeek'
            :disabled-dates='{ weekdays: [1, 7] }'
            :popover="{ placement: 'bottom', visibility: 'click' }">
          </v-date-picker>
        </div>
      </div>
      <p class="d-in fl mt5 mg10">차주</p>
      <input type="text" v-model="nextWeekText" readonly>
    </div>
    <div class="clearfix mt20">
      <div class="t-right">
        <button type="button" title="수정" class="btn btn-gray" @click="editPlando(thisWeek)">수정</button>
        <button type="button" title="조회" class="btn btn-blue" @click="getPlandoList(thisWeek)">조회</button>
      </div>
    </div>
    <div class="tbl-area">
      <!-- 금주실적 start -->
      <table class="tbl">
        <caption>리스트</caption>
        <colgroup>
          <col style="width:10%">
          <col style="width:60%">
          <col style="width:10%">
          <col style="width:10%">
          <col style="width:10%">
        </colgroup>
        <thead>
          <tr>
            <th colspan="5">금주실적</th>
          </tr>
          <tr>
            <th>No</th>
            <th>실적</th>
            <th>시작일</th>
            <th>종료일</th>
            <th>진행사항</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="doRows.length===0">
            <td colspan="5">등록된 실적이 없습니다</td>
          </tr>
          <tr v-for="doValue in doRows" v-bind:key="doValue.serial">
            <td>{{ doValue.rnum }}</td>
            <td class="t-left" v-html="doValue.content">
            </td>
            <td>{{ doValue.sdate }}</td>
            <td>{{ doValue.edate }}</td>
            <td>
              <label for="s1" class="blind">진행사항</label>
              {{ doValue.proceedNm }}
            </td>
          </tr>
        </tbody>
      </table>
      <!-- //금주실적 end -->
      <!-- 차주계획 start -->
      <table class="tbl mt30">
        <caption>리스트</caption>
        <colgroup>
          <col style="width:10%">
          <col style="width:60%">
          <col style="width:10%">
          <col style="width:10%">
          <col style="width:10%">
        </colgroup>
        <thead>
          <tr>
            <th colspan="5">차주계획</th>
          </tr>
          <tr>
            <th>No</th>
            <th>실적</th>
            <th>시작일</th>
            <th>종료일</th>
            <th>비고</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="5" v-if="planRows.length===0">등록된 계획이 없습니다</td>
          </tr>
          <tr v-for="planValue in planRows" v-bind:key="planValue.serial">
            <td>{{ planValue.rnum }}</td>
            <td class="t-left" v-html="planValue.content">
            </td>
            <td>{{ planValue.sdate }}</td>
            <td>{{ planValue.edate }}</td>
            <td>
              <label for="s2" class="blind">진행사항</label>
              {{ planValue.bigo }}
            </td>
          </tr>
        </tbody>
      </table>
      <!-- //차주계획 end -->
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import GroupCode from '../../mixins/GroupCode.js'

export default {
  name: 'MyPlandoView',
  data () {
    return {
      thisWeek: { }, // 금주 날짜(시작일~종료일)
      nextWeekText: '', // 차주 날짜 text
      departments: [], // 부서명
      doRows: [], // 금주실적 row
      planRows: [] // 차주계획 row
    }
  },
  created: function () {
    if (this.$route.query.thisWeek) {
      this.settingDate(new Date(this.$route.query.thisWeek))
    } else {
      this.settingDate(new Date())
    }
    this.getDepartmentInfo() // 부서 정보 가져오기
    this.getPlandoList(this.thisWeek)
  },
  watch: {
    /* 금주의 시작일 변경을 감지
    금주 날짜 선택 시, 사용자가 시작일을 어떤 요일로 선택하든 무조건 월요일이 시작일이 되도록 세팅 */
    'thisWeek.start': function () {
      if (this.thisWeek.start.getDay() !== 1) {
        this.thisWeek.start.setDate(this.thisWeek.start.getDate() - (this.thisWeek.start.getDay() - 1))
      }
      /* 날짜(2020년 6월 12일)를 클릭으로 직접 선택한 경우 2020년 6월 12일 0시 0분 0초 출력되고,
        DB저장시 2020년 6월 11일로 저장되는 문제 발생
        따라서 시,분,초를 더한 값이 0이면 날짜를 다시 세팅한다 */
      this.thisWeek.start.setHours(12)
      var date = this.calculationDate(this.thisWeek.start)
      this.thisWeek.end = date.wkEnd
      this.nextWeekText = date.nwStartText + ' - ' + date.nwEndText
    }
  },
  methods: {
    calculationDate: function (anchorDate) {
      anchorDate.setHours(12)
      const currentWeekDay = anchorDate.getDay()
      const lessDays = currentWeekDay === 0 ? 6 : currentWeekDay - 1
      const wkStart = new Date(new Date(anchorDate).setDate(anchorDate.getDate() - lessDays))
      const wkEnd = new Date(new Date(wkStart).setDate(wkStart.getDate() + 4))
      const nwStart = new Date(new Date(wkStart).setDate(wkStart.getDate() + 7))
      const nwEnd = new Date(new Date(nwStart).setDate(nwStart.getDate() + 4))
      const nwStartText = nwStart.toISOString().substr(0, 10).replace(/-/g, '.')
      const nwEndText = nwEnd.toISOString().substr(0, 10).replace(/-/g, '.')

      return { wkStart: wkStart, wkEnd: wkEnd, nwStart: nwStart, nwStartText: nwStartText, nwEndText: nwEndText }
    },
    /* 오늘 날짜를 받아와서 금주 날짜와 차주 날짜 default setting */
    settingDate: function (initDate) {
      var date = this.calculationDate(initDate)
      this.thisWeek.start = date.wkStart
      this.thisWeek.end = date.wkEnd
      this.nextWeekText = date.nwStartText + ' - ' + date.nwEndText
    },
    /* 부서 정보 가져오기 */
    getDepartmentInfo: function () {
      axios.get('/api/getDepartmentInfo', {
        params: { grcode: GroupCode.DEPARTMENT }
      })
        .then(response => {
          if (response.status === 200) {
            this.departments.push(...response.data.data)
          }
        }).catch((error) => {
          console.log(error)
        })
    },
    editPlando: function (thisWeek) {
      axios.get('/api/getPlandoList', {
        params: { sDate: this.dateToString(thisWeek.start) }
      })
        .then(response => {
          if (response.status === 200) {
            this.$router.replace({ path: '/plando/regi', query: { sDate: thisWeek.start.toISOString().substr(0, 10), listData: response.data.data, mode: 'edit' } })
          }
        }).catch((error) => {
          console.log(error)
        })
    },
    /* 업무실적 조회 */
    getPlandoList: function (thisWeek) {
      let sDate = null
      // sDate 설정
      sDate = this.dateToString(thisWeek.start)
      axios.get('/api/getPlandoList', {
        params: { sDate: sDate, grcode: GroupCode.STATE }
      })
        .then(response => {
          if (response.status === 200) {
            // 모든 행을 지우고 다시 push
            this.doRows.splice(0)
            this.planRows.splice(0)

            const doData = response.data.data.filter(function (el) {
              return el.gubun === '1'
            })
            const planData = response.data.data.filter(function (el) {
              return el.gubun === '2'
            })
            for (var value of response.data.data) {
              value.content = value.content.replace(/ /g, '&nbsp;') // 띄어쓰기 처리
              value.content = value.content.replace(/</g, '&lt;').replace(/>/g, '&gt;') // < , > 처리
              value.content = value.content.replace(/(?:\r\n|\r|\n)/g, '<br>') // 줄바꿈 처리
            }
            this.doRows.push(...doData)
            this.planRows.push(...planData)
          }
        }).catch((error) => {
          console.log(error)
        })
    },
    /* 날짜 형식 변환 */
    dateToString: function (date) {
      return date.toISOString().substr(0, 10).replace(/-/g, '')
    }
  }
}
</script>

<style>
</style>
