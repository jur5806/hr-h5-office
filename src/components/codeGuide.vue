<template>
  <div class="g-guide-box">
    <swiper :options="swiper9ption" ref="mySwiper2" class="g-guide-swiper">
      <swiper-slide v-for="(item,itemIndex) in 3" :key="itemIndex">
        <img class="g-guide-bg" :src="`../../static/img/guide-img${itemIndex+1}.jpg`" alt="">
      </swiper-slide>
      <div class="g-guide-pass" slot="scrollbar"  v-show="index!==2" @click="showNone">跳过</div>
      <div class="swiper-pagination guide-swiper-pagination" v-show="index!==2" slot="pagination"></div>
      <div class="g-guide-btn" slot="scrollbar"  v-show="index===2" @click="showNone">立即体验</div>
    </swiper>
  </div>
</template>

<script>
  import {mapState, mapActions, mapMutations} from 'vuex'
  import * as getData from '../service/getData'
  export default {
    data () {
      return {
        index: 0,
        swiper9ption: {
          pagination: '.swiper-pagination',
          loop: false,
          bulletClass: 'guide-bullet',
          bulletActiveClass: 'guide-bullet-active',
          onTransitionEnd: (swiper) => {
            this.index = swiper.activeIndex
          },
        },
      }
    },
    created () {
    },
    computed: {
    },
    methods: {
      showNone () {
        this.$refs.mySwiper2.swiper.slideTo(0, 500, false);
        this.index = 0;
        this.$emit('showNone', false);
      }
    },
    components: {
    },
    watch: {
    }
  }
</script>
<style scoped lang="scss">
  @import '../assets/css/mixin';
  .g-guide-box{
    position: fixed;
    @include wh(100vw,100vh);
    top: 0;
    left: 0;
    z-index: 1;
    background: #fff;
  }
  .g-guide-swiper{
    position: relative;
    @include wh(100%,100%);
    .g-guide-bg{
      @include wh(100%,100%);
      object-fit: fill;
    }
  }
  .g-guide-btn{
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto auto .7rem;
    width: 3rem;
    line-height: .68rem;
    height: .68rem;
    border-radius: .34rem;
    text-align: center;
    background: #fff;
    @include sc(.3rem,#143ACD);
    z-index: 1;
  }
  .g-guide-pass{
    position: absolute;
    right: .4rem;
    top: .4rem;
    width: 1rem;
    line-height: .56rem;
    height: .5rem;
    border-radius: .5rem;
    text-align: center;
    background: #404040;
    @include sc(.25rem,#fff);
    opacity: .8;
    z-index: 1;
  }
</style>

