<template>
  <div class="conts-area">
    <div class="conts-tit">
      <h2>부서별 업무실적 조회</h2>
    </div>
    <div class="list-top-area">
      <div class="fl">
        <label for="s1">부서명</label>
        <select id="s1" title="select" @change=onChange($event) v-model="myDeptCode">
          <option v-for="department in departments" v-bind:key="department.scode" v-bind:value="department.scode">{{ department.scodeNm }}</option>
        </select>
      </div>
      <p class="d-in fl mt5 mg10">금주</p>
      <div class="fl wp25">
        <div class="vcal-area">
          <!-- <v-text-field slot="activator" v-model="thisWeek" label="Picker in dialog" prepend-icon="vc-ico" class="vc-ico">
          </v-text-field> -->
          <v-date-picker
            mode='range'
            v-model='thisWeek'
            :disabled-dates='{ weekdays: [1, 7] }'
            :popover="{ placement: 'bottom', visibility: 'click' }"
            class="vc-ico2">
          </v-date-picker>
          <!-- <span class="vc-ico"></span> -->
        </div>
      </div>
      <p class="d-in fl mt5 mg10">차주</p>
      <input type="text" v-model="nextWeekText" readonly>
      <div class="fr">
        <button type="button" title="조회" class="btn" @click="downloadWithCSS">pdf 다운로드</button>
        <button type="button" title="조회" class="btn" @click="excelDownload('table', 'sheet')" id="excelButton">엑셀 다운로드</button>
        <button type="button" title="조회" class="btn btn-blue" @click="searchPlando()">조회</button>
      </div>
    </div>
    <div class="list-plando" ref="content">
      <!-- table list start -->
      <table class="tbl-body" ref="table" frame="hsides" rules="groups">
<!--         <caption>리스트</caption> -->
        <colgroup>
          <col style="width:8%">
          <col style="width:28%">
          <col style="width:8%">
          <col style="width:8%">
          <col style="width:28%">
          <col style="width:8%">
          <col style="width:12%">
        </colgroup>
        <thead>
          <tr>
            <th></th>
            <th colspan="3">금주실적</th>
            <th colspan="3">차주계획</th>
          </tr>
          <tr>
            <th>성명</th>
            <th>실적</th>
            <th>일정</th>
            <th>진행사항</th>
            <th>계획</th>
            <th>일정</th>
            <th>비고</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(memValue, memRow) in memRows" v-bind:key="memRow.id">
            <td v-html="memValue.name"></td>
            <td colspan="3">
              <span class="line t1"></span>
              <span class="line t2"></span>
              <table class="tbl-list">
                <colgroup>
                  <col style="width:63.8%">
                  <col style="width:18.2%">
                  <col style="width:18%">
                </colgroup>
                <tbody v-for="(doValue, doRow) in doRows" v-bind:key="doRow.serial">
                  <tr v-if="memValue.id == doValue.id" style="border-top: 1px solid #EEE !important">
                      <td v-html="doValue.content"></td>
                      <td>{{ doValue.sdate }} ~ {{ doValue.edate }}</td>
                      <td>{{ doValue.proceedNm }}</td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td colspan="3">
              <span class="line t3"></span>
              <span class="line t4"></span>
              <table class="tbl-list t2">
                <colgroup>
                  <col style="width:58.5%">
                  <col style="width:16.5%">
                  <col style="width:25%">
                </colgroup>
                <tbody v-for="(planValue, planRow) in planRows" v-bind:key="planRow.serial">
                  <tr v-if="memValue.id == planValue.id" style="border-top: 1px solid #EEE !important">
                    <td v-html="planValue.content"></td>
                    <td>{{ planValue.sdate }} ~ {{ planValue.edate }}</td>
                    <td v-html="planValue.bigo"></td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- //table list end -->
    </div>
    <div class="tbl-plando-week">
      <!-- 금주 start -->
      <table class="tbl">
        <caption>금주</caption>
        <colgroup>
          <col style="width:16%">
          <col style="width:12%">
          <col style="width:12%">
          <col style="width:12%">
          <col style="width:12%">
          <col style="width:12%">
          <col style="width:12%">
          <col style="width:14%">
        </colgroup>
        <thead>
          <tr>
            <th>근태보고<br>(금주)</th>
            <th class="bg-gray">일</th>
            <th>월</th>
            <th>화</th>
            <th>수</th>
            <th>목</th>
            <th>금</th>
            <th class="bg-gray">토</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in thisWeekAtt" v-bind:key="i">
            <th>{{ item.name }}</th>
            <td class="bg-gray"></td>
            <td v-if="attendance.includes(item.mon)" style="color:black">{{ item.mon }}</td><td v-else style="color:red">{{ item.mon }}</td>
            <td v-if="attendance.includes(item.tue)" style="color:black">{{ item.tue }}</td><td v-else style="color:red">{{ item.tue }}</td>
            <td v-if="attendance.includes(item.wed)" style="color:black">{{ item.wed }}</td><td v-else style="color:red">{{ item.wed }}</td>
            <td v-if="attendance.includes(item.thur)" style="color:black">{{ item.thur }}</td><td v-else style="color:red">{{ item.thur }}</td>
            <td v-if="attendance.includes(item.fri)" style="color:black">{{ item.fri }}</td><td v-else style="color:red">{{ item.fri }}</td>
            <td class="bg-gray"></td>
          </tr>
        </tbody>
      </table>
      <!-- 금주 end -->

      <!-- 차주 start -->
      <table class="tbl">
        <caption>차주</caption>
        <colgroup>
          <col style="width:16%">
          <col style="width:12%">
          <col style="width:12%">
          <col style="width:12%">
          <col style="width:12%">
          <col style="width:12%">
          <col style="width:12%">
          <col style="width:14%">
        </colgroup>
        <thead>
          <tr>
            <th>근태보고<br>(차주)</th>
            <th class="bg-gray">일</th>
            <th>월</th>
            <th>화</th>
            <th>수</th>
            <th>목</th>
            <th>금</th>
            <th class="bg-gray">토</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in nextWeekAtt" v-bind:key="i">
            <th>{{ item.name }}</th>
            <td class="bg-gray"></td>
            <td v-if="attendance.includes(item.mon)" style="color:black">{{ item.mon }}</td><td v-else style="color:red">{{ item.mon }}</td>
            <td v-if="attendance.includes(item.tue)" style="color:black">{{ item.tue }}</td><td v-else style="color:red">{{ item.tue }}</td>
            <td v-if="attendance.includes(item.wed)" style="color:black">{{ item.wed }}</td><td v-else style="color:red">{{ item.wed }}</td>
            <td v-if="attendance.includes(item.thur)" style="color:black">{{ item.thur }}</td><td v-else style="color:red">{{ item.thur }}</td>
            <td v-if="attendance.includes(item.fri)" style="color:black">{{ item.fri }}</td><td v-else style="color:red">{{ item.fri }}</td>
            <td class="bg-gray"></td>
          </tr>
        </tbody>
      </table>
      <!-- 금주 end -->
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import GroupCode from '../../mixins/GroupCode.js'
import html2canvas from 'html2canvas'
import JSPDF from 'jspdf'
// import XLSX from 'xlsx'

