<template>
  <div class="warp page1">
    <v-scroll class="main-box2 scroll" ref="my_scroller">
      <div class="g-logo">
        <div class="g-page-title"></div>
        <img v-if="$store.state.channelAppLogoUrl" class="g-logo-img" :src="$store.state.channelAppLogoUrl" alt="">
        <img v-else class="g-logo-img" src="http://park.hzqisheng.cn/v3.5/logo.png" alt="">
      </div>
      <div class="g-login-box">
        <div class="g-wave">
          <span class="g-wave-span c-wave-white"></span>
          <span class="g-wave-span c-wave-white c-wave-center"></span>
          <span class="g-wave-span c-wave-white c-wave-gray"></span>
        </div>
        <div class="g-login-form">
          <div class="g-form-item">
            <div class="icon">
              <i class="iconfont icon-phone"></i>
            </div>
            <input type="text" v-model="phone" placeholder="请输入手机号">
          </div>
          <div class="g-form-item">
            <div class="icon">
              <i class="iconfont icon-anquan"></i>
            </div>
            <input type="text" @blur="bridges.scrollToTop()" v-model="phoneCode" placeholder="请输入验证码">
            <button class="g-vea-btn" @click="checktel">{{computedTime}}</button>
          </div>
        </div>
        <div class="g-login-btn" @click="checkAll">登录</div>
        <div class="g-agreement" @click="agree = !agree">
          <b :class="{'g-dot':true,'active':agree}"></b>
          点击确定表示同意《<span @click.stop="$router.push('/serviceAgreement')">服务协议</span>》
        </div>
      </div>
      <div class="g-submit-over flex-box" v-if="isOver">
        <div class="g-submit-over-box clearfix">
          <div class="g-over-pic">
            <img class="f-adapt-img" src="../assets/images/zzd-logo.png" alt="">
          </div>
          <div class="g-over-content">
            <p>园区用户请使用浙政钉</p>
            <p>查看相关服务</p>
            </div>
        </div>
      </div>
    </v-scroll>
  </div>
</template>
<script>
  import * as getData from '../service/getData'
  import * as mobile from '../config/mUtils'
  import {mapState, mapMutations,mapActions} from 'vuex'

  export default {
    data () {
      return {
        phone: '',
        phoneCode: '',
        computedTime: '获取',
        agree: true,
        isOver: false,
      }
    },
    activated () {
    },
    components: {
    },

    computed: {

    },
    methods: {
      checktel () {
        if (mobile.rule.empty(this.phone,'手机号码不能为空') && mobile.rule.phone(this.phone)) {
          if (typeof this.computedTime === 'number') {
            return
          }
          this.sendmess();
        }
      },
      sendmess () {
        getData.sendCode(this.phone, this.$store.state.channelId).then(res => {
          if (res.data.code !== 1) {
            mobile.toast(res.data.message);
            return
          }
          this.computedTime = 60;
          //倒计时
          this.timer = setInterval(() => {
            this.computedTime --;
            if (this.computedTime === 0) {
              this.computedTime = '重新获取';
              clearInterval(this.timer)
            }
          }, 1000)
        });
      },
      login () {
        let data = {
        username: this.phone,
        password: this.phoneCode
      }
        getData.checkLogin(data).then(res => {
          if (res.data.code === 200) {
            mobile.toast('登录成功')
            this.$router.replace({path: '/index'})
            return
            this.$store.state.userName = res.data.data.userName;
            mobile.setStore('userName', res.data.data.userName);
            this.$store.state.parkToken = res.data.data.userToken;
            mobile.setStore('parkToken', res.data.data.userToken);
            mobile.setSession('parkToken', res.data.data.userToken);
            this.$store.state.userPhone = res.data.data.userMobile;
            mobile.setStore('userPhone', res.data.data.userMobile);
            mobile.setStore('userCompanyId', res.data.data.userCompanyId);  
            this.$store.state.userConfirmState = res.data.data.userConfirmState;
            mobile.setStore('userConfirmState', res.data.data.userConfirmState);
            // mobile.setSession('channelId', res.data.data.userChannelId)

            let domain = mobile.getSession('domain');
            //园区用户信息存储cookie，存储60天
            // mobile.setCookie('channelId', res.data.data.channelId, 1);
            mobile.setCookie('parkToken', res.data.data.userToken, 1);
            mobile.setCookie('userPhone', res.data.data.userMobile, 1);
            //园区用户信息存储cookie共享到其他系统，不设置过期时间
            mobile.setCookie('userToken', res.data.data.userToken, '', domain);
            mobile.setCookie('userMobile', res.data.data.userMobile, '', domain);

            
            if (res.data.data.isLogin === 1) {
              if(res.data.data.userConfirmState == 1){
                this.$router.replace({path: '/perfectIdentity'})
                return
              }else if(res.data.data.userConfirmState == 2){
                this.$router.replace('/perfectIdentity?isOver=1')
                return
              }else if(res.data.data.userConfirmState == 4){
                mobile.toast('认证驳回，请重新提交')
                this.$router.replace('/perfectIdentity')
                return
              }else{
                if(res.data.data.userPostionState == 3 || res.data.data.userPostionState == 4){
                  this.isOver = true;
                  // 园区用户登录清除掉登录信息
                  mobile.removeStore('parkToken')
                  mobile.removeCookie('parkToken')
                  this.$store.state.parkToken = ''
                  mobile.removeCookie('userToken', domain)
                  mobile.removeCookie('userMobile', domain)
                  this.$store.state.userPhone = ''
                  return
                }else{
                  let path = mobile.getSession('paths')
                  let querys = JSON.parse(mobile.getSession('tempQuery'))
                  let fullPath = localStorage.getItem('fullPath')
                  if (fullPath) {
                    if(fullPath.indexOf('#')>-1){
                      window.location.href = fullPath
                    }else{
                      this.$router.replace(fullPath)
                    }
                    sessionStorage.clear()
                  } else {
                    this.$router.replace({path: '/index'})
                  }
                }
              }
            } else {
              this.$router.replace({path: '/perfectIdentity'})
              // if(mobile.getCookie("flag")){
              //   this.$router.replace({path: '/perfectIdentity'})
              // }else{
              //   this.$router.replace({path: '/chooseIdentity'})
              // }
            }

          } else {
            mobile.toast(res.data.message)
          }
        });
      },
      checkAll () {
        if (mobile.rule.empty(this.phone,'账号不能为空') && mobile.rule.empty(this.phoneCode, '密码不能为空')) {
          // if (this.agree === false) {
          //   mobile.toast('请同意服务协议！')
          // } else {
            this.login()
          // }
        }
      }

    }
  }

