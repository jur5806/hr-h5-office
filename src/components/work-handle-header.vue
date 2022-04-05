
<template>
  <header :class="{'top-searchbar':true, 'flex-box':true,'c-login-bg':loginBg, 'searchbgs1': type, 'searchbgs2': !type}" v-if="$store.state.platform !== 'iOS'&&$store.state.platform !== 'Android'">
    <slot name="back"></slot>
    <div class="back" v-if="goBack" @click="$route.query.platform?bridges.GoBack():back()">
      <i class="iconfont icon-back1"></i>
    </div>
    <!--叉叉-->
    <div class="back" v-if="goBackFork" @click="$route.query.platform?bridges.GoBack():back()">
      <i class="iconfont icon-quxiao1"></i>
    </div>
    <div class="back" v-if="bridgeBack"  @click="bridges.GoBack">
      <i class="iconfont icon-back1"></i>
    </div>
    <div style="flex: 1" v-if="headTitle">
    <section class="title-head ellipsis">
      {{headTitle}}
    </section>
    </div>
    <slot name="tit-right"></slot>
    <slot name="icon"></slot>
    <slot name="jifenrule"></slot>
  </header>
</template>

<script>
  import {mapState, mapActions, mapMutations} from 'vuex'
  import * as getData from '../service/getData'
  export default {
    data () {
      return {

      }
    },
    created () {
      console.log(this.$store.state.platform)
    },
    props: ['searchKey', 'headTitle', 'goBack', 'bridgeBack', 'loginBg', 'goBackFork', 'serviceGet', 'type'],
    computed: {

    },

    methods: {
    	back() {
        this.$router.go(-1)
      }

    },
    components: {
    }
  }
</script>
<style scoped lang="scss">
  @import '../assets/css/mixin';
  .top-searchbar{
    position: relative;
    z-index: 200;
    height: .7rem;
   // border-bottom:1px solid #e5e5e5;
    .back{
      padding: 0.1rem 0.2rem;
      i{
        @include sc(.32rem,#FFFFFF)
      }
    }
    .searchbar-con{
      flex: 1;
      margin:0 .1rem;
    }
    .title-head{
      @include cl;
      line-height: .7rem;
      bottom: 0;
      width: 50%;
      text-align: center;
      font-size:.32rem;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(255,255,255,1);
    }
    &.c-login-bg{
      background: url("http://park.hzqisheng.cn/v3.5/login-bg.png") no-repeat;
      background-size: 100% auto;
      background-position: top center;
      border-bottom: 0 none;
    }
  }
  .searchbgs1{
    background: url("../assets/workorderimg/work-handle.png") no-repeat;
    background-size: 100% 100%;
  }
  .searchbgs2{
    background: url("../assets/workorderimg/work-handel1.png") no-repeat;
    background-size: 100% 100%;
  }
</style>
