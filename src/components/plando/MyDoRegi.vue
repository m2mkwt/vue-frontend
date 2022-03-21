<template>
  <div>
    <!-- 금주실적 start -->
      <table class="tbl">
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
          <tr v-for="(todo, todoRow) in todoRows" v-bind:key="todo.serial">
            <td class="t-left">
              <textarea id="ta1" name="ta1" rows="3"></textarea>
            </td>
            <td>
              <!-- calendar start -->
              <div class="vcal-area">
                <v-date-picker
                  v-model='cData20'
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
                  v-model='cData21'
                  :disabled-dates='{ weekdays: [1, 7] }'
                  :popover="{ placement: 'bottom', visibility: 'click' }"
                  :masks="{ input: 'MM/DD'}">
                </v-date-picker>
                <span class="vc-ico"></span>
              </div>
              <!-- //calendar end -->
            </td>
            <td>
              <label for="s1" class="blind">진행사항</label>
              <select id="s2" title="select" v-model="todo.proceed">
                <option v-for="proceed in proceeds" v-bind:key="proceed.scode" v-bind:value="proceed.scode">{{ proceed.scodeNm }}</option>
              </select>
            </td>
            <td><button type="button" title="결재상신" class="btn btn-black" @click="removeRow(todoRows, todoRow)">삭제</button></td>
          </tr>
        </tbody>
      </table>
      <!-- //금주실적 end -->
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'MyDoRegi',
  data () {
    return {
      dragValue: null,
      todoRows: [{ serial: 1, gubun: '1', content: '', sdate: new Date(), edate: new Date(), proceed: '3' }],
      proceeds: [],
      cData5: new Date(),
      cData6: new Date(),
      cData20: new Date(),
      cData21: new Date(),
      cData22: new Date(),
      cData23: new Date(),
      code: 'A006'
    }
  },
  created: function () {
    this.getCodeData(this.code)
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
  }
}
</script>

<style>
</style>
