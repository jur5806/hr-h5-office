<template>
  <div class="warp page1">
    <v-header :goBack="true" headTitle="设置">
    </v-header>
    <v-scroll class="main-box scroll" ref="my_scroller">
      <div class="g-myinfo">
        <div class="g-infoitem f-borbot2 flex-box" >
          <p class="ingotit">关于我们</p>
          <div class="flex-box g-infocont">
            <i class="iconfont icon-jinru-copy"></i>
          </div>
        </div>
        <div class="g-infoitem f-borbot2 flex-box">
          <p class="ingotit">使用帮助</p>
          <div class="flex-box g-infocont">
            <i class="iconfont icon-jinru-copy"></i>
          </div>
        </div>
        <div class="g-infoitem f-borbot2 flex-box" @click="showCancellation=true">
          <p class="ingotit">账号注销</p>
          <div class="flex-box g-infocont">
            <i class="iconfont icon-jinru-copy"></i>
          </div>
        </div>
      </div>
      <div class="layer">
        <div class="g-exit" @click="showCertifi = true">退出登录</div>
      </div>
    </v-scroll>
    <yd-popup class="g-confirm" v-model="showCertifi" position="center" width="6.46rem" :close-on-masker="false">
      <div class="tit">提示</div>
      <p class="g-remindcont">您确定要退出登录吗？</p>
      <div class="flex-box g-btnbox">
        <div class="btn g-bluebtn" @click="cancels">确定</div>
        <div class="btn" @click="showCertifi = false">取消</div>
      </div>
    </yd-popup>

    <!-- 注销提示 -->
    <yd-popup class="g-confirm" v-model="showCancellation" position="center" width="6.46rem" :close-on-masker="false">
      <div class="tit">提示</div>
      <p class="g-remindcont">注销后，无法继续使用此账号登录，是否确认注销账号？</p>
      <div class="flex-box g-btnbox">
        <div class="btn g-bluebtn" @click="cancellation">确定</div>
        <div class="btn" @click="showCancellation = false">取消</div>
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
        showCertifi: false,
        showCancellation: false
      }
    },
    activated(){

    },
    created (){
    },
    mounted () {

    },
    components: {
    },
    computed: {
    },
    methods: {
      cancels () {
        this.$store.state.parkToken = ''
        let domain = mobile.getSession('domain')
        sessionStorage.clear()
        localStorage.clear()
        mobile.setSession('domain', domain)
        mobile.removeCookie('parkToken')
        mobile.removeCookie('userPhone')
        mobile.removeCookie('userToken', domain)
        mobile.removeCookie('userMobile', domain)
        this.$store.state.user = {};
        localStorage.setItem('fullPath', '')

        // 清除防疫登记的信息
        this.$store.state.baseName=''
        this.$store.state.baseCompanyId=0
        this.$store.state.baseCompanyName=''
        this.$store.state.pdCompanyId=0
        this.$store.state.pdCompanyName=''

        this.$router.replace('login')
        
      },
      cancellation() {//停用
        getData.statusUpdate({enabled:false,username:mobile.getStore('userName')}).then(res => {
          mobile.toast(res.data.message)
          if(res.data.code == 1){
            this.cancels()
          }
        })
      },
    },
    watch:{

    }
  }
</script>
<style scoped lang="scss">
  @import '../assets/css/mixin';
  .g-exit{
    margin-top: .2rem;
    @include wh(100%,.88rem);
    background-color: #3C78E5;
    @include sc(.3rem,#fff);
    text-align: center;
    line-height: .88rem;
    border-radius: .44rem;
  }
</style>

