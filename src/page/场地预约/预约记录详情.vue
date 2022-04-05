<template>
  <div class="warp page1">
    <v-header :goBack="true" headTitle="预约记录详情" :serviceGet="true"></v-header>
    <v-scroll class="scroll main-body"  ref="my_scroller" :color-black="true">
      <div class="workFlowList">
        <div class="workFlowList-top" style="margin-top:0.3rem;">
          <div class="flex-box g-topheader">
            <h4>预约信息</h4>
          </div>
          <ul class="g-list">
            <li class="g-list-item" v-if="isShow"><p class="item-label">预约人</p><span>{{info.appName}}</span></li>
            <li class="g-list-item" v-if="isShow"><p class="item-label">联系方式</p>
            <!-- <span style="color:#3F7DEF">{{info.appMobile}}</span> -->
            <span style="color:#3F7DEF" v-if="$store.state.platform === 'Android'" @click="bridges.Call(info.appMobile)">{{info.appMobile}}</span>
            <a style="color:#3F7DEF" :href="'tel:'+info.appMobile" v-else>{{info.appMobile}}</a>
            </li>
            <li class="g-list-item" v-if="isShow"><p class="item-label">所属企业</p><span>{{info.companyName}}</span></li>
            <li class="g-list-item" v-if="!isShow"><p class="item-label">预约状态</p><span>{{info.appStateShow}}</span></li>
            <li class="g-list-item"><p class="item-label">预约场地</p><span>{{info.fieldName}}</span></li>
          </ul>
          <div class="g-yuyuetime">
            预约时间　　{{new Date(info.currentDate).format('yyyy/MM/dd')}}
            <ul class="option-list">
              <li v-for="(hour,index) in info.appHourIntervalVOList" :key="index">
                <span>{{hour.appStartTime}} — {{hour.appEndTime}}</span>
              </li>
            </ul>
          </div>
          <p class="g-heji">总价<span>{{info.appTotalPrice}}元</span></p>
          <div class="g-remark"><p>增值服务　</p><span>{{info.appAppointmentServiceTagName}}</span></div>
          <div class="g-remark" style="border-top:1px solid #ddd"><p>备注信息　</p><span>{{info.appRemark}}</span></div>
          <p class="g-heji" v-if="info.fieldType==2" style="border-bottom:0;">人脸信息
            <span class="g-blue" @click="$router.push('/appointmentFace?photoId='+info.fieldFaceId+'&appId='+appId+'&fieldFacePhoto='+info.fieldFacePhoto)">点击查看</span>
          </p>
          <p v-if="info.appImgUrl" style="padding-bottom:10px">
            <img class="g-img-warp" v-for="(item,index) in getDetailImg(info.appImgUrl)" :src="item" alt="" @click.stop="lookimgs(info.appImgUrl.split(','), index)">
          </p>
        </div>
      </div>
      
      
      <!-- <div class="workFlowList" v-if="info.appState != 1 && isShow ">
        <div class="workFlowList-top">
          <div class="flex-box g-topheader">
            <h4>审批信息</h4>
          </div>
        </div>
        <ul class="g-list">
          <li class="g-list-item"><p class="item-label">审批人</p><span>{{info.appReviewerName}}</span></li>
          <li class="g-list-item"><p class="item-label">审批时间</p><span>{{info.appCheckTime}}</span></li>
          <li class="g-list-item"><p class="item-label">审批结果</p>
            <span v-if="info.appState==2" >审批通过</span>
            <span v-else-if="info.appState==1">审核中</span>
            <span v-else-if="info.appState==7">已使用</span>
            <span v-else-if="info.appState==5">已取消</span>
            <span v-else-if="info.appState==3">审批驳回</span>
          </li>
        </ul>
        <div class="g-remark"><p>审批意见　</p><span>{{info.appReason}}</span></div>
      </div> -->
      <div class="workFlowList g-process-info" v-show="processCheckRecordList.length">
        <div class="workFlowList-top">
          <div class="flex-box g-topheader">
            <h4>审批流程信息</h4>
          </div>
        </div>
        <div class="g-process-cont">
          <div class="g-process-item g-customized" v-for="(item,index) in processCheckRecordList" :key="index">
            <div :class="[{'g-process-line1':index+1<processCheckRecordList.length}]"></div>
            <div class="g-process-step">
              <div :class="['g-process-pending',{'g-process-pass':item.reviewStateShow=='申请'||(item.reviewStateShow=='审批通过'&&item.approvalRecordStatus==1)},{'g-process-reject':item.reviewStateShow=='审批驳回'&&item.approvalRecordStatus==1}]"
                    style="margin-top: 0.2rem;"></div>
              
            </div>
            <div class=" g-process-left">
              <p class="g-process-approval" v-if="index===0&&item.reviewProcessStep == -99">{{item.applicantName?item.applicantName:''}}</p>
              <p class="g-process-approval" v-else>{{item.approvalRecordStatus == 1?item.reviewPersonName:item.reviewRoleShow}}</p>
              <p class="g-process-approval" v-if="item.approvalRecordStatus == 1&&index !== 0">审批意见：{{item.reviewReason || '无'}}</p>
              <p class="g-process-approval" v-if="index===0&&item.reviewProcessStep == -99">{{item.applicationTime?new Date(item.applicationTime).format('MM-dd hh:mm:ss'):''}}
                <span class="g-process-status">
                  {{item.reviewStateShow}}
                </span>
              </p>
              <p class="g-process-time" v-else>{{item.reviewTime?new Date(item.reviewTime).format('MM-dd hh:mm:ss'):''}}
                <span class="g-process-status">
                  {{item.reviewStateShow}}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="workFlowList" v-if="info.appState == 1 && isShow&&checkState">
        <div class="workFlowList-top">
          <div class="flex-box g-topheader">
            <h4>审批意见</h4>
          </div>
          <div class="g-option">
            <textarea placeholder="请填写审批意见" v-model="appReason" maxlength="100" cols="30" rows="10"></textarea>
          </div>
        </div>
      </div>
    </v-scroll>
    <div class="flex-box g-handle-btn" v-if="info.appState == 1 && isShow&&checkState">
      <p class="btn" @click="submit(3)">审批驳回</p>
      <p class="btn g-bluebtn" @click="submit(2)">审批通过</p>
    </div>
    <div class="flex-box g-handle-btn" v-if="!isShow && (info.appState == 1||info.appState == 7)&&!checkState">
      <p v-if="info.appState == 1" class="btn g-bluebtn" @click="showDispose = true;">取消预约</p>
      <p v-if="info.appState == 7" class="btn g-bluebtn" @click="showDispose = true;">结束使用</p>
    </div>

    <yd-popup class="g-confirm" v-model="showDispose" position="center" width="6.46rem" height="4.76rem" :close-on-masker="false">
      <div class="g-adaptimg g-successimg">
        <img src="../../assets/workorderimg/tit.png" alt="">
      </div>
      <div class="tit">提示</div>
      <p class="g-remindcont">{{info.appState == 1?'是否确认取消？':'是否确认已使用完毕？'}}</p>
      <div class="flex-box g-btnbox">
        <div class="btn g-bluebtn" @click="cancel()">确认</div>
        <div class="btn" @click="showDispose=false">取消</div>
      </div>
    </yd-popup>
    <v-lookimg :activeimg="activeimg" :indeximg="indeximg" v-if="lookbool" @closeimg="close"></v-lookimg>
  </div>
