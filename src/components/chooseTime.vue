<template>
  <div>
    <div class="g-item-timechoose flex-box">
      <div class="g-date flex-box" @click.stop="slideShow1 = true">
        <i class="iconfont icon-time-circle"></i>
        <p v-if="timeChooseInfo.yearStart">{{timeChooseInfo.yearStart}}年{{timeChooseInfo.monthStart}}月{{timeChooseInfo.dateStart}}日周{{new Date(timeChooseInfo.yearStart+'-'+timeChooseInfo.monthStart+'-'+timeChooseInfo.dateStart).getDay() | day}}</p>
        <p class="c-grey" v-else>请选择日期</p>
      </div>
      <div class="g-time flex-box" @click.stop="slideShow3 = true">
        <p v-if="timeChooseInfo.hourStart">{{timeChooseInfo.hourStart}}:{{timeChooseInfo.minuteStart}}</p>
        <p class="c-grey" v-else>请选择时间</p>
        <i class="iconfont icon-xiangyou"></i>
      </div>
    </div>
    <div class="g-item-timechoose flex-box">
      <div class="g-date flex-box" @click.stop="slideShow2 = true">
        <i class="iconfont icon-time-circle"></i>
        <p v-if="timeChooseInfo.yearEnd">{{timeChooseInfo.yearEnd}}年{{timeChooseInfo.monthEnd}}月{{timeChooseInfo.dateEnd}}日周{{new Date(timeChooseInfo.yearEnd+'-'+timeChooseInfo.monthEnd+'-'+timeChooseInfo.dateEnd).getDay() | day}}</p>
        <p class="c-grey" v-else>请选择日期</p>
      </div>
      <div class="g-time flex-box" @click.stop="slideShow4 = true">
        <p v-if="timeChooseInfo.hourEnd">{{timeChooseInfo.hourEnd}}:{{timeChooseInfo.minuteEnd}}</p>
        <p class="c-grey" v-else>请选择时间</p>
        <i class="iconfont icon-xiangyou"></i>
      </div>
    </div>
    <div class="flex-box" style="flex-wrap: wrap">
      <div class="g-choose-box" :class="{'active': endTimeNum === 1}" @click="endTimeCheck(1)">当天12:30</div>
      <div class="g-choose-box" :class="{'active': endTimeNum === 2}" @click="endTimeCheck(2)">当天18:30</div>
      <div class="g-choose-box" :class="{'active': endTimeNum === 3}" @click="endTimeCheck(3)">第二天12:30</div>
      <div class="g-choose-box" :class="{'active': endTimeNum === 4}" @click="endTimeCheck(4)">第二天18:30</div>
    </div>
    <!--起始时间年月选择列表-->
    <transition name="fadeIn">
      <v-slideSelect v-if="slideShow1" :show="slideShow1" :optionArray="options1" :initial="[timeChooseInfo.yearStart,timeChooseInfo.monthStart,timeChooseInfo.dateStart]" @cancel="cancel" @getInfo="getInfo($event,1)"></v-slideSelect>
    </transition>
    <!--起始时间时间选择列表-->
    <transition name="fadeIn">
      <v-slideSelect v-if="slideShow3" :show="slideShow3" :optionArray="options2" :initial="[timeChooseInfo.halfDayStart,timeChooseInfo.hourStart,timeChooseInfo.minuteStart]" @cancel="cancel" @getInfo="getInfo($event,3)"></v-slideSelect>
    </transition>
    <!--结束时间年月选择列表-->
    <transition name="fadeIn">
      <v-slideSelect v-if="slideShow2" :show="slideShow2" :optionArray="options1" :initial="[timeChooseInfo.yearEnd,timeChooseInfo.monthEnd,timeChooseInfo.dateEnd]" @cancel="cancel" @getInfo="getInfo($event,2)"></v-slideSelect>
    </transition>
    <!--结束时间时间选择列表-->
    <transition name="fadeIn">
      <v-slideSelect v-if="slideShow4" :show="slideShow4" :optionArray="options2" :initial="[timeChooseInfo.halfDayEnd,timeChooseInfo.hourEnd,timeChooseInfo.minuteEnd]" @cancel="cancel" @getInfo="getInfo($event,4)"></v-slideSelect>
    </transition>
  </div>
