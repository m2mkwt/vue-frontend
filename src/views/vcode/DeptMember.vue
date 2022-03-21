<template>
  <div class="conts-area">
    <div class="conts-tit">
      <h2>부서별 부서원 조회</h2>
    </div>
    <div class="list-top-area">
      <div class="d-ib fl">
        <label for="s1">부서명</label>
        <select id="s1" title="select" v-model="scode" v-on:change="selectDeptMemList()">
          <option v-for="value in dept" v-bind:key="value.scode" v-bind:value="value.scode">{{ value.scodeNm }}</option>
        </select>
      </div>
      <div class="t-right">
        <button type="button" title="추가" class="btn btn-gray" v-if="colHidden" v-on:click="updateMem()">수정</button>
        <button type="button" title="저장" class="btn btn-blue" v-on:click="openModal()">부서원등록</button>
      </div>
    </div>
    <div class="tbl-area">
      <!-- table list start -->
      <table class="tbl" style="table-layout: auto;">
        <caption>list 테이블</caption>
        <colgroup>
          <col style="width:3%">
          <col style="width:3%">
          <col style="width:8%">
          <col style="width:10%">
          <col style="width:8%">
          <col style="width:5%">
          <col style="width:12%">
          <col style="width:12%">
          <col style="width:5%">
          <col style="width:10%">
          <col style="width:5%">
        </colgroup>
        <thead>
          <tr>
            <th>No</th>
            <th> <input type="checkbox" id="editChkAll" name="editChkAll" true-value="Y" false-value="N" v-on:click="clkRow('All')"> </th>
            <th>성명</th>
            <th>부서명</th>
            <th>직급</th>
            <th>부서장</th>
            <th>입사일</th>
            <th v-show="colHidden">퇴사일</th>
            <th v-show="colHidden">퇴사여부</th>
            <th v-show="colHidden">이메일</th>
            <th hidden>아이디</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(value, i) in deptMemList" v-bind:key="value.id" v-bind:value="value.scode" >
            <td>{{ i + 1 }}</td>
            <td>
              <input type="checkbox" id="editChk" name="editChk" true-value="Y" false-value="N" v-on:change="clkRow(i)" >
            </td>
            <td v-if="!isHidden[i]" >{{ value.name }}</td>
            <td v-if="isHidden[i]" > <input type="text" name="nameInput" v-bind:value="value.name"> </td>
            <td v-if="!isHidden[i]" >{{ value.scodeNm }}</td>
            <td v-if="isHidden[i]">
              <select  v-model="sScode[i]" name="scodeSelect" v-on:change="ifChecked(i, value.scode)">
                <option v-for="value2 in dept" v-bind:key="value2.id" v-bind:value="value2.scode" selected="selected"> {{ value2.scodeNm }} </option>
              </select>
            </td>
            <td v-if="!isHidden[i]">{{ value.jikgub }}</td>
            <td v-if="isHidden[i]">
              <select  v-model="sJikgub[i]" name="jikgubSelect" v-on:change="ifChecked(i, value.scode)">
                <option v-for="value3 in jikgub" v-bind:key="value3.id" v-bind:value="value3.scode" > {{ value3.scodeNm }} </option>
              </select>
            </td>
            <td v-if="!isHidden[i]">
              <input type="checkbox" id="chiefYnChk" name="chiefYnChk" disabled v-bind:checked="sChiefYn[i]=='Y'" v-bind:value="sChiefYn[i]" >
            </td>
            <td v-if="isHidden[i]">
              <input type="checkbox" id="chiefYnChk" name="chiefYnChk" class="chiefYnChkVal" v-bind:disabled="isChkDisable[i]" v-bind:checked="sChiefYn[i]=='Y'" true-value="Y" false-value="N" v-on:click="ifChecked(i, value.scode)" v-bind:value="sChiefYn[i]" >
            </td>
            <td v-if="!isHidden[i]">{{ value.sdate }}</td>
            <td v-if="isHidden[i]"> <v-date-picker type="text" name="sdateInput" v-model="sSdate[i]" v-bind:value="value.sdate"></v-date-picker></td>
            <td v-if="!isHidden[i]" v-show="isHidden[i]"> {{ value.retireDt }} </td>
            <td v-if="isHidden[i]"> <v-date-picker type="text" name="retireDtInput" v-model="retireDt[i]" v-bind:value="value.retireDt"></v-date-picker> </td>
            <td v-if="!isHidden[i]" v-show="isHidden[i]"> {{ value.retire }} </td>
            <td v-if="isHidden[i]"> <input type="checkbox" name="retireInput" v-model="retire[i]" v-bind:checked="value.retire=='Y'" true-value="Y" false-value="N" value="value.retire" > </td>
            <td v-if="!isHidden[i]" v-show="isHidden[i]" > {{ value.email }}</td>
            <td v-if="isHidden[i]"> <input type="text" name="emailInput" v-bind:value="value.email"> </td>
            <td v-if="isHidden[i]" hidden> <input type="hidden" id="userId" name="userId" v-bind:value="value.id"> </td>
          </tr>
        </tbody>
      </table>
      <!-- table list end -->
      <!-- popup list start -->
        <memins-modal v-if="modal">
          <div class="regwindow regcontent">
            <div class="conts-tit" style="table-layout:auto">
              <h2 class="t-black">부서원 등록</h2>
            </div>
            <div class="list-top-area">
              <div class="fr">
                <button type="button" title="추가" class="btn btn-blue" v-on:click="addRow(insertLists)">부서원추가</button>
                <button type="button" title="저장" class="btn btn-blue" v-on:click="insertMember()">저장</button>
                <button type="button" title="취소" class="btn btn-gray" v-on:click="closeModal()">취소</button>
              </div>
            </div>
            <div class="tbl-area">
              <!-- table list start -->
              <table class="tbl"  style="table-layout: auto;">
                <caption>list 테이블</caption>
                <colgroup>
                  <col style="width:5%">
                  <col style="width:5%">
                  <col style="width:10%">
                  <col style="width:10%">
                  <col style="width:15%">
                  <col style="width:10%">
                  <col style="width:5%">
                  <col style="width:10%">
                  <col style="width:5%">
                  <col style="width:10%">
                  <col style="width:15%">
                </colgroup>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>성명</th>
                    <th>아이디</th>
                    <th>비밀번호</th>
                    <th>부서명</th>
                    <th>직급</th>
                    <th>부서장</th>
                    <th>입사일</th>
                    <th>이메일</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(insertValue, i) in insertLists" v-bind:key="i.id">
                    <!-- 리스트 -->
                    <!-- NO-->
                    <td v-bind:value="i">{{ i+1 }}</td>
                    <!-- 성명 -->
                    <td>
                      <input type="text" id="text1" name="" v-model.trim="insertValue.name"  style="ime-mode:active" class="wp100">
                    </td>
                    <!-- 아이디 -->
                    <td>
                      <input type="text" id="id" name="id" v-model.trim="insertValue.id" class="wp100" style="ime-mode:disabled" v-on:keyup.enter="checkId(i)" v-on:keydown.tab="checkId(i)" >
                    </td>
                    <!-- 비밀번호 -->
                    <td>
                      <input type="password" id="pw" v-model.trim="insertValue.pw" class="wp100">
                    </td>
                    <!-- 부서명 -->
                    <td>
                      <label for="s1" class="blind">부서명</label>
                      <select id="s1" name="s1" title="select" class="wp100" v-model="insertValue.scode" v-on:click="regChiefChk(i)">
                        <option v-for="dep in dept" v-bind:key="dep.scode" v-bind:value="dep.scode"> {{ dep.scodeNm }} </option>
                      </select>
                    </td>
                    <!-- 직급 -->
                    <td>
                      <label for="s2" class="blind">직급</label>
                      <select id="s2" title="select" class="wp100" v-model="insertValue.jikgub" name="regJikgubSelect" v-on:click="regChiefChk(i)">
                        <option v-for="jik in jikgub" v-bind:key="jik.scode" v-bind:value="jik.scode">{{ jik.scodeNm }}</option>
                      </select>
                    </td>
                    <!-- 부서장 -->
                    <td>
                      <label for="s3" class="blind">부서장</label>
                        <input type="checkbox" id="regChiefYnChk" name="regChiefYnChk" v-model="insertValue.chiefYn" v-bind:checked="insertValue.chiefYn=='Y'" true-value="Y" false-value="N" v-on:click="regChiefChk(i)" value="insertValue.chiefYn" >
                    </td>
                    <!-- 입사일 -->
                    <td>
                      <!-- calendar start -->
                      <div class="vcal-area">
                        <v-date-picker
                          v-model.trim="insertValue.sdate"
                          :format="'YYYY.MM.DD'"
                          :disabled-dates='{ weekdays: [1, 7] }'
                          :popover="{ placement: 'bottom', visibility: 'click' }">
                        </v-date-picker>
                        <span class="vc-ico"></span>
                      </div>
                      <!-- //calendar end -->
                    </td>
                    <!-- 이메일 -->
                    <td>
                      <input type="text" placeholder="id@m2mglobal.co.kr" v-model.trim="insertValue.email" style="ime-mode:disabled">
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- table list end -->
            </div>
          </div>
        </memins-modal>
        <!-- popup list end -->
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import MeminsModal from '../vcode/MemberRegi.vue'
export default {
  name: 'DeptMember',
  components: { MeminsModal },
  data: function () {
    return {
      modal: false,
      name: '',
      deptMemList: [],
      sdate: '',
      sSdate: [],
      retire: [],
      retireDt: [],
      dept: '',
      jikgub: '',
      sJikgub: [],
      chiefYn: 1,
      sChiefYn: [],
      isChkDisable: [],
      scodeNm: '',
      scode: '1',
      sScode: [],
      isHidden: [],
      colHidden: false,
      checked: false,
      poJson: [],
      insertLists: [{ scode: '1', jikgub: '10', chiefYn: 'N' }],
      userId: ''
    }
  },
  created: function () {
    this.selectJikgub()
    this.selectDept()
  },
  mounted: function () {
    this.selectDeptMemList()
  },
  methods: {
    checkId (i) {
      var inputId = document.getElementsByName('id')
      axios.get('/api/deptMember/checkId', {
        params: {
          id: inputId[i].value
        }
      })
        .then(res => {
          this.userId = res.data.data.length
          // console.log(this.userId)
          if (this.userId === 1) {
            alert('중복된 아이디입니다.')
            inputId[i].value = ''
          } else if (this.userId === 0) {
            alert('사용 가능한 아이디입니다.')
          }
        }).catch(() => {
          // console.log(error)
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
    },
    // 직급 조회
    selectJikgub () {
      axios.get('/api/deptMember/selectJikgubList')
        .then(res => {
          this.jikgub = res.data.data
        }).catch(() => {
          // console.log(error)
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
    },
    // 부서 조회
    selectDept () {
      axios.get('/api/deptMember/selectDept')
        .then(res => {
          this.dept = res.data.data
          this.scode = res.data.data[0].scode
        }).catch(() => {
          // console.log(error)
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
    },
    // 수정 저장
    updateMem: function () {
      var name = document.getElementsByName('nameInput')
      var scode = document.getElementsByName('scodeSelect')
      var jikgub = document.getElementsByName('jikgubSelect')
      var chiefYn = document.getElementsByClassName('chiefYnChkVal')
      var sdate = document.getElementsByName('sdateInput')
      var retire = document.getElementsByName('retireInput')
      var retireDt = document.getElementsByName('retireDtInput')
      var email = document.getElementsByName('emailInput')
      var id = document.getElementsByName('userId')
      for (var i = 0; i < name.length; i++) {
        var memUpdList = {
          name: name[i].value,
          dept: scode[i].value,
          jikgub: jikgub[i].value,
          chiefYn: (chiefYn[i].checked === true ? 'Y' : 'N'),
          sdate: sdate[i].children[0].value,
          retire: (retire[i].checked === true ? 'Y' : 'N'),
          retireDt: retireDt[i].children[0].value,
          email: email[i].value,
          id: id[i].value
        }
        this.poJson.push(memUpdList)
      }
      // console.log('this.poJson :: ' + JSON.stringify(this.poJson))
      axios.post('/api/deptMember/updateMember', this.poJson)
        .then(res => {
        }).catch(() => {
          // console.log(error)
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
      window.location.reload()
    },
    // 체크박스 클릭
    ifChecked: function (index, dept) {
      const chiefYn = document.getElementsByName('chiefYnChk')
      let cnt = 0
      if (dept === this.sScode[index]) {
        this.isChkDisable[index] = false
        if (this.sJikgub[index] !== '1' && this.sJikgub[index] !== '2' && dept === this.sScode[index]) {
          for (let i = 0; i < chiefYn.length; i++) {
            if (chiefYn[i].checked === true && (this.sJikgub[i] !== '1' && this.sJikgub[i] !== '2')) {
              cnt = cnt + 1
            }
          }
          if (cnt > 1) {
            alert('부서장이 이미 등록되어 있습니다.')
            chiefYn[index].checked = false
          }
          // console.log('chiefYn[' + index + '] :: ' + chiefYn[index].checked)
        }
      } else if (this.sJikgub[index] !== '1' && this.sJikgub[index] !== '2') {
        this.isChkDisable[index] = true
        chiefYn[index].checked = false
      } else {
        this.isChkDisable[index] = false
      }
    },
    regChiefChk: function (index) {
      const chiefYn = document.getElementsByName('regChiefYnChk')
      const jikgub = this.insertLists[index]
      if (chiefYn[index].checked && (jikgub.value !== '1' && jikgub.value !== '2')) {
        /* 해당 부서의 부서장 중복체크 */
        axios.post('/api/deptMember/checkChiefYn', {
          scode: jikgub.scode /* 부서코드 */
        })
          .then(res => {
            var chk = res.data.data.length
            if (chk > 0) { // db에 부서장 존재
              alert('부서장이 이미 등록되어 있습니다.')
              chiefYn[index].checked = false
            } else { // 부서장 부재
              chiefYn[index].checked = true
            }
          }).catch(() => {
            // console.log(error)
            alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
          })
      }
    },
    // 클릭시 인풋박스로 바뀜
    clkRow: function (i) {
      const editChk = document.getElementsByName('editChk')
      const editChkAll = document.getElementsByName('editChkAll')
      if (i === 'All') {
        for (let lgh = 0; lgh < this.isHidden.length; lgh++) {
          this.$set(this.isHidden, lgh, editChkAll[0].checked)
          editChk[lgh].checked = editChkAll[0].checked
          for (let index = 0; index < this.isHidden.length; index++) {
            if (this.isHidden[index] === true) {
              this.colHidden = true
              break
            } else {
              this.colHidden = false
            }
          }
        }
      } else {
        this.$set(this.isHidden, i, !this.isHidden[i])
        for (let index = 0; index < this.isHidden.length; index++) {
          if (this.isHidden[index] === true) {
            this.colHidden = true
            break
          } else {
            this.colHidden = false
          }
        }
      }
    },
    // email 형식 체크
    chkEmail: function () {
      var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i
      for (var i = 0; i < this.insertLists.length; i++) {
        var email = this.insertLists[i].email
        if (email.match(regExp) != null) {
          // alert('Good!')
        } else {
          alert('이메일을 확인해 주세요.')
        }
      }
      // 검증에 사용할 정규식 변수 regExp에 저장
    },
    // 부서별 보기
    selectDeptMemList: function () {
      /* 파라미터 초기화 */
      this.sJikgub = []
      this.sScode = []
      this.sSdate = []
      this.sChiefYn = []
      this.isChkDisable = []
      this.retire = []
      this.retireDt = []
      this.isHidden = []
      this.colHidden = false

      /* 부서별 조회 */
      axios.post('/api/deptMember/selectDeptMemList', {
        scode: this.scode
      })
        .then(res => {
          this.deptMemList = res.data.data
          for (var i = 0; i < this.deptMemList.length; i++) {
            this.isHidden[i] = false
            this.sJikgub.push(this.deptMemList[i].jscode)
            this.sScode.push(this.deptMemList[i].scode)
            this.sChiefYn.push(this.deptMemList[i].chiefYn)
            this.isChkDisable.push(false)
            var sdate = ''
            sdate = sdate.concat(this.deptMemList[i].sdate.substr(0, 4), '.', this.deptMemList[i].sdate.substr(4, 2), '.', this.deptMemList[i].sdate.substr(6, 2))
            this.sSdate.push(new Date(sdate))
            this.deptMemList[i].sdate = sdate
            this.retire.push(this.deptMemList[i].retire)
            if (this.deptMemList[i].retire === 'Y') {
              var rdate = ''
              rdate = rdate.concat(this.deptMemList[i].retireDt.substr(0, 4), '.', this.deptMemList[i].retireDt.substr(4, 2), '.', this.deptMemList[i].retireDt.substr(6, 2))
              this.retireDt.push(new Date(rdate))
            }
          }
        }).catch(() => {
          // console.log(error)
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
    // window.location.reload()
    },
    // 부서원 등록
    insertMember () {
      this.chkEmail()
      for (var i = 0; i < this.insertLists.length; i++) {
        var insList = {
          name: this.insertLists[i].name,
          id: this.insertLists[i].id,
          pw: this.insertLists[i].pw,
          dept: this.insertLists[i].scode,
          jikgub: this.insertLists[i].jikgub,
          chiefYn: this.insertLists[i].chiefYn,
          sdate: this.insertLists[i].sdate.getFullYear().toString() + ('00' + (this.insertLists[i].sdate.getMonth() + 1)).slice(-2).toString() + ('00' + this.insertLists[i].sdate.getDate()).slice(-2).toString(),
          retire: 'N',
          email: this.insertLists[i].email
        }
        this.poJson.push(insList)
      }
      axios.post('/api/deptMember/insertMember', this.poJson)
        .then(res => {
          // console.log(res.data.data)
        }).catch(() => {
          // console.log(error)
        })
      window.location.reload()
    },
    addRow (row) {
      row.push({ scode: 1, jikgub: 10 })
    },
    // 부서원 입력창 열기
    openModal () {
      this.modal = true
    }, // 부서원 입력창 닫기
    closeModal () {
      this.modal = false
      window.location.reload()
    }
  }
}
</script>

<style>
</style>
