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
          <p class="p-cont g-contract-mar">所属部门：{{info.departmentName|empty}}</p>
          <p class="p-cont g-contract-mar">岗位招聘截止时间：{{new Date(info.rcEndTime.replace(/-/g,'/')).format('yyyy-MM-dd')}}</p>
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

        let name = this.$store.state.channelName
        window.webkit.messageHandlers.Share.postMessage({
          title: `${name}诚挚邀您拜访`,
          content: '点击此链接，完善拜访信息并提交后即可快速通行，进出园区。',
          imageUrl: 'http://park.hzqisheng.cn/share.png',
          url: `${window.location.origin}/#/parkVisitorRegister?shareNum=1&visitorReviewId=${this.visitorReviewId}`
        });
        if (this.$store.state.platform === 'iOS' || this.$store.state.platform === 'Android') {
          if (this.$store.state.platform === 'iOS') {
            window.webkit.messageHandlers.Share.postMessage({
              title: `${name}诚挚邀您拜访`,
              content: '点击此链接，完善拜访信息并提交后即可快速通行，进出园区。',
              imageUrl: 'http://park.hzqisheng.cn/share.png',
              url: `${window.location.origin}/#/parkVisitorRegister?shareNum=1&visitorReviewId=${this.visitorReviewId}`
            });
          //  &noPublic=${this.$route.query.noPublic}&userId=${this.$route.query.userId}&isShare=true
          } else {
            window.test.Share(`${name}诚挚邀您拜访`, '点击此链接，完善拜访信息并提交后即可快速通行，进出园区。', 'http://park.hzqisheng.cn/share.png', `${window.location.origin}/#/parkVisitorRegister?shareNum=1&visitorReviewId=${this.visitorReviewId}`);
          }
          this.loading = false
          return
        }
        let shareCont = {
          title: `${name}诚挚邀您拜访`,
          shareContent: '点击此链接，完善拜访信息并提交后即可快速通行，进出园区。',
          url: `${window.location.origin}/#/parkVisitorRegister?shareNum=1&visitorReviewId=${this.visitorReviewId}`,
          imgUrl: 'http://park.hzqisheng.cn/share.png'
        };
        getData.share(encodeURIComponent(window.location.origin+'/')).then(res => {  //配置微信API
          this.$store.state.appId = res.data.data.appId;
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.data.data.appId, // 必填，公众号的唯一标识
            timestamp: res.data.data.timestamp, //// 必填，生成签名的时间戳
            nonceStr: res.data.data.noncestr, // 必填，生成签名的随机串
            signature: res.data.data.signature,// 必填，签名，见附录1
            jsApiList: [
              'onMenuShareTimeline',
              'onMenuShareAppMessage',
              'onMenuShareQQ',
              'onMenuShareWeibo',
              'onMenuShareQZone',
            ]
          });
          // mobile.wxshare(wx, shareCont);
          let title = shareCont.title
          let shareContent = shareCont.shareContent
          let url = shareCont.url
          let imgUrl = shareCont.imgUrl
          let _this = this
          wx.ready(function () {
            wx.checkJsApi({
              jsApiList: [
                'onMenuShareTimeline', // 分享到朋友圈
                'onMenuShareAppMessage', // 分享给好友
                'onMenuShareQQ', // 分享到QQ
                'onMenuShareWeibo', // 分享到微博
                'onMenuShareQZone' // 分享到QQ空间
              ]
            });
            wx.onMenuShareTimeline({
              title: title, // 分享标题
              link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: imgUrl, // 分享图标
              success: function () {
                mobile.toast('分享成功')
                _this.shareSuccess()
                _this.showShare = false
                _this.$router.go(-1)
              },
              cancel: function () {
                mobile.toast('取消分享')
              }
            });
            wx.onMenuShareAppMessage({
              title: title, // 分享标题
              desc: shareContent, // 分享描述
              link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: imgUrl, // 分享图标
              type: 'link', // 分享类型,music、video或link，不填默认为link
              dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
              success: function () {
                mobile.toast('分享成功')
                _this.shareSuccess()
                _this.showShare = false
                _this.$router.go(-1)
              },
              cancel: function () {
                mobile.toast('取消分享')
              }
            });
            wx.onMenuShareQQ({
              title: title, // 分享标题
              desc: shareContent, // 分享描述
              link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: imgUrl, // 分享图标
              success: function () {
                mobile.toast('分享成功')
                _this.shareSuccess()
                _this.showShare = false
                _this.$router.go(-1)
              },
              cancel: function () {
                mobile.toast('取消分享')
              }
            });
            wx.onMenuShareWeibo({
              title: title, // 分享标题
              desc: shareContent, // 分享描述
              link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: imgUrl, // 分享图标
              success: function () {
                mobile.toast('分享成功')
                _this.shareSuccess()
                _this.showShare = false
                _this.$router.go(-1)
              },
              cancel: function () {
                mobile.toast('取消分享')
              }
            });
            wx.onMenuShareQZone({
              title: title, // 分享标题
              desc: shareContent, // 分享描述
              link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: imgUrl, // 分享图标
              success: function () {
                mobile.toast('分享成功')
                _this.shareSuccess()
                _this.showShare = false
                _this.$router.go(-1)
              },
              cancel: function () {
                mobile.toast('取消分享')
              }
            });
          });
          this.loading = false
        })
        // this.timeOut = setTimeout(() => {
        //   mobile.wxshare(wx, shareCont);
        // }, 1000)

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

