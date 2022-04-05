<template>
  <div class="warp page1">
    <v-header :goBack="true" headTitle="我要预约" :serviceGet="true">
    </v-header>
    <v-scroll class="service-main-box scroll" ref="my_scroller">
      <div class="g-field-info">
        <div class="g-info">
          <div class="g-info-title">
            <span>{{meetingRoom.fieldTypeName}}</span>
            {{meetingRoom.fieldName}}
          </div>
          <div class="g-info-content">场地位置：{{meetingRoom.fieldAddress}}</div>
          <div class="g-info-content">场地容量：可容纳{{meetingRoom.fieldCapacity}}人</div>
        </div>
        <img
          :src="typeof meetingRoom.fieldImageList != 'undefined' &&meetingRoom.fieldImageList.length>0?meetingRoom.fieldImageList[0]:null"
          alt="">
      </div>

      <v-calendar v-on:yuyuedate="getdates"></v-calendar>
      <div class="g-time-choose clearfix" v-if="choosetimeList.length>0">
        <div class="g-time-box">
          <ul class="g-time-list">
            <li class="g-time-item" :class="{'g-choose':item.isChoose, 'g-checked':item.isChecked,'g-lock':item.isLock}" v-for="(item,index) in choosetimeList.slice(0,16)" :key="index"
                @click="choose(item,index)">
              <div v-show="item.isChoose&&!item.isChecked" class="g-choose-box">已选</div>
              <div v-show="item.isChecked" class="g-choose-box">已订</div>
              <div v-show="item.isLock" class="g-choose-box">锁定</div>
              <div class="g-start-time">{{item.startTime}} - {{item.endTime}}</div>
              <!-- <div v-if="item.endTime" class="g-end-time"></div> -->
            </li>
          </ul>
        </div>
        <div class="g-time-box">
          <ul class="g-time-list">
            <li class="g-time-item" :class="{'g-choose':item.isChoose, 'g-checked':item.isChecked,'g-lock':item.isLock}" v-for="(item,index) in choosetimeList.slice(16,32)" :key="index"
                @click="choose(item,16 + index)">
              <div v-show="item.isChoose&&!item.isChecked" class="g-choose-box">已选</div>
              <div v-show="item.isChecked" class="g-choose-box">已订</div>
              <div v-show="item.isLock" class="g-choose-box">锁定</div>
              <div class="g-start-time">{{item.startTime}} - {{item.endTime}}</div>
            </li>
          </ul>
        </div>
        <div class="g-time-box">
          <ul class="g-time-list">
            <li class="g-time-item" :class="{'g-choose':item.isChoose, 'g-checked':item.isChecked,'g-lock':item.isLock}" v-for="(item,index) in choosetimeList.slice(32,48)" :key="index"
                @click="choose(item,32 + index)">
              <div v-show="item.isChoose&&!item.isChecked" class="g-choose-box">已选</div>
              <div v-show="item.isChecked" class="g-choose-box">已订</div>
              <div v-show="item.isLock" class="g-choose-box">锁定</div>
              <div class="g-start-time">{{item.startTime}} - {{item.endTime}}</div>
            </li>
          </ul>
        </div>

      </div>
      <div class="g-nodata" v-else>
        <div class="noarticle g-adaptimg g-loading-icon">
          <img class="i-magnifier" src="http://park.hzqisheng.cn/v3.5/i-loading-magnifier.png" alt=""></div>
        <p class="nodatatext g-loading">正在加载</p>
      </div>

      <div class="g-appointment-time">
        <div class="g-label">预约时间</div>
        <div class="g-content" v-if="chooseNum>0&&firstChoose!==-1">
          <span>{{new Date(this.choosedates.year, this.choosedates.month, this.choosedates.day).format('yyyy/MM/dd')}}</span>
          <ul class="option-list">
            <li v-for="(item,index) in appointmentRecordList" :key="index">
              <span>{{item.appStartTime}}{{item.id>23?'pm':'am'}} — {{item.appEndTime}}{{item.id>23?'pm':'am'}}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="g-field-box">
        <div class="g-label">场地租赁费用</div>
        <div class="g-content">{{Number(leasePrice).toFixed(2)}} 元</div>
      </div>
      <div class="g-field-box" v-if="fieldFeeConfigInfo.haveFee">
        <div class="g-label">服务费</div>
        <div class="g-content">{{Number(servicePrice).toFixed(2)}} 元</div>
      </div>
      <div class="g-field-box">
        <div class="g-label">需付金额</div>
        <div class="g-content">{{leasePrice?(Number(leasePrice)+Number(servicePrice)).toFixed(2):0}} 元</div>
      </div>
      <div class="g-serviceList">
        <div class="g-label g-img-span">增值服务<img src="../../assets/images/icon_remind.png" alt=""><span>用增值服务会生成额外的费用</span></div>
        <ul class="serviceList">
          <li v-for="(item,index) in appointmentServiceTagList" :class="{'active':item.isChecked}" :key="item.appointmentServiceTagId"  @click="checkService(item,index)">
            {{item.appointmentServiceTagName}}
          </li>
        </ul>
      </div>
      <div class="g-textarea">
        <div class="g-label">备注信息</div>
        <div class="form-item-con">
          <textarea v-model="appRemark" cols="30" rows="3" maxlength="100" placeholder="请输入借用事由、参会人数等相关信息" @blur="bridges.scrollToTop()"></textarea>
        </div>
      </div>
      <div class="g-textarea" style="margin-top:-15px">
        <v-upload-file :number="3" :size="5" :img="true" @onFileChange="onImgChange"></v-upload-file>
      </div>

    </v-scroll>
    <yd-popup v-model="maskbool" position="center" width="6.46rem">
      <div class="g-mask clearfix">
        <p class="g-remindcont">您的预约申请已发送，请等待管理员进行审核操作。</p>
        <div class="flex-box g-btnbox">
          <div class="btn" @click="$router.go(-1)">返回</div>
          <div class="btn" @click="$router.replace('/myReservation')">查看预约记录</div>
        </div>
      </div>
    </yd-popup>
    <div class="g-confirmbtn" @click="submits">确认预约</div>
  </div>
