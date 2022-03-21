import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import Test from '../views/Test.vue'
import Login from '../components/Login.vue' // 로그인
import MyPage from '../views/mypage/MyPage.vue' // 마이페이지 부모 설정 vue
import AppReceive from '../views/mypage/AppReceive.vue' // 마이페이지 > 결재수신함
import AppSend from '../views/mypage/AppSend.vue' // 마이페이지 > 결재송신함
import PwdChg from '../views/mypage/PwdChg.vue' // 마이페이지 > 패스워드 변경
import Plando from '../views/plando/Plando.vue' // 업무실적 부모 설정 vue
import DeptPlando from '../views/plando/DeptPlando.vue' // 업무실적 > 부서별 업무실적 조회
import MyPlandoView from '../views/plando/MyPlandoView.vue' // 업무실적 > 업무실적 조회
import MyPlandoRegi from '../views/plando/MyPlandoRegi.vue' // 업무실적 > 업무실적 등록
import GoStop from '../views/gostop/GoStop.vue' // 근태 부모설정 vue
import MonthGostopView from '../views/gostop/MonthGostopView.vue' // 근태 > 월별 근태 조회
import GostopRegi from '../views/gostop/GostopRegi.vue' // 근태 > 근태 등록
import MyMonthView from '../views/gostop/MyMonthView.vue' // 근태 > 월별 개인 휴가 사용 현황
import YearView from '../views/gostop/YearView.vue' // 근태 > 년도별 사용자별 휴가 사용현황
import Vcode from '../views/vcode/Vcode.vue' // 기준사항 부모설정 vue
import CommonCode from '../views/vcode/CommonCode.vue' // 기준사항 > 공통코드 관리
import CalendarView from '../views/vcode/CalendarView.vue' // 기준사항 > 캘린더 조회
import DeptMember from '../views/vcode/DeptMember.vue' // 기준사항 > 부서별 부서원 조회
import MemberRegi from '../views/vcode/MemberRegi.vue' // 기준사항 > 부서원 등록
import HolidayRegi from '../views/vcode/HolidayRegi.vue' // 기준사항 > 법정공휴일 등록
import GostopForceRegi from '../views/vcode/GostopForceRegi.vue' // 근태 > 근태 강제등록
import GostopForceDel from '../views/vcode/GostopForceDel.vue' // 근태 > 근태 강제등록
import InsertAcnt from '../views/vcode/InsertAcnt.vue' // 기준사항 > 연도별 휴가 일수 등록
import DeptGostopView from '../views/gostop/DeptGostopView.vue' // 근태 > 부서별 근태 조회
import Template from '../views/vcode/Template.vue' // 근태 > 템플릿 관리
import AdminPwdChg from '../views/vcode/AdminPwdChg.vue' // 근태 > 관리자 패스워드 변경
// import store from '../store/index.js'

Vue.use(VueRouter)

const requireAuth = () => (to, from, next) => {
  // console.log('login', store.state.loginState)
  // console.log('login', sessionStorage.chiefYn)
  if (sessionStorage.chiefYn === 'Y') {
    return next()
  }
  alert('관리자만 조회 가능한 화면입니다.')
  next(false)
}

const requireAuth2 = () => (to, from, next) => {
  if (sessionStorage.chiefYn === 'Y' || sessionStorage.dept === '1') {
    return next()
  }
  alert('관리자와 경영지원팀만 조회 가능한 화면입니다.')
  next(false)
}

const routes = [
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // },
  {
    path: '/test',
    name: 'Test',
    component: Test
  },
  {
    path: '/',
    component: Login,
    name: 'Login'
  },
  // {
  //   path: '/login',
  //   component: Login
  // },
  {
    path: '/mypage',
    component: MyPage,
    children: [
      {
        path: '/mypage/receive',
        component: AppReceive,
        name: 'AppReceive'
      },
      {
        path: '/mypage/send',
        component: AppSend
      },
      {
        path: '/mypage/pwdchg',
        component: PwdChg
      }
    ]
  },
  {
    path: '/plando',
    component: Plando,
    children: [
      {
        path: '/plando/dept',
        component: DeptPlando
      },
      {
        path: '/plando/view',
        component: MyPlandoView
      },
      {
        path: '/plando/regi',
        component: MyPlandoRegi
      }
    ]
  },
  {
    path: '/gostop',
    component: GoStop,
    children: [
      {
        path: '/gostop/view',
        component: MonthGostopView
      },
      {
        path: '/gostop/regi',
        component: GostopRegi
      },
      {
        path: '/gostop/mymonth',
        component: MyMonthView
      },
      {
        path: '/gostop/year',
        component: YearView,
        beforeEnter: requireAuth()
      },
      {
        path: '/gostop/dept',
        component: DeptGostopView,
        beforeEnter: requireAuth2()
      }
    ]
  },
  {
    path: '/vcode',
    component: Vcode,
    children: [
      {
        path: '/vcode/common',
        component: CommonCode
      },
      {
        path: '/vcode/calendar',
        component: CalendarView
      },
      {
        path: '/vcode/member',
        component: DeptMember
      },
      {
        path: '/vcode/regi',
        component: MemberRegi
      },
      {
        path: '/vcode/insertAcnt',
        component: InsertAcnt
      },
      {
        path: '/vcode/holiday',
        component: HolidayRegi
      },
      {
        path: '/vcode/forceRegi',
        component: GostopForceRegi
      },
      {
        path: '/vcode/forceDel',
        component: GostopForceDel
      },
      {
        path: '/vcode/template',
        component: Template
      },
      {
        path: '/vcode/adminPwdChg',
        component: AdminPwdChg
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
