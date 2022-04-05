<template>
  <transition name="router-fade" mode="out-in">
    <div class="mask" v-if="activeimg" @click="closeimg">
      <swiper :options="swiperOption" ref="mySwiper" class="swiper-container2">
        <swiper-slide class="flex-box" v-for="(item,index) in activeimg" :key="index">
          <video v-if="reg.test(item)" preload :src="item" controls="controls" playsinline x5-playsinline="true" ref="videoplay" id='videoplay'></video>
          <!--<video v-if="reg.test(item)" preload src="http://test-media-api.test176.cn/upload/interactionInfoPic/1543375980296.mp4" controls="controls" playsinline x5-playsinline="true" ref="videoplay" id='videoplay' @click="closeimg"></video>-->
          <img v-else-if="refgif.test(item)" :src="item" click="closeimg">
          <img v-else :src="item + '?x-oss-process=image/auto-orient,1'" @click="closeimg">
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
  </transition>
</template>

<script>
  export default {
    data(){
      var self=this
      return{
        reg: /\.(mp4|rmvb|avi|ts|MOV)$/i,
        refgif: /\.(gif)$/i,
        swiperOption: {
          pagination: '.swiper-pagination',
          paginationClickable: true,
          initialSlide :0,
          autoplayDisableOnInteraction : false,
        },
      }
    },
    created(){
      this.swiperOption.initialSlide = this.indeximg
    },
    props: ['activeimg','indeximg'],
    methods: {
      closeimg(){
        this.$emit('closeimg')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../assets/css/mixin';
  .mask{
    background-color: rgba(0,0,0,1);
    position: fixed;
    z-index: 999999;
    width: 100%;
    height: 100%;
    top:0;
    left:0;
    img,video{
      @include center();
      width: 100%;
    }
    video{
      max-height: 80%;
    }
  }
  .router-fade-enter-active, .router-fade-leave-active {
    transition: opacity .3s;
  }
  .router-fade-enter, .router-fade-leave-active {
    opacity: 0;
  }

</style>
