<template>
   <div class="g-loadinglist-box" ref="my_Loading">
     <slot></slot>
     <div class="g-loading-content">
       <div class="g-loading-box" v-show="loadingState === 0">已显示全部结果</div>
       <div class="g-loading-box" v-show="loadingState === 2&&loadingInfinite" @click="continueFun">显示更多结果</div>
       <div class="g-loading-box" v-show="loadingState === 3">发生了意想不到的错误</div>
       <div class="g-loading-box" v-show="loadingState === 1">
         <svg class="icon icon-loading"
              aria-hidden="false">
           <use :xlink:href="'#icon-loading'" fill="#D8DFE4"></use>
         </svg>
         正在加载中
       </div>
     </div>
   </div>
</template>

<script>
  import {mapState, mapActions, mapMutations} from 'vuex'
  import * as getData from '../service/getData'
  export default {
    data () {
      return {
        loadingState: 1, // 0: stop, 1: loading, 2: stopping loading ,3:loading error
      }
    },
    mounted () {
      this.continueFun();
    },
    props: {
      loadingInfinite: Function,
    },
    computed: {

    },

    methods: {
      continueFun () {
        this.loadingInfinite(this.finishInfinite);
      },
      finishInfinite (hideSpinner) {
        let states = 1;
        switch (hideSpinner) {
          case 'end':
            states = 0;
            break;
          case 'continue':
            states = 2;
            break;
          case 'error':
            states = 3;
            break;
          default:
            states = 1
        }
        this.loadingState = states
      },
    },
    components: {
    }
  }
</script>
<style scoped lang="scss">
  @import '../assets/css/mixin';
  .g-loadinglist-box{
    .g-loading-content{
      .g-loading-box{
        @include fj(center);
        padding-top: .53rem;
        @include sc(.26rem,#D8DFE4);
        line-height: .31rem;
        text-align: center;
        svg{
          display:block;
          margin-right:.2rem;
          width:.3rem;
          height:.3rem;
          fill: #555;
          will-change: transform;
          &.icon-arrow{
            transition: .2s;
            transform: rotate(180deg);
          }
        }
      }
    }
  }
</style>
