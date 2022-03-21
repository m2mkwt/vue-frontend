<template>
  <div>
    <!-- 차주계획 start -->
      <table class="tbl mt30">
        <caption>리스트</caption>
        <colgroup>
          <col style="width:50%">
          <col style="width:15%">
          <col style="width:15%">
          <col style="width:10%">
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
            <th>계획</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr>
          </tr>
          <tr v-for="(plan, planRow) in planRows" v-bind:key="plan.serial">
            <td class="t-left">
              <textarea id="ta2" name="ta2" rows="3"></textarea>
            </td>
            <td>
              <!-- calendar start -->
              <div class="vcal-area">
                <v-date-picker
                  v-model='cData22'
                  :disabled-dates='{ weekdays: [1, 7] }'
                  :popover="{ placement: 'bottom', visibility: 'click' }"
                  :masks="{ input: 'MM/DD'}">
                </v-date-picker>
                <span class="vc-ico"></span>
              </div>
              <!-- //calendar end -->
            </td>
            <td>
              <!-- calendar start -->
              <div class="vcal-area">
                <v-date-picker
                  v-model='cData23'
                  :disabled-dates='{ weekdays: [1, 7] }'
                  :popover="{ placement: 'bottom', visibility: 'click' }"
                  :masks="{ input: 'MM/DD'}">
                </v-date-picker>
                <span class="vc-ico"></span>
              </div>
              <!-- //calendar end -->
            </td>
            <td>
              <label for="s2" class="blind">진행사항</label>
              <select id="s2" title="select" v-model="plan.proceed">
                <option v-for="proceed in proceeds" v-bind:key="proceed.scode" v-bind:value="proceed.scode">{{ proceed.scodeNm }}</option>
              </select>
            </td>
            <td><button type="button" title="결재상신" class="btn btn-black" @click="removeRow(planRows, planRow)">삭제</button></td>
          </tr>
        </tbody>
      </table>
      <!-- //차주계획 end -->
  </div>
</template>

<script>

import { getCommonCode } from '../../mixins/getCode.js'
import axios from 'axios'

export default {
  name: 'MyPlanRegi',
  data () {
    return {
      dragValue: null,
      proceeds: [], // 진행사항 옵션
      planRows: [{ serial: 1, gubun: '1', content: '', sdate: new Date(), edate: new Date(), proceed: '3' }],
      code: 'A006',
      test: '',
      cData5: new Date(),
      cData6: new Date(),
      cData20: new Date(),
      cData21: new Date(),
      cData22: new Date(),
      cData23: new Date()
    }
  },
  created: function () {
    this.getCode(this.code)
    console.log(this.codeData)
    this.getCodeData(this.code)
    // console.log(abc)

    // console.log(this.codeData)
    // console.log(this.getCode(this.code))
  },
  methods: {
    // @TODO 믹스인으로 빼기
    getCodeData: function (groupCode) {
      console.log(groupCode)
      axios.get('/selectCode', {
        params: { groupCode: groupCode }
      })
        .then(res => {
          if (res.status === 200) {
            // DB에서 진행사항 항목을 불러와서 push
            this.proceeds.push(...res.data.data)
          }
        })
    }
  },
  mixins: [getCommonCode]
}
</script>

<style>
</style>
