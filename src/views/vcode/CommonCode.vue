<template>
  <div id="app" class="conts-area" >
    <div class="conts-tit">
      <a  v-bind:href="src"><h2>공통코드 관리</h2></a>
    </div>
    <div class="list-top-area">
      <div class="d-ib fl">
        <label for="text1">코드명</label>
        <input type="text" v-model="grCodeNm"  v-on:keyup.enter="searchCommonCode">
        <button type="button" title="조회" class="btn" v-on:click="searchCommonCode()">검색>조회</button>
        <button type="button" title="추가" class="btn btn-blue" v-show="btnHidden" v-on:click="addGrCode()">신규</button>
        <button type="button" title="저장" class="btn btn-blue" v-show="btnSave" v-on:click="insertCommonCode()">저장</button>
        <button type="button" title="저장" class="btn btn-blue" v-show="!btnHidden" v-on:click="updateCommonCode()">수정저장</button>
      </div>
      <div class="t-right fr">
        <button type="button" title="추가" class="btn btn-blue" v-show="btnHidden2" v-on:click="addScode()">세부목록신규</button>
        <button type="button" title="저장" class="btn btn-blue" v-show="btnSave2" v-on:click="insertScode()">저장</button>
        <button type="button" title="저장" class="btn btn-blue" v-show="!btnHidden2" v-on:click="updateSCode()">수정저장</button>
        <button type="button" title="취소" class="btn btn-gray" v-on:click="cancelGrCode()">취소</button>
      </div>
    </div>
    <div class="clearfix">
      <div class="fl wp49 ml2">
        <p class="mt30 mb10">코드그룹목록</p>
        <div class="tbl-area">
          <!-- table list start -->
          <table class="tbl autoLayout">
            <caption>list 테이블</caption>
            <colgroup>
              <col style="width:20%">
              <col style="width:65%">
              <col style="width:15%">
            </colgroup>
            <thead>
              <tr>
                <th>코드</th>
                <th>코드명</th>
                <th>사용여부</th>
              </tr>
            </thead>
            <tbody>
              <!--그룹 코드 신규 버튼 눌렀을 때 나타나는 tr -->
              <tr v-show="newGrCode" v-for="(insVal, insValI) in newGrCodeList" v-bind:key="insValI.grCode">
              <td>
                <input type="text" v-model.trim="insVal.grCode" onKeyup="this.value=this.value.replace(^[A-Za-z0-9+]*$)">
              </td>
              <td>
                <input type="text" v-model.trim="insVal.grCodeNm">
              </td>
              <td>
                <input v-bind:disabled="!disabled" type="checkbox" name="newChkbox" v-bind:checked="insVal.guseYn=='Y'" true-value="Y" false-value="N" v-model.trim="insVal.guseYn" />
              </td>
              </tr>
              <tr v-for="(value, i) in selectAll" v-bind:key="i.grCode" >
                <!-- 그룹코드 -->
                <td class="cursor" name="grCode" v-on:dblclick="dblGrCode(i, value)" v-bind:value="grCode" v-html="value.grCode"></td>
                <!-- 그룹코드명 -->
                <td class="t-left cursor" name="search" v-on:click="clickGrCodeNm(i, value)" v-html="value.grCodeNm" v-bind:value="grCodeNm" v-on:dblclick="dblGrCode(i, value)">
                </td>
                <!-- 사용여부 -->
                <td class="cursor" v-on:dblclick="dblGrCode(i, value)" name="guseYn">
                    <input v-bind:disabled="disabled" v-on:click="chgCheck(i)" type="checkbox" name="chkbox" v-bind:checked="value.guseYn=='Y'" true-value="Y" false-value="N" value="value.guseYn" v-html="value.guseYn"/>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- table list end -->
        </div>
      </div>
      <div class="fl wp49">
        <p class="mt30 mb10">세부목록</p>
        <div class="tbl-area">
          <!-- table list start -->
          <table class="tbl autoLayout">
            <caption>list 테이블</caption>
            <colgroup>
              <col style="width:20%">
              <col style="width:40%">
              <col style="width:15%">
              <col style="width:15%">
              <col style="width:10%">
            </colgroup>
            <thead>
              <tr>
                <th>세부코드</th>
                <th>세부코드명</th>
                <th>사용여부</th>
                <th>우선순위</th>
                <th>비고</th>
              </tr>
            </thead>
            <tbody>
              <!-- 세부목록 신규버튼 눌렀을 때 나오는 tr-->
              <tr v-show="newSCode" v-for="(insSVal, insSValI) in newSCodeList" v-bind:key="insSValI.scode">
                <!-- 세부 코드 -->
                <td>
                  <input type="text" v-model.trim="insSVal.scode" onKeyup="this.value=this.value.replace(/[^0-9]/g,'')">
                </td>
                <!-- 세부 코드명 -->
                <td class="t-left cursor">
                  <input type="text" v-model.trim="insSVal.scodeNm">
                </td>
                <!-- 사용여부 -->
                <td>
                  <label for="chk3" class="blind">체크박스</label>
                  <input type="checkbox" v-bind:disabled="!disabled" name="chk3" v-bind:checked="insSVal.suseYn=='Y'" true-value="Y" false-value="N" v-model="insSVal.suseYn">
                </td>
                <!-- 우선순위 -->
                <td>
                  <input type="text" v-model.trim="insSVal.priority" onKeyup="this.value=this.value.replace(/[^0-9]/g,'')">
                </td>
                <!-- 비고 -->
                <td>
                  <input type="text" v-model.trim="insSVal.bigo1">
                </td>
              </tr>
              <!-- 그룹코드 눌렀을 때 셀렉트 되는 tr-->
              <tr>
                <td colspan="5" v-show="isHidden">코드명을 선택해 주세요.</td>
              </tr>
              <tr v-for="(value, i) in searchList" v-bind:key="i"  v-on:dblclick="dblSCode(i, value)">
                <!-- 세부 코드 -->
                <td class="cursor" v-html="value.scode" name="scode" value="i.scode" ></td>
                <!-- 세부 코드명 -->
                <td class="t-left cursor" v-html="value.scodeNm" name="scodeNm"></td>
                <!-- 사용여부 -->
                <td class="cursor" value="i.suseYn">
                  <label for="chk3" class="blind">체크박스</label>
                  <input type="checkbox" v-bind:disabled="disabled" name="chk3" v-on:click="chgSCheck(i)" v-html="value.suseYn" v-bind:checked="value.suseYn=='Y'" true-value="Y" false-value="N">
                </td>
                <!-- 순서 -->
                <td class="cursor" v-html="value.priority" name="priority" v-bind:value="value.priority"></td>
                <!-- 비고 -->
                <td class="cursor" v-html="value.bigo1" name="bigo1" v-bind:value="value.bigo1"></td>
              </tr>
            </tbody>
          </table>
          <!-- table list end -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'CommonCode',
  data: function () {
    return {
      poJson: [],
      grCode: [],
      grCodeNm: [],
      guseYn: [],
      selectAll: [{}],
      searchList: [],
      scode: [],
      scodeNm: [],
      priority: [],
      suseYn: [],
      bigo1: [],
      isHidden: true,
      src: 'http://localhost:3000/vcode/common',
      checked: false,
      btnHidden: true,
      btnHidden2: true,
      btnSave: false,
      btnSave2: false,
      trHidden: true,
      select: true,
      edit: true,
      selectedRow: [],
      selectedSRow: [],
      disabled: true,
      newGrCode: false,
      newGrCodeList: [],
      newSCode: false,
      newSCodeList: [],
      dbClickRow: []
    }
  },
  created: function () {
    this.firstSelect()
  },
  methods: {
    // 세부코드 체크 박스
    chgSCheck: function (i) {
      var sChecked = document.getElementsByName('chk3')
      if (sChecked[i].checked === false) {
        sChecked[i].chekced = true
        this.searchList[i].suseYn = 'Y'
      } else {
        sChecked[i].chekced = false
        this.searchList[i].suseYn = 'N'
      }
    },
    // 그룹 체크 박스
    chgCheck: function (i) {
      var checked = document.getElementsByName('chkbox')
      if (checked[i].checked === false) {
        checked[i].chekced = true
        this.selectAll[i].guseYn = 'Y'
      } else {
        checked[i].chekced = false
        this.selectAll[i].guseYn = 'N'
      }
    },
    // 처음 그룹코드 전체조회
    firstSelect: function () {
      axios.get('/api/commonCode/selectCommonCodeList')
        .then(res => {
          // console.log(res.data)
          this.selectAll = res.data.data
        }).catch(() => {
          // console.log(error)
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
    },
    // 검색
    searchCommonCode: function () {
      this.isHidden = false
      axios.post('/api/commonCode/searchCommonCode', {
        grCodeNm: this.grCodeNm
      })
        .then(res => {
          this.searchList = res.data.data
          if (this.searchList.length === 0 || this.grCodeNm === '') {
            alert('그룹코드명을 입력해주세요')
          }
        }).catch(() => {
          // console.log(error)
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
    },
    // 수정 모드 취소
    cancelGrCode: function () {
      if (confirm('정말 취소하시겠습니까??') === true) {
        window.location.reload()
      } else {
        return false
      }
    },
    // 그룹 코드 신규 버튼 클릭
    addGrCode: function () {
      if (this.btnHidden2 === false || this.btnSave2 === true) {
        alert('수정 사항을 저장해 주세요.')
      } else {
        this.btnSave = true
        this.newGrCode = true
        this.newGrCodeList.push({})
      }
    },
    // 그룹 코드 신규 저장
    insertCommonCode: function () {
      for (var i = 0; i < this.newGrCodeList.length; i++) {
        var grCodeList = {
          grCode: this.newGrCodeList[i].grCode,
          grCodeNm: this.newGrCodeList[i].grCodeNm,
          guseYn: this.newGrCodeList[i].guseYn
        }
        this.poJson.push(grCodeList)
      }
      axios.post('/api/commonCode/insertCommonCode', this.poJson)
        .then(res => {
          window.location.reload()
        }).catch(() => {
          // console.log(error)
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
    },
    // 더블 클릭시 수정 모드 - 그룹 코드
    dblGrCode: function (i, value) {
      if (this.btnHidden2 === false) {
        return false
      }
      var cnt = document.getElementsByName('grCode').length
      this.selectedRow[cnt] = ''
      // 신규 로우 추가 됐을 때 동작 안하게
      if (this.btnSave === false && this.btnSave2 === false) {
        // 중복 클릭 방지
        if (this.edit === true && this.selectedRow[i] !== false) {
          this.btnHidden = false
          var ableGrchk = document.getElementsByName('chkbox')
          ableGrchk[i].disabled = !this.disabled
          this.$set(this.selectAll, i, {
            grCode: '<input type="text" name="grCodeInput" value="' + value.grCode + '"readonly>',
            grCodeNm: '<input type="text" name="grCodeNmInput" value="' + value.grCodeNm + '" autofocus>'
          })
          this.selectedRow[i] = false
          if (ableGrchk[i].checked === true) {
            this.selectAll[i].guseYn = 'Y'
          }
        } else if (this.selectedRow[i] === false) {
          alert('이미 선택한 행입니다.')
        }
      } else if (this.edit === false) {
        alert('신규 입력 중 수정 불가합니다.')
      }
    },
    // 그룹코드 수정 저장
    updateCommonCode: function () {
      var grCode = document.getElementsByName('grCodeInput')
      var grCodeNm = document.getElementsByName('grCodeNmInput')
      var guseYn = document.getElementsByName('chkbox')
      for (var i = 0; i < grCodeNm.length; i++) {
        var grCodeList = { grCode: grCode[i].value, grCodeNm: grCodeNm[i].value, guseYn: guseYn[i].checked === true ? 'Y' : 'N' }
        this.poJson.push(grCodeList)
      }
      axios.post('/api/commonCode/updateCommonCode', this.poJson)
        .then(res => {
          // console.log(res.data.data)
        }).catch(() => {
          // console.log(error)
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
      window.location.reload()
    },
    // 그룹 코드명 클릭 (세부 목록 조회)
    clickGrCodeNm: function (i, value) {
      // 세부목록 수정중인 상태 초기화
      this.selectedSRow = []
      // 이미 선택한 채로 선택할 때 세부 신규 버튼 안바뀌게
      this.isHidden = false
      this.btnSave2 = false
      this.grCode = value.grCode
      // 세부 목록 신규 로우 추가되었을 경우 초기화
      this.newSCode = false
      this.newSCodeList = []
      // 세부 목록 수정 중이었을 경우 disable 초기화
      if (this.btnHidden2 === false) {
        this.btnHidden2 = true
        for (var v = 0; v < this.dbClickRow.length; v++) {
          var ableGrchk = document.getElementsByName('chk3')
          var index = this.dbClickRow[v]
          ableGrchk[index].disabled = this.disabled
        }
        // alert('수정 사항을 저장해 주세요.')
        // return false
      }
      if (this.btnHidden === false) {
        // v-html 때문에 문자열 자름.
        var vhtml = ''
        var grCdSplit = ''
        var grCodeNm = ''
        if (value.grCodeNm.indexOf('value') > -1) {
          vhtml = value.grCodeNm.split('value="')
          grCdSplit = vhtml[1].split('"')
          grCodeNm = grCdSplit[0]
        } else {
          grCodeNm = value.grCodeNm
        }
        // console.log('자른 문자열 :: ', grCodeNm)
        axios.post('/api/commonCode/searchCommonCode', {
          grCodeNm: grCodeNm
        })
          .then(res => {
            // console.log(res.data.data)
            this.searchList = res.data.data
          }).catch(() => {
            // console.log(error)
            alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
          })
      } else {
        axios.post('/api/commonCode/searchCommonCode', {
          grCodeNm: value.grCodeNm
        })
          .then(res => {
            // console.log(res.data.data)
            this.searchList = res.data.data
          }).catch(() => {
            // console.log(error)
            alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
          })
      }
    },
    // 세부 목록 신규 버튼 클릭
    addScode: function () {
      if (this.btnHidden === false || this.btnSave === true) {
        alert('수정 사항을 저장해 주세요.')
      } else {
        if (this.grCode.length !== 0) {
          this.btnSave2 = true
          this.newSCode = true
          this.newSCodeList.push({})
        } else {
          alert('그룹 코드를 먼저 선택해 주세요.')
        }
      }
    },
    // 세부 코드 저장
    insertScode: function () {
      for (var i = 0; i < this.newSCodeList.length; i++) {
        var sCodeList = {
          grCode: this.grCode,
          scode: this.newSCodeList[i].scode,
          scodeNm: this.newSCodeList[i].scodeNm,
          suseYn: this.newSCodeList[i].suseYn,
          priority: this.newSCodeList[i].priority,
          bigo1: this.newSCodeList[i].bigo1
        }
        this.poJson.push(sCodeList)
      }
      axios.post('/api/commonCode/insertSCode', this.poJson)
        .then(res => {
          window.location.reload()
        }).catch(() => {
          // console.log(error)
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
    },
    // 더블 클릭시 수정 모드 - 세부 코드
    dblSCode: function (i, value) {
      this.dbClickRow.push(i)
      if (this.btnHidden === false) {
        alert('수정 사항을 저장해 주세요.')
        return false
      }
      var cnt = document.getElementsByName('scode').length
      this.selectedSRow[cnt] = ''
      // 신규 로우 추가 됐을 때 동작 안하게
      if (this.btnSave === false && this.btnSave2 === false) {
      // 중복 클릭 방지
        if (this.edit === true && this.selectedSRow[i] !== false) {
          this.btnHidden2 = false
          var ableSchk = document.getElementsByName('chk3')
          ableSchk[i].disabled = !this.disabled
          // 비고가 null일 경우 빈칸 처리
          if (value.bigo1 === null) {
            value.bigo1 = ''
          }
          this.$set(this.searchList, i, {
            scode: '<input type="text" name="sodeInput" value="' + value.scode + '" readonly >',
            scodeNm: '<input type="text" name="scodeNmInput" value="' + value.scodeNm + '">',
            priority: '<input type="text" name="priorityInput" value="' + value.priority + '" onKeyup="this.value=this.value.replace(/[^0-9]/g,' + "'" + "'" + ')">',
            bigo1: '<input type="text" name="bigo1Input" value="' + value.bigo1 + '">'
          })
          this.selectedSRow[i] = false
          if (ableSchk[i].checked === true) {
            this.searchList[i].suseYn = 'Y'
          }
        } else if (this.selectedSRow[i] === false) {
          alert('이미 선택한 행입니다.')
        }
      } else if (this.edit === false) {
        alert('신규 추가 중 수정 불가합니다.')
      }
    },
    // 세부코드 수정 저장
    updateSCode: function () {
      var scode = document.getElementsByName('sodeInput')
      var scodeNm = document.getElementsByName('scodeNmInput')
      var suseYn = document.getElementsByName('chk3')
      var priority = document.getElementsByName('priorityInput')
      var bigo1 = document.getElementsByName('bigo1Input')
      for (var i = 0; i < scodeNm.length; i++) {
        var scodeList = {
          grCode: this.grCode,
          scode: scode[i].value,
          scodeNm: scodeNm[i].value,
          suseYn: suseYn[i].checked === true ? 'Y' : 'N',
          priority: priority[i].value,
          bigo1: bigo1[i].value === null ? ' ' : bigo1[i].value
        }
        this.poJson.push(scodeList)
      }
      axios.post('/api/commonCode/updateSCode', this.poJson)
        .then(res => {
          // console.log(res.data.data)
        }).catch(() => {
          // console.log(error)
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
      window.location.reload()
    }
  }
}
</script>
<!-- 퍼블 깨지 것 방지. 테이블에 적용-->
<style>
.autoLayout {
  table-layout: auto !important;
  margin-top: 10px;
}
</style>
