<template>
  <div class="conts-area" @keydown="enterEvent($event)">
    <div class="conts-tit">
      <h2>업무실적 등록/수정</h2>
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
      <div class="fl wp25">
          <input type="text" v-model="nextWeekText" readonly>
      </div>
    </div>
    <div class="clearfix mt20">
      <div class="d-ib fl">
        <button type="button" title="금주실적 추가" class="btn btn-gray" @click="addRow(doRows, thisWeek)">금주실적 추가</button>
        <button type="button" title="결재상신" class="btn btn-black" @click="copyPlan()">전주계획 복사</button>
      </div>
      <div class="t-right">
        <button type="button" title="저장" class="btn btn-blue" @click="savePlando()">저장</button>
      </div>
    </div>
    <div class="tbl-area">
      <input type="hidden" v-model="mode">
      <!-- <MyDoRegi/>
      <MyPlanRegi/> -->
      <div>
    <!-- 금주실적 start -->
      <table class="tbl">
        <caption>리스트</caption>
        <colgroup>
          <col style="width:50%">
          <col style="width:14%">
          <col style="width:14%">
          <col style="width:12%">
          <col style="width:10%">
        </colgroup>
        <thead>
          <tr>
            <th colspan="5">금주실적</th>
          </tr>
          <tr>
            <th>실적</th>
            <th>시작일</th>
            <th>종료일</th>
            <th>계획</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr>
          </tr>
          <tr v-for="(doValue, doRow) in doRows" v-bind:key="doValue.serial">
            <td class="t-left">
              <textarea id="ta1" name="ta1" rows="5" v-model="doValue.content" :maxlength="1000" @keydown="onKeyDown($event)"></textarea>
            </td>
            <td>
              <!-- calendar start -->
              <div class="vcal-area">
                <v-date-picker
                  v-model="doValue.sdate"
                  :disabled-dates='{ weekdays: [1, 7] }'
                  :popover="{ placement: 'bottom', visibility: 'click' }"
                  :masks="{ input: 'MM/DD'}"
                  :min-date="thisWeek.start"
                  :max-date="thisWeek.end">
                </v-date-picker>
              </div>
              <!-- //calendar end -->
            </td>
            <td>
              <!-- calendar start -->
              <div class="vcal-area">
                <v-date-picker
                  v-model="doValue.edate"
                  :disabled-dates='{ weekdays: [1, 7] }'
                  :popover="{ placement: 'bottom', visibility: 'click' }"
                  :masks="{ input: 'MM/DD'}"
                  :min-date="doEndMin">
                </v-date-picker>
              </div>
              <!-- //calendar end -->
            </td>
            <td>
              <label for="s1" class="blind">진행사항</label>
              <select id="s2" title="select" v-model="doValue.proceed" class="inner-select">
                <option v-for="proceed in proceeds" v-bind:key="proceed.scode" v-bind:value="proceed.scode">{{ proceed.scodeNm }}</option>
              </select>
            </td>
            <td><button type="button" title="삭제" class="btn btn-black" @click="removeRow(doRows, doRow)">삭제</button></td>
          </tr>
        </tbody>
      </table>
      <!-- //금주실적 end -->
      <div class="clearfix mt40">
        <div>
          <button type="button" title="차주계획 추가" class="btn btn-gray" @click="addRow(planRows, nextWeek)">차주계획 추가</button>
        </div>
      </div>
      <!-- 차주계획 start -->
      <table class="tbl mt10">
        <caption>리스트</caption>
        <colgroup>
          <col style="width:50%">
          <col style="width:10%">
          <col style="width:10%">
          <col style="width:20%">
          <col style="width:10%">
        </colgroup>
        <thead>
          <tr>
            <th colspan="5">차주계획</th>
          </tr>
          <tr>
            <th>실적</th>
            <th>시작일</th>
            <th>종료일</th>
            <th>비고</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr>
          </tr>
          <tr v-for="(plan, planRow) in planRows" v-bind:key="plan.serial">
            <td class="t-left">
              <textarea id="ta2" name="ta2" rows="5" v-model="plan.content" :maxlength="1000" @keydown="onKeyDown($event)"></textarea>
            </td>
            <td>
              <!-- calendar start -->
              <div class="vcal-area t2">
                <v-date-picker
                  v-model='plan.sdate'
                  :disabled-dates='{ weekdays: [1, 7] }'
                  :popover="{ placement: 'bottom', visibility: 'click' }"
                  :masks="{ input: 'MM/DD'}"
                  :min-date="planStartMin"
                  :max-date="planStartMax"
                  :class="[ isActive ? redClass: '' ]">
                </v-date-picker>
              </div>
              <!-- //calendar end -->
            </td>
            <td>
              <!-- calendar start -->
              <div class="vcal-area t2">
                <v-date-picker
                  v-model='plan.edate'
                  :disabled-dates='{ weekdays: [1, 7] }'
                  :popover="{ placement: 'bottom', visibility: 'click' }"
                  :masks="{ input: 'MM/DD'}"
                  :min-date="planEndMin">
                </v-date-picker>
              </div>
              <!-- //calendar end -->
            </td>
            <td>
              <textarea id="ta2" name="ta2" rows="3" v-model="plan.bigo"></textarea>
            </td>
            <td><button type="button" title="결재상신" class="btn btn-black" @click="removeRow(planRows, planRow)">삭제</button></td>
          </tr>
        </tbody>
      </table>
      <!-- //차주계획 end -->
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import GroupCode from '../../mixins/GroupCode.js'
import moment from 'moment'

