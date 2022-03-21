<template>
  <div class="conts-area">
    <div class="conts-tit">
      <h2>템플릿 관리</h2>
    </div>
    <div class="list-top-area">
      <div class="fl wp30">
        <label for="s1">구분</label>
        <select id="s1" title="구분" class="wp50" v-model="listSelected" @change="onChange">
          <option value="0">선택</option>
          <option v-for="(item, i) in listCode" v-bind:key="i" v-bind:value="item.scode">{{ item.scodeNm }}</option>
        </select>
      </div>
      <div class="fr">
        <button type="button" class="btn btn-blue" @click="onClick">저장</button>
      </div>
    </div>
    <div class="tbl-area">
      <!-- table list start -->
      <table class="tbl">
        <caption>템플릿 관리</caption>
        <colgroup>
          <col style="width:20%">
          <col style="width:80%">
        </colgroup>
        <tbody>
          <tr>
            <th>내용</th>
            <td><textarea id="ta1" name="ta1" v-model="detail.content" style="height:200px"></textarea></td>
          </tr>
        </tbody>
      </table>
      <!-- //table list end -->
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Template',
  data: () => ({
    listSelected: '0',
    listCode: [],
    detail: {}
  }),
  methods: {
    selectListCode: function () {
      axios.get('/api/mypage/codeList', {
        params: {
          grcode: 'A012'
        }
      })
        .then(res => {
          this.listCode = res.data.data
        }).catch(() => {
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
    },
    selectTemplate: function () {
      axios.get('/api/mypage/templateDetail', {
        params: {
          gubun: this.listSelected
        }
      })
        .then(res => {
          if (res.data.data != null) {
            this.detail = res.data.data
          } else {
            this.detail.content = ''
          }
        }).catch(() => {
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
    },
    updateTemplate: function () {
      axios.post('/api/mypage/templateUpdate', {
        gubun: this.listSelected,
        message: this.detail.content
      })
        .then(res => {
          alert(res.data.message)
        }).catch(() => {
          alert('오류가 발생하였습니다. 시스템 관리자에게 문의하세요.')
        })
    },
    onChange: function () {
      this.selectTemplate()
    },
    onClick: function () {
      if (this.listSelected === '0') {
        alert('구분을 선택하여 주세요.')
      } else {
        this.updateTemplate()
      }
    }
  },
  created: function () {
    this.selectListCode()
  }
}
</script>

<style>
</style>
