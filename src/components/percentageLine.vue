<template>
  <div class="interface flex-box">
    <div class="music" ref="progress">
      <div class="music1 flex-box" >
        <div class="progressbar" ref="prolen">
          <div class="probar" ref="probar">
            <span></span>
          </div>
        </div>
        <span>{{percentage}}%</span>
      </div>
    </div>
  </div>
</template>

<script>
  import * as mobile from '../config/mUtils'
  import * as getData from '../service/getData'
  export default {
    data(){
      return {
        percentage:'',
      }
    },
    mounted(){
      this.$refs.progress.addEventListener('touchstart', this.touchstart, false);
      this.$refs.progress.addEventListener('touchmove', this.touchmove, false);
      this.$refs.progress.addEventListener('touchend', this.touchend, false);
    },
    beforeDestroy(){

    },
    props: ['percentages','disabled'],
    methods: {
      init(){
        this.$refs.probar.style.width = this.percentage + '%';
        /*this.$refs.probar.style.width = 0;*/
      },
      getPoint(obj){
        var l = obj.offsetLeft;
        while (obj = obj.offsetParent) {
          l += obj.offsetLeft;
        }
        return l;
      },
      touchstart(event){

      },
      touchmove(event){
        var left = this.getPoint(this.$refs.prolen);
        var x = event.changedTouches[0].clientX;
        var width = this.$refs.prolen.offsetWidth;
        if(this.disabled){
          return
        }
        if (x - left >= 0 && x - left <= width) {

          this.$refs.probar.style.width = ((x - left) / width) * 100 + '%';
          this.percentage = Math.round(((x - left) / width) * 100)

        }
        if (x - left > width) {
          this.$refs.probar.style.width = '100%';
          this.percentage = 100
        }
      },
      touchend(event){
        if(this.disabled){
          return
        }
        var left = this.getPoint(this.$refs.prolen);
        var x = event.changedTouches[0].clientX;
        var width = this.$refs.prolen.offsetWidth;
        var per
        if (x - left >= 0 && x - left <= width) {
           per = ((x - left) / width) * 100 + '%';
           this.percentage = Math.round(((x - left) / width) * 100)
        }
        if (x - left > width) {
          per = '100%';
          this.percentage = 100
        }
        this.$emit('getpercentage',this.percentage);
      }
    },
    watch: {
      percentages(val){
        this.percentage = val
        this.init()
      },
      disabled(val){
        this.disabled = val
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import '../assets/css/mixin';
  .interface{
    justify-content:space-around;
    .music{
      margin-right: .25rem;
      .music1{
        span{
          flex: 1;
          width: .34rem;
          font-size:.2rem;
          color:#999999;
          word-break: normal;

        }
        .progressbar{
          position: relative;
          margin: 0 .2rem;
          width: 4.2rem;
          height: 2px;
          background: rgba(51,51,51,0.10);
          border-radius: .02rem;
          .probar{
            transition: width linear 0.2s;
            border-radius: .02rem;
            position: absolute;
            top: 0;
            left: 0;
            width: 0;
            height: 2px;
            background-color: #4A89DC;
            svg{
              @include center();
              z-index: 20;
              width: .3rem;
              line{
                stroke: rgba(255,255,255,.7);
              }
            }
            &:after{
              position: absolute;
              right: -.18rem;
              top: -.18rem;
              content: '';
              width: .36rem;
              height: .36rem;
              border-radius: 50%;
              background-color: #4A89DC;
            }
            span{
              position: absolute;
             /* top: -.06rem;
              right: -.07rem;
              width: .14rem;
              height: .14rem;
              border-radius: .07rem;
              background-color: #4A89DC;*/
            }
          }
        }
      }
      .music2{
        font-size: .24rem;
        color: #999999;
      }
    }
  }

</style>
