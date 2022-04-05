<template>
  <header :class="{'top-searchbar':true, 'flex-box':true,'c-login-bg':loginBg}"
          v-if="$store.state.platform !== 'iOS'&&$store.state.platform !== 'Android'">
    <slot name="back"></slot>
    <div class="back" v-if="goBack" @click="$route.query.platform?bridges.GoBack():back()">
      <i class="iconfont icon-back1"></i>
    </div>
    <!--叉叉-->
    <div class="back" v-if="goBackFork" @click="$route.query.platform?bridges.GoBack():back()">
      <i class="iconfont icon-quxiao1"></i>
    </div>
    <div class="back" v-if="bridgeBack" @click="bridges.GoBack">
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
      return {}
    },
    created () {
      console.log(this.$store.state.platform)
    },
    props: ['searchKey', 'headTitle', 'goBack', 'bridgeBack', 'loginBg', 'goBackFork', 'serviceGet'],
    computed: {},

    methods: {
      back () {
        this.$router.go(-1)
      }
    },
    components: {}
  }
</script>
<style scoped lang="scss">
  @import '../assets/css/mixin';

  .top-searchbar {
    position: relative;
    z-index: 200;
    height: 1rem;
    /* background:linear-gradient(135deg,rgba(20,158,255,1) 0%,rgba(44,122,238,1) 100%); */
    background: #4F7BE6;
    // border-bottom:1px solid #e5e5e5;
    .back {
      padding: 0.1rem 0.2rem;

      i {
        @include sc(.4rem, #FFFFFF)
      }
    }

    .searchbar-con {
      flex: 1;
      margin: 0 .1rem;
    }

    .title-head {
      @include cl;
      line-height: 1rem;
      bottom: 0;
      width: 50%;
      text-align: center;
      @include sc(0.36rem, #FFFFFF);
    }

    &.c-login-bg {
      background: url("http://park.hzqisheng.cn/v3.5/login-bg.png") no-repeat;
      background-size: 100% auto;
      background-position: top center;
      border-bottom: 0 none;
    }
  }
</style>