</script>
<style scoped lang="scss">
  @import '../assets/css/mixin';
  .page1{
    background-color: #fff;
  }
  .main-box2{
    overflow: hidden;
    overflow-y: auto;
  }
  .g-logo{
    position: relative;
    @include wh(100%,5.68rem);
    background: url("http://park.hzqisheng.cn/v3.5/login-bg.png") no-repeat;
    background-size: 100% auto;
    background-position: center top;
    .g-page-title{
      @include sc(.36rem,#fff);
      line-height: 1rem;
      text-align: center;
      height: 1rem;
    }
    .g-logo-img{
      display: block;
      margin: .33rem auto 0;
      @include wh(2.61rem,2.55rem);
    }
  }
  .g-login-box{
    position: relative;
    height: calc(100vh - 5.68rem);
    .g-login-form{
      padding-top: .41rem;
      .g-form-item{
        @include fj(flex-start);
        align-items: center;
        margin: 0 1.1rem;
        @include wh(auto,1.06rem);
        padding-top: .25rem;
        border-bottom: 1px solid #D8DFE4;
        .icon{
          width: .4rem;
          margin-right: .08rem;
          .iconfont{
            @include sc(.37rem,#3A44D8);
          }
        }
        input{
          width: calc(100% - .48rem - 1.2rem);
          @include sc(.28rem,#333);
          line-height: .5rem;
          padding-right: .16rem;
          &::placeholder{
            color: #ccc;
          }
        }
        .g-vea-btn{
          @include wh(1.2rem,.5rem);
          border-radius: .25rem;
          border: .02rem solid #3f7def;
          @include sc(.23rem,#3f7def);
        }
      }
    }
    .g-login-btn{
      margin: .68rem .88rem 0;
      @include wh(auto,1.32rem);
      @include sc(.3rem,#fff);
      text-align: center;
      line-height: 1.32rem;
      background: url("http://park.hzqisheng.cn/v3.5/login-button.png");
      background-size: 100% 100%;
    }
    .g-agreement{
      padding-top: calc(100vh - 5.68rem - 2.53rem - 2rem - .88rem);
      @include fj(center);
      align-items: center;
      width: 100%;
      line-height: .44rem;
      @include sc(.24rem,#8F8F8F);
      span{
        @include sc(.24rem,#3F7DEF);
      }
      .g-dot{
        margin-right: .15rem;
        @include wh(.24rem,.24rem);
        border: .03rem solid #8f8f8f;
        padding: .03rem;
        border-radius: 50%;
        &.active{
          background-color: #333333;
          background-clip: content-box;
        }
      }
    }
  }
  .g-submit-over>.g-submit-over-box{
    margin: auto;
  }
  .g-submit-over{
    position: absolute;
    top: 0;
    left: 0;
    @include wh(100%,100%);
    background: #fff;
    .g-over-pic{
        margin: .24rem auto;
        @include wh(2rem,2rem);
      }
    .g-over-content{
      margin: .36rem auto;
      width: 3.3rem;
      
      
      text-align: center;
      p{
        @include sc(.3rem,#333333);
        line-height: .54rem;
      }
    }
  }
</style>

