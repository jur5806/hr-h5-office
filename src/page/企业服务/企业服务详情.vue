<template>
  <div class="warp page1 g-page-grey">
    <v-header :goBack="true" headTitle="企业服务详情">
    </v-header>
    <!-- <div class="g-enterprise-bg"> -->
      <!-- <div class="g-bg-top"></div> -->
      <v-scroll class="scroll" :class=" info.odStatus === 4 ? 'main-box28' : 'main-box29'" ref="my_scroller" style="margin-top: .2rem;">
        <div class="g-top-blank"></div>
        <div class="g-padinng-20">
          <div class="g-enser-top">
            <v-enterprise-steps :types="types" v-if="hasPersonOrder"></v-enterprise-steps>
            <p class="g-needs" v-if="info.odStatus === 1 || info.odStatus === 2">您的需求已提交</p>
            <p class="g-needs" v-else-if="info.odStatus === 4">服务已完成</p>
            <p class="g-times">{{info.odFinishTime ? new Date(info.odFinishTime).format('yyyy-MM-dd hh:mm:ss') : new Date(info.odCreateTime).format('yyyy-MM-dd hh:mm:ss')}}</p>
            <div class="flex-box" v-if="info.odStatus === 1 || info.odStatus === 2">
              <img class="imgs" src="../../assets/enterpriseImg/remind.png" alt="">
              <p class="p1">请耐心等待，企业服务中心会第一时间处理您的需求~</p>
            </div>
            <div class="flex-box" v-else-if="info.odStatus === 4">
              <img class="imgs" src="../../assets/enterpriseImg/remind.png" alt="">
              <p class="p1">您的服务已处理完成~</p>
            </div>
            <!-- <div class="flex-box g-replys" v-else-if="info.odStatus === 4">
              <img src="../../assets/enterpriseImg/mangers.png" alt="">
              <div>
                <h4>管家反馈</h4>
                <p v-if="info.odStatus === 1 || info.odStatus === 2">您的服务任务已经派发，请耐心等待服务人员为您 服务～</p>
                <p v-if="info.odStatus === 4">{{info.odFeedback}}</p>
              </div>
            </div> -->
          </div>
          <div class="g-servce-details">
            <div class="flex-box g-detail-tit">
              <h4>{{orderTypeName}}</h4>
              <p :class="{
                  'bg-red': info.odStatus === 1 || info.odStatus === 2,
                  'bg-green': info.odStatus === 4,
                }">{{getStatus(info.odStatus)}}</p>
            </div>
            <div class="g-forms-enter">
              <div class="g-des">{{info.odDescription}}</div>
              <div class="g-des" v-if="info.odIsVisit == 2">隐患描述:{{security.securityDescribe}}</div>
              <div class="g-des" v-if="info.odIsVisit == 2">备注信息:{{security.securityRemark}}</div>
              <div class="flex-box g-enter-bottom">
                <img class="img1" src="../../assets/enterpriseImg/handle-time.png" alt="">
                <p class="p-times">{{new Date(info.odCreateTime).format('yyyy-MM-dd hh:mm:ss')}} 提交</p>
              </div>
              <div class="g-form-item">
                <ul class="g-showimgs">
                  <li v-for="(imgItem, imgIndex) in odImgUrl" :key="imgIndex"><img :src="imgItem.imgUrl" alt="" @click.stop="lookimgs(odImgUrl, imgIndex)"></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </v-scroll>
      <div class="g-enterprise-footer" v-if="info.odStatus === 1 || info.odStatus === 2">
        <!-- <p @click="cencelService">取消</p> -->
        <van-button :loading="cencelLoading" type="primary" @click="cencelService" class="g-btn">取消</van-button>
      </div>

      <v-lookimg :activeimg="activeimg" :indeximg="indeximg" v-if="lookbool" @closeimg="lookbool = false"></v-lookimg>
    <!-- </div> -->
  </div>
</template>