export default {
  name: 'DeptPlando',
  data () {
    return {
      departments: [], // 부서 정보 select option
      myDeptCode: '', // 내 부서 코드
      thisWeek: { }, // 금주 날짜(시작일~종료일)
      nextWeekText: '', // 차주 날짜 text
      memRows: [], // 부서원 리스트
      doRows: [], // 금주 실적 리스트
      planRows: [], // 차주 계획 리스트
      thisWeekAtt: [],
      nextWeekAtt: [],
      attendance: ['출근', '출장', '외근'],
      uri: 'data:application/vnd.ms-excel;base64,',
      template: '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
      base64: function (s) { return window.btoa(unescape(encodeURIComponent(s))) },
      format: function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p] }) }
    }
  },
  created: function () {
    this.settingDate(new Date()) // 날짜 세팅
    // this.searchPlando()
    this.getMyDepartmentCode() // 내 부서 코드 가져오기
    this.getDepartmentInfo() // 부서 정보 가져오기
  },
  watch: {
    /* 금주의 시작일 변경을 감지
    금주 날짜 선택 시, 사용자가 시작일을 어떤 요일로 선택하든 무조건 월요일이 시작일이 되도록 세팅 */
    'thisWeek.start': function () {
      if (this.thisWeek.start.getDay() !== 1) {
        // this.thisWeek.start = new Date(new Date().setDate(this.thisWeek.start.getDate() - (this.thisWeek.start.getDay() - 1)))
        this.thisWeek.start.setDate(this.thisWeek.start.getDate() - (this.thisWeek.start.getDay() - 1))
      }
      this.thisWeek.start.setHours(12)
      var date = this.calculationDate(this.thisWeek.start)
      this.thisWeek.end = date.wkEnd
      this.nextWeekText = date.nwStartText + ' - ' + date.nwEndText
    }
  },
  methods: {
    /* 날짜 계산 함수 */
    calculationDate: function (anchorDate) {
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
    /* 내 부서 코드 가져오기 */
    getMyDepartmentCode: function () {
      axios.get('/api/getMyDepartmentCode', {
        params: { grcode: GroupCode.DEPARTMENT }
      })
        .then(response => {
          if (response.status === 200) {
            this.myDeptCode = response.data.data.scode
            // 동기 처리 (부서 코드를 가져온 뒤, 실적을 조회해야함)
            this.$nextTick(function () {
              this.searchPlando()
            })
          }
        }).catch((error) => {
          console.log(error)
        }).finally(() => {
        })
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
    /* 업무실적 조회 */
    searchPlando: function () {
      this.getDepartmentMember(this.thisWeek) // 부서원 정보 가져오기
      this.$nextTick(function () {
        this.getPlandoList(this.thisWeek) // 부서원별 업무실적 가져오기
        this.getThisWeekPlan(this.thisWeek, this.myDeptCode) // 금주 근태보고 가져오기
        this.getNextWeekPlan(this.thisWeek, this.myDeptCode) // 차주 근태보고 가져오기
      })
    },
    /* 선택한 부서의 부서원 id 가져오기 */
    getDepartmentMember: function (sDate) {
      sDate = this.dateToString(sDate.start)
      axios.get('/api/getDepartmentMember', {
        params: { scode: this.myDeptCode, sDate: sDate }
      })
        .then(response => {
          if (response.status === 200) {
            // this.memRows.splice(0)
            // for (const value of response.data.data) {
            //   this.memRows.push(value)
            // }
            this.memRows = response.data.data
          }
        }).catch((error) => {
          console.log(error)
        }).finally(() => {
        })
    },
    /* 업무실적 조회 */
    getPlandoList: function (sDate) {
      sDate = this.dateToString(sDate.start)
      axios.get('/api/getDepartmentMemberPlando', {
        params: { sDate: sDate, grcode: GroupCode.STATE, scode: this.myDeptCode }
      })
        .then(response => {
          if (response.status === 200) {
            // 모든 행을 지우고 다시 push
            this.doRows.splice(0)
            this.planRows.splice(0)
            // 금주실적과 차주계획을 각각 저장
            const doData = response.data.data.filter(function (el) {
              return el.gubun === '1'
            })
            const planData = response.data.data.filter(function (el) {
              return el.gubun === '2'
            })
            for (const value of response.data.data) {
              if (value.content) {
                value.content = value.content.replace(/ /g, '&nbsp;') // 띄어쓰기 처리
                value.content = value.content.replace(/</g, '&lt;').replace(/>/g, '&gt;') // < , > 처리
                value.content = value.content.replace(/(?:\r\n|\r|\n)/g, '<br>') // 줄바꿈 처리
              }

              if (value.bigo) {
                value.bigo = value.bigo.replace(/ /g, '&nbsp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/(?:\r\n|\r|\n)/g, '<br>') // 줄바꿈 처리
              }
            }
            // this.doRows = doData
            // this.planRows = planData
            this.doRows.push(...doData)
            this.planRows.push(...planData)
          }
        }).catch((error) => {
          console.log(error)
        }).finally((response) => {
        })
    },
    onChange: function (event) {
      // console.log(event.target.value)
    },
    /* 금주 근태보고 */
    getThisWeekPlan: function (sDate, myDeptCode) {
      sDate = this.dateToString(sDate.start)
      axios.get('/api/thisWeekPlando', {
        params: { grcode: GroupCode.VACATION, sDate: sDate, scode: myDeptCode }
      })
        .then(res => {
          this.thisWeekAtt = res.data.data
        })
        .catch((ex) => {
          console.log('Error!!!! : ' + ex)
        })
    },
    /* 차주 근태보고 */
    getNextWeekPlan: function (sDate, myDeptCode) {
      sDate = this.dateToString(sDate.start)
      axios.get('/api/nextWeekPlando', {
        params: { grcode: GroupCode.VACATION, sDate: sDate, scode: myDeptCode }
      })
        .then(res => {
          this.nextWeekAtt = res.data.data
        })
        .catch((ex) => {
          console.log('Error!!!! : ' + ex)
        })
    },
    excelDownload: function (table, name) {
      if (!table.nodeType) table = this.$refs.table
      // console.log(table)
      var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
      window.location.href = this.uri + this.base64(this.format(this.template, ctx))
      // document.getElementById('excelButton').download = 'abcde'
      // document.getElementById('excelButton').href = this.uri + this.base64(this.format(this.template, ctx))
      // document.getElementById('excelButton').click()
    },
    downloadWithCSS () {
      const doc = new JSPDF('', 'mm', 'a4')
      var position = 1
      var canvasElement = document.createElement('canvas', 1.0)
      const sDate = this.dateToString(this.thisWeek.start)
      const eDate = this.dateToString(this.thisWeek.end)
      html2canvas(this.$refs.content, { canvas: canvasElement }).then(function (canvas) {
        const img = canvas.toDataURL('image/png')
        var margin = 1
        var imgWidth = 210 - 2 * margin // 이미지 가로 길이(mm) A4 기준
        var pageHeight = imgWidth * 1.45 // 출력 페이지 세로 길이 계산 A4 기준
        var imgHeight = canvas.height * imgWidth / canvas.width
        var heightLeft = imgHeight
        doc.addImage(img, 'PNG', margin, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
        // 한 페이지 이상일 경우 루프 돌면서 출력
        while (heightLeft >= 1) {
          position = heightLeft - imgHeight
          doc.addPage()
          doc.addImage(img, 'PNG', margin, position, imgWidth, imgHeight)
          heightLeft -= pageHeight
        }
        doc.save(sDate + ' - ' + eDate + '.pdf')
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
