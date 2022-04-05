<template>
  <div class="Slidebox" @click.self="cancel">
    <transition name="fadeIn">
      <div class="slide-main-box" v-show="showIf">
        <div class="slide-btn-box">
          <div class="slide-btn" @click.stop="cancel">取消</div>
          <div class="g-choose-num">{{chooseNum}}</div>
          <div class="slide-btn" @click.stop="sendInfo">完成</div>
        </div>
        <div class="slide-frame"></div>
        <div class="slide-box">
          <swiper v-if="optionArrayNow.length>0" :options="json.swiperOption" ref="mySwiper" :class="'Swiper j-slide' + indexs" v-for="(json,indexs) in optionArrayNow" :key="indexs">
            <swiper-slide v-for="(item,index) in Crange(indexs)" :key="index" class="flex-box Item" v-show="dateNumber(item, indexs)">
              <div class="con">{{item+unit(indexs)}}</div>
            </swiper-slide>
          </swiper>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    data () {
      var _this = this;
      return {
        choseJson: {},
        optionArrayNow: [],
        showIf: false,
        chooseNum: '',
        nowMonth: Number(new Date().format('MM')),
        nowDate: Number(new Date().format('dd')),
        nowYear: Number(new Date().format('yyyy')),
        first: true,
        slideHour: false,//是否是切换小时
      }
    },
    mounted () {
      this.optionArray.forEach((val,index) => {
        this.choseJson[val.name] = this.Crange(index)[0];
        var _this = this;
        let initialVal = this.initialFun(index);
        val.swiperOption = {
          initialSlide: initialVal >= 0 ? initialVal : 0,
          centeredSlides: !0,
          watchSlidesProgress: !0,
          direction: 'vertical',
          onSetTransition: function (a, b) {
            var es;
            for (var c = 0; c < a.slides.length; c++) es = a.slides[c].style,
              es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = b + "ms"
          },
          onTransitionEnd: function (swiper) {
            let index = swiper.container[0].classList[2].slice(-1);
            _this.activeIndex(index,swiper.activeIndex)
          },
          onProgress: function (a) {
            for (let i = 0; i < a.slides.length; i++) {
              var slide = a.slides.eq(i);
              var slideProgress = a.slides[i].progress;
              let modify = 1;
              if (Math.abs(slideProgress) > 1) {
                modify = (Math.abs(slideProgress) - 1) * 0.3 + 1;
              }
              let scale = 1 - Math.abs(slideProgress) / 2.5;
              slide.css('opacity', scale);
            }
          },
        };
        this.optionArrayNow.push(val);
        this.$nextTick(function () {
          this.showIf = this.show;
          this.swiper(index).slideTo(initialVal >= 0 ? initialVal : 0, 400, false);
        })
      });
    },
    computed: {
    },
    props: ['optionArray','show','initial'],
    methods: {
      Crange (index) {
        let arr = [],range = this.optionArray[index].range;
        if (range.length > 2 || typeof range[0] === 'string') { //不是时间范围
          range.forEach(val => {
            arr.push(val)
          })
        } else { //时间范围
          if (range[0] > range[1]) {
            for (let i = range[0];i >= range[1];i--) {
              if (i < 10) {
                i = '0' + i
              }
              arr.push(i)
            }
          } else {
            for (let i = range[0];i <= range[1];i++) {
              if (i < 10) {
                i = '0' + i
              }
              arr.push(i)
            }
          }
        }
        return arr
      },
      //默认选项位置获取
      initialFun (index) {
        let toIndex = this.Crange(index).indexOf(this.initial[index]);
        if (this.optionArray[0].name === 'year') {//年月日选择
          if (Number(this.initial[0]) === this.nowYear && index === 1) {
            toIndex -= this.nowMonth - 1;
          }
          if (Number(this.initial[0]) === this.nowYear && Number(this.initial[1]) === this.nowMonth && index === 2) {
            toIndex -= this.nowDate - 1;
          }
        }
        return toIndex;
      },
      //取消按钮
      cancel () {
        this.$emit('cancel');
      },
      //发送选择内容
      sendInfo () {
        this.$emit('getInfo',this.choseJson);
      },
      //判断日期月份显现
      dateNumber (num, indexs) {
        if (this.optionArray[0].name !== 'year') {//不是年月日选择
          return true
        }
        let number = Number(this.choseJson.date);
        let year = Number(this.choseJson.year);
        let month = Number(this.choseJson.month);
        if (year === this.nowYear && indexs === 1 && Number(num) < this.nowMonth) {//今月之前
          return false
        }
        if (indexs !== 2) {//非日期选择swiper
          return true
        }
        if (year === this.nowYear && Number(num) < this.nowDate && month === this.nowMonth) {//今日之前
          return false
        }
        if (num === 31) {//判断大月小月
          if (month <= 7) {
            if (month % 2 === 0) {
              return false
            } else {
              return true
            }
          } else {
            if (month % 2 === 0) {
              return true
            } else {
              return false
            }
          }
        }
        if (num === 30 && month === 2) {//判断2月
          return false
        }
        if (num === 29 && year % 4 === 0 && month === 2) {//判断闰年
          return false
        }
        return true
      },
      //获得当前选择的内容
      activeIndex (index,i) {
        /*第一次进入*/
        if (index == 2) {
          this.first = false;
        }
        /*选择年月日时切换效果*/
        this.choseJson[this.optionArray[index].name] = this.Crange(index)[i];
        if (this.optionArray[index].name === 'year' && !this.first) {//切换year改变月日
          this.$refs.mySwiper[1].swiper.slideTo(0);
          this.$refs.mySwiper[2].swiper.slideTo(0);
          this.choseJson.month = this.Crange(1)[0];
          this.choseJson.date = this.Crange(2)[0];
        }
        if (this.optionArray[index].name === 'month' && !this.first) {//切换month改变日
          this.$refs.mySwiper[2].swiper.slideTo(0);
          if (this.choseJson.year === this.nowYear && Number(this.choseJson.month) === 1) {
            this.choseJson.date = this.Crange(2)[this.nowDate - 1];
          } else {
            this.choseJson.date = this.Crange(2)[0];
          }
        }

        /*选择上下午时间切换效果*/
        if (this.optionArray[index].name === 'halfDay' && !this.slideHour) {
          if (this.choseJson.halfDay === '上午' && !this.first) {
            this.$refs.mySwiper[1].swiper.slideTo(0);
            this.$refs.mySwiper[2].swiper.slideTo(0);
            this.choseJson.month = this.Crange(1)[0];
            this.choseJson.date = this.Crange(2)[0];
          }
          if (this.choseJson.halfDay === '下午' && !this.first) {
            this.$refs.mySwiper[1].swiper.slideTo(4);
            this.$refs.mySwiper[2].swiper.slideTo(0);
            this.choseJson.month = this.Crange(1)[4];
            this.choseJson.date = this.Crange(2)[0];
          }
        }

        /*选择小时时间切换效果*/
        if (this.optionArray[index].name === 'hour') {
          this.slideHour = true;
          if (i >= 4 && !this.first) {
            this.$refs.mySwiper[0].swiper.slideTo(1);
            setTimeout(() => {
              this.slideHour = false;
            }, 500);
          }
          if (i < 4 && !this.first) {
            this.$refs.mySwiper[0].swiper.slideTo(0);
            setTimeout(() => {
              this.slideHour = false;
            }, 500);
          }
        } else {
          this.slideHour = false;
        }
        /*选择时间之后取值变换*/
        if (this.optionArray[index].name === 'hour' || this.optionArray[index].name === 'minute') {
          this.chooseNum = this.choseJson.hour + ':' + this.choseJson.minute;
        }
        /*选择年月日之后取值变换*/
        if (this.optionArray[index].name === 'year' || this.optionArray[index].name === 'month' || this.optionArray[index].name === 'date') {
          if (this.optionArray[index].name !== 'date' && this.choseJson.year === this.nowYear) {
            this.choseJson.month = this.Crange(1)[i + this.nowMonth - 1];
          }
          if (this.optionArray[index].name !== 'month' && this.choseJson.year === this.nowYear && Number(this.choseJson.month) === this.nowMonth) {
            this.choseJson.date = this.Crange(2)[i + this.nowDate - 1];
          }
          this.chooseNum = this.choseJson.year + '.' + this.choseJson.month + '.' + this.choseJson.date;
        }
      },
      translateData (index,i) {

      },
      //当前的swiper ref
      swiper (index) {
        return this.$refs.mySwiper[index].swiper;
      },
      unit (index) {
        return this.optionArray[index].unit
      }
    },
    watch: {
      optionArray: function (nowVal,oldVal) {
        nowVal.forEach((val,index) => {
          this.choseJson[val.name] = this.Crange(index)[0];
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../assets/css/mixin';
  .Slidebox{
    position: fixed;
    left: 0;
    bottom: 0;
    @include wh(100vw,100vh);
    background: RGBA(0, 0, 0, 0.45);
    overflow: hidden;
    z-index: 99;
  }
  .slide-main-box{
    @include center;
    width: calc(100% - 1.36rem);
    background: #fff;
    overflow: hidden;
    border-radius: .16rem;
    .slide-btn-box{
      position: relative;
      z-index: 999;
      @include wh(100%,.98rem);
      @include fj();
      background: linear-gradient(to right,#68B0FC,#3F7DEF);
      align-items: center;
      border-radius: .16rem .16rem 0 0;
      .slide-btn{
        padding: 0 .68rem;
        @include sc(.28rem,#fff);
        line-height: 1.04rem;
      }
      .g-choose-num{
        @include sc(.28rem,#fff);
        line-height: .4rem;
      }
    }
    .slide-frame{
      position: absolute;
      left: 0;
      top: 2.8rem;
      @include wh(100%,.8rem);
      border-top: .02rem solid #EEEEEE;
      border-bottom: .02rem solid #EEEEEE;
    }
  }
  .slide-box{
    @include fj();
    padding: 0 .4rem;
  }
  .Swiper{
    flex: 1;
    height: .8rem;
    margin-top: 1.76rem;
    margin-bottom: 1.76rem;
    overflow: initial;
    .swiper-wrapper{
      height: .8rem;
    }
    .Item{
      position: relative;
      height: .8rem;
      &.swiper-slide-active{
        .con{
          font-size: .3rem;
          color: #333333;
          //color: inherit;
          font-weight: 500;
        }
      }
      .con{
        text-align: center;
        margin: 0 auto;
        @include sc(.28rem,#333);
        font-weight: 400;
        transition:all 0.35s ease-out 0s;
      }
    }
  }
</style>
