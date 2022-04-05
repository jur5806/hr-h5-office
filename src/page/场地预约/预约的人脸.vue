<template>
  <div class="warp page1 face-page">
    <v-header :goBack="true" headTitle="人脸信息"></v-header>
    <v-scroll class="main-body scroll myFace g-face-bg" ref="my_scroller"
              style="position: relative;width: 100%;overflow-x: hidden;">
      <div class="g-face">
        <div class="g-face-img-box">
          <div class="g-img-scan-box">
            <img class="g-face-img" :src="url + '?x-oss-process=image/resize,w_500/auto-orient,1'"/>
            <img class="g-face-light" src="http://public.hzqisheng.cn/Fp5iKHGZ5EuCjmbpC6Fh5HMLts6k"/>
          </div>
        </div>
        <p class="g-face-text">如录入人脸无法使用<br>请联系园区管理员</p>
      </div>
    </v-scroll>
    <div class="g-loading" v-if="state === 1">
      <p><img src="../../assets/img/face-pack.png" alt="">{{message}}</p>
    </div>
    <div class="g-loading" v-if="state === 3">
      <p><img src="../../assets/img/face-error.png" alt="">{{message}}</p>
    </div>
    <div class="g-loading" v-if="state === 2">
      <p><img src="../../assets/img/face-success.png" alt="">{{message}}</p>
    </div>
    <div class="g-handle-btn" v-if="show && state === 3">
      <p>
        <v-photo :first="1" @feedback="goSure"></v-photo>
        重新上传人脸
      </p>
    </div>
  </div>
</template>
<script>
  import * as getData from '../../service/getData'
  import * as mobile from '../../config/mUtils'
  import {upload, getExtranetUrl, deleteFile} from '../../plugins/oss-sdk'
  import {mapState, mapMutations, mapActions} from 'vuex'

  export default {
    data() {
      return {
        url: '',
        state:0,
        show:true,
        visitorFaceId:'',
        photoUrl:'',
        message:'',
      }
    },
    activated() {
    },
    created() {

    },
    mounted() {
      this.url = this.$route.query.fieldFacePhoto;
      this.appId = this.$route.query.appId;
      this.getFieldPhotoIssuedState();
    },
    components: {},
    computed: {},
    methods: {
      getFieldPhotoIssuedState(){
        getData.getFieldPhotoIssuedState({appId:this.appId}).then(res => {
          if (res.data.code === 1) {
            this.state = res.data.data.flag;
            this.message = res.data.message
          } else {
            mobile.toast(res.data.message)
          }
        });
      },
      edit(){
        getData.editVisitorPhoto(this.appId,this.photoUrl).then(res => {
          if (res.data.code === 1) {
            mobile.toast('修改成功')
            this.url = this.photoUrl;
            this.getFieldPhotoIssuedState();
          } else {
            mobile.toast(res.data.message)
          }
        });
      },
      goSure (data) {
        this.photoUrl = data.url;
        this.edit()

      },
    },
    watch: {}
  }
</script>
<style lang="scss">
  .g-progress{
    .yd-progressbar>svg{
          border-radius:1rem;
          height:0.16rem;
        }
  }