</template>
<script>
  import * as getData from '../../service/getData'
  import * as mobile from '../../config/mUtils'
  import {mapState, mapMutations, mapActions} from 'vuex'

  export default {
    data() {
      return {
        maskbool: false,
        appointmentType: "",
        meetingRoom: {},
        choosedates: '',
        choosetimeList: [],
        chooseNum: 0,//选择的个数
        chooseBeforeIndex: -1,//上一次点击的位置
        chooseIndex: -1,//当前点击的位置
        byMrIdAndTime: [],
        firstChoose: -1,//选择的第一个位置
        timeBucket: [],
        fieldFeeConfigInfo:{},
        appRemark: "",
        lockTimeList:[],
        overTimeList:[],
        appointmentRecordList:[],
        appointmentServiceTagList:[],//增值服务列表
        appImgUrl: []
      }
    },
    activated() {

    },
    mounted() {
    },
    components: {},
    computed: {
      leasePrice(){
        this.timeBucket = [0,0,0]
        this.choosetimeList.forEach((item,index)=>{
          if(index<=23){
            if(item.isChoose){
              this.timeBucket[0] = 1
            }
          }else if(index>23&&index<=35){
            if(item.isChoose){
              this.timeBucket[1] = 1
            }
          }else{
            if(item.isChoose){
              this.timeBucket[2] = 1
            }
          }
        })
        let all = this.timeBucket.reduce((a,b)=>a+b)
        console.log()

        if(this.meetingRoom.fieldFeeType===1){ //固定价格收费
          if(this.meetingRoom.fieldFeeUnit===1){
            return this.chooseNum*this.meetingRoom.fieldFee
          }else if(this.meetingRoom.fieldFeeUnit===2){
            return this.meetingRoom.fieldFee
          }
        }
        if(this.meetingRoom.fieldFeeType===2){ //阶梯价格收费
          console.log(this.chooseNum);
          let price = 0;
          this.fieldFeeConfigInfo.ladderFee.forEach((element,index) =>{
            if(this.chooseNum*0.5>element.startTime&&this.chooseNum*0.5<=element.endTime){
              price = element.price;
            }
          })
          return price;
        }

        if(this.meetingRoom.fieldFeeType===3 && all>0){ // 按半天/全天价格收费
          if(this.fieldFeeConfigInfo.halfDay===1 && this.fieldFeeConfigInfo.allDay!==1){ //只有半天价格情况
            if(this.timeBucket[0]){
              return this.fieldFeeConfigInfo.halfDayPrice*(all >= 2?2:1)
            }else{
              return this.fieldFeeConfigInfo.halfDayPrice
            }
          }else if(this.fieldFeeConfigInfo.halfDay!==1 && this.fieldFeeConfigInfo.allDay===1){ //只有全天价格情况
            return this.fieldFeeConfigInfo.allDayPrice
          }else if(this.fieldFeeConfigInfo.halfDay===1 && this.fieldFeeConfigInfo.allDay===1){ //半天和全天价格都有的情况
            if(all==1){
              return this.fieldFeeConfigInfo.halfDayPrice
            }else{
              return this.fieldFeeConfigInfo.allDayPrice
            }
          }
        }
        return 0
      },
      servicePrice() {
        if(!this.fieldFeeConfigInfo.haveFee){
          return 0
        }
        if(this.weekend){
          return this.fieldFeeConfigInfo.restDayFee||0
        }
        if(this.timeBucket[2]){
          return this.fieldFeeConfigInfo.eveningFee||0
        }
        return 0
      },
      weekend() {
        let clickTime = new Date(this.choosedates.year, this.choosedates.month, this.choosedates.day).format('yyyy/MM/dd');
        if(new Date(clickTime).getDay() === 0 || new Date(clickTime).getDay() === 6){
          return true
        } else {
          return false
        }
      },

    },
    methods: {
      recordPosition(index) {
        this.chooseBeforeIndex = this.chooseIndex;//保存之前点击的位置
        this.chooseIndex = index;//记录当前点击的位置
      },
      checkService(item,index){
        this.$set(item,'isChecked',!item.isChecked)
        this.$forceUpdate()
      },
      choose(item, index) {
        if(item.isLock){
          mobile.toast('当前时间已被锁定，请重新选择');
          return
        }else if(item.isChecked){
          mobile.toast('当前时间已被预订，请重新选择');
          return
        }
        if (!item.isChoose) {//第一次点击且没有被已订
          this.$set(item, 'isChoose', true);
          this.recordPosition(index);
          this.chooseNum++;
          this.firstChoose = index;

        } else if (item.isChoose && this.chooseNum > 0) {//取消选择
          this.recordPosition(index);
          this.$set(item, 'isChoose', false);
          this.chooseNum--;
        }
        this.appointmentRecordList = [];
        this.choosetimeList.forEach(item=>{
          if(item.isChoose){
            let obj = {
              id:item.id,
              appStartTime:item.startTime,
              appEndTime:item.endTime,
            }
            this.appointmentRecordList.push(obj)
          }
        })
      },
      onImgChange(data) {
        this.appImgUrl = data.fileList.map((item)=>{
          return item.exportFile
        })
      },
      getdates(val) {

        this.choosedates = val;
        this.byMrIdAndTime = [];
        this.chooseNum = 0;//选择的个数
        this.chooseBeforeIndex = -1;//上一次点击的位置
        this.chooseIndex = -1;//当前点击的位置
        this.firstChoose = -1;//选择的第一个位置
        this.choosetimeList = [];
        let dates = new Date(val.year, val.month, val.day).format('yyyy-MM-dd hh:mm:ss');
        console.log(dates);
        this.init(dates)
      },
      chooseTimeInit() {
        let hour = 0;
        for (let i = 1; i <= 48; i++) {
          if (i % 2 !== 0) {
            this.choosetimeList.push({
              id:i,
              isChecked: false,//已订
              isChoose: false,//选择
              isLock: false,//锁定
              startTime: hour>9 ? hour + ':00':'0'+hour + ':00',
              endTime: hour>9 ? hour + ':30':'0'+hour + ':30',
            })
          } else {
            this.choosetimeList.push({
              id:i,
              isChecked: false,
              isChoose: false,
              isLock: false,//锁定
              startTime: hour>9 ? hour + ':30' : '0'+hour + ':30',
              endTime: ++hour>9 ? hour + ':00' : '0'+hour + ':00',
            });
          }
        }
        this.byMrIdAndTime.forEach(val => {
          let index = (val.startHour) * 2;
          if (val.startMinute > 0) {
            index++;
          }
          for (let i = 0; i < val.longTime / 30; i++) {
            this.$set(this.choosetimeList[index + i], 'isChecked', true);
          }
        })
        this.lockTimeList.forEach(val => {
          let index = (val.startHour) * 2;
          if (val.startMinute > 0) {
            index++;
          }
          for (let i = 0; i < val.longTime / 30; i++) {
            this.$set(this.choosetimeList[index + i], 'isLock', true);
          }
        })
        this.overTimeList.forEach(val => {
          let index = (val.startHour) * 2;
          if (val.startMinute > 0) {
            index++;
          }
          for (let i = 0; i < val.longTime / 30; i++) {
            this.$set(this.choosetimeList[index + i], 'isLock', true);
          }
        })
      },
      init(dates) {
        getData.fieldDetailWithTimeApp(this.$route.query.fieldId, dates).then(res => {
          if (res.data.code === 1) {
            this.meetingRoom = res.data.data;
            this.fieldFeeConfigInfo = JSON.parse(res.data.data.fieldFeeConfigInfo)
            this.appointmentType = res.data.data.appointmentType;
            this.appointmentServiceTagList = res.data.data.appointmentServiceTagList;
            this.appointmentServiceTagList.forEach(item=>{
              item.isChecked = false;
            });
            res.data.data.appointmentTimeList.forEach((item,index) => {
              this.choosetimeList.push({
                id:index,
                isChecked: item.state == 1 ? true : false,//预定
                isChoose: false,
                isLock: item.state == 2 ? true : false,//锁定
                startTime: item.hourInterval.split('-')[0],
                endTime: item.hourInterval.split('-')[1],
              })
            });
            // console.log(this.choosetimeList)
          }
        })
      },
      submits() {
        if (this.chooseNum === 0) {
          mobile.toast('请选择预约时间');
          return
        }
        let recordList = [];
        let clickTime = new Date(this.choosedates.year, this.choosedates.month, this.choosedates.day).format('yyyy/MM/dd');
        this.choosetimeList.forEach(item=>{
          if(item.isChoose){
            let obj = {
              appStartTime:clickTime + ' ' + item.startTime+':00',
              appEndTime:clickTime + ' ' + item.endTime+':00',
              // appEndTime:clickTime + ' ' + (item.endTime == '24:00' ? '23:59:59' : item.endTime+':00'),
            }
            recordList.push(obj)
          }
        })
        let service = [];
        this.appointmentServiceTagList.forEach(item=>{
          if(item.isChecked){
            service.push(item.appointmentServiceTagName);
          }
        })
        let form = {
          appMrId:this.$route.query.fieldId,
          appRemark:this.appRemark,
          appImgUrl: this.appImgUrl.join(','),
          appointmentRecordList:recordList,
          appointmentServiceTagName:service.join('、'),
        }
        if (this.appointmentType == 1) {
          getData.addAppointmentOfPT(form).then(res => {
            if (res.data.code === 1) {
              this.maskbool = true;
            }else{
              mobile.toast(res.data.message);
              location.reload();
            }
          })
        } else {
          // this.$store.state.appointmentRecordList = recordList;
          this.$store.state.orderTimeList = this.appointmentRecordList;
          sessionStorage.setItem('recordList',JSON.stringify(recordList))
          this.$router.push({
            path: '/appointmentConfirm',
            query: {fieldId: this.$route.query.fieldId,clickTime:clickTime,appRemark:this.appRemark,appointmentServiceTagName:service.join('、'),appImgUrl:this.appImgUrl.join(',')}
          });
        }

      },
    },
    watch: {}
  }
