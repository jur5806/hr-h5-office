<template>
  <div class="warp page1">
    <v-scroll class="main-box scroll" ref="my_scroller" style="position: relative;width: 100%;overflow-x: hidden;">
      <div class="g-logo clearfix" @click="checkUser('myInfo')"><!--$router.push('/myInfo')-->
        <div class="flex-box g-userinfo" style="justify-content: space-between">
          <div class="flex-box">
            <div class="g-headimg g-adaptimg c-bg-grey">
              <img v-if="parkToken && user.userConfirmState === 3 && user.userHeadThumb" :src="user.userHeadThumb + '?x-oss-process=image/resize,w_100/auto-orient,1'" alt="">
              <img v-else src="http://park.hzqisheng.cn/v3.5/defaulthead.png" alt="">
            </div>
            <div class="g-infobox">
              <div class="flex-box">
                <h4>{{user.username}}<i v-if="user.userConfirmState === 2" class="i-auditing"><img src="http://park.hzqisheng.cn/v3.5/icon-audit.png" alt=""></i></h4>
              </div>
              <!-- <p>{{user.companyName}}</p> -->
            </div>
            <!-- <div class="g-infobox" v-if="!parkToken">
              <h4>未登录</h4>
              <p>请登录您的账户</p>
            </div> -->
          </div>
          <div class="g-adaptimg g-companyConfirm" v-if="parkToken && (user.userConfirmState === 4 || user.userConfirmState === 1)" @click.stop="$router.push('/perfectIdentity')">
            <img src="http://park.hzqisheng.cn/v3.5/companyConfirm.png" alt="">
          </div>
        </div>
      </div>
      <div style="position: relative">
        <div class="g-wave">
          <span class="g-wave-span c-wave-white"></span>
          <span class="g-wave-span c-wave-white c-wave-center"></span>
          <span class="g-wave-span c-wave-white c-wave-gray"></span>
        </div>
      </div>
      <div class="g-yuanqi-entrance" v-if="mobileMhModule">
        <div class="g-entrance">
          <div class="g-entrance-left">
            <img src="../../static/img/icon-yuanqi.png">
            <div class="g-entrance-info">
              <p>我管理的企业</p>
              <p>{{user.companyName}}</p>
            </div>
          </div>
          <div class="g-entrance-right" @click="openEntrance()">
            管理
          </div>
        </div>
      </div>
      <div class="g-minelist">
        <div class="g-mineitem flex-box g-shadow marbot30" @click="checkUser('switchCompany')" v-if="showSelectCompany"><!--$router.push('/myNews')-->
          <div class="flex-box g-mineleft">
            <i class="iconfont icon-gongsiqiye"></i>
            <p>切换企业</p>
          </div>
          <div class="g-mineright flex-box">
            <i class="iconfont icon-jinru-copy"></i>
          </div>
        </div>

        <div class="g-shadow marbot30">
          <div class="g-mineitem flex-box" @click="checkUser('myNews')"><!--$router.push('/myNews')-->
            <div class="flex-box g-mineleft">
              <i class="iconfont icon-wodexiaoxi"></i>
              <p>我的信息</p>
            </div>
            <div class="g-mineright flex-box">
              <div class="g-redcircle" v-if="haveRemind && parkToken"></div>
              <i class="iconfont icon-jinru-copy"></i>
            </div>
          </div>
          <div class="g-mineitem"><div class="g-oneline"></div></div>
          <div class="g-mineitem"><div class="g-oneline"></div></div>
          <div class="g-mineitem flex-box" @click="checkUser('myEnroll')"><!--$router.push('/myEnroll')-->
            <div class="flex-box g-mineleft">
              <i class="iconfont icon-baoming"></i>
              <p>我的推荐</p>
            </div>
            <div class="g-mineright flex-box">
              <i class="iconfont icon-jinru-copy"></i>
            </div>
          </div>
        </div>

        <div class="g-shadow marbot30">
          <div class="g-mineitem flex-box" @click="checkUser('setUp')"><!--$router.push('/setUp')-->
            <div class="flex-box g-mineleft">
              <i class="iconfont icon-shezhi" style="font-size: .36rem;"></i>
              <p>设置</p>
            </div>
            <div class="g-mineright flex-box">
              <i class="iconfont icon-jinru-copy"></i>
            </div>
          </div>
        </div>
      </div>
    </v-scroll>
    <v-footer></v-footer>
    <yd-popup class="g-confirm" v-model="showlogin" position="center" width="6.46rem" :close-on-masker="false">
      <div class="tit">提示</div>
      <p class="g-remindcont">该功能需登陆后才可使用，是否进行登录？</p>
      <div class="flex-box g-btnbox">
        <div class="btn g-bluebtn" @click="$router.push('/login')">登录</div>
        <div class="btn" @click="showlogin = false">再看看</div>
      </div>
    </yd-popup>
    <yd-popup class="g-confirm" v-model="showVisitor" position="center" width="6.46rem" :close-on-masker="false">
      <div class="tit">提示</div>
      <p class="g-remindcont">访客用户进行信息完善后可使用此功能并可使用多样的企业服务，是否进行信息完善？</p>
      <div class="flex-box g-btnbox">
        <div class="btn g-bluebtn" @click="$router.push('/perfectIdentity')">开始</div>
        <div class="btn" @click="showVisitor = false">取消</div>
      </div>
    </yd-popup>
    <yd-popup class="g-confirm" v-model="showCertifi" position="center" width="6.46rem">
      <div class="tit">提示</div>
      <p class="g-remindcont" style="padding: 0 .4rem;text-align: left;">企业信息尚在认证中,请耐心等待。如需修改已提交的信息，请点击"重新提交"；暂时不想进行认证，请点击撤回</p>
      <div class="flex-box g-btnbox">
        <div class="btn g-bluebtn" @click="$router.push({path:'/perfectIdentity',query:{name:user.userName,companyId:user.userCompanyId,companyName:user.companyName}})">重新提交</div>
        <div class="btn g-cehui" @click="showback = true">撤回</div>
      </div>
    </yd-popup>
    <yd-popup class="g-confirm" v-model="showback" position="center" width="6.46rem" :close-on-masker="false">
      <div class="tit">提示</div>
      <p class="g-remindcont" style="line-height: 1.34rem;">是否确认撤回已提交的认证信息？</p>
      <div class="flex-box g-btnbox">
        <div class="btn g-bluebtn" @click="cancelback">确定</div>
        <div class="btn" @click="showback = false;showCertifi = false;">取消</div>
      </div>
    </yd-popup>
  </div>
