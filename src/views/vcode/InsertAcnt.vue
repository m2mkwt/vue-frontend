<template>
<div class="conts-area">
    <div class="conts-tit">
    <h2>연도별 휴가 일수 등록</h2>
    </div>
    <div class="list-top-area">
        <label for="s1">년도</label>
        <select id="s1" title="select"  v-model="sel_searchYear" @change="loadDayOffList()">
            <option v-for="Y in callYears" v-bind:key="Y.year" v-bind:value="Y">{{Y}}</option>
        </select>
    <button  type="button" title="저장" class="fr btn btn-blue" v-on:click="insertAcnt()">저장</button>
    </div>
    <div class="tbl-area">
    <!-- table detail start -->
    <table class="tbl tb-detail" id="tableId">
        <caption>디테일 테이블</caption>
        <colgroup>
        <col style="width:20%">
        <col style="width:30%">
        <col style="width:50%">
        </colgroup>
        <thead>
        <tr>
            <th> <input type="checkbox" id="editChkAll" name="editChkAll" true-value="Y" false-value="N" v-on:click="clkRow('All')"> </th>
            <th>성명</th>
            <th>발생일수</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(v, i) in dayOffList" v-bind:key="v.id" v-bind:value="v.name">
            <td v-if="isHidden[i]" hidden>
              <input type="text" v-bind:value="v.id" name="id">
            </td>
            <!-- 체크박스 -->
            <td>
                <input type="checkbox" id="editChk" name="editChk" true-value="Y" false-value="N" v-on:click="clkRow(i)" >
            </td>
            <!-- 사원명 -->
            <td  v-if="!isHidden[i]" name="name">
                {{ v.name }}</td>
            <td v-if="isHidden[i]" name="name">
                {{ v.name }}
            </td>
            <!-- 연차 수-->
            <td  v-if="!isHidden[i]">
                {{ v.acnt }}
            </td>
            <td  v-if="isHidden[i]">
                <input type="text" name="acnt" v-bind:placeholder="v.acnt" onKeyup="this.value=this.value.replace(/[^0-9]/g,'')" >
            </td>

        </tr>
        </tbody>
    </table>
    <!-- table detail end -->
    </div>
</div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'DeptPlando',
  data () {
    return {
      selectedYear: '',
      callYears: [],
      checked: false,
      isHidden: [],
      poJson: [],
      searchYear: [],
      sel_searchYear: moment(new Date()).format('yyyy'),
      visible: false,
      tempData: {
        userId: '',
        userName: '',
        selYear: ''
      },
      dayOffList: {
        eachMember: {
          id: '',
          name: '',
          acnt: '',
          sumMinusDayoff: ''
        }
      }
    }
  },
  mounted: function () {
    this.getCalendarYear()
  },
  methods: {
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
            this.sel_searchYear = this.callYears[0]
          }
        }).catch(() => {
          // console.log(error)
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
    },
    // 클릭시 인풋박스로 바뀜
    clkRow: function (i) {
      const editChk = document.getElementsByName('editChk')
      const editChkAll = document.getElementsByName('editChkAll')
      var name = document.getElementsByName('name')
      if (i === 'All') {
        for (let lgh = 0; lgh < name.length; lgh++) {
          this.$set(this.isHidden, lgh, editChkAll[0].checked)
          editChk[lgh].checked = editChkAll[0].checked
        }
      } else {
        this.$set(this.isHidden, i, !this.isHidden[i])
      }
    },
    /* 연차 발생 저장 */
    insertAcnt: function () {
      // console.log('sel_searchYear :: ', this.sel_searchYear)
      var inputAcnt = document.getElementsByName('acnt')
      var inputId = document.getElementsByName('id')
      // console.log('inputAcnt :: ', inputAcnt)
      // console.log('inputAcnt[i].value :: ', inputAcnt[0].value)
      for (var i = 0; i < inputAcnt.length; i++) {
        // console.log('inputId[i].value :: ', inputId[i].value)
        // console.log('inputAcnt[i].value :: ', inputAcnt[i].value)
        var insertAcntList = {
        //   id: this.dayOffList[i].id,
          id: inputId[i].value,
          year: this.sel_searchYear,
          a_cnt: inputAcnt[i].value
        }
        this.poJson.push(insertAcntList)
      }
      axios.post('/api/deptMember/insertAcnt', this.poJson)
        .then((result) => {
          // console.log('selectAllMembersDayOffList result : ', result.data.data)
          this.dayOffList = result.data.data
          window.location.reload()
        }).catch(() => {
          // console.log('error', error)
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
    },
    /* 해당 년도에 근무하는 직원 리스트 */
    loadDayOffList: function () {
      var month = new Date().getMonth() + 1
      axios.post('/api/vacation/selectAllMembersDayOffList', {
        gdate: this.sel_searchYear - 1,
        month: month
      })
        .then((result) => {
          // console.log('selectAllMembersDayOffList result : ', result.data.data)
          this.dayOffList = result.data.data
        }).catch(() => {
          // console.log('error', error)
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
    },
    /* 조회 연도 */
    loadAllYear: function () {
      axios.get('/api/vacation/selectGuntaeYear')
        .then((result) => {
          this.searchYear = result.data.data
          this.loadDayOffList()
        }).catch(() => {
          // console.log('error', error)
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
    }
  },
  created () {
    // 페이지 로드시 기본작동 메소드
    this.loadAllYear()
  }
}
</script>

<style>
</style>
