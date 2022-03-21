<template>
  <div class="conts-area">
    <div class="conts-tit">
      <h2>결재수신함</h2>
    </div>
    <div class="list-top-area">
      <div class="t-right">
        <label for="s1">결재상태</label>
        <select id="s1" title="select" class="wp20" v-model="listSelected" @change="onSelectChange()">
          <option value="0">전체</option>
          <option v-for="(item, i) in listCode" v-bind:key="i" v-bind:value="item.scode">{{ item.scodeNm }}</option>
        </select>
      </div>
    </div>
    <div class="tbl-area">

      <!-- table list start -->
      <table class="tbl">
        <caption>리스트</caption>
        <colgroup>
          <col style="width:10%">
          <col style="width:10%">
          <col style="width:50%">
          <col style="width:10%">
          <col style="width:10%">
          <col style="width:10%">
        </colgroup>
        <thead>
          <tr>
            <th>No</th>
            <th>결재종류</th>
            <th>결재사유</th>
            <th>상신자</th>
            <th>결재상태</th>
            <th>결재</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="list.length == 0">
            <td colspan="6">
              <div class="t-center pd50">결재내용이 없습니다.</div>
            </td>
          </tr>
          <tr v-for="(item, i) in list" v-bind:key="i" v-else>
            <td>{{ item.serial }}</td>
            <td>{{ item.vcodeNm }}</td>
            <td class="t-left"><a href="#" v-on:click="openModal(item.serial, 2)">{{ item.vreason }}</a></td>
            <td>{{ item.name }}</td>
            <td>
              <div>{{ item.appCodeNm }}</div>
            </td>
            <td><a href="#" v-on:click="openModal(item.serial, 1)" v-if="item.appCode == '1'">결재</a></td>
          </tr>
        </tbody>
      </table>
      <!-- //table list end -->
    </div>
    <!-- Modal start -->
    <MyModal v-if="modal">
      <template slot="header">
        결재
      </template>
      <!-- default 슬롯 콘텐츠 -->
      <div class="tbl-area">
        <table class="tbl tb-detail mt10">
          <caption>디테일 테이블</caption>
          <colgroup>
            <col style="width:30%">
            <col style="width:70%">
          </colgroup>
          <tbody v-if="detailNum == 1">
            <tr>
              <td class="tbl-title"><strong>{{ detail.deptNm }}</strong></td>
              <td class="tbl-title"><strong>{{ detail.name }} {{ detail.jikgubNm }}</strong></td>
            </tr>
            <tr>
              <th>결재선택</th>
              <td class="t-left">
                <label for="s1" class="blind">결재</label>
                <select id="s1" title="select" class="wp100" v-model="detailSelected">
                  <option v-for="(item, i) in detailCode" v-bind:key="i" v-bind:value="item.scode">{{ item.scodeNm }}</option>
                </select>
              </td>
            </tr>
            <tr>
              <th>휴가일자</th>
              <td class="t-left">
                <span>{{ detail.sdate }}</span> ~ <span>{{ detail.edate }}</span>
              </td>
            </tr>
            <tr>
              <th>결재종류</th>
              <td class="t-left"><span>{{ detail.appGubunNm }} ( {{ detail.vcodeNm }} )</span></td>
            </tr>
            <tr>
              <th>결재내용</th>
              <td><textarea id="ta1" name="ta1" v-model="message" style="height:120px"></textarea></td>
            </tr>
          </tbody>
          <tbody v-else-if="detailNum == 2">
            <tr>
              <td class="tbl-title"><strong>{{ detail.deptNm }}</strong></td>
              <td class="tbl-title"><strong>{{ detail.name }} {{ detail.jikgubNm }}</strong></td>
            </tr>
            <tr>
              <th>휴가일자</th>
              <td class="t-left">
                <span>{{ detail.sdate }}</span> ~ <span>{{ detail.edate }}</span>
              </td>
            </tr>
            <tr>
              <th>결재종류</th>
              <td class="t-left"><span>{{ detail.appGubunNm }} ( {{ detail.vcodeNm }} )</span></td>
            </tr>
            <tr>
              <th>부서장 결재</th>
              <td>
                <div class="t-left">결재상태 : {{ detail.appCodeNm }}</div>
                <div class="t-left">결재일시 : {{ detail.appDt }}</div><br />
                <textarea id="ta1" name="ta1" v-model="detail.appContent" value="" disabled style="height:80px"></textarea>
              </td>
            </tr>
            <tr>
              <th>총괄본부장 결재</th>
              <td>
                <div class="t-left">결재상태 : {{ detail.app3CodeNm }}</div>
                <div class="t-left">결재일시 : {{ detail.app3Dt }}</div><br />
                <textarea id="ta1" name="ta1" v-model="detail.app3Content" value="" disabled style="height:80px"></textarea>
              </td>
            </tr>
            <tr>
              <th>대표이사1 결재</th>
              <td>
                <div class="t-left">결재상태 : {{ detail.app1CodeNm }}</div>
                <div class="t-left">결재일시 : {{ detail.app1Dt }}</div><br />
                <textarea id="ta1" name="ta1" v-model="detail.app1Content" value="" disabled style="height:80px"></textarea>
              </td>
            </tr>
            <tr>
              <th>대표이사2 결재</th>
              <td>
                <div class="t-left">결재상태 : {{ detail.app2CodeNm }}</div>
                <div class="t-left">결재일시 : {{ detail.app2Dt }}</div><br />
                <textarea id="ta1" name="ta1" v-model="detail.app2Content" value="" disabled style="height:80px"></textarea>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- /default -->
      <!-- footer 슬롯 콘텐츠 -->
      <template slot="footer">
        <div class="t-center" v-if="detailNum == 1">
          <button type="button" class="btn btn-blue" v-on:click="doSend">저장</button>
          <button type="button" class="btn btn-gray" v-on:click="closeModal">취소</button>
        </div>
        <div class="t-center" v-else-if="detailNum == 2">
          <button type="button" class="btn btn-gray" v-on:click="closeModal">확인</button>
        </div>
      </template>
      <!-- /footer -->
    </MyModal>
    <!-- modal end -->
  </div>
