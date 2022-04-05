<template>
  <div class="warp page1">
    <v-header :goBack="true" headTitle="详情"></v-header>
    <div class="contract-box">
      <v-scroll class="scroll" style="overflow-y: auto;height: 100%;">
        <div class="item-box">
          <div class="item-name">{{userInfo.userName}}</div>
          <div class="item-phone">
            <img src="./../../assets/images/phone1.png" alt="">
            联系方式：{{userInfo.userMobile}}
          </div>
          <div class="item-area">
            <img src="./../../assets/images/area.png" alt="">
            所在区域：{{userInfo.userCompanyName}}
          </div>
          <div class="item-area">
            <img src="./../../assets/images/timer.png" alt="">
            认证提交时间：{{userInfo.userCertificationTime|datetime}}
          </div>
        </div>
      </v-scroll>
    </div>
    <div class="btn-audit" @click="auditDialog=true">审核</div>
    <yd-popup class="g-confirm g-confirm-box" v-model="auditDialog" position="center" width="5.46rem" :close-on-masker="true">
      <div class="tit">企业用户审核</div>
      <p class="g-remindcont">若通过，请选择人员权限</p>
      <div class="btn-box">
        <div class="btn-type" :class="{'active':auditState==1}" @click="auditState=1">企业员工</div>
        <div class="btn-type" :class="{'active':auditState==2}" @click="auditState=2">企业管理员</div>
      </div>
      <div class="flex-box g-btnbox">
        <div class="btn-confirm" @click="refuse">审核驳回</div>
        <span style="color: #d9d9d9">|</span>
        <div class="btn-confirm" @click="agree">审核通过</div>
      </div>
    </yd-popup>
    <yd-popup v-model="uploadDialog" position="center" width="5.46rem" :close-on-masker="false">
      <div class="upload-tips">
        <img :src="tipsImgs[activeTip]" alt="">
        <div class="tit">{{tips[activeTip]}}</div>
      </div>
      <div class="flex-box-center">
        <i class="iconfont icon-jinakangbaoicons18" @click="uploadDialog=false,$router.go(-1)"></i>
      </div>
    </yd-popup>
  </div>
</template>

<script>
import * as mobile from './../../config/mUtils'
import * as getData from './../../service/getData'
export default {
  name: '',
  components: {},
  data () {
    return {
      auditDialog: false,
      uploadDialog: false,
      auditState: 1,
      tipsImgs: [require('./../../assets/images/success.png'), require('./../../assets/images/error.png')],
      tips: ['人员审批已通过', '人员审批已驳回'],
      activeTip: 0,
      userInfo: {}
    }
  },

  mounted() {
    if(mobile.getSession('userInfo')){
      this.userInfo = JSON.parse(mobile.getSession('userInfo'))
    }else{
      mobile.toast('页面出错，退出重试')
    }
  },

  methods: {
    // 认证通过
    agree(){
      this.auditDialog = false
      getData.userAudit({
        userId: this.userInfo.userId,
        state: 3,
        userPostionState: this.auditState,
        userMobile: this.userInfo.userMobile,
        userName: this.userInfo.userName
      }).then((res)=>{
        if(res.data.code === 1){
          this.uploadDialog = true,
          this.activeTip = 0
        }else{
          mobile.toast(res.data.message)
        }
      })
    },
    // 认证驳回
    refuse(){
      this.auditDialog = false
      getData.userAudit({
        userId: this.userInfo.userId,
        state: 4
      }).then((res)=>{
        if(res.data.code === 1){
          this.uploadDialog = true,
          this.activeTip = 1
        }else{
          mobile.toast(res.data.message)
        }
      })
    }
  }
}

</script>
<style lang='scss' scoped>
.contract-box{
  padding: .25rem;
  background:rgba(243, 244, 246, 1);
  flex: 1;
  overflow: auto;
  .item-box{
    background: #FFFFFF;
    padding: .3rem;
    border-radius: 0.12rem;
    margin-bottom: .25rem;
    display: flex;
    flex-direction: column;
    .item-name{
      font-size: 0.3rem;
      font-weight: 500;
      color: #333333;
      margin-bottom: .2rem;
    }
    .item-phone,.item-area{
      font-size: 0.24rem;
      font-weight: 400;
      color: #333333;
      line-height: 0.5rem;
      display: flex;
      align-items: center;
      img{
        margin-right: .15rem;
      }
    }
  }
}
.btn-audit{
  width: 96%;
  background: #0F8FFF;
  border-radius: 0.08rem;
  padding: .18rem 0;
  text-align: center;
  font-size: 0.32rem;
  font-weight: 500;
  color: #FFFFFF;
  position: absolute;
  bottom: .18rem;
  left: 2%;
}
.btn-box{
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  .btn-type{
    width: 3.8rem;
    height: 0.8rem;
    text-align: center;
    line-height: .8rem;
    background: #F4F4F4;
    border-radius: 0.4rem;
    margin-bottom: .3rem;
    
  }
  .active{
    background: rgba(63, 125, 239, 1);
    color:#FFFFFF;
  }
}
.btn-confirm{
  width: 50%;
  text-align: center;
  padding: .26rem 0;
  border-top: 1px solid rgb(241, 241, 241);
  &:nth-child(1){
    font-size: 0.26rem;
    font-weight: 400;
    color: #FF2F2F;
  }
  &:nth-child(3){
    font-size: 0.26rem;
    font-weight: 400;
    color: #3F7DEF;
  }
}
.upload-tips{
  height: 3.3rem;
  background: #FFFFFF;
  border-radius: 0.16rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  .tit{
    margin-top: .3rem;
    font-size: 0.32rem;
    font-weight: 400;
    color: #222222;
  }
}
.flex-box-center{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: .5rem;
  i{
    font-size: .7rem;
    color: white;
  }
}
</style>
<style lang="scss">
.g-confirm-box .yd-popup-center{
  padding: 0;
  padding-top: .4rem;
}
</style>