</template>
<script>
  import * as getData from '../service/getData'
  import * as mobile from '../config/mUtils'
  import {mapState, mapMutations,mapActions} from 'vuex'

  export default {
    data () {
      return {
        user: {},
        haveRemind: false,
        parkToken: '',
        showVisitor: false,
        showlogin: false,
        showCertifi: false,
        showback: false,
        type:1,
        isSame: false,
        isWx: false,
        openIdNew: '',
        mobileMhModule: false,
        showSelectCompany: false,
      }
    },
    activated () {
    },
    created () {
    },
    mounted () {
      this.init()
    },
    components: {
    },
    computed: {
    },
    methods: {
      init () {
        getData.userDetail(mobile.getStore('userId')).then(res => {
          if (res.data.code === 200) {
            this.user = res.data.data
          }else{
            mobile.toast(res.data.message)
          }
        })
      },
      checkUser (url) {
        //this.$router.push('/' + url)
        if (mobile.getStore('parkToken') || this.$store.state.parkToken) {/*已登录*/
          this.$router.push('/' + url)
        } else {
          if (url === 'myInfo') {
            this.$router.replace('login')
          } else {
            this.showlogin = true
          }
        }
      },
      cancelback () {
        getData.cancelCheck().then(res => {
          if (res.data.code === 1) {
            mobile.toast('撤回成功');
            this.showback = false;
            this.showCertifi = false;
            this.init()
          } else {
            mobile.toast(res.data.message)
          }
        })
      },
      openEntrance() {
        window.location.href =  `${this.$store.state.companyApiUrl}?channelId=${this.$store.state.channelId || mobile.getCookie('channelId')}&parkToken=${this.$store.state.parkToken || mobile.getCookie('parkToken')}&phone=${this.$store.state.userPhone || mobile.getCookie('userPhone')}`
      }
    },
    watch: {

    }
  }
</script>
<style scoped lang="scss">
  @import '../assets/css/mixin';


  .g-wxbox{
    width:2.43rem;
    height:.52rem;
    border:1px solid rgba(255,255,255,1);
    border-radius:.06rem;
    padding-left: .21rem;
    margin-left: .32rem;
    .g-wx-icon{
      width: .4rem;
      height: .4rem;
      margin-right: .1rem;
    }
    .g-wx-state{
      width: .24rem;
      height: .24rem;
    }
    p{
      font-size:.24rem;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(255,255,255,1);
      margin-right: .07rem;
      margin-top: 0;
    }
  }
  .page1{
    overflow: hidden;
  }
  .g-yuanqi-entrance {
    margin-left: .04rem;
    height: 2.12rem;
    width: 100%;
    background: url("../../static/img/yuanqi-bg.png") no-repeat;
    background-size: 100% 2.12rem;
    padding: .55rem 0;
    .g-entrance{
      width: calc(86%);
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 auto;
    }
    .g-entrance-left {
      display: flex;
      img{
        width: 0.86rem;
        height: 0.86rem;
      }
      .g-entrance-info{
        padding-left: .24rem;
        p:nth-child(1) {
        font-size: 0.28rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: #FEFEFE;
        padding-top: .02rem;
      }
        p:nth-child(2) {
        font-size: 0.24rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: #FEFEFE;
        padding-top: .08rem;

      }

      }
    }
    .g-entrance-right {
      width: 1.6rem;
      height: 0.6rem;
      background: #FFFFFF;
      border-radius: .3rem;
      font-size: 0.28rem;
      font-family: PingFang SC;
      font-weight: 400;
      color: #3F7DEF;
      line-height: 0.6rem;
      text-align: center;
      &.active {
        background-color: #3F7DEF;
      }
    }
  }
  .g-minelist{
    padding-bottom: .5rem;
  }
  .g-logo{
    position: relative;
    @include wh(100%,4.57rem);
    background: url("http://park.hzqisheng.cn/v3.5/login-bg.png") no-repeat;
    background-size: 100% auto;
    background-position: center top;
    .g-page-title{
      @include sc(.36rem,#fff);
      line-height: 1rem;
      text-align: center;
    }
    .g-logo-img{
      display: block;
      margin: .33rem auto 0;
      @include wh(2.61rem,2.55rem);
    }
  }
  .g-companyConfirm{
    @include wh(1.8rem,.52rem);
    margin-right: .68rem;
  }
  .g-mineleft{
    .icon-quan{
      margin-top: -.18rem;
    }
    .icon-renlianshibie{
      margin-top: -.05rem;
    }
    .icon-baoming{
      margin-top: -.05rem;
    }
    .icon-wodeshoucang{
      margin-top: -.1rem;
    }
    .icon-wodexiaoxi{
      margin-top: -.03rem;
    }
    .icon-shezhi{
      margin-top: -.08rem;
    }
  }
</style>