<script>
  import * as getData from '../../service/getData'
  import * as mobile from '../../config/mUtils'
  import { Dialog } from 'vant';
  export default {
    data () {
      return {
        info: {},
        activeimg: [],
        indeximg: 0,
        lookbool: false,
        types: '',
        hasPersonOrder: 1,
        odImgUrl: [],
        orderTypeName: '',
        cencelLoading: false,
        security: {}
      }
    },
    mounted () {
      getData.getOrderDetail(this.$route.query.odId).then(res => {
        if (res.data.code === 1) {
          res.data.data.odJson = JSON.parse(res.data.data.orderDepartment.odJson)
          this.info = res.data.data.orderDepartment
          this.security = res.data.data.security;
          this.orderTypeName = res.data.data.orderTypeName
          let odJson = JSON.parse(this.info.odJson)
          odJson.forEach(element => {
            if(element.type == 'file'){
              this.odImgUrl = element.value || [];
            }
          });
          if (this.info.odStatus === 0) { // 没有派发过
            this.hasPersonOrder = 0
          } else {
            this.hasPersonOrder = 1
            if (this.info.odStatus === 1 || this.info.odStatus === 2) {
              this.types = 1
            } else if (this.info.odStatus === 4) {
              this.types = 2
            }
          }
        }
      })
    },
    components: {},
    computed: {},
    methods: {
      getStatus (odStatus) {
        switch (odStatus) {
          case 1:
            return '待处理'
          case 2:
            return '待处理'
          case 3:
            return '处理中'
          case 4:
            return '已完成'
          case 4:
            return '已取消'
          default:
            return odStatus
        }
      },
      lookimgs (list, index,type) {
        let arr 
        if(!type){
          arr= list.map(ele=>{
            return ele.imgUrl;
          })
        }else{
          arr = list
        }
        this.activeimg = arr
        this.indeximg = index
        this.lookbool = true
      },
      cencelService(){
        this.cencelLoading = true;
        getData.cancelOrderService(this.$route.query.odId).then(res => {
          this.cencelLoading = false;
          if (res.data.code === 1) {
            mobile.toast('取消成功');
            this.$router.go(-1);
          }else{
            mobile.toast(res.data.message)
          }
        }).catch(error => {
          this.cencelLoading = false;
        })
      }
    },
    filters: {

    }
  }
</script>

<style scoped lang="scss">
  @import '../../assets/css/mixin';
  .g-padinng-20{
    padding: 0 .2rem .2rem;
  }
  .g-enser-top{
    background:rgba(255,255,255,1);
    box-shadow:0px .06rem .2rem 0px rgba(0,14,26,0.08);
    border-radius:.16rem;
    padding: .35rem .4rem .3rem;
    margin-bottom: .24rem;
    .g-needs{
      font-size:.28rem;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height: .48rem;
      margin-top: .2rem;
    }
    .g-times{
      font-size:.24rem;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(46,115,255,1);
      line-height: .36rem;
      margin-bottom: .26rem;
    }
    .p1{
      font-size:.24rem;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(255,46,46,1);
      line-height: .36rem;
    }
    .imgs{
      width: .25rem;
      height: .24rem;
      margin-right: .09rem;
    }
    .g-replys{
      border-top: 1px solid #DDDDDD;
      padding-top: .35rem;
      img{
        width: .88rem;
        height: .87rem;
        margin-right: .2rem;
      }
      h4{
        font-size:.28rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(46,115,255,1);
        line-height:.36rem;
      }
      p{
        font-size:.24rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(119,119,119,1);
        line-height:.36rem;
        margin-top: .1rem;
      }
    }
  }
  .g-servce-details{
    width: 100%;
    overflow: hidden;
    background:rgba(255,255,255,1);
    box-shadow:0px .06rem .2rem 0px rgba(0,14,26,0.08);
    border-radius:.16rem;
    padding: .4rem;
    .g-detail-tit{
      justify-content: space-between;
      margin-bottom: .1rem;
      padding-bottom: .18rem;
      border-bottom: 1px solid #f3f3f3;
      h4{
        font-size:.3rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(51,51,51,1);
      }
      p{
        font-size:.22rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(255,255,255,1);
        line-height: .36rem;
        width:.92rem;
        height:.36rem;
        border-radius:.18rem;
        text-align: center;
      }
      .bg-red{
        background:rgba(255,99,99,1);
      }
      .bg-blue{
        background:#5AA8FF;
      }
      .bg-green{
        background:#17C930
      }
    }
  }

  .g-showimgs{
    display: flex;
    flex-wrap: wrap;
    width: 110%;
    li{
      width: 1.96rem;
      height: 1.96rem;
      margin-top: .26rem;
      margin-right: .21rem;
      img{
        width: 100%;
        height: 100%;
      }
    }
  }

  .g-forms-enter{
    .g-des{
      font-size: 0.28rem;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 0.44rem;
    }
    .g-form-cont .p-conts{
      border: 0 none;
      color: #999999;
    }

  }
  .g-enter-bottom{
    margin-top: .2rem;
      border-top: 1px solid #f3f3f3;
      height: .84rem;
      .img1{
        width: .26rem;
        height: .26rem;
        margin-right: .15rem;
      }
      .p-times{
        font-size:.24rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(204,204,204,1);
      }
    }
    .van-button__text{
      color: white;
      font-size: .3rem;
    }

</style>
