<template>
  <div>
    <div class="g-date flex-box">
      <i class="iconfont icon-xiangzuoyuanjiantouzuojiantouxiangzuoxianxing" @click="premonth"></i>
      <p v-if="myDate.month<9">{{myDate.year}}-0{{myDate.month+1}}</p>
      <p v-else>{{myDate.year}}-{{myDate.month+1}}</p>
      <i class="iconfont icon-xiangzuoyuanjiantouzuojiantouxiangzuoxianxing1" @click="nextmonth"></i>
    </div>
    <swiper :options="swiper1Option" ref="mySwiper" class="flex-box g-week">
      <swiper-slide class="g-week-day" v-for="(item,key) in dayweek" :key="key">
        <p class="p1">周{{item.gweek}}</p>
        <p class="p2" v-if="item.gday<10">0{{item.gday}}</p>
        <p class="p2" v-else>{{item.gday}}</p>
      </swiper-slide>
    </swiper>
  </div>
</template>
<script>
  import * as getData from '../service/getData'
  import * as mobile from '../config/mUtils'
  import {mapState, mapMutations, mapActions} from 'vuex'

  export default {
    data() {
      return {
        swiper1Option: {
          pagination: '.swiperpage',
          paginationClickable: false,
          direction: 'horizontal',
          autoplay: 0,
          initialSlide: 0,
          autoplayDisableOnInteraction: false,
          slidesPerView: 7,
          centeredSlides: true,
          speed: 50,
          onSlideChangeEnd: swiper => {
            this.getindex(swiper.realIndex)
          },
          loop: false
        },
        year: 0,
        month: 0,
        day: 0,
        dayweek: [],
        realIndex: 0,
        myDate: {
          year: '',
          month: '',
          day: '',
          endDay: ''
        },
        chooseDate: {
          year: '',
          month: '',
          day: ''
        }
      }
    },
    mounted() {
      let myDate = new Date()
      this.myDate.year = myDate.getFullYear()
      this.myDate.month = myDate.getMonth()
      this.myDate.day = myDate.getDate()
      this.myDate.endDayDay = new Date().add('d', +14).getDate()

      this.chooseDate.year = myDate.getFullYear()
      this.chooseDate.month = myDate.getMonth()
      this.chooseDate.day = myDate.getDate()
      this.init()
      // this.$emit('yuyuedate',this.myDate);
    },
    components: {},
    computed: {
      swiper() {
        return this.$refs.mySwiper.swiper
      }
    },
    methods: {
      getindex(realIndex) {
        let choosedate = {}
        choosedate.year = this.myDate.year
        choosedate.month = this.myDate.month
        let nowDay = new Date().getDate()
        let nowMonth = new Date().getMonth()
        let endDate = new Date().add('d', +14)
        let endDay = endDate.getDate()
        let endMonth = endDate.getMonth()
        if ((this.myDate.month >= endMonth) && (endDay < realIndex + 1)) {
          this.swiper.slideTo(endDay - 1, 50, false)
          mobile.toast('最多预约2周之内的时间')
          choosedate.day = endDay
        } else if ((this.myDate.month === nowMonth) && (nowDay > realIndex + 1)) {
          this.swiper.slideTo(nowDay - 1, 50, false)
          mobile.toast('不能预约当天之前的时间')
          choosedate.day = nowDay
        } else {
          choosedate.day = realIndex + 1
        }
        this.chooseDate = choosedate
      },
      init() {
        this.year = this.myDate.year
        this.month = this.myDate.month
        this.day = this.myDate.day
        this.render(this.year, this.month)
      },

      // 整合为数组
      render(y, m) {
        let firstDayOfMonth = new Date(y, m, 1).getDate()         // 当月第一天
        let lastDateOfMonth = new Date(y, m + 1, 0).getDate()    // 当月最后一天
        this.dayweek = []
        for (var i = 1; i <= lastDateOfMonth; i++) {
          let week = new Date(y, m, i).getDay()
          week = this.changeweek(week)
          this.dayweek.push({
            gweek: week,
            gday: i
          })
        }
        this.swiper1Option.initialSlide = this.day - 1

        this.$refs.mySwiper.swiper.init()
      },

      // 将0~6转化为一 到 六
      changeweek(week) {
        if (week == 0) {
          return '日'
        } else if (week == 1) {
          return '一'
        } else if (week == 2) {
          return '二'
        } else if (week == 3) {
          return '三'
        } else if (week == 4) {
          return '四'
        } else if (week == 5) {
          return '五'
        } else if (week == 6) {
          return '六'
        }
      },
      nextmonth() {
        let endDate = new Date().add('d', +14)
        let endDay = endDate.getDate()
        let endMonth = endDate.getMonth()
        let month = this.myDate.month
        let realIndex = this.swiper.realIndex
        if (month == 11) {
          this.myDate.month = 0
          this.myDate.year = this.myDate.year + 1
        } else {
          this.myDate.month = this.myDate.month + 1
        }
        if (this.myDate.month > endMonth) {
          this.myDate.month = endMonth
          mobile.toast('最多预约2周之内的时间')
          return
        }
        this.myDate.day = 1
        this.init()
        // if ((this.myDate.month >= endMonth) && (endDay < realIndex + 1)) {
        //   this.swiper.slideTo(endDay - 1, 50, false)
        //   mobile.toast('最多预约2周之内的时间')
        //   this.myDate.day = endDay
        // }
        let chooseDate = this.myDate
        this.chooseDate = JSON.parse(JSON.stringify(chooseDate))
      },
      premonth() {
        let nowDay = new Date().getDate()
        let nowMonth = new Date().getMonth()
        let realIndex = this.swiper.realIndex
        let month = this.myDate.month
        if (month == 0) {
          this.myDate.month = 11
          this.myDate.year = this.myDate.year - 1
        } else {
          this.myDate.month = this.myDate.month - 1
        }
        if (this.myDate.month < nowMonth) {
          this.myDate.month = nowMonth
          mobile.toast('不能预约当天之前的时间')
          return
        }
        this.myDate.day = 1
        this.init()
        if ((this.myDate.month === nowMonth) && (nowDay > realIndex + 1)) {
          this.swiper.slideTo(nowDay - 1, 50, false)
          this.myDate.day = nowDay
        }
        let chooseDate = this.myDate
        this.chooseDate = JSON.parse(JSON.stringify(chooseDate))
      }
    },
    watch: {
      chooseDate: {
        deep: true,
        handler: function (val, oldVal) {
          this.$emit('yuyuedate', val)
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  @import '../assets/css/mixin';

  .g-date {
    @include wh(100%, .69rem);
    border-bottom: 1px solid #e9e9e9;
    justify-content: center;

    i {
      padding: 0 .1rem;
      @include sc(.3rem, #a8a8a8)
    }

    .g-shangyige {
      transform: rotate(180deg);
    }

    p {
      @include sc(.28rem, #4d4c4c);
      padding: 0 .3rem;
    }
  }

  .g-week {
    @include wh(100%, 1.8rem);
    align-items: flex-start;
    justify-content: space-around;
    border-bottom: 1px solid #e9e9e9;

    .g-week-day {
      padding: 0 .2rem;

      .p1 {
        @include sc(.26rem, #4d4c4c)
        line-height: .84rem;
        text-align: center;
      }

      .p2 {
        margin: .12rem auto 0;
        @include wh(.54rem, .54rem)
        border-radius: 50%;
        text-align: center;
        line-height: .54rem;
        @include sc(.26rem, #4d4c4c)
      }
    }

    .s-on {
      .p1 {
        color: #4a89dc;
      }

      .p2 {
        background-color: #4a89dc;
        color: #fff;
      }
    }
  }

</style>
