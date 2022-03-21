<template>
  <div class="snb">
    <ul>
      <li v-if="this.snbLink == 'mypage'"><router-link to="/mypage/receive">결재수신함</router-link></li>
      <li v-if="this.snbLink == 'mypage'"><router-link to="/mypage/send">결재상신함</router-link></li>
      <li v-if="this.snbLink == 'mypage'"><router-link to="/mypage/pwdchg">패스워드 변경</router-link></li>
      <li v-if="this.snbLink == 'plando'"><router-link to="/plando/dept">부서별 업무실적 조회</router-link></li>
      <li v-if="this.snbLink == 'plando'"><router-link to="/plando/view">업무실적 조회</router-link></li>
      <li v-if="this.snbLink == 'plando'"><router-link to="/plando/regi">업무실적 등록</router-link></li>
      <li v-if="this.snbLink == 'gostop'"><router-link to="/gostop/view">월별 근태 조회</router-link></li>
      <li v-if="this.snbLink == 'gostop'"><router-link to="/gostop/dept">부서별 근태 조회</router-link></li>
      <li v-if="this.snbLink == 'gostop'"><router-link to="/gostop/regi">근태 등록</router-link></li>
      <li v-if="this.snbLink == 'gostop'"><router-link to="/gostop/mymonth">월별 개인 휴가 사용 현황</router-link></li>
      <li v-if="this.snbLink == 'gostop'"><router-link to="/gostop/year">년도/월/사용자별 휴가현황</router-link></li>
      <li v-if="this.snbLink == 'vcode'"><router-link to="/vcode/common">공통코드 관리</router-link></li>
      <li v-if="this.snbLink == 'vcode'"><router-link to="/vcode/calendar">캘린더 관리</router-link></li>
      <li v-if="this.snbLink == 'vcode'"><router-link to="/vcode/holiday">법정공휴일 등록</router-link></li>
      <li v-if="this.snbLink == 'vcode'"><router-link to="/vcode/member">부서별 부서원 조회</router-link></li>
      <li v-if="this.snbLink == 'vcode'"><router-link to="/vcode/insertAcnt">연도별 휴가 일수 등록</router-link></li>
      <li v-if="this.snbLink == 'vcode'"><router-link to="/vcode/forceRegi">근태 등록</router-link></li>
      <li v-if="this.snbLink == 'vcode'"><router-link to="/vcode/forceDel">근태 삭제</router-link></li>
      <li v-if="this.snbLink == 'vcode'"><router-link to="/vcode/template">템플릿 관리</router-link></li>
      <li v-if="this.snbLink == 'vcode'"><router-link to="/vcode/adminPwdChg">관리자 패스워드 변경</router-link></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Snb',
  props: ['snbLink']
}
</script>

<style>
</style>
