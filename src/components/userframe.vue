<template>
  <div>
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
  import * as mobile from '../config/mUtils'
  import * as getData from '../service/getData'
  export default {
    data(){
      return{
        showlogin: false,
        showVisitor: false,
        showCertifi: false,
        showback: false,
      }
    },
    created(){
    },
    props: ['type'],/*1，未登录提示，2,访客提示，3访客认证中提示，4，访客撤回提示，*/
    methods: {

    },
    watch: {

    }
  }
</script>

<style lang="scss" scoped>
  @import '../assets/css/mixin';

</style>
