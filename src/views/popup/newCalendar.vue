<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" v-if="visible" @click.self="$emit('close')">
      <div class="window content">
        <div class="conts-tit h2">
          <!-- table detail start -->
          <table>
            <caption>디테일 테이블</caption>
            <colgroup>
              <col style="width:100%">
            </colgroup>
            <thead>
              <tr>
                <th>캘린더 생성</th>
              </tr>
            </thead>
            <br/>
            <tbody>
              <tr>
                <th>
                  <label for="getNewYear">생성할 년도</label>
                  <select v-model="selectYears" id="getNewYear">
                    <option v-for="Y in endYear-nowYear" v-bind:key="Y">{{nowYear}}{{Y+nowYear-1}}</option>
                  </select>
                </th>
              </tr>
            </tbody>
          </table>
          <!-- table detail end -->
        </div>
        <footer style="text-align: center;">
          <slot name="footer">
            <button class="btn btn-blue btn-area" @click="$emit('update:visible', !visible)">닫기</button>
            <button class="btn btn-blue btn-area" @click="save()">생성</button>
          </slot>
        </footer>
      </div>
    </div>
  </transition>
</template>
<script>
import axios from 'axios'
export default {
  name: 'HolidayRegi',
  props: {
    visible: {
      type: Boolean,
      require: true,
      default: false
    }
  },
  title: {
    type: String,
    require: false
  },
  data () {
    const sYear = new Date().getFullYear()
    return {
      nowYear: parseInt(sYear.toString().substring(0, 2)),
      startYear: parseInt(sYear.toString().substring(2, 4)),
      endYear: parseInt((sYear + 10).toString().substring(2, 4)),
      selectYears: sYear
    }
  },
  methods: {
    close () {
      this.$emit('update:visible', false)
    },
    save: function () {
      var chk = ''
      this.selectedYear = document.getElementById('getNewYear').value
      axios.get('/api/calendar/selectCalYearsCnt',
        { params: { mYears: this.selectYears } })
        .then(res => {
          chk = res.data.data
          console.log(res.data.data)
          if (chk > 0) {
            if (confirm('기존의 ' + this.selectYears + ' 캘린더 정보가 사라집니다, 생성 하시겠습니까?')) {
              axios.get('/api/calendar/saveCalYearsList',
                { params: { mYears: this.selectYears, chk: chk } })
                .then(res => {
                  alert(this.selectYears + ' 캘린더 생성완료!!')
                  this.registFixedHoliday()// add fixed holiday
                })
                .catch((ex) => {
                  console.log('saveCalYearsListError!!! : ' + ex)
                  alert(res.data.data)
                })
            }
          } else {
            axios.get('/api/calendar/saveCalYearsList',
              { params: { mYears: this.selectYears, chk: chk } })
              .then(res => {
                alert(this.selectYears + ' 캘린더 생성완료!!')
                this.registFixedHoliday()// add fixed holiday
              })
              .catch((ex) => {
                console.log('saveCalYearsListError!!!! : ' + ex)
                alert(res.data.data)
              })
          }
        })
        .catch((ex) => {
          console.log('chkCalYearsListError!!!! : ' + ex)
        })
      this.$emit('update:visible', false)
    },
    registFixedHoliday: function () { /* 캘린더 생성 후, 고정된 휴일 값을 자동으로 추가 */
      axios
        .get('/api/calendar/registFixedHoliday',
          { params: { mYears: this.selectYears } })
        .then(res => {
          console.log('고정된 휴일 추가!!')
        }).catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>
<style>
.modal-overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    z-index: 30;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
}
.window {
    background: #fff;
    border-radius: 2px;
    height: 50%;
}
.content {
    padding: 10px 20px;
    height: 150px !important;
    width: 250px;
}
</style>
