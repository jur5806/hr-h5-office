<template>
  <div class="warp page1">
    <v-zhajiheader :headTitle="'我的推荐'">
    </v-zhajiheader>
    <v-scroll class="scroll main-box4">
      <div class="g-visitlist" v-if="type === 2">
        <div class="g-visitlist-item" v-for="(item, index) in visitorList" :key="index" :class="item.visitorState === 2 ? 'g-overdue' : ''" @click="$router.push('/visitorDetails?visitorId=' + item.visitorId + '&noPublic=2')">
          <div class="flex-box g-item-top">
            <i :class="item.visitorIsReceive === 0 ? 'iconfont-visit iconfasong' : 'iconfont-visit iconjieshou'"></i>

            <p class="p-word">对方已提交简历信息</p>
            <!-- <p class="p-state" v-if="item.approvalState === 1">{{getTimes(item)}}</p>
            <p class="p-state" v-else>已过期</p> -->
            <p class="p-state" v-if="item.approvalState == 0">待审核</p>
            <p style="color: #ff9b0c;" v-if="item.approvalState == 1">HR初审</p>
            <p style="color: #2C7AEE;" v-if="item.approvalState == 2">面试通过</p>
            <p style="color: #15C875;" v-if="item.approvalState == 3">成功入职</p>
            <p style="color: #15C875;" v-if="item.approvalState == 99">成功入职</p>
          </div>
          <div class="g-visit-info flex-box">
            <div class="g-visit-info-img" v-if="item.visitorIsReceive === 0">
              <img src="../assets/visitImg/wait.png" alt="">
            </div>
            <div class="g-visit-info-img" v-else>
              <img v-if="item.visitorState === 1" src="../assets/visitImg/xingm.png" alt="">
              <img v-else src="../assets/visitImg/yiguoqi.png" alt="">
            </div>
            <div style="flex: 1">
              <p class="g-info-name">{{item.recommendedName}}</p>
              <p class="g-info-phone">{{item.telephone}}</p>
            </div>
            <div class="g-infodel" @click.stop="delVisit(item)">
              删除记录
            </div>
          </div>
          <div class="flex-box g-visit-moreinfo" v-if="item.visitorIsReceive === 1">
            <div class="flex-box g-visit-moreinfo-item">
              <i class="iconfont-visit iconrenshu"></i>
              <p v-if="item.visitorNum === 5">4人以上</p>
              <p v-else>{{item.visitorNum}}人</p>
            </div>
            <div class="flex-box g-visit-moreinfo-item">
              <i class="iconfont-visit iconicon"></i>
              <p>{{new Date(item.visitorStartTime).format('MM.dd')}} ~ {{new
                Date(item.visitorEndTime).format('MM.dd')}}</p>
            <!-- 近2天（6.12~6.18}}）-->
            </div>
            <div class="flex-box g-visit-moreinfo-item">
              <i class="iconfont-visit iconvisitrecord"></i>
              <p>{{item.visitorVisitType | getVisitType}}</p>
            </div>
          </div>
        </div>
      </div>
    </v-scroll>

      <div class="g-nodatabox" v-if="visitorList.length === 0 && type === 2 && isLoadingEnd === true">
        <div class="g-nodatabox-cont">
          <img src="../assets/visitImg/empty.png" alt="">
          <p>当前暂无访客信息，点击下方按钮快速新增</p>
        </div>
      </div>
      <div class="g-nodatabox" v-if="noneVisitList.length === 0 && type === 1 && isLoadingEnd === true">
        <div class="g-nodatabox-cont">
          <img src="../assets/visitImg/empty.png" alt="">
          <p>当前暂无来访审核</p>
        </div>
      </div>
    </v-scroll>
    <div class="alpay" @click="showShare = false" v-if="showShare"><img src="http://park.hzqisheng.cn/v3.5/share.png"/>
    </div>
    <!-- <v-visit-footer-square :title="'分享访客登记链接'" @submits="submitsCheck"></v-visit-footer-square> -->
    <yd-popup class="g-confirm" v-model="showCertifi" position="center" width="6.46rem" :close-on-masker="false">
      <div class="tit">提示</div>
      <p class="g-remindcont">是否确认删除？</p>
      <div class="flex-box g-btnbox">
        <div class="btn g-bluebtn" @click.stop="sureDel">确定</div>
        <div class="btn" @click.stop="showCertifi = false">取消</div>
      </div>
    </yd-popup>
    <yd-popup class="g-zhaji-confirm" v-model="showagree" position="center" width="6.3rem" :close-on-masker="false">
      <div class="tit">提示</div>
      <p class="g-remindcont">是否确定通过</p>
      <div class="flex-box g-btnbox">
        <div class="btn g-bluebtn" @click="examine(2)">确认</div>
        <div class="btn" @click="showagree = false">取消</div>
      </div>
    </yd-popup>
    <yd-popup class="g-confirm" v-model="showReminder" position="center" width="6.06rem" :close-on-masker="false">
      <div class="tit">提示</div>
      <p class="g-remindcont">对不起，您暂无邀请访客的权限，如有疑问，请联系园区管理员，谢谢！</p>
      <div class="flex-box g-remindcont-btn">
        <div class="btn g-bluebtn" style="width:3.38rem;" @click="showReminder = false">确认</div>
      </div>
    </yd-popup>
  </div>
