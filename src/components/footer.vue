<template>
  <div class="g-footer flex-box">
    <div class="g-navs" :class="on('index') ?'c-on':''" @click="changeTab('index')">
      <i class="iconfont icon-shouye"></i>
      <p>首页</p>
    </div>
    <!-- <div class="g-navs" :class="on('service') ?'c-on':''" @click="changeTab('service')">
      <i class="iconfont icon-fuwu"></i>
      <p>服务</p>
    </div>
    <div class="g-navs" :class="on('circle') ?'c-on':''" @click="changeTab('circle')">
      <i class="iconfont icon-quanzi-xuanzhong"></i>
      <p>圈子</p>
    </div> -->
    <div class="g-navs" :class="on('mine') ?'c-on':''" @click="changeTab('mine')">
      <i class="iconfont icon-gerenzhongxin-xuanzhong"></i>
      <p>我的</p>
    </div>
    <yd-popup class="g-confirm" v-model="showlogin" position="center" width="6.46rem" :close-on-masker="false">
      <div class="tit">提示</div>
      <p class="g-remindcont">该功能需登陆后才可使用，是否进行登录？</p>
      <div class="flex-box g-btnbox">
        <div class="btn g-bluebtn" @click="$router.push('/login')">登录</div>
        <div class="btn" @click="showlogin = false">再看看</div>
      </div>
    </yd-popup>
  </div>
</template>

<script>
  import {mapState, mapActions, mapMutations} from 'vuex'
  import * as getData from '../service/getData'
  import * as mobile from '../config/mUtils'
  export default {
    props:['navindex'],
    data () {
      return {
        index:'index',
        showlogin: false,
        parkToken: ''
      }
    },
    created () {
      this.index = this.navindex;
    },
    mounted () {
      this.parkToken = mobile.getStore('parkToken')
      this.parkToken = this.parkToken ? this.parkToken : this.$store.state.parkToken
    },
    computed: {
    },
    methods: {
      changeTab (path) {
        if (this.parkToken || path === 'index' || path === 'mine') {
          this.$router.push({path: path})
        } else {
          this.showlogin = true
        }
      },
      on (page) {
        return this.$route.path.indexOf(page) !== -1
      }
    },
    components: {
    }
  }
</script>
<style scoped lang="scss">
  @import '../assets/css/mixin';
  .g-footer{
    position: relative;
    z-index: 99;
    @include wh(100%,1rem);
    padding-top: .1rem;
    border-top: .02rem solid #e9e9e9;
    justify-content: space-around;
    text-align: center;
    .g-navs{
     /* padding: 0 .2rem;*/
      width: 25%;
      text-align: center;
      i{
        display: block;
        line-height: .48rem;
        @include sc(.48rem,#ACB3C3);
      }
      .icon-fuwu{
        font-size: .42rem;
      }
      .icon-gerenzhongxin-xuanzhong{
        font-size: .45rem;
      }
      p{
        @include sc(.18rem,#ACB3C3);
        text-align: center;
      }
    }
    .c-on{
      i,p{
        color: #4a89dc;
      }

    }


  }

</style>

