<template>
  <div id="app" :class="appClass">
    <keep-alive v-if="!$route.meta.nokeepAlive">
      <router-view></router-view>
    </keep-alive>
    <router-view v-else></router-view>
  </div>
</template>

<script>
  import {mapState, mapMutations, mapActions} from 'vuex'
  import * as getData from './service/getData'
  import * as mobile from './config/mUtils'
  import wx from 'weixin-js-sdk'

  export default {
    name: 'app',
    data () {
      return {}
    },
    computed: {
      ...mapState([
        'platform'
      ]),
      appClass () {
        let arr = []
        arr.push(this.$store.state.platform)
        if (this.$store.state.phoneType == 1) {
          arr.push('phone-type-x')
        }
        if (!this.$store.state.platform && this.$store.state.h5phoneType == 1 && this.$store.state.first == 0) {
          arr.push('h5-phone-type-x')
        }
        return arr
      }
    },
    components: {},
    created () {
      //this.$store.state.user = {userId: 10};
    },
    mounted () {
      setTimeout(() => {
      }, 400)
    },
    methods: {},
    watch: {}
  }
</script>


<style lang="scss">
  @import 'assets/css/base';
  @import 'assets/css/style';
  @import 'assets/font/iconfont.css';
  @import 'assets/css/swiper-3.4.2.min.css';
  @import "assets/css/yyp-css";
  @import "assets/css/face";
  @import 'assets/css/enterprise';
  @import 'assets/css/meter';
  @import 'assets/font/visit-icon/iconfont.css';
  #app{
    height: 100%;
  }

  .g-fullsrceen {
    position: fixed;
    top: 6rem;
    z-index: 999;
    width: 100%;
  }

  @font-face {
    font-family: 'alterbatebold';
    src: url('assets/font/alterbatebold/alterbatebold.eot');
    src: url('assets/font/alterbatebold/alterbatebold.eot?#iefix') format('embedded-opentype'),
    url('assets/font/alterbatebold/alterbatebold.woff') format('woff'),
    url('assets/font/alterbatebold/alterbatebold.svg') format('svg'),
    url('assets/font/alterbatebold/alterbatebold.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'PingFangSC-Regular';
    src: url('./assets/font/SanFrancisco/SystemSanFranciscoDisplayRegular.ttf'); //你的资源目录
    font-weight: normal;
    font-style: normal;
  }
  @font-face {
    font-family: 'PingFangSC-Medium';
    src: url('./assets/font/SanFrancisco/SystemSanFranciscoDisplayMedium.ttf'); //你的资源目录
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'DigifaceWide';
    src: url('./assets/font/SanFrancisco/digifacewide.ttf'); //你的资源目录
    font-weight: normal;
    font-style: normal;
  }
</style>