</template>

<script>
import MyModal from '../../components/MyModal.vue'
import axios from 'axios'
import moment from 'moment'

export default {
  name: 'AppReceive',
  components: { MyModal },
  data () {
    return {
      listCode: [],
      detailCode: [],
      modal: false,
      message: '',
      appGubun: '1',
      appStatus: '',
      listSelected: '0',
      detailSelected: '2',
      list: [],
      detail: {},
      detailNum: ''
    }
  },
  methods: {
    openModal (serial, num) {
      // 결재
      if (num === 1) {
        this.detailNum = num
        this.selectApprovalRecDetail(serial)
      } else {
        // 결재이력
        this.detailNum = num
        this.selectApprovalRepDetail(serial)
      }
    },
    closeModal () {
      this.modal = false
      this.detailSelected = '2'
      this.message = ''
      this.selectApprovalRecList()
    },
    doSend () {
      if (this.message.length > 0) {
        this.updateApprovalRec()
      } else {
        alert('결재내용을 입력하여 주세요.')
      }
    },
    selectListCode: function () {
      axios.get('/api/mypage/codeList', {
        params: {
          grcode: 'A010'
        }
      })
        .then(res => {
          this.listCode = res.data.data
          this.listCode.splice(3, 4)
        }).catch(() => {
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
    },
    selectDetailCode: function () {
      axios.get('/api/mypage/codeList', {
        params: {
          grcode: 'A010'
        }
      })
        .then(res => {
          this.detailCode = res.data.data
          this.detailCode.splice(0, 1)
          this.detailCode.splice(2, 3)
        }).catch(() => {
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
    },
    selectApprovalRecList: function () {
      axios.get('/api/mypage/approvalRecList', {
        params: {
          appGubun: this.appGubun,
          appCode: this.listSelected
        }
      })
        .then(res => {
          this.list = res.data.data
        }).catch(() => {
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
    },
    selectApprovalRecDetail: function (serial) {
      axios.get('/api/mypage/approvalRecDetail', {
        params: {
          serial: serial
        }
      })
        .then(res => {
          this.detail = res.data.data
          this.modal = true
        }).catch(() => {
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
    },
    selectApprovalRepDetail: function (serial) {
      axios.get('/api/mypage/approvalRepDetail', {
        params: {
          serial: serial
        }
      })
        .then(res => {
          this.detail = res.data.data
          if (this.detail.appDt != null) {
            this.detail.appDt = moment(this.detail.appDt).format('YYYY-MM-DD HH:mm')
          }
          if (this.detail.app1Dt != null) {
            this.detail.app1Dt = moment(this.detail.app1Dt).format('YYYY-MM-DD HH:mm')
          }
          if (this.detail.app2Dt != null) {
            this.detail.app2Dt = moment(this.detail.app2Dt).format('YYYY-MM-DD HH:mm')
          }
          if (this.detail.app3Dt != null) {
            this.detail.app3Dt = moment(this.detail.app3Dt).format('YYYY-MM-DD HH:mm')
          }
          this.modal = true
        }).catch(() => {
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
    },
    updateApprovalRec: function () {
      axios.post('/api/mypage/approvalRecUpdate', {
        serial: this.detail.serial,
        appCode: this.detailSelected,
        appContent: this.message,
        sdate: this.detail.sdate,
        edate: this.detail.edate,
        vcode: this.detail.vcode,
        submitId: this.detail.submitId,
        appGubunNm: this.detail.appGubunNm,
        appStatus: this.detailCode[parseInt(this.detailSelected) - 2].scodeNm,
        name: this.detail.name,
        vreason: this.detail.vreason
      })
        .then(res => {
          // alert(res.data.message)
          alert('결재가 처리되었습니다.')
          this.message = ''
          this.closeModal()
        }).catch(() => {
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
    },
    onSelectChange: function () {
      this.selectApprovalRecList()
    }
  },
  created: function () {
    this.selectListCode()
    this.selectDetailCode()
    this.selectApprovalRecList()
  }
}
</script>

<style>
.tbl-title {text-align:left !important; padding:10px 10px 10px 0 !important; border:0 !important}
</style>