</style>
<style scoped lang="scss">
  @import '../../assets/css/mixin';
  .warp{
    height: 100%;
    display: flex;
    flex-direction: column;
    .main-body{
      flex: 1;
      overflow: auto;
    }
  }
  .layer {
    position: absolute;
    width: 100%;
    padding: .3rem .52rem;
    bottom: .52rem;
  }

  .g-face-bg {
    background: url("http://public.hzqisheng.cn/FuCmjFAV1nMxga2pkAurr0AeXgj5") no-repeat;
    background-size: 100% auto;
    background-position: center -1.4rem;
  }

  .g-face-tip {
    text-align: center;

    .g-face-tit {
      @include sc(.32rem, #333);
      line-height: 1;
      margin-top: .6rem;
      margin-bottom: .5rem;
    }

    .g-face-img {
      @include wh(5.17rem, 5.17rem);
      object-fit: cover;
      margin-bottom: .2rem;
    }

    .g-face-text {
      padding: .7rem 1.2rem 0;
      @include sc(.28rem, #333);
      line-height: .5rem;
      text-align: left;
    }

    .g-face-btn {
      position: relative;

      .upload-input {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        opacity: 0;
      }
    }
  }

  .g-face {
    text-align: center;
    padding-top: .44rem;

    .g-face-img-box {
      @include wh(5.66rem, 5.66rem);
      margin: 0 auto;
      padding: .25rem;
      position: relative;

      &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
        @include wh(5.66rem, 5.66rem);
        background: url("http://public.hzqisheng.cn/Ft_BcIH48mXpcgHMrq5tqiIJ-o70") no-repeat;
        background-size: 100% 100%;
        animation: bg-rotate 5s linear infinite;

      }

      &:after {
        content: '';
        position: absolute;
        left: .08rem;
        top: .08rem;
        z-index: 2;
        @include wh(5.5rem, 5.5rem);
        background: url("http://public.hzqisheng.cn/Fh9ez5Dp3erNokDGYh1kbl2J37B3") no-repeat;
        background-size: 100% 100%;
        animation: bg-anti-rotate 5s linear infinite;
      }

      .g-img-scan-box {
        @include wh(100%, 100%);
        border-radius: 50%;
        overflow: hidden;
        padding: .06rem;
        position: relative;
        z-index: 10;
        transform: translate3d(0, 0, 0);
        -webkit-transform: translate3d(0, 0, 0);

        .g-face-img {
          @include wh(5.04rem, 5.04rem);
          object-fit: cover;
          border-radius: 50%;
        }

        .g-face-light {
          position: absolute;
          left: 0;
          top: 50%;
          @include wh(100%, auto);
          animation: scan-light 5s linear infinite;
        }
      }
    }

    .g-face-text {
      @include wh(6.16rem, 1.6rem);
      background: $fc;
      border-radius: .16rem;
      box-shadow: 0 .1rem .2rem 0 rgba(212, 212, 212, 0.5);
      @include sc(.28rem, #333);
      margin: .5rem auto 0;
      line-height: .44rem;
      padding: .36rem 0;
    }

    .g-face-btn {
      position: relative;
      box-shadow: 0 .1rem .16rem 0 rgba(58, 115, 220, 0.4);
    }

    .g-face-border-btn {
      background-color: transparent;
      border: .01rem solid #6199FF;
      color: #6199FF;
    }

    .tip {
      position: absolute;
      width: 100%;
      bottom: .35rem;
      @include sc(.24rem, #686868);
      text-align: center;
      line-height: 1;
    }
  }

  .g-remindcont {
    margin: .6rem 0 .8rem;
    padding: 0 .5rem
  }

  .page1 {
    overflow: hidden;
  }

  .g-bluebtn {
    position: relative;
  }

  @keyframes bg-rotate {
    0% {
      transform: rotate(0deg)
    }
    25% {
      transform: rotate(90deg)
    }
    50% {
      transform: rotate(180deg)
    }
    75% {
      transform: rotate(270deg)
    }
    100% {
      transform: rotate(360deg)
    }
  }

  @keyframes bg-anti-rotate {
    0% {
      transform: rotate(0deg)
    }
    25% {
      transform: rotate(-90deg)
    }
    50% {
      transform: rotate(-180deg)
    }
    75% {
      transform: rotate(-270deg)
    }
    100% {
      transform: rotate(-360deg)
    }
  }

  @keyframes scan-light {
    0% {
      top: 100%
    }
    25% {
      top: 75%
    }
    50% {
      top: 50%
    }
    75% {
      top: 25%
    }
    100% {
      top: 0
    }
  }
  .face-state{
    padding: 0.2rem;
  }
  .g-loading{
    background: #fff;
    padding: 0.2rem;
    border-radius: 0.2rem;
    text-align: center;
    p{
      padding: 0.2rem 0;
      font-size: 0.28rem;

    }
    img{
      height: 0.4rem;
      width: .4rem;
      vertical-align: bottom;
      margin-right: 0.1rem;
    }
    .g-progress{
      padding: 0.15rem 0.5rem 0 0.5rem;
    }
  }
  .g-handle-btn{
    padding: .34rem .75rem .6rem;
    p{
      height:.8rem;
      background:rgba(46,115,255,1);
      box-shadow:0px .02rem .03rem 0px rgba(177,210,255,0.5), 0px .14rem .2rem 0px rgba(0,99,234,0.36);
      border-radius:.4rem;
      text-align: center;
      line-height: .8rem;
      font-size:.3rem;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(255,255,255,1);
      position: relative;
    }
  }
</style>