</template>
<script>
import * as getData from "../../service/getData";
import * as mobile from '../../config/mUtils'
export default {
  data() {
    return {
      info:{},
      appReason:'',
      isShow:0,
      showDispose:false,
      appId:'',
      processCheckRecordList: [],
      checkState:'',
      lookbool: false,
      activeimg: [],
      indeximg: 0,
    };
  },
  created() {},
  mounted() {
    this.isShow = this.$route.query.type == 1 ? true : false;
    this.checkState =this.$route.query.checkState == 0?true : false; //0为待审批状态
    this.appId = this.$route.query.appId;
    this.init();
  },
  components: {},
  computed: {},
  methods: {
    //时间转换
    init(){
      getData.appointmentDetail(this.$route.query.appId).then(res => {
        if (res.data.code !== 1&&res.data.code !== 'success') {
          mobile.toast(res.data.message);
          return;
        }
        this.info = res.data.data;
        this.processCheckRecordList = res.data.data.approvalRecordVOList||[];
      })
      .catch(_ => {
        console.log(_);
      });
    },
    cancel(){
      let type = this.info.appState == 1 ? 1 : 2;
      getData.endAppointment(this.$route.query.appId,type).then(res => {
        if (res.data.code === 1) {
          mobile.toast('操作完成！')
        } else {
          mobile.toast(res.data.message)
        }
        this.$router.go(-1)

      }).catch(err => {

      })
    },
    submit(type){
      if(mobile.rule.empty(this.appReason, '审批意见不能为空')){
        let info = {
          appId: this.$route.query.appId,
          appMrId: this.info.fieldId,
          appState: type,
          appReason: this.appReason,
        }
        this.$dialog.loading.open('审核中。。。');
        getData.updateAppointment(info).then(res => {
          if (res.data.code === 1) {
            mobile.toast('审核完成！')
          } else {
            mobile.toast(res.data.message)
          }
          this.$router.go(-1)
          this.$dialog.loading.close();
        }).catch(err => {
          this.$dialog.loading.close();
        })
      }
    },
    getDetailImg(urls) {
      if(urls!=""&&urls!=null){
        return urls.split(",");
      }else{
        return []
      }
    },
    lookimgs (activeimg, indeximg) {
      this.lookbool = true;
      this.activeimg = activeimg;
      this.indeximg = indeximg;
    },
    close () {
      this.lookbool = false
    },
  },
  watch: {}
};
</script>
<style scoped lang="scss">
@import "../../assets/css/mixin";
.warp{
  display: flex;
  height: 100%;
  flex-direction: column;
  .main-body{
    flex: 1;
    overflow: auto;
    display: flex;
    padding:0 0.3rem;
  }
}
 .g-yuyuetime {
  padding:0.3rem 0;
  line-height: .26rem;
  @include sc(.28rem, #727171);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.g-heji {
  display: flex;
  justify-content: space-between;
  padding:0.2rem 0;
  border-top: .02rem solid #ddd;
  line-height: .7rem;
  @include sc(.28rem, #727171);
  padding-right: .22rem;
  border-bottom: .02rem solid #ddd;
  span {
    color: #4a89dc;
    font-size: .3rem;

    i {
      color: #4a89dc;
      font-size: .22rem;
    }
  }
}
.g-remark{
  display: flex;
  justify-content: space-between;
  padding:0.2rem 0;
  line-height: .5rem;
  p{
    flex-shrink: 0;
    font-size: 0.28rem;
    color: #727171;
  }
  span{
    font-size: 0.28rem;
    color: #727171;
    line-height: 0.5rem;
  }
}
.g-topheader{
  line-height: .92rem;
  justify-content: space-between;
  padding: .2rem 0rem;
  h4{
    padding-left:0.16rem;
    position: relative;
    font-size:0.32rem;
    color:rgba(41,44,47,1);
    line-height:0.44rem;
    display: flex;
    justify-content: space-between;
    margin-right: .2rem;
    flex: 1;
    &::before{
      content:"";
      display: inline-block;
      width:0.06rem;
      height:0.24rem;
      position:absolute;
      top:50%;
      left:0;
      transform:translate(0, -50%);
      background-color:rgba(15,143,255,1);
    }
  }
}
.workFlowList{
  padding: 0 .3rem;
  box-shadow: 0rem 0rem 1rem 0rem rgba(214, 214, 214, 0.5);
  border-radius: 0.2rem;
  margin-bottom:0.3rem;
  .g-list{
    .g-list-item{
      padding: 0.3rem 0;
      display: flex;
      justify-content: space-between;
      border-bottom:0.02rem solid #ddd;
      .item-label{
        font-family: PingFang SC;
        font-weight: 400;
        color: #727171;
        font-size: 0.28rem;
        flex-shrink: 0;
        margin-right: .2rem;
      }
      span{
        font-size: 0.28rem;
      }
    }

  }
}
.g-option{
  padding-bottom: 0.2rem;
  textarea{
    padding:0.1rem;
    background: #F5F6F7;
    width: 100%;
    height: 1.5rem;
  }
}
.g-handle-btn{
  padding: .3rem;
  p{
    flex:1;
    margin-left: 0.2rem;
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
  }
}
.g-confirm{
    .g-successimg{
      width: 1rem;
      height: 1rem;
      margin:auto;
    }
  }
.g-img-warp {
    width: 95px;
    height: 95px;
    margin-right: 10px;
  }
</style>