export default {
  name: 'MyPlandoRegi',
  data () {
    return {
      thisWeek: { }, // 금주 날짜(시작일~종료일)
      nextWeek: { }, // 차주 날짜(시작일~종료일)
      nextWeekText: '', // 차주 날짜 text
      doRows: [], // 금주실적 row (진행사항은 default를 3(미처리)으로 설정)
      planRows: [], // 차주계획 row
      proceeds: [], // 진행사항 select option
      departments: [], // 부서명
      serial: 1, // 금주실적 row key 값
      isActive: false,
      redClass: 'border-red',
      mode: '', // 등록모드인지 수정모드인지 구분 (등록: '', 수정: 'edit')
      doEndMin: '', // 금주 종료일 min-date 설정
      planStartMin: '', // 차주 시작일 min-date 설정
      planStartMax: '', // 차주 시작일 max-date 설정ㄴ
      planEndMin: '' // 차주 종료일 min-date 설정
    }
  },
  created: function () {
    this.settingDate(new Date())
    this.addRow(this.doRows, this.thisWeek) // 금주실적 기본 1줄
    this.addRow(this.planRows, this.nextWeek)
    this.getDepartmentInfo() // 부서 정보 가져오기
    this.getProceedData(GroupCode.STATE) // 진행사항 option 가져오기

    /* 수정 모드인 경우 */
    if (this.$route.query.mode === 'edit') {
      this.mode = this.$route.query.mode
      this.initPlando()
    }
  },
  watch: {
    /* 금주의 시작일 변경을 감지
    금주 날짜 선택 시, 사용자가 시작일을 어떤 요일로 선택하든 무조건 월요일이 시작일이 되도록 세팅 */
    'thisWeek.start': function () {
      if (this.thisWeek.start.getDay() !== 1) {
        this.thisWeek.start.setDate(this.thisWeek.start.getDate() - (this.thisWeek.start.getDay() - 1))
      }
      this.thisWeek.start.setHours(12)

      const date = this.calculationDate(this.thisWeek.start)
      this.thisWeek.end = date.wkEnd
      this.nextWeek.start = date.nwStart
      this.nextWeek.end = date.nwEnd
      this.nextWeekText = date.nwStartText + ' - ' + date.nwEndText

      // 시작일, 종료일 min-date 설정
      this.doEndMin = this.thisWeek.start
      this.planStartMin = date.nwStart
      this.planStartMax = date.nwEnd
      this.planEndMin = date.nwStart
    }
  },
  methods: {
    /* 날짜 계산 */
    calculationDate: function (anchorDate) {
      const currentWeekDay = anchorDate.getDay()
      const lessDays = currentWeekDay === 0 ? 6 : currentWeekDay - 1
      const wkStart = new Date(new Date(anchorDate).setDate(anchorDate.getDate() - lessDays))
      const wkEnd = new Date(new Date(wkStart).setDate(wkStart.getDate() + 4))
      const nwStart = new Date(new Date(wkStart).setDate(wkStart.getDate() + 7))
      const nwEnd = new Date(new Date(nwStart).setDate(nwStart.getDate() + 4))
      const nwStartText = nwStart.toISOString().substr(0, 10).replace(/-/g, '.')
      const nwEndText = nwEnd.toISOString().substr(0, 10).replace(/-/g, '.')

      return { wkStart: wkStart, wkEnd: wkEnd, nwStart: nwStart, nwEnd: nwEnd, nwStartText: nwStartText, nwEndText: nwEndText }
    },
    initPlando: function () {
      for (const value of this.$route.query.listData) {
        value.sdate = new Date(value.sdate)
        value.edate = new Date(value.edate)
      }

      const doData = this.$route.query.listData.filter(function (el) {
        return el.gubun === '1'
      })
      const planData = this.$route.query.listData.filter(function (el) {
        return el.gubun === '2'
      })

      this.emptySpaceDelete(this.doRows)
      this.emptySpaceDelete(this.planRows)

      this.doRows.push(...doData)
      this.planRows.push(...planData)
      this.settingDate(new Date(this.$route.query.sDate))
    },
    /* 오늘 날짜를 받아와서 금주 날짜와 차주 날짜 default setting */
    settingDate: function (initDate) {
      var date = this.calculationDate(initDate)
      this.thisWeek.start = date.wkStart
      this.thisWeek.end = date.wkEnd
      this.nextWeek.start = date.nwStart
      this.nextWeek.end = date.nwEnd
      this.nextWeekText = date.nwStartText + ' - ' + date.nwEndText

      // 시작일, 종료일 min-date 설정
      this.doEndMin = this.thisWeek.start
      this.planStartMin = date.nwStart
      this.planStartMax = date.nwEnd
      this.planEndMin = date.nwStart
    },
    // @TODO 믹스인으로 빼기
    getProceedData: function (groupCode) {
      axios.get('/api/selectCode', {
        params: { groupCode: groupCode }
      })
        .then(response => {
          if (response.status === 200) {
            // DB에서 진행사항 항목을 불러와서 push
            this.proceeds.push(...response.data.data)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    /* 실적 및 계획 row 추가 */
    addRow: function (row, date) {
      this.serial = this.serial + 1
      row.push({ serial: this.serial, gubun: '1', content: '', sdate: date.start, edate: date.end, proceed: '3' })
    },
    /* 실적 및 계획 row 삭제 */
    removeRow: function (rows, row) {
      rows.splice(row, 1)
    },
    /* 전주계획 복사 */
    copyPlan: function () {
      const sDate = this.dateToString(new Date(new Date(this.thisWeek.start).setDate(this.thisWeek.start.getDate())))
      axios.get('/api/getLastWeekPlanCopy', {
        params: { gubun: '2', sDate: sDate }
      })
        .then(response => {
          if (response.status === 200) {
            if (response.data.data.length === 0) {
              alert('복사할 전주 계획이 없습니다')
              return
            }
            this.emptySpaceDelete(this.doRows) // 빈칸 삭제
            // String -> date 형식으로 변경
            for (const value of response.data.data) {
              value.sdate = new Date(value.sdate)
              value.edate = new Date(value.edate)
            }

            this.doRows.push(...response.data.data) // spread operator로 배열 한꺼번에 출력 가능
          }
        }).catch((error) => {
          console.log(error)
        })
    },
    /* 전주 계획 복사 시, 실적이 비어있는 칸은 삭제 */
    emptySpaceDelete: function (row) {
      for (let i = 0; i < row.length; i++) {
        if (!row[i].content) { // null, undefied ... 체크
          row.splice(i, 1)
          i--
        }
      }
    },
    /* 날짜(2020년 6월 12일)를 클릭으로 직접 선택한 경우 2020년 6월 12일 0시 0분 0초가 출력되고,
        DB저장시 2020년 6월 11일로 저장되는 문제 발생
        따라서 시,분,초를 더한 값이 0이면 날짜를 다시 세팅한다 */
    checkDate: function (date) {
      date.setHours(12)
      return date
    },
    /* 저장 시 Validation Check */
    saveValidation: function () {
      if (this.mode !== 'edit') {
        if (!this.isNullContent()) {
        // @TODO: 메시지 내용 변경
          alert('금주 실적과 차주 계획이 모두 비어있습니다\r\n업무 실적을 입력해주세요')
          return false
        }
      }

      if (!this.validationStartEnd()) {
        alert('종료일이 시작일보다 이전 날짜일 수 없습니다')
        return false
      }

      return true
    },
    /* 계획 및 실적 저장 */
    savePlando: function () {
      if (!this.saveValidation()) {
        return
      }
      this.convertData(this.doRows, 'date', 1)
      this.convertData(this.planRows, 'date', 2)

      const plandoPOList = (this.doRows).concat(this.planRows)
      const editSDate = this.dateToString(new Date(new Date(this.thisWeek.start).setDate(this.thisWeek.start.getDate())))

      axios
        .post('/api/savePlando',
          { plandoPOList: plandoPOList, mode: this.mode, editSDate: editSDate }
        )
        .then((response) => {
          if (response.data.success) {
            alert(response.data.message)
            // @TODO: parameter 넘기는 다른 방법 고민
            this.$router.replace(this.$route.query.redirect || '/plando/view?thisWeek=' + this.thisWeek.start)
          } else {
            alert(response.data.message)
            this.convertData(this.doRows, 'string')
            this.convertData(this.planRows, 'string')
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    /* 실적 저장 전 or 실적 저장 후 data type 변경
    rows: 입력 값
    type: 'date'=dateToString / 'string'=stringToDate
    gubun: 1=실적 / 2=계획
     */
    convertData: function (rows, type, gubun) {
      if (type === 'date') {
        for (let i = 0; i < rows.length; i++) {
          rows[i].sdate = this.dateToString(this.checkDate(rows[i].sdate))
          rows[i].edate = this.dateToString(this.checkDate(rows[i].edate))
          rows[i].gubun = gubun
        }
      } else {
        for (let i = 0; i < rows.length; i++) {
          rows[i].sdate = this.stringToDate(rows[i].sdate)
          rows[i].edate = this.stringToDate(rows[i].edate)
        }
      }
    },
    /* 업무 실적 등록/수정 시 금주 실적과 차주 계획이 모두 비어있는지 확인
    모두 비어있는 경우 값을 입력하라는 메시지창을 띄워준다 */
    isNullContent: function () {
      const doContent = this.doRows.filter(function (el) {
        return el.content.replace(/ /g, '').replace(/(?:\r\n|\r|\n)/g, '') // 띄어쓰기 or 엔터만 하고 저장하는 경우도 비어있는 것으로 간주
      })
      const planContent = this.planRows.filter(function (el) {
        return el.content.replace(/ /g, '').replace(/(?:\r\n|\r|\n)/g, '')
      })

      if (doContent.length + planContent.length === 0) {
        return false
      } else {
        return true
      }
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
    validationStartEnd: function () {
      for (const value of this.doRows) {
        if (this.checkDate(value.sdate).toISOString().substr(0, 10) > this.checkDate(value.edate).toISOString().substr(0, 10)) {
          return false
        }
      }

      for (const value of this.planRows) {
        if (this.checkDate(value.sdate).toISOString().substr(0, 10) > this.checkDate(value.edate).toISOString().substr(0, 10)) {
          return false
        }
      }
      return true
    },
    /* Date 형식 -> String 형식으로 변환 */
    dateToString: function (date) {
      return date.toISOString().substr(0, 10).replace(/-/g, '') // 정규식을 이용하여 replaceAll 처리 사용
    },
    /* String형식 -> Date형식으로 변환 */
    stringToDate: function (date) {
      return new Date(moment(date).format('YYYY-MM-DD'))
    },
    /* 글자수 체크 event */
    onKeyDown: function (e) {
      if (e.target.textLength > 1000) {
        alert('글자수를 1000자 이하로 입력해주세요.')
      }
    },
    enterEvent: function (e) {
      // alert('!!!')
    }
  }
}
</script>

<style scoped>
.border-red { background-color: #e53e3e }
.inner-select {width:100%; min-width:auto !important; padding:5px !important; margin-right:0 !important}
</style>
