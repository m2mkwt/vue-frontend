<template>
  <transition name="modal" appear>
  <div class="modal modal-overlay" v-if="visible" @click.self="$emit('close')">
  <div class="modal-window">
  <div class="modal-content">
    <div class="list-top-area">
      <label for="s1">년도 : </label>
      <label v-bind:value="tempData.selYear">{{ tempData.selYear }}</label>
      <label for="s2" class="ml10">성명 : </label>
      <!-- <select id="s2" title="select" @change="onChangeName($event)" v-model="selectedID">
        <option v-for="callName in callNames" v-bind:key="callName.id" v-bind:value="callName.id">{{ callName.name }}</option>
      </select> -->
      <label v-bind:value="tempData.userName">{{ tempData.userName }}</label>
    </div>
    <div class="clearfix mt30">
      <div class="d-ib">
        휴가사용일수/발생일수
        <span class="text-box">
          <!--<span v-bind:key="callUseDate.months" v-bind:value="callUseDate.months">{{ callUseDate }}</span> /10-->
          <!--<span>{{ eachDayOffList.acnt }} / {{ eachDayOffList.sumMinusDayoff }}</span>-->
          <span>{{ eachDayOffList.sumMinusDayoff }} / {{ eachDayOffList.acnt }}</span>
        </span>
      </div>
      <div class="d-ib fr">
        <span class="s-box t-red">&block; 휴가</span><span class="s-box">&block; 반차</span>
      </div>
    </div>
    <div class="tbl-area">
      <!-- table detail start -->
      <table class="tbl tb-detail mt10">
        <caption>디테일 테이블</caption>
        <colgroup>
          <col style="width:20%">
          <col style="width:40%">
          <col style="width:40%">
        </colgroup>
        <thead>
          <tr>
            <th>해당 월</th>
            <th>휴가날짜</th>
            <th>반차날짜</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="K in eachMonthOffList" v-bind:key="K.months">
            <th>{{ K.months }}</th>
            <td class="t-left">
              <span class="t-red">{{ K.dayOff }}</span>
            </td>
            <td class="t-left">
              <span class="t-blue">{{ K.halfOff }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- table detail end -->
    </div>
        <footer class="modal-footer">
          <slot name="footer">
            <button @click="$emit('update:visible', !visible)">닫기</button>
          </slot>
        </footer>
  </div>
  </div>
  </div>
  </transition>
</template>

<script>

export default {
  name: 'LookupVacationList',
  props: {
    visible: {
      type: Boolean,
      require: true,
      default: false
    },
    tempData: {
      userId: '',
      userName: '',
      selYear: ''
    },
    eachDayOffList: {
      acnt: '',
      sumMinusDayoff: ''
    },
    eachMonthOffList: {
    }
  },
  data () {
    return {
      monthsList: []
    }
  },
  close () {
    this.$emit('update:visible', false)
  }
}

</script>

<style lang="stylus" scoped>
.modal {
  &.modal-overlay {
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

  &-window {
    background: #fff;
    border-radius: 4px;
    overflow: hidden;
    width: 30%;
  }

  &-content {
    padding: 10px 20px;
  }

  &-footer {
    background: #ccc;
    padding: 10px;
    text-align: right;
  }
}

// 오버레이 트랜지션
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.4s;

  // 오버레이에 포함되어 있는 모달 윈도의 트랜지션
  .modal-window {
    transition: opacity 0.4s, transform 0.4s;
  }
}

// 딜레이가 적용된 모달 윈도가 제거된 후에 오버레이가 사라짐
.modal-leave-active {
  transition: opacity 0.6s ease 0.4s;
}

.modal-enter, .modal-leave-to {
  opacity: 0;

  .modal-window {
    opacity: 0;
    transform: translateY(-20px);
  }
}
</style>
