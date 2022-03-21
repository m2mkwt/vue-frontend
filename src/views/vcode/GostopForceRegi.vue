<template>
  <div class="conts-area">
    <div class="conts-tit">
      <h2>근태 등록</h2>
    </div>
    <div class="list-top-area">
      <div class="t-right">
        <!-- <button type="button" title="저장" class="btn btn-blue" v-on:click="tmpSave">임시저장</button> -->
        <button type="button" title="결재상신" class="btn btn-black" @click="insertForceApprove()">강제등록</button>
      </div>
    </div>
    <div class="tbl-area">
      <table class="tbl tb-detail">
        <caption>디테일 테이블</caption>
        <colgroup>
          <col style="width:30%">
          <col style="width:70%">
        </colgroup>
        <tbody>
          <tr>
            <th>부서</th>
            <td class="t-left">
              <select id="dept" title="select" class="wp30" v-model="sel_dept" v-on:change="loadWorker()">
                <option v-for="v in allDept" v-bind:key="v.scode" v-bind:value="v.scode">{{ v.scodeNm }}</option>
              </select>
            </td>
          </tr>
          <tr>
            <th>근로자</th>
            <td class="t-left">
              <select id="worker" title="select" class="wp30" v-model="sel_worker">
                <option v-for="v in workerForDept" v-bind:key="v.id" v-bind:value="v.id">{{ v.name }}</option>
              </select>
            </td>
          </tr>
          <tr>
            <th>일자</th>
            <td class="t-left">
              <div class="fl wp30">
                <!-- START calendar start -->
                <div class="vcal-area">
                  <v-date-picker
                    v-model='sDate'
                    :disabled-dates="{ weekdays: [1, 7] }"
                    :popover="{ placement: 'bottom', visibility: 'click' }"
                    @input='changeDate'>
                  </v-date-picker>
                </div>
                <!-- START calendar end -->
              </div>
              <span class="s-h fl">-</span>
              <div class="fl wp30">
                <!-- END calendar start -->
                <div class="vcal-area">
                  <v-date-picker
                    v-model='eDate'
                    :disabled-dates="{ weekdays: [1, 7] }"
                    :popover="{ placement: 'bottom', visibility: 'click' }"
                    :min-date="sDate">
                  </v-date-picker>
                </div>
                <!-- END calendar end -->
              </div>
            </td>
          </tr>
          <tr>
            <th>근태 종류</th>
            <td class="t-left">
              <label for="s3" class="blind">근태종류</label>
              <select id="s3" title="select" class="wp30" v-model="sel_vCode">
                <option v-for="v in vCode" v-bind:key="v.scode" v-bind:value="v.scode">{{ v.scodeNm }}</option>
              </select>
            </td>
          </tr>
          <tr>
            <th>근태 사유</th>
            <td><textarea id="ta2" name="ta2" v-model="textarea" placeholder="신청 사유 자세히 작성 바랍니다 ex) 개인 사정"></textarea></td>
          </tr>
        </tbody>
      </table>

    </div>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
  name: 'DeptPlando',
  data () {
    const now = new Date()
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    return {
      sDate: tomorrow,
      eDate: tomorrow,
      vCode: [],
      allDept: {
        sCode: '',
        scodeNm: ''
      },
      workerForDept: {
        id: '',
        name: ''
      },
      sel_vCode: '',
      sel_dept: '',
      sel_worker: '',
      textarea: '',
      holidays: [
      ],
      tmpDate: ''
    }
  },
  methods: {
    /* 시작일 변경시 액션 */
    changeDate: function () {
      // console.log('change eDate with sDate')
      // 선택한 해당일이 holiday라면, 직전 평일로 날짜 세팅
      for (var i = 0; i < this.holidays.length; i++) {
        if (this.holidays[i] === moment(this.sDate).format('yyyyMMDD')) {
          for (var j = (i - 1); j >= 0; j--) {
            this.sDate = moment(this.sDate).add(-1, 'days')._d
            if (this.holidays[j] !== moment(this.sDate).format('yyyyMMDD')) {
              break
            }
          }
          alert('휴일은 선택할 수 없습니다!')
          break
        }
      }
      this.eDate = this.sDate
    },
    /* 근태 종류 */
    loadvCode: function () {
      axios.get('/api/vacation/selectScodeA005')
        .then((result) => {
          // console.log('result', result.data)
          this.vCode = result.data.data
          this.sel_vCode = result.data.data[0].scode
        }).catch(() => {
          // console.log('error', error)
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
    },
    /* 부서 목록 */
    loadDept: function () {
      axios.get('/api/vacation/selectAllDept')
        .then((result) => {
          // console.log('dept result', result.data)
          this.allDept = result.data.data
          this.sel_dept = result.data.data[0].scode
          this.loadWorker()
        }).catch(() => {
          // console.log('error', error)
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
    },
    /* 부서별 사원목록 */
    loadWorker: function () {
      // console.log('부서 변경됐다!!!!!!')
      // console.log('선택한 부서 == ' + this.sel_dept)
      axios.post('/api/vacation/selectWorkerForDept', {
        dept: this.sel_dept
      })
        .then((result) => {
          // console.log('부서변경 result', result.data.data)
          this.workerForDept = result.data.data
          this.sel_worker = result.data.data[0].id
        }).catch(() => {
          // console.log('error', error)
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
    },
    /* 휴일 리스트 */
    loadHoliday: function () {
      var tmpHolidayDates = []
      axios.get('/api/vacation/selectHoliday')
        .then((result) => {
          tmpHolidayDates = JSON.parse(JSON.stringify(result.data.data))
          for (var i = 0; i < tmpHolidayDates.length; i++) {
            this.holidays.push(tmpHolidayDates[i].ymd)
            // 기본세팅된 내일 날짜(tomorrow)가 holiday라면 다음날로
            if (moment(this.sDate).format('yyyyMMDD') === tmpHolidayDates[i].ymd) {
              this.sDate = moment(tmpHolidayDates[i].ymd).add(1, 'days')._d
            }
          }
        }).catch(() => {
          // console.log('error', error)
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
    },
    /* 시작일, 종료일, 근태사유 공란판정 */
    emptyTest: function () {
      if (this.sDate === null || this.eDate === null || this.textarea.length === 0) {
        return false
      }
    },
    /* 임시저장 */
    tmpSave: function () {
      if (this.emptyTest() === false) {
        alert('공란이 존재합니다! 모든 입력값을 채워주세요')
      } else {
        var sd = moment(this.sDate).format('yyyyMMDD')
        var ed = moment(this.eDate).format('yyyyMMDD')
        axios.post('/api/vacation/insertTmpSave', {
          s_date: sd,
          e_date: ed,
          v_code: this.sel_vCode,
          v_reason: this.textarea
        })
          .then((result) => {
            alert(result.data.message)
            this.textarea = ''
          }).catch(() => {
            // console.log('error', error)
            alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
          })
      }
    },
    /* 근태 강제등록 */
    insertForceApprove: function () {
      if (this.emptyTest() === false) {
        alert('공란이 존재합니다! 모든 입력값을 채워주세요')
      } else {
        var sd = moment(this.sDate).format('yyyyMMDD')
        var ed = moment(this.eDate).format('yyyyMMDD')
        // console.log('강제등록 data == 1. dept : ' + this.sel_dept + ', 2. id : ' + this.sel_worker + ', 3. sDate : ' + sd + ', 4. eDate : ' + ed + ', 5. reason : ' + this.textarea)
        axios.post('/api/vacation/insertForceApprove', {
          id: this.sel_worker,
          s_date: sd,
          e_date: ed,
          v_code: this.sel_vCode,
          v_reason: this.textarea
        })
          .then((result) => {
            alert(result.data.message)
            this.textarea = ''
          }).catch(() => {
            // console.log('error', error)
            alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
          })
      }
    }
  },
  mounted () {
    /* 페이지 로드시 기본작동 메소드 */
    this.loadvCode()
    this.loadHoliday()
    this.loadDept()
  }
}
</script>

<style>
</style>
