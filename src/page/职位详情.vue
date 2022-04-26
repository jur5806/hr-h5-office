<template>
  <div class="warp page1">
    <v-header :goBack="true" headTitle="职位详情 ">
    </v-header>
    <v-scroll class="main-box1 scroll" :class="isChecked==2?'main-box36':''" ref="my_scroller">
      <div class="g-contract-details">
        <div class="g-contract-bot g-info-item g-contract-basic">
          <div class="flex-box g-contract-name">
            <!-- <i class="iconfont icon-hetong"></i> -->
            <p class="p-contract-tit">{{info.stationTitle}}</p>
          </div>
          <p class="p-cont g-contract-mar">岗位名称：{{info.stationName|empty}}</p>
          <p class="p-cont g-contract-mar">岗位招聘截止时间：
            {{info.rcEndTime?new Date(info.rcEndTime.replace(/-/g,'/')).format('yyyy-MM-dd'):'-'}}</p>
          <p class="p-cont g-contract-mar">工作地点：{{info.workPlace|empty}}</p>
          <p class="p-cont g-contract-mar">需求人数：{{info.rcDepartmentNum|empty}}</p>
        </div>

        <div class="g-contract-bot g-info-item g-tenant-info" v-if="company">
          <div class="g-info-tit">发布人信息：</div>
          <p class="p-cont g-tenant-mar">{{company.companyName}}</p>
          <div class="flex-box g-tenant-user">
            <p class="g-tenant-name p-cont"><i class="iconfont icon-ren"></i>{{company.name}}</p>
            <p class="g-tenant-name p-cont"><i class="iconfont icon-dianhua"></i>{{company.phone}}</p>
          </div>
        </div>
        <div class="g-contract-bot g-info-item g-house-info" v-if="contractFileList&&contractFileList.length>0">
          <div class="g-info-tit">附件预览</div>
          <ul class="g-file-view">
            <li v-for="(item,index) in contractFileList" :key="index" @click="downLoad(item.contractFilePath)"><p>{{item.contractFileName}}</p></li>
          </ul>
        </div>
        <div class="g-contract-bot g-info-item">
          <div class="g-info-tit">招聘需求：</div>
          <div class="g-abstract-cont">
            <div class="g-contract-point">
              <p>
                {{info.rcDescribe}}
              </p>
            </div>
          </div>
        </div>
      </div>
    </v-scroll>
    <div class="alpay" @click="showShare = false" v-if="showShare"><img src="http://park.hzqisheng.cn/v3.5/share.png"/>
    </div>
    <v-visit-footer-square :title="'分享'" @submits="submitsCheck" v-if="$store.state.isShare"></v-visit-footer-square>
    <div class="g-visit-footer" v-else>
      <div class="g-footerbtn1" @click.stop="$router.push('/inputInfo?checkType=' + checkType+'&hrId='+hrId+'&userId='+userId)">投递</div>
    </div>
    <!-- <div class="btn g-bluebtn" @click="beforeCheck" >投递</div> -->

    <yd-popup class="g-confirm" v-model="showDismissal" position="center" width="6.3rem" :close-on-masker="true">
      <div class="tit">审核驳回</div>
      <p class="g-dismissal">驳回原因</p>
      <div class="g-input-dismissal">
        <textarea placeholder="请输入驳回原因" v-model.trim="rejectReason" maxlength="20"></textarea>
      </div>
      <div class="flex-box g-btnbox">
        <div class="btn g-bluebtn" @click="beforeCheck">确认</div>
        <div class="btn" @click="showDismissal = false">取消</div>
      </div>
    </yd-popup>

     <yd-popup class="g-confirm" v-model="showPass" position="center" width="6.3rem" :close-on-masker="true">
      <div class="tit">审核通过</div>
      <div class="g-input-dismissal">
        <textarea placeholder="请输入审批意见" v-model.trim="rejectReason" maxlength="30"></textarea>
      </div>
      <div class="flex-box g-btnbox">
        <div class="btn g-bluebtn" @click="submit">确认</div>
        <div class="btn" @click="showPass = false">取消</div>
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
        chekAdmins: [],
        showShare: false,
        processCheckRecordList: [],
        company: {},
        contract: {},
        // apartmentContract:{},
        // propertyBasicTerms: {},
        parkingBasicTerms: {},
        houseResList: [],
        contractFileList: [],
        contractLeaseTerm: [],
        apartContractLeaseTerm: [],
        propertyTermsList: [],
        parkingRentingTermsList: [],
        remark: '',
        checkType: 0,
        isShow: false,
        showDismissal: false,
        showPass: false,
        rejectReason: '',
        billList:[1],
        billDivisionType: 1, //房源免租账单划分
        proBillDivisionType: 1, //物业免租账单划分
        rentFreeTermsList: [],//房源免租条款
        propertyFreeTermsList: [],//物业免租条款
        rentFreeTerms: {
          startTime: new Date().format("yyyy-MM-dd"),
          endTime: new Date().add("y", +1).add("d", -1).format("yyyy-MM-dd")
        },
        propertyFreeTerms: {
          startTime: new Date().format("yyyy-MM-dd"),
          endTime: new Date().add("y", +1).add("d", -1).format("yyyy-MM-dd")
        },
        isChecked:1,
        channelId:"",
        info:{},
        hrId:'',
        userId: '',
      }
    },
    activated () {
    },
    mounted () {
      this.channelId=mobile.getCookie('channelId')
      this.checkType = Number(this.$route.query.checkType);
      this.hrId = Number(this.$route.query.hrId);
      this.userId = this.$route.query.userId;
      this.init()
      this.userDetail();
    },
    components: {
    },

    computed: {

    },
    methods: {
      init () {
        getData.getRecruitIdDetail(this.$route.query.checkType).then(res => {
          if (res.data.code == 200) {
            this.info = res.data.data;
          } else {
            mobile.toast(res.data.message)
          }
        })
      },
      userDetail(){
        getData.userDetail(this.hrId ).then(res => {
          if (res.data.code === 200) {
            this.company = res.data.data
            // mobile.toast(res.data.message)
          }
        })
      },
      submitsCheck () {
        this.share(2)
      },
      share (type) { /*分享*/
        if (type === 2) {
          this.showShare = true;
        }
      },
      monthTime (endTime, startTime) {
        return mobile.toMonth(endTime, startTime)
      },
      submit(){
        if(this.checkType == 6){
          this.apartmentContractCheck(1);
        }else{
          this.checkContract(1)
        }
      },
      apartmentContractCheck (type) {
        let info = {
          contractId: this.$route.query.contractId,
          rejectReason: this.rejectReason,
          checkRecordOpinion: this.rejectReason,
          isCheck: type,
          contractType: this.$route.query.contractType,
        }
        this.$dialog.loading.open('审核中。。。');
        getData.apartmentContractCheck(info).then(res => {
          if (res.data.code === 1) {
            if (type === 1) {
              mobile.toast('已通过审核！')
            } else {
              mobile.toast('合同已驳回！');
              this.showDismissal = false
            }
            this.$router.go(-1)
          } else {
            mobile.toast(res.data.message)
          }
          this.$dialog.loading.close();
        }).catch(err => {
          this.$dialog.loading.close();
        })
      },
      checkContract (type) {
        let info = {
          contractId: this.$route.query.contractId,
          rejectReason: this.rejectReason,
          isCheck: type,
          checkRecordOpinion: this.rejectReason,
          contractType: this.$route.query.contractType
        }
        this.$dialog.loading.open('审核中。。。');
        getData.contractCheck(info).then(res => {
          if (res.data.code === 1) {
            if (type === 1) {
              mobile.toast('已通过审核！')
            } else {
              mobile.toast('合同已驳回！');
              this.showDismissal = false
            }
            this.$router.go(-1)
          } else {
            mobile.toast(res.data.message)
          }
          this.$dialog.loading.close();
        }).catch(err => {
          this.$dialog.loading.close();
        })
      },
      back () {
        this.$router.go(-1)
      },
      beforeCheck () {
        if (mobile.rule.empty(this.rejectReason, '驳回理由不能为空')) {
          if(this.checkType == 6){
            this.apartmentContractCheck(2);
          }else{
            this.checkContract(2)
          }
        }
      },
      downLoad(url, name) {
      if (
        mobile.fileUrl(url) === "excel" ||
        mobile.fileUrl(url) === "word"  ||
        mobile.fileUrl(url) === "ppt"
      ) {
        if(this.$store.state.platform){
          window.location.href = url
        }else{
          window.open("https://view.officeapps.live.com/op/view.aspx?src=" + url);
        }
      } else {
        window.location.href = url
      }
    },
    }
  }