</template>

<script>
  import {mapState, mapActions, mapMutations} from 'vuex'
  import * as getData from '../service/getData'
  import * as mobile from '../config/mUtils'
  export default {
    props: {
      timeInfo: {
        type: Object
      }
    },
    data () {
      return {
        options1: [
          {
            range: [Number(new Date().format('yyyy')), Number(new Date().format('yyyy')) + 10],
            unit: '年',
            name: 'year'
          },
          {
            range: [1, 12],
            unit: '月',
            name: 'month'
          },
          {
            range: [1, 31],
            unit: '日',
            name: 'date'
          },
        ],//年月列表
        options2: [
          {
            range: ['上午', '下午'],
            unit: '',
            name: 'halfDay'
          },
          {
            range: [8, 18],
            unit: '',
            name: 'hour'
          },
          {
            range: ['00', '30'],
            unit: '',
            name: 'minute'
          },
        ],//时间列表
        timeChooseInfo: {
          yearStart: '',//被选择的开始年
          monthStart: '',//被选择的开始月
          dateStart: '',//被选择的开始日
          hourStart: '',//被选择的开始小时
          minuteStart: '',//被选择的开始分钟
          halfDayStart: '',//被选择的开始上下午
          yearEnd: '',//被选择的结束年
          monthEnd: '',//被选择的结束月
          dateEnd: '',//被选择的结束日
          hourEnd: '',//被选择的结束小时
          minuteEnd: '',//被选择的结束分钟
          halfDayEnd: '',//被选择的开始上下午
        },
        endTimeNum: '',//结束时间选择项
        slideShow1: false,
        slideShow2: false,
        slideShow3: false,
        slideShow4: false,
      }
    },
    created () {
    },
    mounted () {
      if (this.timeInfo) {
        this.timeChooseInfo = this.timeInfo;
      }
    },
    computed: {
    },
    methods: {
      isNowDate (type) {
        if (this.timeChooseInfo['year' + type] == new Date().format('yyyy') && this.timeChooseInfo['month' + type] == new Date().format('MM') && this.timeChooseInfo['date' + type] == new Date().format('dd')) {
          return true
        } else {
          return false
        }
      },
      isNowTime (val) {
        if (val.hour < new Date().format('hh') || (val.hour == new Date().format('hh') && val.minute < new Date().format('mm'))) {
          return true
        } else {
          return false
        }
      },
      endTimeCheck (num) {
        if (this.timeChooseInfo.yearStart === '') {
          mobile.toast('请先选择起始时间');
          return
        }
        if (this.endTimeNum === num) {
          this.endTimeNum = '';
        } else {
          this.endTimeNum = num;
          this.timeChooseInfo.yearEnd = this.timeChooseInfo.yearStart;
          this.timeChooseInfo.monthEnd = this.timeChooseInfo.monthStart;
          if (num === 1 || num === 2) {
            this.timeChooseInfo.dateEnd = this.timeChooseInfo.dateStart;
            if (num === 1) {
              if ((Number(new Date().format('hh')) === 12 && Number(new Date().format('mm') > 30)) || Number(new Date().format('hh')) > 12) {
                this.endTimeNum = '';
                mobile.toast('请选择有效时间');
                return
              }
              this.timeChooseInfo.hourEnd = 12;
              this.timeChooseInfo.minuteEnd = '30';
              this.timeChooseInfo.halfDayEnd = '下午';
            } else {
              if ((Number(new Date().format('hh')) === 18 && Number(new Date().format('mm') > 30)) || Number(new Date().format('hh')) > 18) {
                this.endTimeNum = '';
                mobile.toast('请选择有效时间');
                return
              }
              this.timeChooseInfo.hourEnd = 18;
              this.timeChooseInfo.minuteEnd = '30';
              this.timeChooseInfo.halfDayEnd = '下午';
            }
          }
          if (num === 3 || num === 4) {
            let startDate = new Date(`${this.timeChooseInfo.yearStart}-${this.timeChooseInfo.monthStart}-${this.timeChooseInfo.dateStart}`);
            startDate = new Date(startDate.setDate(startDate.getDate() + 1));
            this.timeChooseInfo.monthEnd = Number(startDate.format('MM'));
            this.timeChooseInfo.dateEnd = Number(startDate.format('dd'));
            this.timeChooseInfo.dateEnd = this.timeChooseInfo.dateEnd < 10 ? '0' + this.timeChooseInfo.dateEnd : this.timeChooseInfo.dateEnd;
            this.timeChooseInfo.monthEnd = this.timeChooseInfo.monthEnd < 10 ? '0' + this.timeChooseInfo.monthEnd : this.timeChooseInfo.monthEnd;
            if (num === 3) {
              this.timeChooseInfo.hourEnd = 12;
              this.timeChooseInfo.minuteEnd = '30';
              this.timeChooseInfo.halfDayEnd = '下午';
            } else {
              this.timeChooseInfo.hourEnd = 18;
              this.timeChooseInfo.minuteEnd = '30';
              this.timeChooseInfo.halfDayEnd = '下午';
            }
          }
        }
      },
      //所有列表隐藏
      cancel () {
        this.slideShow1 = false;
        this.slideShow2 = false;
        this.slideShow3 = false;
        this.slideShow4 = false;
      },
      //获得并赋值选择项
      getInfo (val,type) {
        this.cancel();
        this.endTimeNum = '';
        if (type === 1) {//起始日期
          /*this.hourStart = '';
          this.minuteStart = '';
          this.halfDayStart = '';*/
          this.timeChooseInfo.hourEnd = '';
          this.timeChooseInfo.minuteEnd = '';
          this.timeChooseInfo.halfDayEnd = '';

          this.timeChooseInfo.yearStart = this.timeChooseInfo.yearEnd = val.year;
          this.timeChooseInfo.monthStart = this.timeChooseInfo.monthEnd = val.month;
          this.timeChooseInfo.dateStart = this.timeChooseInfo.dateEnd = val.date;
        } else if (type === 2) {//结束日期
          if (this.timeChooseInfo.yearStart === '') {
            mobile.toast('请先选择起始日期');
            return
          }
          if ((Number(val.date) < Number(this.timeChooseInfo.dateStart) && Number(val.year) === Number(this.timeChooseInfo.yearStart) && Number(val.month) === Number(this.timeChooseInfo.monthStart)) || (Number(val.year) === Number(this.timeChooseInfo.yearStart) && Number(val.month) < Number(this.timeChooseInfo.monthStart)) || (Number(val.year) < Number(this.timeChooseInfo.yearStart))) {
            mobile.toast('请大于起始日期');
            return
          }
          //console.log(Number(val.date) - Number(this.dateStart))
          const startDate = new Date(this.timeChooseInfo.yearStart + '-' + this.timeChooseInfo.monthStart + '-' + this.timeChooseInfo.dateStart);
          const endDate = new Date(val.year + '-' + val.month + '-' + val.date);
          if ((endDate - startDate) / 1000 / 3600 / 24 > 7) {
            mobile.toast('最多延续一周');
            return
          }
          this.timeChooseInfo.hourEnd = '';
          this.timeChooseInfo.minuteEnd = '';
          this.timeChooseInfo.halfDayEnd = '';
          this.timeChooseInfo.dateEnd = val.date;
          this.timeChooseInfo.yearEnd = val.year;
          this.timeChooseInfo.monthEnd = val.month;
        } else if (type === 3) {//开始时间
          if (this.timeChooseInfo.yearStart === '') {
            mobile.toast('请先选择日期');
            return
          }
          if (val.hour === 18 && val.minute === '30') {
            mobile.toast('开始时间不得为下午6点半');
            return
          }
          this.timeChooseInfo.hourStart = val.hour;
          this.timeChooseInfo.minuteStart = val.minute;
          this.timeChooseInfo.halfDayStart = val.halfDay;
          if (this.timeChooseInfo.dateEnd !== this.timeChooseInfo.dateStart) {
            return
          }
          if (this.timeChooseInfo.minuteStart === '00') {
            this.timeChooseInfo.hourEnd = this.timeChooseInfo.hourStart;
            this.timeChooseInfo.minuteEnd = '30';
          } else {
            this.timeChooseInfo.hourEnd = Number(this.timeChooseInfo.hourStart) + 1;
            this.timeChooseInfo.hourEnd = this.timeChooseInfo.hourEnd < 10 ? '0' + this.timeChooseInfo.hourEnd : this.timeChooseInfo.hourEnd;
            this.timeChooseInfo.minuteEnd = '00';
          }
          if (this.isNowTime({hour: this.timeChooseInfo.hourEnd, minute: this.timeChooseInfo.minuteEnd})) {
            let nowHour = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours();
            let nextHour = (new Date().getHours() + 1) < 10 ? '0' + (new Date().getHours() + 1) : (new Date().getHours() + 1);
            this.timeChooseInfo.hourEnd = new Date().format('mm') < 30 ? nowHour : nextHour;
            this.timeChooseInfo.minuteEnd = new Date().getMinutes() < 30 ? '30' : '00';
          }
          if (Number(this.timeChooseInfo.hourEnd) >= 12) {
            this.timeChooseInfo.halfDayEnd = '下午';
          } else {
            this.timeChooseInfo.halfDayEnd = this.timeChooseInfo.halfDayStart;
          }
        } else if (type === 4) {//结束时间
          if (this.timeChooseInfo.yearStart === '') {
            mobile.toast('请先选择日期');
            return
          }
          if (val.hour === '08' && val.minute === '00') {
            mobile.toast('结束时间不得为上午8点');
            return
          }
          if (this.isNowDate('End')) {
            if (this.isNowTime(val)) {
              mobile.toast('请大于现在的时间');
              return
            }
          }
          this.timeChooseInfo.hourEnd = val.hour;
          this.timeChooseInfo.minuteEnd = val.minute;
          this.timeChooseInfo.halfDayEnd = val.halfDay;
        }
      },
    },
    components: {
    },
    watch: {
      timeChooseInfo:{
        handler: function (val, oldval) {
          this.$emit('timeChooseInfo', val);
        },
        deep: true//对象内部的属性监听，也叫深度监听
      },
      'timeChooseInfo.hourEnd': function (nowVal, oldVal) {
        if (this.dateEnd !== this.dateStart) {
          return
        }
        //console.log(nowVal,this.hourStart)
        if (nowVal <= this.timeChooseInfo.hourStart) {//结束时间小于等于开始相同
          if (this.minuteEnd === '00') {
            this.timeChooseInfo.hourStart = this.timeChooseInfo.hourEnd - 1;
            this.timeChooseInfo.hourStart = this.timeChooseInfo.hourStart < 10 ? '0' + this.timeChooseInfo.hourStart : this.timeChooseInfo.hourStart;
            this.timeChooseInfo.minuteStart = '30';
            if (this.timeChooseInfo.hourStart < 12) {
              this.timeChooseInfo.halfDayStart = '上午';
            } else {
              this.timeChooseInfo.halfDayStart = '下午';
            }
          } else {
            this.timeChooseInfo.hourStart = this.timeChooseInfo.hourEnd;
            this.timeChooseInfo.minuteStart = '00';
            this.timeChooseInfo.halfDayStart = this.timeChooseInfo.halfDayEnd;
          }
        }
      }
    },
    filters: {
      day (val) {
        switch (val) {
          case 1:
            return '一';
          case 2:
            return '二';
          case 3:
            return '三';
          case 4:
            return '四';
          case 5:
            return '五';
          case 6:
            return '六';
          case 0:
            return '日';
          default:
            return val;
        }
      },
    }
  }
</script>
<style scoped lang="scss">
  @import '../assets/css/mixin';

</style>

