<template>
  <div class="warp page1 g-page-grey">
    <v-header :goBack="true" headTitle="入孵申请详情" :serviceGet="true"></v-header>
    <v-scroll class="scroll" style="flex:1;overflow-y:auto;" ref="my_scroller" :color-black="true">
      <div class="g-header">
        <div class="g-header-blue"></div>
        <div class="g-content-list g-header-position">
          <div class="g-content">
            <ul class="g-list">
              <li class="g-list-item"><p class="item-label">档案编号</p><span>{{enterprise.enterpriseNumber}}</span></li>
              <li class="g-list-item"><p class="item-label">提交审批时间</p><span>{{startTime}}</span></li>
              <li class="g-list-item"><p class="item-label">发起人</p><span>{{startPerson}}</span></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="g-content-list">
        <div class="g-content" style="margin-top:0.3rem;">
          <div class="flex-box g-topheader">
            <h4>企业简况</h4>
          </div>
          <div class="flex-box g-topheader2">
            <h4>{{enterprise.enterpriseName}}</h4>
            <p class="g-blue">{{enterprise.enterpriseIncubationProperty == 1? '新注册' : '迁址'}}</p>
          </div>
          <ul class="g-basic-list">
            <li class="g-basic-item">
              <p class="g-basic-p">联系人：<span>{{enterprise.enterpriseContactName}}</span></p>
              <p class="g-basic-p">联系电话：<span>{{enterprise.enterpriseContactTel}}</span></p>
            </li>
            <li class="g-basic-item">
              <p class="g-basic-p">项目领域：<span>{{enterprise.enterpriseItemFiled|domain}}</span></p>
              <p class="g-basic-p">注册资本：<span>{{enterprise.enterpriseRegisterCapital||'-'}}万元</span></p>
            </li>
            <li class="g-basic-item"><p class="g-basic-label">注册地址：<span>{{enterprise.enterpriseRegisterAddress}}</span></p></li>
            <li class="g-basic-item"><p class="g-basic-label">企业基本情况：<span>{{enterprise.enterpriseActivityContent}}</span></p></li>
            <li class="g-basic-item"><p class="g-basic-label">企业主营业务服务流程：<span>{{enterprise.enterpriseBusinessProcess}}</span></p></li>
            <li class="g-basic-item"><p class="g-basic-label">企业上下游产业及目标客户群体：<span>{{enterprise.enterpriseTargetCustomer}}</span></p></li>
          </ul>
        </div>
      </div>
      <div class="g-content-list">
        <div class="g-content" style="margin-top:0.3rem;">
          <div class="flex-box g-topheader">
            <h4>企业奖项</h4>
          </div>
          <div class="g-table">
            <table>
              <thead>
                <th>奖项名称</th>
                <th>获奖日期</th>
              </thead>
              <tbody>
                <tr v-for="prize in prizes" :key="prize.prizeId">
                  <td :title="prize.prizeName">{{prize.prizeName}}</td>
                  <td>{{new Date(prize.prizeGainTime).format('yyyy-MM-dd')}}</td>
                </tr>
                <tr v-if="!prizes.length"><td colspan="2">暂无企业奖项数据</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="g-content-list">
        <div class="g-content" style="margin-top:0.3rem;">
          <div class="flex-box g-topheader">
            <h4>企业法人</h4>
          </div>
          <ul class="g-basic-list">
            <li class="g-basic-item">
              <p class="g-basic-p">姓名：<span>{{legal.coreTeamPersonName}}</span></p>
              <p class="g-basic-p">联系电话：<span>{{legal.coreTeamPersonTel}}</span></p>
            </li>
            <li class="g-basic-item">
              <p class="g-basic-p">出生日期：<span>{{legal.coreTeamPersonBirthday|date}}</span></p>
              <p class="g-basic-p">学历：<span>{{legal.coreTeamPersonDomesticEducation|education}}</span></p>
            </li>
            <li class="g-basic-item"><p class="g-basic-label">个人简介：<span>{{legal.coreTeamPersonRemark}}</span></p></li>
          </ul>
          <h3 class="g-h3">职称信息：</h3>
          <div class="g-table">
            <table>
              <thead>
                <th>最高职称</th>
                <th>职称名称</th>
                <th>认定时间</th>
              </thead>
              <tbody>
                <tr v-for="(legalPerson,index) in legalPersonProfessionalInfo" :key="'legalPerson'+index">
                  <td>{{legalPerson.coreTeamPersonProfessional|coreTeamPersonProfessional}}</td>
                  <td>{{legalPerson.coreTeamPersonProfessionalName}}</td>
                  <td>{{legalPerson.coreTeamPersonConfirmTime}}</td>
                </tr>
                <tr v-if="!legalPersonProfessionalInfo.length"><td colspan="3">暂无职称信息</td></tr>
              </tbody>
            </table>
          </div>
          <h3 class="g-h3">荣誉信息：</h3>
          <div class="g-table">
            <table>
              <thead>
                <th>最高荣誉</th>
                <th>荣誉名称</th>
                <th>获评时间</th>
              </thead>
              <tbody>
                <tr v-for="(legalHonor,index) in legalPersonHonorInfo" :key="'legalHonor'+index">
                  <td>{{legalHonor.coreTeamPersonHighestHonor|coreTeamPersonHighestHonor}}</td>
                  <td>{{legalHonor.coreTeamPersonHonorName|coreTeamPersonHonorName}}</td>
                  <td>{{legalHonor.coreTeamPersonRatedTime}}</td>
                </tr>
                <tr v-if="!legalPersonHonorInfo.length"><td colspan="3">暂无荣誉信息</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="g-content-list">
        <div class="g-content" style="margin-top:0.3rem;">
          <div class="flex-box g-topheader">
            <h4>企业股东</h4>
          </div>
          <div class="g-table">
            <table>
              <thead>
                <th>股东名称或姓名</th>
                <th>认缴出资额（万元）</th>
                <th>出资比例</th>
              </thead>
              <tbody>
                <tr v-for="person in shareholderList" :key="person.coreTeamPersonId">
                  <td>{{person.shareholderName}}</td>
                  <td>{{person.shareholderContribution}}</td>
                  <td>{{(person.shareholderContribution/shareholderTotalAmount*100).toFixed(2)}}%</td>
                </tr>
                <tr v-if="!shareholderList.length"><td colspan="5">暂无企业股东数据</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="g-content-list">
        <div class="g-content" style="margin-top:0.3rem;">
          <div class="flex-box g-topheader">
            <h4>企业人才</h4>
          </div>
          <div class="g-table">
            <table>
              <thead>
                <th>姓名</th>
                <th>职务</th>
                <th>最高学历</th>
                <th>最高职称</th>
                <th>最高荣誉</th>
              </thead>
              <tbody>
                <tr v-for="person in coreTeamPersonList" :key="person.coreTeamPersonId">
                  <td>{{person.coreTeamPersonName}}</td>
                  <td>{{person.coreTeamPersonJob|coreTeamPersonJob}}</td>
                  <td>{{person.coreTeamPersonDomesticEducation|education}}</td>
                  <td>{{person.highestProfessionalName||'-'}}</td>
                  <td>{{person.highestHonorName||'-'}}</td>
                </tr>
                <tr v-if="!coreTeamPersonList.length"><td colspan="5">暂无企业人才数据</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="g-content-list">
        <div class="g-content" style="margin-top:0.3rem;">
          <div class="flex-box g-topheader">
            <h4>企业知识产权</h4>
          </div>
          <div class="g-table">
            <table>
              <thead>
                <th>知识产权名称</th>
                <th>发明人</th>
                <th>知识产权类别</th>
              </thead>
              <tbody>
                <tr v-for="property in intellectualPropertyList" :key="property.intellectualPropertyId">
                  <td :title="property.intellectualPropertyName">{{property.intellectualPropertyName}}</td>
                  <td :title="property.intellectualPropertyInventionPerson">{{property.intellectualPropertyInventionPerson}}</td>
                  <td>{{property.intellectualPropertyCategory|property}}</td>
                </tr>
                <tr v-if="!intellectualPropertyList.length"><td colspan="3">暂无知识产权数据</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="g-content-list">
        <div class="g-content" style="margin-top:0.3rem;">
          <div class="flex-box g-topheader">
            <h4 class="flex-box">
              企业评分情况
              <span class="totalGrade">合计：{{totalAmount}}分</span>
            </h4>
          </div>
          <div class="g-table">
            <table>
              <thead>
                <th>评分项</th>
                <th>评分</th>
              </thead>
              <tbody>
                <tr>
                  <td>团队情况</td>
                  <td>{{grade[0]}}分</td>
                </tr>
                <tr>
                  <td>项目技术来源</td>
                  <td>{{grade[1]}}分</td>
                </tr>
                <tr>
                  <td>知识产权情况</td>
                  <td>{{grade[2]}}分</td>
                </tr>
                <tr>
                  <td>项目现处阶段</td>
                  <td>{{grade[3]}}分</td>
                </tr>
                <tr>
                  <td>预期经济效益</td>
                  <td>{{grade[4]}}分</td>
                </tr>
                <tr>
                  <td>成立两年内企业上年度销售收入（加分项)</td>
                  <td>{{grade[5]}}分</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="g-content-list">
        <div class="g-content" style="margin-top:0.3rem;">
          <div class="flex-box g-topheader">
            <h4>附件预览</h4>
          </div>
          <div class="g-table">
            <table>
              <thead>
                <th>附件名称</th>
                <th>附件类型</th>
              </thead>
              <tbody>
                <tr v-for="(item,index) in fileList" :key="index">
                  <td ><a :title="item.fileManageName" style="color:#0F8FFF;" @click="downLoad(item.fileManagePath)">{{item.fileManageName}}</a></td></td>
                  <td>{{item.fileManageType|fileManageType}}</td>
                </tr>
                <tr v-if="!fileList.length"><td colspan="2">暂无附件数据</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="g-content-list">
        <div class="g-content">
          <div class="flex-box g-topheader">
            <h4>审批流程信息<span style="color:#666">{{isRejectRestart}}</span></h4>
          </div>
          <div class="g-flow">
            <div  class="g-detail-step" v-for="(item,index) in processList" :key="item.id">
              <div v-if="item.status" :class="[processList.length==index+1?'g-step-item': 'g-step-item1',processList[index+1]&&processList[index+1].processRecord?'g-setp-item2':'']">
                <div class="g-step-number">{{index+1}}</div>
                <div class="g-item-title">{{item.approvalPersonName}}({{index==0?'发起人意见':item.name+'意见'}})</div>
                <div class="flex-box g-item-time">
                  <div class="g-dotime" :class="[item.status==1?'g-item-green':'',item.status==2?'g-item-red':'',item.status==0?'g-item-blue':'',]">{{new Date(item.endTime).format('yyyy-MM-dd hh:mm:ss')}}</div>
                  <div><span class="g-state-blue" :class="[item.status==1?'g-item-green':'',item.status==2?'g-item-red':'',item.status==0?'g-item-blue':'',]">{{item.status|status}}</span></div>
                </div>
                <div class="g-item-info">审批意见: <span class="optionDetail" @click="showOption = true;rejectReason = item.remark">详情</span></div>
              </div>
              <div v-else :class="[processList.length==index+1?'g-step-item': 'g-step-item1']">
                <div class="g-step-number1">{{index+1}}</div>
                {{item.name+'意见'}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-scroll>
    <div class="g-btn-footer" v-if="approvalProcessId&&audit == 1&&processCurrStep != 1">
      <p  @click="showDismissal = true;rejectReason='';">驳回</p>
      <p  @click="showPass = true;rejectReason='';">通过</p>
    </div>

    <yd-popup class="g-confirm" v-model="showOption" position="center" width="6.3rem" :close-on-masker="true">
      <div class="tit">审核意见</div>
      <div class="g-input-dismissal" style="display:flex;">
        <v-scroll class="scroll" style="overflow:auto;flex:1;">
          {{rejectReason}}
        </v-scroll>
      </div>
      <div class="flex-box g-btnbox">
        <div class="btn" style="margin:0 auto;" @click="showOption = false">关闭</div>
      </div>
    </yd-popup>

    <yd-popup class="g-confirm" v-model="showDismissal" position="center" width="6.3rem" :close-on-masker="true">
      <div class="tit">审核驳回</div>
      <div class="g-input-dismissal">
        <textarea placeholder="请输入驳回原因" v-model.trim="rejectReason" maxlength="100"></textarea>
      </div>
      <div class="flex-box g-btnbox">
        <div class="btn g-bluebtn" @click="checkIt(2)">确认</div>
        <div class="btn" @click="showDismissal = false">取消</div>
      </div>
    </yd-popup>

     <yd-popup class="g-confirm" v-model="showPass" position="center" width="6.3rem" :close-on-masker="true">
      <div class="tit">审核通过</div>
      <div class="g-input-dismissal">
        <textarea placeholder="请输入审批意见" v-model.trim="rejectReason" maxlength="100"></textarea>
      </div>
      <div class="flex-box g-btnbox">
        <div class="btn g-bluebtn" @click="checkIt(1)">确认</div>
        <div class="btn" @click="showPass = false">取消</div>
      </div>
    </yd-popup>
  </div>
</template>
<script>
import * as getData from "../../service/getData";
import * as mobile from '../../config/mUtils'
export default {
  data() {
    return {
      info:{},
      fileList:[],
      processList:[],
      examine:false,
      showDismissal:false,
      showPass:false,
      rejectReason:'',
      enterprise:{},
      startPerson:'',
      startTime:'',
      coreTeamPersonList:[],
      shareholderList: [],
      enterpriseFileList:[],
      prizes:[],
      intellectualPropertyList:[],
      totalAmount:0,
      grade:[],
      approvalProcessId:'',
      showOption:false,
      audit:'',
      processCurrStep:'',
      isRejectRestart:'',
      legal:{},
      legalPersonHonorInfo:[],
      legalPersonProfessionalInfo:[],
      shareholderTotalAmount: 0
    };
  },
  created() {},
  mounted() {
    this.applicationId = this.$route.query.applicationId;
    this.approvalProcessId = this.$route.query.approvalProcessId;
    this.audit = this.$route.query.audit;
    this.processCurrStep = this.$route.query.processCurrStep;
    this.init();
  },
  components: {},
  computed: {},
  methods: {
    //时间转换
    timeFormat(time) {
      return mobile.toDateTime(time)
    },
    init(){
      getData.getDetail(this.$route.query.applicationId).then(res => {
        if (res.data.code !== 1&&res.data.code !== 'success') {
          mobile.toast(res.data.message);
          return;
        }
        this.isRejectRestart = res.data.data.isRejectRestart ? '（驳回合同重新发起）' : '';
        this.enterprise = res.data.data.enterprise;
        this.fileList = res.data.data.fileList;
        this.startPerson = res.data.data.startPerson;
        this.startTime = res.data.data.startTime ? new Date(res.data.data.startTime).format('yyyy-MM-dd'):'-';
        this.coreTeamPersonList = res.data.data.coreTeamPersonList;
        this.shareholderList = res.data.data.shareholderList;
        this.shareholderTotalAmount = res.data.data.totalAmount;
        this.intellectualPropertyList = res.data.data.intellectualPropertyList;
        this.processList = res.data.data.processRecordList;
        this.prizes = res.data.data.prizes;
        this.legal = res.data.data.legal;
        this.legalPersonHonorInfo = res.data.data.legalPersonHonorInfo ? res.data.data.legalPersonHonorInfo : [];
        this.legalPersonProfessionalInfo = res.data.data.legalPersonProfessionalInfo ? res.data.data.legalPersonProfessionalInfo : [];
        this.grade = JSON.parse(res.data.data.enterprise.enterpriseScore)
        this.totalAmount = 0;
        this.grade.forEach(item=>{
          this.totalAmount += Number(item);
        })
      })
      .catch(_ => {
        console.log(_);
      });
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
        window.location.href = url;
      }
    },
    checkIt (type) {
      if(!this.rejectReason){
        mobile.toast('审批意见不能为空！')
        return
      }
        let info = {
          approvalProcessId: this.approvalProcessId,
          remark: this.rejectReason,
          status: type,
        }
        this.$dialog.loading.open('审核中。。。');
        getData.approval(info).then(res => {
          if (res.data.code === 1) {
            if (type === 1) {
              mobile.toast('已通过审核！')
            } else {
              mobile.toast('合同已驳回！');
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
  },
  watch: {}
};
</script>
<style scoped lang="scss">
@import "../../assets/css/mixin";
.warp{
  height:100%;
  width:100%;
  display: flex;
  flex-direction: column;
}
.g-header{
  height:2.65rem;
  position: relative;
  .g-header-blue{
    height: 1.4rem;
    background:linear-gradient(135deg,rgba(20,158,255,1) 0%,rgba(44,122,238,1) 100%);
  }
  .g-header-position{
    position: absolute;
    width: 100%;
    top:0.2rem;
  }
}

.g-content-list{
  padding: 0 .3rem;
  .g-content{
    width:100%;
    background:rgba(255,255,255,1);
    border-radius:.16rem;
    margin-bottom: .24rem;
    padding-bottom:.24rem;
  }
  .g-topheader{
    line-height: .92rem;
    justify-content: space-between;
    padding: .2rem .28rem;
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
      span{
        font-size:0.32rem;
        font-weight:500;
        color:rgba(41,44,47,1);
      }
    }
    p{
      border-radius:0.03rem;
      padding:0 0.12rem;
      font-size:0.24rem;
      font-weight:400;
      line-height:0.34rem;
      max-width: 3rem;
    }
    .g-red{
      background:rgba(255,233,233,1);
      color:rgba(235,60,60,1);
    }
    .g-blue{
      background:rgba(214,239,255,1);
      color:rgba(31,141,247,1);
    }
    .g-orange{
      background:rgba(255,230,214,1);
      color:rgba(247,81,31,1);
    }
    .g-green{
      background:rgba(218,246,221,1);
      color:rgba(0,159,48,1);
    }

  }
  .g-topheader2{
    line-height: .92rem;
    padding: 0rem .18rem;
    h4{
      padding-left:0.16rem;
      position: relative;
      font-size:0.28rem;
      color:rgba(41,44,47,1);
      line-height:0.44rem;
      display: flex;
      margin-right: .2rem;
    }
    p{
      border-radius:0.03rem;
      padding:0 0.12rem;
      font-size:0.24rem;
      font-weight:400;
      line-height:0.34rem;
      min-width: 1rem;
    }
    .g-blue{
      background:rgba(214,239,255,1);
      color:rgba(31,141,247,1);
    }
  }
  .g-basic-list{
    padding: 0 0.3rem;
    .g-basic-item{
      padding: 0.18rem 0;
      display: flex;
      justify-content: space-between;
      font-size: 0.28rem;
      .g-basic-p{
        width:50%;
        font-size: 0.28rem;
        flex-shrink: 0;
        margin-right: .2rem;
      }
      .g-basic-label{
        font-size: 0.28rem;
        margin-right: .2rem;
      }
    }

  }
  .g-list{
    padding: 0 0.3rem;
    .g-list-item{
      padding: 0.18rem 0;
      display: flex;
      justify-content: space-between;
      font-size: 0.28rem;
      border-bottom: 0.02rem solid #ccc;
      &:last-child{
        border:0;
      }
      .item-label{
        font-size: 0.28rem;
        flex-shrink: 0;
        margin-right: .2rem;
      }
      span{
        font-size: 0.24rem;
      }
    }

  }
  .g-h3{
    padding: 0.24rem 0.28rem;
    font-size: 0.30rem;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #292C2F;
    line-height: 0.36rem;
  }

  .g-table{
    padding:0rem 0.3rem;
    table{
      width: 100%;
      border: 0.02rem solid #F2F3F5;
      border-collapse: collapse;
    }
    th{
      background: #f2f3f5;
      font-size: 0.28rem;
      font-weight: 500;
      color: #292C2F;
    }
    tr{
      border:0.02rem solid #f2f3f5;
    }
    td{
      color: #666;
      line-height: 0.58rem;
      font-size: 0.28rem;
      font-weight: 500;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width:0.8rem;
    }

  }

}
.optionDetail{
  width: 1.08rem;
  height: 0.42rem;
  border-radius: 0.08rem;
  border: 0.02rem solid #0F8FFF;
  display: inline-block;
  text-align: center;
  margin-left: 0.2rem;
}
.totalGrade{
  font-size: 0.28rem;
  font-weight: 500;
  color: #0F8FFF;
  line-height: 0.42rem;
}
.g-option{
  padding: 0 0.3rem;
  p{
    padding: 0.18rem 0;
    font-size: 0.28rem;
  }
}
.g-detail-step:first-child{
  margin-top: 0.5rem;
}
.g-detail-step {
    .g-step-item {
      position: relative;
      margin: auto;
      width: 5rem;
      min-height: 1rem;
      padding-left: 0.6rem;
      font-size: 0.28rem;
      padding-bottom: 0.2rem;
    }
    .g-dotime {
      margin-right: 0.2rem;
    }
    .g-item-title {
      font-size: 0.28rem;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #292C2F;
      line-height: 0.4rem;
    }
    .g-item-time {
      margin: 0.05rem 0;
      div {
        font-size: 0.24rem;
      }
    }
    .g-item-info {
      padding-top:0.1rem;
      font-size: 0.24rem;
    }
    .g-item-green {
      color: #0ec671;
    }
    .g-item-blue {
      color: #0F8FFF;
    }
    .g-item-red {
      color: #ff4a4a;
    }
    .g-item-black {
      color: #434343;
    }
    .g-state-blue{
      padding:0.1rem;
      background: #E1F0FF;
      border-radius: 0.03rem;
    }
    .g-step-item1 {
      position: relative;
      margin: auto;
      width: 5rem;
      min-height: 1rem;
      padding-left: 0.6rem;
      font-size: 0.28rem;
      border-left: 0.04rem solid #ccc;
      padding-bottom: 0.2rem;
    }
    .g-setp-item2 {
      position: relative;
      margin: auto;
      width: 5rem;
      min-height: 1rem;
      padding-left: 0.6rem;
      font-size: 0.28rem;
      border-left: 0.04rem solid #2c7aee;
      padding-bottom: 0.2rem;
    }
    .g-step-number {
      position: absolute;
      width: 0.3rem;
      height: 0.3rem;
      border-radius: 50%;
      top: 0;
      left: -0.15rem;
      background-color: #2c7aee;
      text-align: center;
      line-height: 0.3rem;
      color: #fff;
    }
    .g-step-number1 {
      position: absolute;
      width: 0.3rem;
      height: 0.3rem;
      border-radius: 50%;
      top: 0;
      left: -0.15rem;
      text-align: center;
      line-height: 0.3rem;
      color: #fff;
      background-color: #ccc;
    }
    .g-step-number2 {
      position: absolute;
      width: 0.3rem;
      height: 0.3rem;
      border-radius: 50%;
      top: 0;
      left: -0.15rem;
      text-align: center;
      line-height: 0.3rem;
      color: #fff;
      background-color: #F75322;
    }
  }

.g-btn-footer {
  padding: 0.3rem 0.3rem 0.3rem;
  display: flex;
  p {
    width: 47%;
    height: .8rem;
    text-align: center;
    line-height: .8rem;
    font-size: .32rem;
    font-family: PingFangSC-Medium,PingFang SC;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    background:rgba(20,158,255,1);
    // background:linear-gradient(135deg, 0%,rgba(44,122,238,1) 100%);
    border-radius:0.08rem;
  }
  p:first-child{
    margin-right:5%;
    background: #FFFFFF;
    border-radius: 0.08rem;
    color: #0F8FFF;
    border: 0.02rem solid #0F8FFF;
  }
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

</style>