</script>
<style scoped lang="scss">
  @import '../assets/css/mixin';
  .g-apprebtn{
    @include wh(100%,.98rem);
    .g-disagree,.g-agree{
      @include wh(50%,1rem);
      text-align: center;
      line-height: 1rem;
      font-size: .3rem;
      border: 1px solid #3F7DEF;
    }
    .g-disagree{
      color: #3F7DEF;
      background-color: #fff;
    }
    .g-agree{
      color: #fff;
      background-color: #3F7DEF;
    }
  }
  .g-visit-footer{
    // padding: .4rem .75rem .6rem;
  }
  .g-footerbtn1{
    height:1rem;
    background-color: #3F7DEF;
    text-align: center;
    line-height: 1rem;
    font-size:.3rem;
    font-family:PingFangSC-Medium;
    font-weight:500;
    color:rgba(255,255,255,1);
  }
  .g-dismissal{
    @include sc(.28rem,#333333);
    line-height: .4rem;
    margin-bottom: .2rem;
  }
  .g-input-dismissal{
    @include wh(100%,1.54rem);
    border: .02rem solid rgba(238,238,238,1);
    padding: .2rem;
    margin-bottom: .4rem;
    textarea{
      @include wh(100%,100%);
      @include sc(.26rem,#333);
      &::placeholder{
        @include sc(.26rem,#ccc);
      }
    }
  }
  .g-file-view{
    li{
      margin-top: 0.28rem;
      p{
        display: inline-block;
        height:0.36rem;
        font-size:0.26rem;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(63,125,239,1);
        line-height:0.36rem;
        border-bottom: 0.02rem solid #3F7DEF;
      }
    }
  }
  .bill-border{
    padding-top: 0.28rem;
    border-top: 0.02rem solid #eee;
  }

  .g-contract-point{
    display: flex;
    &::before{
      content: "· ";
      display: inline-block;
      margin-right: 0.1rem;
    }
  }
</style>