</script>
<style scoped lang="scss">
  @import '../../assets/css/mixin';

  .g-mask {
    width: 6.5rem;
    background: #fff;
    border-radius: .26rem;

    .g-remindcont {
      margin: .84rem auto .83rem;
      width: 5.42rem;
      @include sc(.32rem, #4D4C4C);
    }

    .g-btnbox {
      @include fj();
      border-top: 1px solid #DADADA;

      .btn {
        flex: 1;
        line-height: .98rem;
        @include sc(.3rem, #0877FF);
        text-align: center;
        border-right: 1px solid #DADADA;

        &:last-child {
          border-right: 0 none;
        }
      }
    }
  }

  .g-field-info {
    @include fj();
    align-items: center;

    .g-info {
      .g-info-content {
        margin-left: .15rem;
      }
    }

    img {
      @include wh(2.5rem, 1.92rem);
      object-fit: cover;
      margin-right: .14rem;
    }
  }

  .g-time-choose {
    border-bottom: 1px solid #e9e9e9;
    padding-bottom: .4rem;

    .g-time-box {
      margin-top: .51rem;
      margin-bottom: .64rem;
      padding: 0 .34rem;

      .g-time-halfDay {
        @include sc(.28rem, #4D4C4C);
        line-height: .3rem;
        margin-bottom: .28rem;
      }

      .g-time-list {
        display: flex;
        overflow: auto;
        .g-time-item {
          position: relative;
          @include wh(2.2rem, 1.06rem);
          margin-right:0.1rem;
          border: .02rem solid #DBDBDB;
          background: #Fff;
          border-radius: 0.2rem;
          flex-shrink: 0;
          flex-grow: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          &:last-child {
            margin-right:0;
          }

          .g-choose-box, .g-checked-box {
            border-radius: .04rem;
            @include sc(.32rem, #fff);
            text-align: center;
            line-height: .6rem;
          }

          .g-start-time, .g-end-time {
            @include sc(.22rem, #4D4C4C);
            text-align: center;
          }

          .g-end-time {
            left: unset;
            right: 0;
            transform: translate(50%, 100%);
          }
        }
        .g-choose{
          background: #166EFF;
          box-shadow: 0rem 0rem 0rem 0rem rgba(82, 140, 255, 0.35);
          color:#fff;
          .g-start-time{
            color:#fff;
          }
        }
        .g-checked{
          background: #04A800;
          box-shadow: 0rem 0rem 0rem 0rem rgba(25, 174, 21, 0.25);
          color:#fff;
          .g-start-time{
            color:#fff;
          }
        }
        .g-lock{
          background: #C1CCD7;
          color:#fff;
          .g-start-time{
            color:#fff;
          }
        }
      }
    }
  }

  .g-field-box {
    @include wh(100%, .88rem);
    padding: 0 .3rem 0 .34rem;
    @include fj();
    align-items: center;
    border-bottom: 1px solid #e9e9e9;

    .g-label {
      @include sc(.28rem, #4D4C4C);
    }

    .g-content {
      @include sc(.26rem, #E60204);

      span {
        @include sc(.24rem, #777777);
        margin-right: .23rem;

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
  .g-appointment-time{
    width: 100%;
    min-height: 0.88rem;
    padding: 0.2rem .3rem 0.2rem .34rem;
    @include fj();
    align-items: center;
    border-bottom: 1px solid #e9e9e9;

    .g-label {
      @include sc(.28rem, #4D4C4C);
    }

    .g-content {
      display: flex;
      @include sc(.26rem, #E60204);

      span {
        @include sc(.24rem, #777777);
        display: flex;
        align-items: center;
        margin-right: .23rem;

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
  .g-textarea{
    width: 100%;
    padding: 0.1rem .35rem 0.2rem;
    display: flex;
    flex-direction: column;
    align-items: start;
    .form-item-con {
      width: 100%;
      margin: 0.2rem 0 0;
      textarea {
        padding: 0.2rem;
        color: #333;
        font-size: 0.28rem;
        width: 100%;
        height: 100%;
        background: #f8f8f8;
        border-radius: 0.1rem;
        font-family:PingFang SC;
        font-weight:500;
      }
    }

  }

  .g-nodata {
    height: 3.92rem;
    border-bottom: 1px solid #e9e9e9;

    .noarticle {
      margin-top: 1rem;
    }
  }
  .g-img-span{
    display: flex;
    align-items: center;
    margin-bottom: .1rem;
    img{
      width:0.36rem;
      height:0.36rem;
      margin: 0 0.15rem;
    }
    span{
      font-size: 0.24rem;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #7CB305;
    }
  }
  .g-serviceList{
    width: 100%;
    padding: .3rem .3rem .3rem .34rem;
    display: flex;
    border-bottom: 1px solid #e9e9e9;
    flex-direction: column;
  }
  .serviceList{
    display: flex;
    flex-wrap: wrap;
    li{
      width: 1.5rem;
      height: 0.58rem;
      background: #EEEEEE;
      border-radius: 0.08rem;
      margin:.2rem .2rem 0 0;
      text-align: center;
      line-height: 0.58rem;

    }
    .active{
        background: #166EFF;
        color:#fff;
        border-radius: 0.08rem;
      }

  }

  .g-label {
      @include sc(.28rem, #4D4C4C);
    }
</style>


