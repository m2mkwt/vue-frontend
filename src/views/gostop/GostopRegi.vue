<template>
  <div class="conts-area">
    <div class="conts-tit">
      <h2>근태 등록</h2>
    </div>
    <div class="list-top-area">
      <div class="t-right">
        <button type="button" title="저장" class="btn btn-blue" v-on:click="tmpSave">임시저장</button>
        <button type="button" title="결재상신" class="btn btn-black" @click="reqApprove">결재상신</button>
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
            <th>일자</th>
            <td class="t-left">
              <div class="fl wp30">
                <!-- START calendar start -->
                <div class="vcal-area">
                  <v-date-picker
                    v-model='sDate'
                    :disabled-dates="{ weekdays: [1, 7] }"
                    :popover="{ placement: 'bottom', visibility: 'click' }"
                    :min-date='new Date()'
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
      sel_vCode: '',
      textarea: '',
      holidays: [
      ],
      tmpDate: ''
    }
  },
  methods: {
    /* 시작일 변경시 액션 */
    changeDate: function () {
      console.log('change eDate with sDate')
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
          console.log('result', result.data)
          this.vCode = result.data.data
          this.sel_vCode = result.data.data[0].scode
        }).catch((error) => {
          console.log('error', error)
        })
    },
    /* 휴일 리스트 */
    loadHoliday: function () {
      var tmpHolidayDates = []
      axios.get('/api/vacation/selectHoliday')
        .then((result) => {
          // filter 로 기능 변경 가능한지 알아보고 변경해보자!
          tmpHolidayDates = JSON.parse(JSON.stringify(result.data.data))
          for (var i = 0; i < tmpHolidayDates.length; i++) {
            this.holidays.push(tmpHolidayDates[i].ymd)
            // 기본세팅된 내일 날짜(tomorrow)가 holiday라면 다음날로
            if (moment(this.sDate).format('yyyyMMDD') === tmpHolidayDates[i].ymd) {
              this.sDate = moment(tmpHolidayDates[i].ymd).add(1, 'days')._d
            }
          }
        }).catch((error) => {
          console.log('error', error)
        })
    },
    /* 시작일, 종료일 공란판정 */
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
          }).catch((error) => {
            console.log('error', error)
          })
      }
    },
    /* 결재상신 */
    reqApprove: function () {
      if (this.emptyTest() === false) {
        alert('공란이 존재합니다! 모든 입력값을 채워주세요')
      } else {
        var sd = moment(this.sDate).format('yyyyMMDD')
        var ed = moment(this.eDate).format('yyyyMMDD')
        axios.post('/api/vacation/reqApprove', {
          s_date: sd,
          e_date: ed,
          v_code: this.sel_vCode,
          v_reason: this.textarea
        })
          .then((result) => {
            alert(result.data.message)
            this.textarea = ''
          }).catch((error) => {
            console.log('error', error)
          })
      }
    }
  },
  mounted () {
    /* 페이지 로드시 기본작동 메소드 */
    this.loadvCode()
    this.loadHoliday()
  }
}
</script>

<style>
</style>
