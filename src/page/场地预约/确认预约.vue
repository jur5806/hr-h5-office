<template>
  <div class="warp page1">
    <v-header :goBack="true" headTitle="确认预约" :serviceGet="true">
    </v-header>
    <v-scroll ref="my_scroller" class="service-main-box scroll">
      <div class=" g-field-info">
        <div class="g-field-wrap">
          <div class="img-box">
            <img
              :src="typeof appointmentInfo.fieldImageList != 'undefined' &&appointmentInfo.fieldImageList.length>0?appointmentInfo.fieldImageList[0]:null"
              alt="">
          </div>
          <div class="g-info">
            <div class="g-info-title">
              {{appointmentInfo.fieldName}}
            </div>
            <div class="g-info-type" v-if="appointmentInfo.fieldTypeName">{{appointmentInfo.fieldTypeName|empty}}</div>
            <div class="g-info-content">{{appointmentInfo.fieldAddress|empty}}</div>
            <div class="g-info-content">可容纳{{appointmentInfo.fieldCapacity|empty}}人</div>
          </div>
        </div>
        <div class="g-appointment-time">
          <div class="g-label">预约时间:</div>
          <div class="g-content">
            <span>{{clickTime}}</span>
            <ul class="option-list">
              <li v-for="(item,index) in orderTimeList" :key="index">
                <span>{{item.appStartTime}}{{item.id>23?'pm':'am'}} — {{item.appEndTime}}{{item.id>23?'pm':'am'}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="g-minelist">
        <div class="g-mineitem flex-box g-shadow marbot30" @click="goUrl('/faceInfo',query)">
          <div class="flex-box g-mineleft">
            <i class="iconfont icon-renlianshibie"></i>
            <p>我的人脸</p>
          </div>
          <div class="g-mineright flex-box">
            <p class="g-face-name" v-if="$store.state.myFace">{{$store.state.myFace.fieldFaceName}}</p>
            <p class="g-face-name" v-else>{{appointmentInfo.myFace}}</p>
            <span class="g-face-type" v-if="userId === appointmentInfo.faceId">本人</span>
            <i class="iconfont icon-jinru-copy"></i>
          </div>
        </div>

        <div class="g-mineitem flex-box g-shadow marbot30">
          <div class="flex-box g-mineleft">
            <div class="img-box">
              <img src="../../../static/img/icon_querenyuyue_zhifufangshi.png" alt="">
            </div>
            <p>支付方式</p>
          </div>
          <div class="g-mineright flex-box">
            <p class="g-face-name">微信支付</p>
            <i class="iconfont icon-jinru-copy"></i>
          </div>
        </div>

        <div class="g-mineitem flex-box g-shadow marbot30">
          <div class="flex-box g-mineleft">
            <div class="img-box">
              <img src="../../../static/img/icon_querenyuyue_hejijine.png" alt="">
            </div>
            <p>合计金额</p>
          </div>
          <div class="g-mineright flex-box">
            <p class="g-money-number">￥{{appointmentInfo.moneyNumber}}</p>
          </div>
        </div>
      </div>
    </v-scroll>
    <div class="g-confirmbtn" v-if="appointmentInfo.moneyNumber!=0" @click="submits">前往付款</div>
    <div class="g-confirmbtn" v-else @click="submitsNoFee">确认预约</div>
  </div>
</template>
<script>
  import * as getData from '../../service/getData'
  import * as mobile from '../../config/mUtils'
  import {mapState, mapMutations, mapActions} from 'vuex'

  export default {
    data() {
      return {
        navstate: 0,
        pageIndex: 1,
        totalPage: 1,
        appointmentRecordList: [],
        checkState: '',
        appointmentInfo: {
          fieldName: '',
          fieldTypeName: '',
          fieldAddress: '',
          fieldCapacity: '',
          appStartTime: '',
          appEndTime: '',
          myFace: '',
          payType: '',
          moneyNumber: '',
          fieldImageList: '',
          appFieldFaceId: ''
        },
        userId: '',
        isOperate: false,
        query: {},
        appointmentRecordList:[],
        orderTimeList:[],
        clickTime:'',
      }
    },
    created() {
      this.$route.query && (this.query = this.$route.query);
    },
    components: {},
    mounted() {
      this.appointmentRecordList = JSON.parse(sessionStorage.getItem('recordList')||'')
      this.orderTimeList = this.$store.state.orderTimeList;
      this.clickTime = this.$route.query.clickTime;
      let user = mobile.getSession('user')
      if (user) {
        this.userId = JSON.parse(user).userId;
      }
      this.init()
      if (this.$route.query.pay) {
        this.payMoney();
      }
    },
    computed: {},
    methods: {
      submitsNoFee() {
        if (!this.$store.state.myFace && !this.appointmentInfo.appFieldFaceId) {
          mobile.toast('请先选择人脸')
          return
        }
        // 免费预约
        getData.addNoPaymentAppointmentOfZH({
          appMrId: this.$route.query.fieldId,
          appRemark: this.$route.query.appRemark,
          appImgUrl: this.$route.query.appImgUrl,
          appFieldFaceId: this.$store.state.myFace ? this.$store.state.myFace.fieldFaceId : this.appointmentInfo.appFieldFaceId,
          appointmentServiceTagName:this.$route.query.appointmentServiceTagName,
          appointmentRecordList: this.appointmentRecordList
        }).then(res => {
          if(res.data.code === 1){
            mobile.toast('预约成功')
            this.$router.replace('/myReservation')
          }else{
            mobile.toast(res.data.message)
          }
        })
      },
      submits() {
        if (!this.$store.state.myFace && !this.appointmentInfo.appFieldFaceId) {
          mobile.toast('请先选择人脸')
          return
        }
        if (mobile.getSession('isWx') === 'false') {
          this.h5pay()
        } else {
          let fieldFaceId = this.$store.state.myFace ? this.$store.state.myFace.fieldFaceId : this.appointmentInfo.appFieldFaceId;
          let siteInfo = {
            appMrId:this.$route.query.fieldId,
            appRemark:this.$route.query.appRemark,
            appFieldFaceId:fieldFaceId,
            appImgUrl: this.$route.query.appImgUrl,
            appointmentServiceTagName:this.$route.query.appointmentServiceTagName,
            appointmentRecordList:this.appointmentRecordList,
          }
          sessionStorage.setItem('siteInfo',JSON.stringify(siteInfo));
          let url = window.location.origin + '/#/appointmentConfirm?pay=true'
          let uri = encodeURIComponent(url)
          getData.getAppointmentWXCode({uri: uri}).then((res) => {
            if (res.data.code === 1) {
              window.location.replace(res.data.data);
            } else {
              mobile.toast(res.data.message);
            }
          }).catch(err => {
            console.log(err)
          })
        }
      },
      payMoney() {
        let url = window.location.origin + '/#/myReservation'
        getData.resultAppointmentOpenId(this.$route.query.code).then((rest) => {
          if (rest.data.code === 1) {
            let siteInfo = JSON.parse(sessionStorage.getItem('siteInfo'));
            getData.wxAppointmentPayment(siteInfo).then((res) => {
              if (res.data.code === 1) {
                this.isOperate = false
                WeixinJSBridge.invoke('getBrandWCPayRequest', {
                  "appId": res.data.data.appid,
                  "timeStamp": res.data.data.timeStamp,
                  "nonceStr": res.data.data.nonceStr,
                  "package": res.data.data.package,
                  "signType": "MD5",
                  "paySign": res.data.data.paySign
                }, (result => {
                  WeixinJSBridge.log(result.err_msg);
                  console.log(result)
                  console.log(result.err_msg)
                  if (result.err_msg == "get_brand_wcpay_request:ok") {//微信支付成功
                    mobile.toast('支付成功');
                    this.$router.replace('/myReservation')
                    // history.go(-1)
                  } else if (result.err_msg == "get_brand_wcpay_request:cancel"){//用户取消支付!
                    mobile.toast('支付已取消');
                    // window.location.replace(url)
                    history.go(-2)
                  } else {
                    mobile.toast('支付出错');
                    // window.location.replace(url)
                    history.go(-2)
                  }
                }))
              } else {
                this.isOperate = false
                mobile.toast(res.data.message);
                // window.location.replace(url)
                // history.go(-1)
              }
            }).catch(err => {
              // alert('catch')
              alert(err)
              console.log(err)
            })
          } else {
            this.isOperate = false;
            mobile.toast('支付参数错误！');
            // window.location.replace(url)
            history.go(-1)
          }
        }).catch(err => {
          console.log(err)
        })
      },
      h5pay() {
        let fieldFaceId = this.$store.state.myFace ? this.$store.state.myFace.fieldFaceId : this.appointmentInfo.appFieldFaceId;
        const browserType = {
          versions: (function () {
            let u = navigator.userAgent
            return {
              trident: u.indexOf('Trident') > -1, // IE内核
              presto: u.indexOf('Presto') > -1, // opera内核
              webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
              gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
              mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
              ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
              android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或者uc浏览器
              iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
              iPad: u.indexOf('iPad') > -1, // 是否iPad
              webApp: u.indexOf('Safari') === -1, // 是否web应该程序，没有头部与底部
              weixin: u.toLowerCase().match(/MicroMessenger/i) === 'micromessenger', // 是否微信
              qq: u.match(/\sQQ/i) === ' qq' // 是否QQ
            }
          }())
        }
        let browser
        if (browserType === 'ios') {
          browser = 'IOS'
        } else if (browserType === 'Android') {
          browser = 'Android'
        } else {
          browser = 'Wap'
        }
        let form = {
          appMrId:this.$route.query.fieldId,
          appRemark:this.$route.query.appRemark,
          appFieldFaceId:fieldFaceId,
          type:browser,
          appImgUrl: this.$route.query.appImgUrl,
          appointmentRecordList:this.appointmentRecordList,
          appointmentServiceTagName:this.$route.query.appointmentServiceTagName,
        }
        getData.addAppointmentOfZH(form).then(res => {
          if (res.data.code === 1) {
            let url = res.data.data.mweb_url
            window.location.replace(url)
          }else{
            mobile.toast(res.data.message)
          }
        })
        this.$store.state.appRemark = '';
      },
      goUrl(url, query) {
        this.$router.push({path: url, query: query})
      },
      init() {
        let form = {};
        if(this.$route.query.fieldId){
          form = {
            fieldId:this.$route.query.fieldId,
            appointmentRecordList:this.appointmentRecordList
          };
        }else{
          let siteInfo = JSON.parse(sessionStorage.getItem('siteInfo'));
          form = {
            fieldId:siteInfo.appMrId,
            appointmentRecordList:siteInfo.appointmentRecordList
          };
        }
        getData.fieldDetailConfirm(form).then(res => {
          if (res.data.code === 1) {
            this.isLoading = false;
            let data = res.data.data;
            this.appointmentInfo.fieldName = data.fieldName;
            this.appointmentInfo.fieldTypeName = data.fieldTypeName;
            this.appointmentInfo.fieldAddress = data.fieldAddress;
            this.appointmentInfo.fieldCapacity = data.fieldCapacity;
            this.appointmentInfo.myFace = data.facePersonName;
            this.appointmentInfo.moneyNumber = data.totalFee;
            this.appointmentInfo.fieldImageList = data.fieldImageList;
            this.appointmentInfo.appFieldFaceId = data.fieldFaceId;
          } else {
            mobile.toast(res.data.message)
          }
        })
      }
    },
    watch: {}

  }

</script>
<style scoped lang="scss">
  @import '../../assets/css/mixin';

  .g-field-info {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    position: relative;

    .g-field-wrap {
      height: 2.03rem;
      box-sizing: border-box;
      padding: .22rem .3rem .25rem;
      @include fj(flex-start);
      align-items: center;
      border-bottom: .02rem solid #EFEFF4;
    }

    .img-box {
      @include wh(2.17rem, 1.58rem);
      margin-right: .26rem;
      border: 0;

      img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .g-info {
      height: 100%;

      .g-info-title {
        font-size: .28rem;
        font-weight: bold;
        color: rgba(77, 76, 76, 1);
        margin-top: 0.11rem;
        line-height: .28rem;
        margin-bottom: .37rem;
      }

      .g-info-type {
        position: absolute;
        right: .3rem;
        top: .24rem;
        padding: .03rem .15rem;
        @include sc(.24rem, #3C78E5);
        background: rgba(219, 234, 251, 1);
        border-radius: .21rem;
      }

      .g-info-content {
        @include sc(.24rem, #727171);
        line-height: .24rem;
        margin: .26rem 0;
      }
    }

    .g-appointment-time{
      width: 100%;
      min-height: 0.88rem;
      padding: 0.2rem .3rem 0.2rem .34rem;
      @include fj();
      align-items: center;
      border-bottom: 1px solid #e9e9e9;

      .g-content {
        display: flex;
        @include sc(.26rem, #E60204);

        span {
          @include sc(.24rem, #777777);
          display: flex;
          align-items: center;
          margin-right: .6rem;

          &:last-child {
            margin-right: 0;
          }
        }
      }
      .option-List{
        li{
          margin-bottom: 0.03rem;
        }
      }
    }

    .g-yuyuetime {
      @include sc(.24rem, #727171);
      padding: .24rem .3rem;
      box-sizing: border-box;
    }
  }

  .g-face-name {
    @include sc(.26rem, #727171);
    margin-right: .13rem;
  }

  .g-face-type {
    padding: 0 .18rem;
    @include sc(.24rem, #3C78E5);
    line-height: .42rem;
    background: rgba(219, 234, 251, 1);
    border-radius: .21rem;
    margin-right: .13rem;
  }

  .g-money-number {
    @include sc(.24rem, #3C78E5);
  }

  .g-confirmbtn {
    height: 1rem;
    background: #3F7DEF;
  }

  .g-mineitem {
    box-shadow: 0 0 .50rem 0 rgba(214, 214, 214, 0.5);

    .img-box {
      width: .42rem;
      height: .42rem;
      margin-right: .23rem;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>