</template>

<script>
  import * as getData from '../service/getData'
  import * as mobile from '../config/mUtils'
  import wx from 'weixin-js-sdk'

  export default {
    data () {
      return {
        type: 2,
        showShare: false,
        showCertifi: false,
        showReminder: false,
        userId: '',
        visitorList: [],
        noneVisitList: [],
        nowTime: '',
        isLoadingEnd: false,
        allAgree: false,
        showagree: false,
        agreeId: '',
        code:'',
        visitorReviewId:'',
      }
    },
    mounted () {
      this.initFirst();
    },
    components: {},

    computed: {},
    methods: {
      initFirst() {
        this.userId = sessionStorage.getItem('userId')
        getData.myResumeInfo(this.userId).then(res => {
          if (res.data.code === 200) {
            this.visitorList = res.data.data
          }
          
        })
      },
      judgeUserRole() {
        getData.judgeUserRole(this.userId).then(res => {
          if(res.data.code !== 1){
            return
          }
          this.code = res.data.data.status
        });
      },
      init () {
        this.isLoadingEnd = false
        if (this.type === 2) {
          getData.getVisitorList(this.userId).then(res => {
            if (res.data.code !== 1) {
              this.isLoadingEnd = true
              mobile.toast(res.data.message);
              return
            }
            this.isLoadingEnd = true
            this.nowTime = res.data.data.nowTime
            this.visitorList = res.data.data.visitorList
          })
        } else {
          getData.showUnreviewedVisitorList().then(res => {
            if (res.data.code !== 1) {
              mobile.toast(res.data.message);
              return
            }
            this.isLoadingEnd = true
            let list = res.data.data
            this.noneVisitList = [];
            list.forEach(val => {
              val.isAgree = false;
              this.noneVisitList.push(val);
            });
          })
        }
      },
      getTimes (item) {
        let timeLength = item.visitorEndTime - this.nowTime;
        if (timeLength > 0) {
          // 大于一天
          if (timeLength > 24 * 60 * 60 * 1000) {
            return Math.floor(timeLength / (24 * 60 * 60 * 1000)) + '天后过期'
          } else {
            return Math.floor(timeLength / (60 * 60 * 1000)) + '小时后过期'
          }
        } else {
          return '已过期'
        }
      },
      getTimeLength(info){
        if (info.visitorEndTime - info.visitorStartTime === (24 * 60 * 60 - 1) * 1000) {
          return '当天' + new Date(info.visitorStartTime).format('MM.dd')
        } else if (info.visitorEndTime - info.visitorStartTime === (24 * 60 * 60 * 3 - 1) * 1000) {
          return '近3天（' + new Date(info.visitorStartTime).format('MM.dd') + '~' + new Date(info.visitorEndTime).format('MM.dd') + '）'
        } else {
          return '近7天（' + new Date(info.visitorStartTime).format('MM.dd') + '~' + new Date(info.visitorEndTime).format('MM.dd') + '）'
        }
      },
      getTimeLength1(info){
        if (info.visitorReviewEndTime - info.visitorReviewStartTime === (24 * 60 * 60 - 1) * 1000) {
          return '当天' + new Date(info.visitorReviewStartTime).format('MM.dd')
        } else if (info.visitorReviewEndTime - info.visitorReviewStartTime === (24 * 60 * 60 * 3 - 1) * 1000) {
          return '近3天（' + new Date(info.visitorReviewStartTime).format('MM.dd') + '~' + new Date(info.visitorReviewEndTime).format('MM.dd') + '）'
        } else {
          return '近7天（' + new Date(info.visitorReviewStartTime).format('MM.dd') + '~' + new Date(info.visitorReviewEndTime).format('MM.dd') + '）'
        }
      },
      delVisit (info) {
        this.showCertifi = true;
        this.visitorId = info.resumeId
      },
      sureDel () {
        getData.resumetDel(this.visitorId).then(res => {
          if (res.data.code !== 200) {
            mobile.toast(res.data.message);
            return
          }
            this.showCertifi = false
            this.initFirst()
            mobile.toast('删除成功')
        })
      },
      examine(visitorReviewStatus) {
        let str = `adminId=${this.userId}&visitorReviewId=${this.agreeId}&visitorReviewStatus=${visitorReviewStatus}`;
        if (this.canAgree) {
          this.canAgree = false;
          getData.visitorReview(str).then(res => {
            if (res.data.code !== 1) {
              mobile.toast(res.data.message);
              return
            }
            mobile.toast('审核成功');
            this.showagree = false;
            this.canAgree = true;
            this.init(() => {
            });
          })
        } else {
          mobile.toast('请勿重复提交通过');
        }
      },
      submits () {
        if(this.code===1){
          this.$router.push('/parkVisitorAdd?isPark=1')
        }else{
          this.showReminder=true;
        }
      },
      submitsCheck () {
        this.addLcVisitorReview();
      },
      addLcVisitorReview(){
        getData.addLcVisitorReview().then(res => {
          if (res.data.code === 1) {
            this.visitorReviewId = res.data.data.visitorReviewId;
            this.showShare = true;
          } else {
            mobile.toast(res.data.message)
          }
        });
      },
      changeTab (type) {
        this.type = type;
        this.init()
      }
    },
    filters: {
      getVisitType (val) {
        switch (val) {
          case 1:
            return '业务来访'
          case 2:
            return '人员面试'
          case 3:
            return '参观访问'
          case 4:
            return '其他来访'
          default:
            return '--'
        }
      },
      getStatus (val) {
        switch (val) {
          case 1:
            return '审核中';
          case 2:
            return '已通过';
          case 3:
            return '已驳回';
          case 4:
            return '已过期';
          default:
            return '--'
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../assets/css/mixin';
  .g-visitbg-top{
    position: relative;
    img{
      position: absolute;
      top: -1.28rem;
      height: 4.25rem;
      width: 100%;
      z-index: 0
    }
  }
  .g-visittype{
    justify-content: space-around;
    margin-bottom: .4rem;
    box-shadow: 0 0 .5rem 0 rgba(214, 214, 214, 0.5);
    p{
      position: relative;
      z-index: 1;
      font-size:.3rem;
      font-family:PingFangSC-Medium;
      color:#4E4C4C;
      // opacity:0.6;
      line-height: .8rem;
    }
    .g-active{
      opacity: 1;
      color: #3C78E5;
      &:after{
        position: absolute;
        content: '';
        bottom: 0;
        left: 50%;
        margin-left: -.3rem;
        width:.6rem;
        height:.04rem;
        background:#3C78E5;
        border-radius:.02rem;
      }
    }
  }
  .main-box4{
    flex: 1
  }
  .g-visitlist{
    position: relative;
    z-index: 4;
    padding: 0 .2rem;
    .g-visitlist-item{
      margin-bottom: .3rem;
      padding: 0.3rem .21rem;
      background-color: #fff;
      box-shadow: 0 0 .5rem 0 rgba(214, 214, 214, 0.5);
      border-radius: .08rem;
      width: 100%;
      min-height: 2.73rem;

      .g-visit-name{
        .g-info-name{
          font-size: .3rem;
          font-family: PingFang SC;
          font-weight: 500;
          color: #343434;
          margin-right: .2rem;
        }
        .g-info-status{
          width: 1rem;
          height: .36rem;
          img{
            width: 100%;
            height: 100%;
          }
        }
      }
      .g-info-company{
        font-size: 0.29rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: #343434;
        padding-top: .24rem;
      }
      .g-info-visitor,.g-info-visittime,.g-info-visitnum{
        font-size: 0.26rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: #666666;
        padding-top: .15rem;
      }
    }
    .g-item-top{
      height: .6rem;
      border-bottom: 1px solid #EAEAEA;
      i{
        color: #2C7AEE;
        margin-right: .17rem;
        font-size: .26rem;
      }
      p{
        font-size:.26rem;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(102,102,102,1);
      }
      .iconjieshou{
        color: #15C875;
      }
      .p-word{
        flex: 1;
        color:rgba(102,102,102,1);
      }
      .p-state{
        color:rgba(255,74,74,1);
      }
    }
    .g-visit-info{
      padding: .4rem 0;
      .g-visit-info-img{
        flex: none;
        width: .8rem;
        height: .8rem;
        margin-right: .2rem;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .g-info-wait{
        font-size:.26rem;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(102,102,102,1);
      }
      .g-info-name{
        font-size:.34rem;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(67,67,67,1);
        line-height:1;
      }
      .g-info-phone{
        font-size:.26rem;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(102,102,102,1);
        line-height:1;
        margin-top: .1rem;
      }
      .g-infodel{
        width:1.4rem;
        height:.5rem;
        background:rgba(255,255,255,1);
        border:1px solid rgba(255,74,74,1);
        border-radius:.25rem;
        text-align: center;
        line-height: .5rem;
        font-size:.26rem;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(255,74,74,1);
      }
    }
    .g-visit-moreinfo{
      padding-bottom: .19rem;
      justify-content: space-between;
      .g-visit-moreinfo-item{
        i{
          margin-right: .08rem;
          color: #C0C4DC;
          font-size: .26rem;
          line-height: 1;
        }
        p{
          font-size:.26rem;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(102,102,102,1);
          line-height: 1;
        }
      }
    }
    .g-overdue{
      .g-item-top{
        i{
          color: #D0D0D0;
        }
        .p-word,.p-state{
          color:#CCCCCC;
        }
        .iconjieshou{
          color: #CCCCCC;
        }
      }
      .g-visit-info{
        .g-info-name, .g-info-phone{
          color:#999999;
        }
      }
      .g-visit-moreinfo{
        .g-visit-moreinfo-item{
          i, p{
            color: #999999;
          }
        }
      }
    }
  }
  .g-nodatabox{
    position: relative;
    z-index: 1;
    padding: 0 .2rem;
    .g-nodatabox-cont{
      width: 100%;
      height: 6rem;
      // box-shadow:0px 7px 23px 4px rgba(203,216,234,0.3);
      border-radius:.1rem;
      background-color: #FFFFFF;
      padding-top: 2.73rem;
      img{
        display: block;
        width: 4.4rem;
        height: 2.74rem;
        margin: 0 auto;
      }
      p{
        font-size:.26rem;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:#A1AEBE;
        // margin-top: .47rem;
        text-align: center;
      }
    }
  }

  .g-zhaji-visitList .g-item, .g-zhaji-manageList .g-item {
    &:first-child {
      margin-top: 0.1rem;
    }
  }

  .g-confirm {
    .g-remindcont {
      padding: 0;
    }
  }

  .g-remindcont-btn{
    justify-content: center;
  }
</style>
