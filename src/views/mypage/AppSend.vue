<template>
  <div class="conts-area">
    <div class="conts-tit">
      <h2>결재상신함</h2>
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
            <th>최종결재자</th>
            <th>결재상태</th>
            <th>최종결재일시</th>
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
            <td class="t-left"><a href="#" v-on:click="openModal(item.serial)">{{ item.vreason }}</a></td>
            <td>{{ item.app3Nm }}</td>
            <td>
              <div>{{ item.appStatusNm }}</div>
            </td>
            <td>{{ item.app3Dt }}</td>
          </tr>
        </tbody>
      </table>
      <!-- //table list end -->
    </div>
    <!-- Modal start -->
    <MyModal v-if="modal">
      <template slot="header">
        결재내용
      </template>
      <!-- default 슬롯 콘텐츠 -->
      <div class="tbl-area">
        <table class="tbl tb-detail mt10">
          <caption>디테일 테이블</caption>
          <colgroup>
            <col style="width:30%">
            <col style="width:70%">
          </colgroup>
          <tbody>
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
        <div class="t-center">
          <!-- <button type="button" class="btn btn-blue" v-on:click="doSend">저장</button> -->
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
  name: 'AppSend',
  components: { MyModal },
  data () {
    return {
      listCode: [],
      modal: false,
      message: '',
      listSelected: '0',
      list: [],
      detail: {}
    }
  },
  methods: {
    openModal (serial) {
      this.selectApprovalRepDetail(serial)
    },
    closeModal () {
      this.modal = false
    },
    doSend () {
      if (this.message.length > 0) {
        alert(this.message)
        this.message = ''
        this.closeModal()
      } else {
        alert('결재내용을 입력하여 주세요.')
      }
    },
    selectListCode: function () {
      axios.get('/api/mypage/codeList', {
        params: {
          grcode: 'A009'
        }
      })
        .then(res => {
          this.listCode = res.data.data
        }).catch(() => {
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
    },
    selectApprovalRepList: function () {
      axios.get('/api/mypage/approvalRepList', {
        params: {
          appCode: this.listSelected
        }
      })
        .then(res => {
          this.list = res.data.data
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
    onSelectChange: function () {
      this.selectApprovalRepList()
    }
  },
  created: function () {
    this.selectListCode()
    this.selectApprovalRepList()
  }
}
</script>

<style>
.tbl-title {text-align:left !important; padding:10px 10px 10px 0 !important; border:0 !important}
</style>
